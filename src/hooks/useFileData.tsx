import { useState, useEffect } from 'react';
import { useUser } from '../components/User/UserContext';
import { dummyFileTypes, initialFiles, generateFileId } from '../data/dummyData';

type CreateFileBody = {
  typeId: number;          // 1 for CV, 2 for CL, etc.
  fileUrl: string;         // Blob URL in demo mode
  fileName: string;        
  extens?: string;
  description?: string;
  applicationsIds?: number[];  // (Optional) to link this file to apps
};

export function useFileData() {
  const { user } = useUser();
  const [files, setFiles] = useState<any[]>(initialFiles);
  const [fileTypes, setFileTypes] = useState(dummyFileTypes);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // In demo mode, file types are static
  // No need to fetch

  // Create file - stores in local state with Blob URL
  const createFile = async (body: CreateFileBody) => {
    const newFile = {
      fileId: generateFileId(),
      typeId: body.typeId,
      fileUrl: body.fileUrl, // This will be a Blob URL
      fileName: body.fileName,
      extens: body.extens || '',
      description: body.description || '',
      applicationsIds: body.applicationsIds || [],
      createdAt: new Date().toISOString(),
    };
    
    setFiles(prev => [...prev, newFile]);
    return newFile;
  };

  // Delete file - removes from local state and revokes Blob URL
  const deleteFile = async (fileId: number) => {
    const fileToDelete = files.find(f => f.fileId === fileId);
    if (fileToDelete && fileToDelete.fileUrl.startsWith('blob:')) {
      // Revoke the Blob URL to free memory
      URL.revokeObjectURL(fileToDelete.fileUrl);
    }
    setFiles(prev => prev.filter(f => f.fileId !== fileId));
  };

  // Update file - updates local state
  const updateFile = async (fileId: number, updateData: any) => {
    setFiles(prev => 
      prev.map(f => 
        f.fileId === fileId ? { ...f, ...updateData } : f
      )
    );
    const updated = files.find(f => f.fileId === fileId);
    return updated ? { ...updated, ...updateData } : null;
  };

  // Re-fetch everything - no-op in demo mode
  const refetch = async () => {
    // In demo mode, files are stored in state, no refetch needed
    setLoading(false);
  };

  // Get a presigned upload URL - returns mock data in demo mode
  const getPresignedUploadUrl = async (
    fileName: string,
    fileMime: string,
    docType: string
  ) => {
    // In demo mode, return mock data
    return {
      uploadUrl: 'demo-upload-url',
      objectKey: `demo/${docType}/${fileName}`,
    };
  };

  const uploadFileToS3 = async (
    uploadUrl: string,
    file: File
  ) => {
    // In demo mode, this is a no-op
    // Files are stored as Blob URLs instead
    return Promise.resolve();
  };



  // Combined flow: "uploadAndCreateFile"
  // In demo mode: creates Blob URL and stores in local state
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
      // In demo mode, create a Blob URL instead of uploading to S3
      const fileUrl = URL.createObjectURL(file);
  
      // Parse extension from the file name
      let extension = '';
      if (file.name.includes('.')) {
        const parts = file.name.split('.');
        extension = parts[parts.length - 1]; // e.g. "pdf" or "docx"
      }
  
      // Create file record in local state
      await createFile({
        typeId,
        fileUrl, // Blob URL
        fileName: file.name,
        extens: extension,
        description,
        applicationsIds
      });
    } catch (err) {
      console.error('Error in uploadAndCreateFile:', err);
      setError((err as Error).message);
    }
  };

  // Initialize file types on mount
  useEffect(() => {
    setFileTypes(dummyFileTypes);
    setFiles(initialFiles);
    setLoading(false);
  }, []);

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
