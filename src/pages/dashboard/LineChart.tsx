import React, { useMemo } from 'react';
import InfoIcon from '@mui/icons-material/Info';
import IconButton from '@mui/material/IconButton';
import { Tooltip } from 'react-tooltip';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

interface LineChartData {
  name: string;
  [key: string]: number;  // Dynamically handle any column name
}

interface LineChartProps {
  columns: { title: string; cards: { date_applied: string }[] }[];  // Ensure correct typing for `columns` and `cards`
  title: string;
}

const LineChartComponent: React.FC<LineChartProps> = ({ columns = [], title }) => {
  const { lineChartData, columnTitles } = useMemo(() => {
    const dataMap: { [key: string]: any } = {};
    let earliestDate: Date | null = null;
    let latestDate: Date | null = new Date(); // Use current date as the latest

    const columnTitles = columns && Array.isArray(columns)
      ? columns.map(col => col.title)
      : [];

    // Calculate the last 6 months from the latest date
    const lastSixMonths = Array.from({ length: 6 }).map((_, i) => {
      const date = new Date(latestDate!.getFullYear(), latestDate!.getMonth() - i, 1);
      return date;
    }).reverse();  // Reverse to have them in ascending order

    const months = lastSixMonths.map((date) =>
      date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) // "Sep 2024" format
    );

    // Initialize the dataMap with last 6 months and columns as 0
    months.forEach((month) => {
      dataMap[month] = { name: month };
      columnTitles.forEach((title) => {
        dataMap[month][title] = 0;  // Initialize each title column with 0
      });
    });

    // Iterate through columns and cards to count activities by month
    if (Array.isArray(columns)) {
      columns.forEach((column) => {
        if (column.cards && Array.isArray(column.cards)) {
          column.cards.forEach((card) => {
            if (card.date_applied) {
              const cardDate = new Date(card.date_applied);
              const cardMonth = cardDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

              if (dataMap[cardMonth]) {
                dataMap[cardMonth][column.title] += 1;  // Increment the count for the corresponding column title
              }
            }
          });
        }
      });
    }

    return {
      lineChartData: Object.values(dataMap), // Convert the dataMap to an array for Recharts
      columnTitles
    };
  }, [columns]);

  // Helper function to assign random colors to each line
  const getRandomColor = (index: number) => {
    const colors = ['#FFD700', '#FF69B4', '#9370DB', '#FF4500', '#00CED1', '#800080'];
    return colors[index % colors.length];  // Rotate through the colors
  };


  return (
    <div>
      <h4 style={{ color: '#FFF', textAlign: 'left' }}>{title}</h4>

      <div style={{ position: 'relative', top: '-30px', left: '98%' }}> {/* Ensure positioning context */}
        {/* Icon button with a data-tooltip-id */}
        {/* Icon button with a data-tooltip-id */}
        <a data-tooltip-id="tooltip">
          <IconButton style={{ color: '#FFF' }}>
            <InfoIcon />
          </IconButton>
        </a>
        {/* Tooltip with id that matches data-tooltip-id */}
        <Tooltip id="tooltip" place="bottom" >
          Hover above the dots to view your applications
        </Tooltip>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={lineChartData}
          margin={{
            top: 5, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            interval={0}
            tickFormatter={(tick) => tick}  // Already formatted as "MMM YYYY"
          />
          <YAxis>
            <text x={-35} y={160} dy={-15} fill="#FFF" transform="rotate(-90)" textAnchor="middle">
              Number of Activities
            </text>
          </YAxis>
          <RechartsTooltip />
          <Legend
            layout="vertical"
            verticalAlign="middle"
            align="left"
            wrapperStyle={{
              color: '#FFF',
              paddingLeft: '10px',
            }}
          />
          {/* Dynamically create a Line for each column title */}
          {columnTitles.map((title, index) => (
            <Line
              key={index}
              type="monotone"
              dataKey={title}
              stroke={getRandomColor(index)}  // Assign random color or handle it your own way
              activeDot={{ r: 8 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartComponent;
