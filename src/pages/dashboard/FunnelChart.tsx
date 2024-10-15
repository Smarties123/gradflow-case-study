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

const CustomLabel: React.FC<{ x: number, y: number, name: string, percent: number }> = ({ x, y, name, percent }) => {
  return (
    <g>
      <text
        x={x}
        y={y - 5}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ fill: '#fff', fontSize: 12 }} // Percentage text in white
      >
        {percent}%
      </text>
    </g>
  );
};

const FunnelChart: React.FC<FunnelChartProps> = ({ data = [], title, mode }) => {
  // Filter out entries with a value of 0
  // Sort data in descending order of value
  const sortedData = [...data].sort((a, b) => b.value - a.value);

  // Filter out entries with a value of 0
  const filteredData = sortedData.filter(entry => entry.value !== 0);
  return (
    <div className={mode === 'light' ? 'rs-theme-light' : 'rs-theme-dark'}>
      <h4>{title}</h4>
      {filteredData.length > 0 ? (
        <RechartsFunnelChart width={400} height={250}>
          <Tooltip
            formatter={(value, name) => [value, name]}
            contentStyle={{}}
          />
          <Funnel dataKey="value" data={filteredData} isAnimationActive>
            {filteredData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                stroke="black"
                strokeWidth={mode === 'light' ? 1 : 0} // Add stroke for contrast in light mode
                style={{
                  transition: 'fill 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.target.style.fill = '#ccc9c2'; // Change background to white on hover
                  e.target.style.stroke = entry.color; // Change stroke to original color for contrast

                }}
                onMouseLeave={(e) => {
                  e.target.style.fill = entry.color; // Reset background color on mouse leave
                  e.target.style.stroke = 'none'; // Remove stroke
                }}
              />
            ))}
            <LabelList
              content={({ x, y, index }) => {
                const entry = filteredData[index];
                return (
                  <CustomLabel
                    x={195}
                    y={y + 30}
                    name={entry.name + " " + entry.value}
                    percent={entry.percent}
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
