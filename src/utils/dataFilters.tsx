import { format, parseISO, startOfWeek, startOfMonth, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval } from 'date-fns';

const rawData = [
  { date: '2023-08-24', stage: 'Pending', count: 5 },
  { date: '2023-08-25', stage: 'Pending', count: 8 },
  { date: '2023-08-26', stage: 'Pending', count: 6 },
  { date: '2023-08-24', stage: 'Applied', count: 3 },
  { date: '2023-08-25', stage: 'Applied', count: 4 },
  { date: '2023-08-26', stage: 'Applied', count: 7 },
  { date: '2023-08-24', stage: 'Offer', count: 1 },
  { date: '2023-08-25', stage: 'Offer', count: 2 },
  { date: '2023-08-26', stage: 'Offer', count: 1 },
  { date: '2023-08-01', stage: 'Pending', count: 10 },
  { date: '2023-08-08', stage: 'Pending', count: 12 },
  { date: '2023-08-15', stage: 'Pending', count: 8 },
  { date: '2023-08-01', stage: 'Applied', count: 6 },
  { date: '2023-08-08', stage: 'Applied', count: 9 },
  { date: '2023-08-15', stage: 'Applied', count: 7 },
  { date: '2023-08-01', stage: 'Offer', count: 2 },
  { date: '2023-08-08', stage: 'Offer', count: 3 },
  { date: '2023-08-15', stage: 'Offer', count: 4 },
  { date: '2023-06-01', stage: 'Pending', count: 15 },
  { date: '2023-07-01', stage: 'Pending', count: 14 },
  { date: '2023-08-01', stage: 'Pending', count: 16 },
  { date: '2023-06-01', stage: 'Applied', count: 7 },
  { date: '2023-07-01', stage: 'Applied', count: 6 },
  { date: '2023-08-01', stage: 'Applied', count: 8 },
  { date: '2023-06-01', stage: 'Offer', count: 2 },
  { date: '2023-07-01', stage: 'Offer', count: 3 },
  { date: '2023-08-01', stage: 'Offer', count: 4 },
];

export const getFilteredData = (timeFrame: string, stage: string) => {
  const filteredData = rawData.filter(item => item.stage === stage);

  let groupedData = [];

  if (timeFrame === 'Daily') {
    groupedData = eachDayOfInterval({
      start: parseISO('2023-08-01'),
      end: parseISO('2023-08-31'),
    }).map(day => {
      const formattedDay = format(day, 'yyyy-MM-dd');
      const total = filteredData
        .filter(item => item.date === formattedDay)
        .reduce((sum, item) => sum + item.count, 0);
      return { date: formattedDay, value: total };
    });
  } else if (timeFrame === 'Weekly') {
    groupedData = eachWeekOfInterval({
      start: parseISO('2023-08-01'),
      end: parseISO('2023-08-31'),
    }).map(weekStart => {
      const total = filteredData
        .filter(item => parseISO(item.date) >= startOfWeek(weekStart) && parseISO(item.date) < startOfWeek(weekStart, { weekStartsOn: 1 }))
        .reduce((sum, item) => sum + item.count, 0);
      return { date: format(weekStart, 'MMM d yyyy'), value: total };
    });
  } else if (timeFrame === 'Monthly') {
    groupedData = eachMonthOfInterval({
      start: parseISO('2023-06-01'),
      end: parseISO('2023-08-31'),
    }).map(monthStart => {
      const total = filteredData
        .filter(item => parseISO(item.date) >= startOfMonth(monthStart) && parseISO(item.date) < startOfMonth(monthStart, { monthStartsOn: 1 }))
        .reduce((sum, item) => sum + item.count, 0);
      return { date: format(monthStart, 'MMMM yyyy'), value: total };
    });
  }

  return groupedData;
};
