import React, { useState } from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface BarChartData {
  date: string;
  value: number;
}

interface BarChartProps {
  data: BarChartData[];
  title: string;
}

const BarChart: React.FC<BarChartProps> = ({ data, title }) => {
  const [timeFrame, setTimeFrame] = useState('Weekly');
  const [stage, setStage] = useState('Pending');

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        <h4 style={{ color: '#FFF' }}>{title}</h4>
        <div style={{ display: 'flex', gap: '10px' }}>
          <select
            style={{ background: '#333', color: '#FFF', border: '1px solid #FFF', borderRadius: '3px' }}
            value={timeFrame}
            onChange={(e) => setTimeFrame(e.target.value)}
          >
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
          </select>
          <select
            style={{ background: '#333', color: '#FFF', border: '1px solid #FFF', borderRadius: '3px' }}
            value={stage}
            onChange={(e) => setStage(e.target.value)}
          >
            <option value="Pending">Pending</option>
            <option value="Applied">Applied</option>
            <option value="Offer">Offer</option>
          </select>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <RechartsBarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <XAxis dataKey="date" tick={{ fill: '#FFF' }} />
          <YAxis tick={{ fill: '#FFF' }} axisLine={{ stroke: '#FFF' }} />
          <Tooltip />
          <Bar dataKey="value" fill="#FF6200" barSize={30} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;
