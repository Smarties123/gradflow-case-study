import { useState, useEffect } from 'react';
import { useUser } from '../components/User/UserContext';

export function useFileData() {
  const { user } = useUser();
  const [files, setFiles] = useState([]);
  const [fileTypes, setFileTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.token) {
      setLoading(false);
      return;
    }
    fetchAllFileTypes();
    fetchAllFiles();
  }, [user]);

  const fetchAllFileTypes = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/files/types`, {
        headers: { 'Authorization': `Bearer ${user.token}` },
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
        headers: { 'Authorization': `Bearer ${user.token}` },
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

  return { files, fileTypes, loading, error };
}
