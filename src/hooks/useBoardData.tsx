import { useEffect, useState, useContext } from 'react';
import { BoardContext } from '../pages/board/BoardContext';
import { initialColumns } from '../data/dummyData';

export const useBoardData = (user: any) => {
  const { columns, setColumns } = useContext(BoardContext);
  const [loading, setLoading] = useState(columns.length === 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In demo mode, use dummy data
    if (columns.length > 0) {
      // Data is already loaded; no need to fetch
      return;
    }

    try {
      // Use dummy data instead of API calls
      setColumns(initialColumns);
      setLoading(false);
    } catch (error) {
      console.error('Error loading board data:', error);
      setError('Failed to load board data.');
      setLoading(false);
    }
  }, [user, columns.length, setColumns]);

  return { columns, loading, error };
};
