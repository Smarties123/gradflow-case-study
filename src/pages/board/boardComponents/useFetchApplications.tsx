// ./boardComponents/useFetchApplications.ts

import { useEffect, useState } from 'react';
import { Column, Card } from '../types';
import { groupJobsIntoColumns } from './utils';
import { useUser } from '../../../components/User/UserContext';

export const useFetchApplications = (setColumns) => {
  const { user } = useUser();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const statusResponse = await fetch(`${process.env.REACT_APP_API_URL}/status`, {
          headers: {
            'Authorization': `Bearer ${user?.token}`,
          },
        });

        if (!statusResponse.ok) {
          throw new Error('Failed to fetch statuses');
        }

        const statuses = await statusResponse.json();

        const jobResponse = await fetch(`${process.env.REACT_APP_API_URL}/applications`, {
          headers: {
            'Authorization': `Bearer ${user?.token}`,
          },
        });

        if (!jobResponse.ok) {
          throw new Error('Failed to fetch applications');
        }

        const jobs = await jobResponse.json();

        const mappedJobs: Card[] = jobs.map((job: any) => ({
          id: String(job.ApplicationId),
          company: job.CompanyName,
          position: job.JobName,
          deadline: job.Deadline,
          location: job.Location,
          url: job.CompanyURL,
          notes: job.Notes || '',
          salary: job.Salary || 0,
          StatusId: job.StatusId,
          date_applied: job.DateApplied,
          card_color: job.Color || '#ffffff',
          companyLogo: job.CompanyLogo,
          Favourite: job.Favourite || false,
        }));

        const groupedColumns = groupJobsIntoColumns(mappedJobs, statuses);
        setColumns(groupedColumns);
      } catch (error) {
        console.error('Error loading applications or statuses:', error);
        setError('Failed to load applications or statuses');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchApplications();
    }
  }, [user, setColumns]);

  return { loading, error };
};