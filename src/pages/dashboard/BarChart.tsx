import React, { useState } from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { useData } from '../../data/useData';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import Tooltip from '@mui/material/Tooltip';

interface BarChartProps {
  title: string;
  dateRange: [Date, Date] | null;
  filteredColumns: any[]; // Adjust this prop as needed for your data structure
}

const BarChart: React.FC<BarChartProps> = ({ title, dateRange, filteredColumns }) => {
  const [timeFrame, setTimeFrame] = useState('Select Period');
  const [stage, setStage] = useState('Select Type');

  const data = useData({ columns: filteredColumns, timeFrame, stage, dateRange });

  // Formatter function for Y-axis to display integer values
  const formatYAxisTick = (tick: number) => Math.floor(tick);

  return (
    <div style={{ position: 'relative' }}>
      {/* Title with Info Tooltip */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <h4 style={{ color: '#FFF', margin: 0 }}>{title}</h4>
        <Tooltip title={`Use filters to view your applications`} placement="top">
          <IconButton style={{ position: 'absolute', top: -3, right: -3, color: '#FFF' }}>
            <InfoIcon />
          </IconButton>
        </Tooltip>
      </div>

      {/* Dropdowns for TimeFrame and Stage */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        <select
          id="dropdownSelect"
          style={{ border: '1px solid #FFF', borderRadius: '3px', color: '#FFF', background: 'transparent' }}
          value={timeFrame}
          aria-label="Select Period"
          onChange={(e) => setTimeFrame(e.target.value)}
        >
          <option value="Select Period">Select Period</option>
          <option value="Daily">Daily</option>
          <option value="Weekly">Weekly</option>
          <option value="Monthly">Monthly</option>
        </select>
        <select
          id="dropdownSelect"
          style={{ border: '1px solid #FFF', borderRadius: '3px', color: '#FFF', background: 'transparent' }}
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

      {/* Bar Chart */}
      <ResponsiveContainer width="100%" height={330}>
        <RechartsBarChart data={data} margin={{ top: 20, right: 5, bottom: 5, left: 5 }}>
          <XAxis dataKey="date" />
          <YAxis tickFormatter={formatYAxisTick} domain={[0, 'auto']} allowDecimals={false} />
          <RechartsTooltip formatter={(value) => new Intl.NumberFormat().format(value)} />
          <Bar dataKey="value" fill="#FF6200" barSize={30} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;
