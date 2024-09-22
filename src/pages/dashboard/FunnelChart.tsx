import React from 'react';
import { FunnelChart as RechartsFunnelChart, Funnel, Tooltip, Cell, LabelList } from 'recharts';

interface FunnelChartData {
  name: string;
  value: number;
  percent: number;
  color: string;
}

interface FunnelChartProps {
  data?: FunnelChartData[];
  title: string;
  mode: 'light' | 'dark'; // Mode prop to handle light or dark mode
}

const CustomLabel: React.FC<{ x: number, y: number, value: any, name: string, percent: number, mode: 'light' | 'dark' }> = ({ x, y, name, percent, mode }) => {
  return (
    <g>
      <text id="label" x={195} y={y + 30} textAnchor="middle" dominantBaseline="middle">
        {name}: {percent}%
      </text>
    </g>
  );
};

const FunnelChart: React.FC<FunnelChartProps> = ({ data = [], title, mode }) => {
  return (
    <div className={mode === 'light' ? 'rs-theme-light' : 'rs-theme-dark'}>
      <h4>{title}</h4>
      {data.length > 0 ? (
        <RechartsFunnelChart width={400} height={250}>
          <Tooltip />
          <Funnel dataKey="value" data={data} isAnimationActive>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.value === 0 ? 'rgba(255, 255, 255, 0.2)' : entry.color}
                stroke={entry.value === 0 ? '#FFF' : 'none'}
                strokeWidth={entry.value === 0 ? 2 : 0}
              />
            ))}
            <LabelList
              content={({ x, y, value, index }) => {
                const entry = data[index];
                return (
                  <CustomLabel
                    x={x}
                    y={y}
                    value={value}
                    name={entry.name}
                    percent={entry.percent}
                    mode={mode} // Pass mode to CustomLabel
                  />
                );
              }}
            />
          </Funnel>
        </RechartsFunnelChart>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default FunnelChart;
