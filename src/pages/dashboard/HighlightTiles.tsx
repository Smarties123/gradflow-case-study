import React from 'react';
import { Col, Row, Panel } from 'rsuite';
import { useSpring, animated } from 'react-spring';

import InfoIcon from '@mui/icons-material/Info'; import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

// Highlight Tile Component
interface HighlightTileProps {
  title: string;
  value: number;
  color: string;
  icon: React.ReactNode;
}

const HighlightTile: React.FC<HighlightTileProps> = ({ title, value, color, icon }) => {

  const props = useSpring({
    from: { number: 0 },
    to: { number: value },
    delay: 200,
    config: { duration: 1000 },
  });

  return (
    <Panel shaded style={{ background: color, color: '#FFF', borderRadius: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {/* Information Icon with Tooltip */}
        <div style={{ position: 'absolute', top: 0, right: 0 }}>
          <Tooltip title={`Number Of ${title} Applications Made`}>
            <IconButton>
              <InfoIcon />
            </IconButton>
          </Tooltip>
        </div>

        {/* <div style={{ marginRight: '10px' }}>{icon}</div> */}
        <div style={{ marginLeft: '8px' }}>
          <h4 style={{ margin: 0 }}>{title}</h4>
          <h2 style={{ margin: 0 }}>
            <animated.span>
              {props.number.to((n) => Math.floor(n))}
            </animated.span>
          </h2>
        </div>
      </div>

    </Panel >
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
      {/* <Col xs={24} sm={12} md={6}>
        <DonutChartComponent data={data} />
      </Col> */}
    </Row>
  );
};

export default HighlightTiles;
