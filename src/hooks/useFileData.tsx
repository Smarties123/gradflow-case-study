import { useState, useEffect } from 'react';
import { useUser } from '../components/User/UserContext';


type CreateFileBody = {
  typeId: number;          // 1 for CV, 2 for CL, etc.
  fileUrl: string;         // final S3 https link
  fileName: string;        
  extens?: string;
  description?: string;
  applicationsIds?: number[];  // (Optional) to link this file to apps
};




export function useFileData() {
  const { user } = useUser();
  const [files, setFiles] = useState([]);
  const [fileTypes, setFileTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllFileTypes = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/files/types`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch file types');
      }
      const data = await response.json();
      setFileTypes(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    }
  };

  const fetchAllFiles = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/files`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch files');
      }
      const data = await response.json();
      setFiles(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create file
  const createFile = async (body: CreateFileBody) => {
    if (!user?.token) return;
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/files`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error('Failed to create file record');
      }
      await refetch();
    } catch (error) {
      console.error('Error creating file:', error);
    }
  };

  // Delete file
  const deleteFile = async (fileId: number) => {
    if (!user?.token) return;
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/files/${fileId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error('Failed to delete file record');
      }
      // If your backend also calls s3.deleteObject, 
      // the S3 object will be removed as well.

      // Refresh local list
      await refetch();
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  // Update file (return the updated row from server)
  const updateFile = async (fileId: number, updateData: any) => {
    if (!user?.token) return null;
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/files/${fileId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(updateData),
        }
      );
      if (!response.ok) {
        throw new Error('Failed to update file');
      }
      const data = await response.json();
      await refetch();
      return data.file; // The updated row from server
    } catch (error) {
      console.error('Error updating file:', error);
      return null;
    }
  };


  // Re-fetch everything
  const refetch = async () => {
    if (!user?.token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    await fetchAllFileTypes();
    await fetchAllFiles();
  };

  // Get a presigned upload URL from your server
  const getPresignedUploadUrl = async (
    fileName: string,
    fileMime: string,
    docType: string
  ) => {
    if (!user?.token) throw new Error('No user token, cannot upload');
    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/files/presigned-upload`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ fileName, fileMime, docType }),
      }
    );
    if (!res.ok) {
      throw new Error('Failed to obtain presigned URL');
    }
    return res.json(); // { uploadUrl, objectKey }
  };

  const uploadFileToS3 = async (
    uploadUrl: string,
    file: File
  ) => {
    // Use fetch PUT (or Axios with progress events)
    const res = await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': file.type },
      body: file,
    });
    if (!res.ok) {
      throw new Error('File upload to S3 failed');
    }
    // No return needed; if no error, it succeeded
  };



    // ----------------------------------------------------------
  //  3) Combined flow: "uploadAndCreateFile"
  //     - get presigned URL
  //     - PUT file to S3
  //     - create DB record
  // ----------------------------------------------------------
  const uploadAndCreateFile = async ({
    file,
    docType,   // 'cv' or 'cl'
    typeId,    // numeric type ID
    description,
    applicationsIds,
  }: {
    file: File;
    docType: string;
    typeId: number;
    description?: string;
    applicationsIds?: number[];
  }) => {
    if (!file) return;
    try {
      // 1) Get presigned upload URL
      const { uploadUrl, objectKey } = await getPresignedUploadUrl(
        file.name,
        file.type,
        docType
      );
  
      // 2) Upload file to S3
      await uploadFileToS3(uploadUrl, file);
  
      // 3) Build final S3 link from your bucket name & region
      const s3Bucket = process.env.REACT_APP_S3_BUCKET;
      const s3Region = process.env.REACT_APP_S3_REGION;
      // console.log('s3Bucket:', s3Bucket, 's3Region:', s3Region);

      const fileUrl = `https://${s3Bucket}.s3.${s3Region}.amazonaws.com/${objectKey}`;
  
      // NEW: parse extension from the file name
      let extension = '';
      if (file.name.includes('.')) {
        const parts = file.name.split('.');
        extension = parts[parts.length - 1]; // e.g. "pdf" or "docx"
      }
  
      // 4) Create file in DB
      await createFile({
        typeId,
        fileUrl,
        fileName: file.name,
        extens: extension,   // pass the extension here
        description,
        applicationsIds
      });
    } catch (err) {
      console.error('Error in uploadAndCreateFile:', err);
      setError((err as Error).message);
    }
  };


  // ----------------------------------------------------------
  //  useEffect: fetch data on mount if token present
  // ----------------------------------------------------------
  useEffect(() => {
    if (!user?.token) {
      setLoading(false);
      return;
    }
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Return everything
  return {
    files,
    fileTypes,
    loading,
    error,
    // existing methods
    createFile,
    deleteFile,
    updateFile,
    refetch,
    // new methods for S3 upload flow
    uploadAndCreateFile,
    getPresignedUploadUrl,
    uploadFileToS3
  };
}
