import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface LineChartData {
  name: string;
  Apply: number;
  'Phone Interview': number;
  'Phone Call': number;
  'On Site Interview': number;
  'Offer Received': number;
  'Received Offer': number;
}

interface LineChartProps {
  data: LineChartData[];
  title: string;
}

const LineChartComponent: React.FC<LineChartProps> = ({ data, title }) => (
  <div>
    <h4 style={{ color: '#FFF', textAlign: 'left' }}>{title}</h4>
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={data}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
        <XAxis dataKey="name" stroke="#FFF" />
        <YAxis stroke="#FFF">
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
        <Line type="monotone" dataKey="Apply" stroke="#FFD700" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="Phone Interview" stroke="#FF69B4" />
        <Line type="monotone" dataKey="Phone Call" stroke="#9370DB" />
        <Line type="monotone" dataKey="On Site Interview" stroke="#FF4500" />
        <Line type="monotone" dataKey="Offer Received" stroke="#00CED1" />
        <Line type="monotone" dataKey="Received Offer" stroke="#800080" />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default LineChartComponent;
