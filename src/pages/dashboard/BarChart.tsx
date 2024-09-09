import React, { useState, useContext } from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { BoardContext } from '../board/BoardContext'; // Adjust the path as needed
import { useData } from '../../data/useData';

interface BarChartProps {
  // monthData: { date: string; value: number }[];   // "Sep 2024", "Aug 2024", etc.
  // weekData: { date: string; value: number }[];
  // dailyData: { date: string; value: number }[];
  // monthandFirstColumn: { date: string; value: number }[];
  // monthandSecondColumn: { date: string; value: number }[];
  // monthandThirdColumn: { date: string; value: number }[];
  // monthandFourthColumn: { date: string; value: number }[];
  // allData: { date: string; value: number }[];
  title: string;
}

const BarChart: React.FC<BarChartProps> = ({
  // allData,
  // monthData,
  // weekData,
  // dailyData,
  // monthandFirstColumn,
  // monthandSecondColumn,
  // monthandThirdColumn,
  // monthandFourthColumn,
  title
}) => {

  const { columns } = useContext(BoardContext);

  const [timeFrame, setTimeFrame] = useState('Select Period');
  const [stage, setStage] = useState('Select Type');

  const data = useData({ columns, timeFrame, stage });


  // const data = getData();

  // Formatter function to ensure only integer values are displayed on Y-axis
  const formatYAxisTick = (tick: number) => {
    return Math.floor(tick);  // Use Math.floor to round down to the nearest integer
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        <h4 style={{ color: '#FFF' }}>{title}</h4>
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <select
          style={{ background: '#333', color: '#FFF', border: '1px solid #FFF', borderRadius: '3px' }}
          value={timeFrame}
          onChange={(e) => setTimeFrame(e.target.value)}
        >
          <option value="Select Period">Select Period</option>
          <option value="Daily">Daily</option>
          <option value="Weekly">Weekly</option>
          <option value="Monthly">Monthly</option>
        </select>
        <select
          style={{ background: '#333', color: '#FFF', border: '1px solid #FFF', borderRadius: '3px' }}
          value={stage}
          onChange={(e) => setStage(e.target.value)}
        >
          <option value="Select Type">Select Type</option>
          {columns.map((column, index) => (
            <option key={index} value={column.title}>
              {column.title}
            </option>
          ))}
        </select>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <RechartsBarChart data={data} margin={{ top: 20, right: 5, bottom: 5, left: 5 }}>
          <XAxis dataKey="date" />
          <YAxis tickFormatter={(tick) => Math.floor(tick)} // Ensures integer values
            domain={[0, 'auto']}  // Sets the lower bound to 0 and allows Recharts to adjust the upper bound
            allowDecimals={false} // Disables decimals
          />
          <Tooltip formatter={value => new Intl.NumberFormat().format(value)} />
          <Bar dataKey="value" fill="#FF6200" barSize={30} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;
