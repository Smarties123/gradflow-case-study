import React, { useState, useContext } from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { BoardContext } from '../board/BoardContext'; // Adjust the path as needed
import { useData } from '../../data/useData';

interface BarChartProps {
  title: string;
  dateRange: [Date, Date] | null;
  filteredColumns: any[]; // Add this prop
}

const BarChart: React.FC<BarChartProps> = ({ title, dateRange, filteredColumns }) => {
  const [timeFrame, setTimeFrame] = useState('Select Period');
  const [stage, setStage] = useState('Select Type');

  const data = useData({ columns: filteredColumns, timeFrame, stage, dateRange });
  // Formatter function to ensure only integer values are displayed on Y-axis
  const formatYAxisTick = (tick: number) => {
    return Math.floor(tick);  // Use Math.floor to round down to the nearest integer
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <h4 style={{ color: '#FFF' }}>{title}</h4>
      </div>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        <select
          id="dropdownSelect"
          style={{ border: '1px solid #FFF', borderRadius: '3px' }}
          value={timeFrame}
          onChange={(e) => setTimeFrame(e.target.value)}
        >
          <option value="Select Period">Select Period</option>
          <option value="Daily">Daily</option>
          <option value="Weekly">Weekly</option>
          <option value="Monthly">Monthly</option>
        </select>
        <select
          id="dropdownSelect"
          style={{ border: '1px solid #FFF', borderRadius: '3px' }}
          value={stage}
          onChange={(e) => setStage(e.target.value)}
        >
          <option value="Select Type">Select Type</option>
          {filteredColumns.map((column, index) => (
            <option key={index} value={column.title}>
              {column.title}
            </option>
          ))}
        </select>

      </div>

      <ResponsiveContainer width="100%" height={330}>
        <RechartsBarChart data={data} margin={{ top: 20, right: 5, bottom: 5, left: 5 }}>
          <XAxis dataKey="date" />
          <YAxis tickFormatter={formatYAxisTick} domain={[0, 'auto']} allowDecimals={false} />
          <Tooltip formatter={value => new Intl.NumberFormat().format(value)} />
          <Bar dataKey="value" fill="#FF6200" barSize={30} />
        </RechartsBarChart>
      </ResponsiveContainer>

    </div>
  );
};

export default BarChart;
