import { useState, useEffect } from 'react';
import { useUser } from '../components/User/UserContext';

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
  const createFile = async (body: {
    typeId: number;
    fileUrl: string;
    fileName: string;
    extens?: string;
    description?: string;
  }) => {
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
      const response = await fetch(`${process.env.REACT_APP_API_URL}/files/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete file record');
      }
      await refetch();
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  // Update file (return the updated row from server)
  const updateFile = async (fileId, updateData) => {
    if (!user?.token) return null;
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/files/${fileId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(updateData),
      });
      if (!response.ok) {
        throw new Error('Failed to update file');
      }
      // Parse the updated file data
      const data = await response.json();
      // data.file is the newly updated row
      await refetch();
      return data.file; // Return the updated file so the UI can use it immediately
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

  useEffect(() => {
    if (!user?.token) {
      setLoading(false);
      return;
    }
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return {
    files,
    fileTypes,
    loading,
    error,
    createFile,
    deleteFile,
    updateFile,
    refetch,
  };
}
