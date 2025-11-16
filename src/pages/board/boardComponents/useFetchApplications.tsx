// ./boardComponents/useFetchApplications.ts

import { useEffect, useState } from 'react';
import { useUser } from '../../../components/User/UserContext';
import { initialColumns } from '../../../data/dummyData';

export const useFetchApplications = (setColumns) => {
  const { user } = useUser();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In demo mode, use dummy data
    try {
      setColumns(initialColumns);
      setLoading(false);
    } catch (error) {
      console.error('Error loading applications or statuses:', error);
      setError('Failed to load applications or statuses');
      setLoading(false);
    }
  }, [user, setColumns]);

  return { loading, error };
};