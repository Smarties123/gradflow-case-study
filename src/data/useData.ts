import { useMemo } from 'react';

export const useData = ({ columns, timeFrame, stage, dateRange }: UseDataParams) => {

    const allData = useMemo(() => {
        const dataMap: { [key: string]: number } = {};
        const highlightData = columns.map((column) => ({
            title: column.title,
            value: column.cards.length,
        }));

        highlightData.forEach(data => {
            dataMap[data.title] = data.value;
        });

        return highlightData.map(data => ({
            date: data.title,
            value: dataMap[data.title],
        }));
    }, [columns]);

    const today = new Date();

    const monthData = useMemo(() => {
        const dataMap: { [key: string]: number } = {};
        const months = Array.from({ length: 12 }, (_, i) => {
            const date = new Date();
            date.setMonth(today.getMonth() - (11 - i));
            return {
                label: `${date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`,
            };
        });

        months.forEach(month => {
            dataMap[month.label] = 0;
        });

        columns.forEach(column => {
            if (stage === 'Select Type' || column.title === stage) {
                column.cards.forEach(card => {
                    if (card.date_applied) {
                        const cardDate = new Date(card.date_applied);
                        const cardMonth = cardDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                        if (dataMap[cardMonth] !== undefined) {
                            dataMap[cardMonth] += 1;
                        }
                    }
                });
            }
        });

        return months.map(month => ({
            date: month.label,
            value: dataMap[month.label],
        }));
    }, [columns, stage]);

    const weekData = useMemo(() => {
        const dataMap: { [key: string]: number } = {};
        const getStartOfWeek = (date: Date) => {
            const dayOfWeek = date.getDay();
            const diff = date.getDate() - dayOfWeek;
            return new Date(date.setDate(diff));
        };

        const weeks = Array.from({ length: 4 }, (_, i) => {
            const currentWeekStart = getStartOfWeek(new Date());
            currentWeekStart.setDate(currentWeekStart.getDate() - i * 7);

            const weekEnd = new Date(currentWeekStart);
            weekEnd.setDate(currentWeekStart.getDate() + 6);

            const weekLabel = `${currentWeekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;

            return {
                label: weekLabel,
                startDate: currentWeekStart,
                endDate: weekEnd,
            };
        }).reverse();

        weeks.forEach(week => {
            dataMap[week.label] = 0;
        });

        columns.forEach(column => {
            if (stage === 'Select Type' || column.title === stage) {
                column.cards.forEach(card => {
                    if (card.date_applied) {
                        const cardDate = new Date(card.date_applied);
                        weeks.forEach(week => {
                            if (cardDate >= week.startDate && cardDate <= week.endDate) {
                                dataMap[week.label] += 1;
                            }
                        });
                    }
                });
            }
        });

        return weeks.map(week => ({
            date: week.label,
            value: dataMap[week.label],
        }));
    }, [columns, stage]);

    const dailyData = useMemo(() => {
        const dataMap: { [key: string]: number } = {};
        const days = Array.from({ length: 8 }, (_, i) => {
            const currentDay = new Date();
            currentDay.setDate(today.getDate() - i);
            const dayLabel = currentDay.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            return {
                label: dayLabel,
                date: currentDay,
            };
        }).reverse();

        days.forEach(day => {
            dataMap[day.label] = 0;
        });

        columns.forEach(column => {
            if (stage === 'Select Type' || column.title === stage) {
                column.cards.forEach(card => {
                    if (card.date_applied) {
                        const cardDate = new Date(card.date_applied);
                        const cardLabel = cardDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                        if (dataMap[cardLabel] !== undefined) {
                            dataMap[cardLabel] += 1;
                        }
                    }
                });
            }
        });

        return days.map(day => ({
            date: day.label,
            value: dataMap[day.label],
        }));
    }, [columns, stage]);

    // Handle default case when both timeFrame and stage are not selected
    if (timeFrame === 'Select Period' && stage === 'Select Type') {
        return allData;
    }

    // If stage is not specified (or "Select Type"), show data for all columns based on timeFrame
    if (stage === 'Select Type') {
        if (timeFrame === 'Monthly') {
            return monthData;
        }
        if (timeFrame === 'Weekly') {
            return weekData;
        }
        if (timeFrame === 'Daily') {
            return dailyData;
        }
    }

    // If both timeFrame and stage are specified, filter accordingly
    if (timeFrame === 'Monthly') {
        return monthData;
    }
    if (timeFrame === 'Weekly') {
        return weekData;
    }
    if (timeFrame === 'Daily') {
        return dailyData;
    }

    return [];
};
