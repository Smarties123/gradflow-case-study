// ./boardComponents/utils.ts

import { Column, Card } from '../types';

export const groupJobsIntoColumns = (jobs: Card[], statuses: any[]): Column[] => {
  const columns: Column[] = statuses.map(status => ({
    id: status.StatusId,
    title: status.StatusName,
    cards: []
  }));

  jobs.forEach(job => {
    const statusIndex = columns.findIndex(col => col.id === job.StatusId);
    if (statusIndex >= 0) {
      columns[statusIndex].cards.push(job);
    } else {
      columns[0].cards.push(job);
    }
  });

  return columns;
};
