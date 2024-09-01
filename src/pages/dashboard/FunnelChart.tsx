import React from 'react';
import { FunnelChart as RechartsFunnelChart, Funnel, LabelList, Tooltip, Cell } from 'recharts';

interface FunnelChartData {
  name: string;
  value: number;
  percent: number;
  color: string;
}

interface FunnelChartProps {
  data: FunnelChartData[];
  title: string;
}

const FunnelChart: React.FC<FunnelChartProps> = ({ data, title }) => {
  return (
    <div>
      <h4 style={{ color: '#FFF', textAlign: 'left' }}>{title}</h4>
      <RechartsFunnelChart width={400} height={250}>
        <Tooltip />
        <Funnel dataKey="value" data={data} isAnimationActive>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
          <LabelList
            position="left"
            fill="#FFF"
            stroke="none"
            dataKey="name"
            formatter={(name) => `${name}`}
          />
          <LabelList
            position="center"
            fill="#FFF"
            stroke="none"
            dataKey="percent"
            formatter={(value) => `${value}%`}
          />
        </Funnel>
      </RechartsFunnelChart>
    </div>
  );
};

export default FunnelChart;
