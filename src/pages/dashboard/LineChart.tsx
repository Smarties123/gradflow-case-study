import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
    let latestDate: Date | null = null;

    const columnTitles = columns && Array.isArray(columns)
      ? columns.map(col => col.title)
      : [];

    // Find the earliest and latest month from the cards
    if (Array.isArray(columns)) {
      columns.forEach((column) => {
        if (column.cards && Array.isArray(column.cards)) {
          column.cards.forEach((card) => {
            if (card.date_applied) {
              const cardDate = new Date(card.date_applied);
              if (!earliestDate || cardDate < earliestDate) {
                earliestDate = cardDate;
              }
              if (!latestDate || cardDate > latestDate) {
                latestDate = cardDate;
              }
            }
          });
        }
      });
    }

    // Generate months between earliest and latest dates
    const months = [];
    if (earliestDate && latestDate) {
      let currentMonth = new Date(earliestDate.getFullYear(), earliestDate.getMonth(), 1);
      const endMonth = new Date(latestDate.getFullYear(), latestDate.getMonth() + 1, 0);

      while (currentMonth <= endMonth) {
        months.push(currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
        currentMonth.setMonth(currentMonth.getMonth() + 1);
      }
    }

    console.log("Months: ", months);
    console.log("Columns: ", columns);

    // Initialize the dataMap with all months and columns as 0
    months.forEach((month) => {
      dataMap[month] = { name: month };
      columnTitles.forEach((title) => {
        dataMap[month][title] = 0;  // Initialize each title column with 0
      });
    });

    console.log("Initialized Data Map: ", dataMap);

    // Iterate through columns and cards to count activities by month
    if (Array.isArray(columns)) {
      columns.forEach((column) => {
        if (column.cards && Array.isArray(column.cards)) {
          column.cards.forEach((card) => {
            if (card.date_applied) {
              const cardDate = new Date(card.date_applied);
              const cardMonth = cardDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

              if (dataMap[cardMonth]) {
                dataMap[cardMonth][column.title] += 1;  // Increment the count for the corresponding column title
              }
            }
          });
        }
      });
    }

    console.log("Final Data Map: ", dataMap);

    return {
      lineChartData: Object.values(dataMap), // Convert the dataMap to an array for Recharts
      columnTitles
    };
  }, [columns]);

  console.log("Line Chart Data: ", lineChartData);

  return (
    <div>
      <h4 style={{ color: '#FFF', textAlign: 'left' }}>{title}</h4>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={lineChartData}
          margin={{
            top: 5, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" interval={0} />
          <YAxis>
            <text x={-35} y={160} dy={-15} fill="#FFF" transform="rotate(-90)" textAnchor="middle">
              Number of Activities
            </text>
          </YAxis>
          <Tooltip />
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

// Helper function to assign random colors to each line
const getRandomColor = (index: number) => {
  const colors = ['#FFD700', '#FF69B4', '#9370DB', '#FF4500', '#00CED1', '#800080'];
  return colors[index % colors.length];  // Rotate through the colors
};

export default LineChartComponent;
