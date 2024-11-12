import { useEffect, useState, useContext } from 'react';
import { BoardContext } from '../pages/board/BoardContext'; // Adjust the path as needed

export const useBoardData = (user: any) => {
  const { columns, setColumns } = useContext(BoardContext);
  const [loading, setLoading] = useState(columns.length === 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBoardData = async () => {
      if (columns.length > 0) {
        // Data is already loaded; no need to fetch
        return;
      }

      try {
        // Fetch statuses (columns)
        const statusResponse = await fetch(`${process.env.REACT_APP_API_URL}/status`, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
          },
        });

        if (!statusResponse.ok) {
          throw new Error('Failed to fetch statuses');
        }

        const statuses = await statusResponse.json();

        // Fetch applications (cards)
        const applicationResponse = await fetch(`${process.env.REACT_APP_API_URL}/applications`, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
          },
        });

        if (!applicationResponse.ok) {
          throw new Error('Failed to fetch applications');
        }

        const applications = await applicationResponse.json();

        // Build columns and add applications (cards) to their respective statuses (columns)
        const columnsWithCards = statuses.map((status: any) => ({
          id: status.StatusId,
          title: status.StatusName,
          order: status.StatusOrder,
          cards: applications
            .filter((app: any) => app.StatusId === status.StatusId)
            .map((app: any) => ({
              id: String(app.ApplicationId),
              company: app.CompanyName,
              position: app.JobName,
              deadline: app.Deadline,
              location: app.Location,
              url: app.CompanyURL,
              notes: app.Notes || '',
              salary: app.Salary || 0,
              StatusId: app.StatusId,
              date_applied: app.DateApplied,
              card_color: app.Color || '#ffffff',
              companyLogo: app.CompanyLogo,
              Favourite: app.Favourite || false,
            })),
        }));

        setColumns(columnsWithCards);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching board data:', error);
        setError('Failed to load board data.');
        setLoading(false);
      }
    };

    fetchBoardData();
  }, [user.token]);

  return { columns, loading, error };
};
