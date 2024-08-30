import React from 'react';
import { Col, Row, Panel } from 'rsuite';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

// Highlight Tile Component
interface HighlightTileProps {
  title: string;
  value: number;
  color: string;
  icon: React.ReactNode;
}

const HighlightTile: React.FC<HighlightTileProps> = ({ title, value, color, icon }) => {
  return (
    <Panel shaded style={{ background: color, color: '#FFF', borderRadius: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ marginRight: '10px' }}>{icon}</div>
        <div>
          <h4 style={{ margin: 0 }}>{title}</h4>
          <h2 style={{ margin: 0 }}>{value}</h2>
        </div>
      </div>
    </Panel>
  );
};

interface HighlightTilesProps {
  data: { title: string; value: number; color: string; icon: React.ReactNode }[];
}

const HighlightTiles: React.FC<HighlightTilesProps> = ({ data }) => {
  return (
    <Row gutter={16}>
      {data.map((item, index) => (
        <Col key={index} xs={24} sm={12} md={6}>
          <HighlightTile title={item.title} value={item.value} color={item.color} icon={item.icon} />
        </Col>
      ))}
      <Col xs={24} sm={12} md={6}>
        <DonutChartComponent data={data} />
      </Col>
    </Row>
  );
};

// Donut Chart Component
interface DonutChartComponentProps {
  data: { title: string; value: number; color: string }[];
}

const DonutChartComponent: React.FC<DonutChartComponentProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="title"
          cx="50%"
          cy="50%"
          innerRadius="60%"
          outerRadius="80%"
          fill="#8884d8"
          paddingAngle={5}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default HighlightTiles;
