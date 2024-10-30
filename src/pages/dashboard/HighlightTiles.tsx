import React from 'react';
import { Col, Row } from 'rsuite';
import { useSpring, animated } from 'react-spring';
import './Styles/HighlightTile.less';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

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
    <Card className="cardStats" sx={{ backgroundColor: color, position: 'relative', borderRadius: '8px', color: '#FFF', minWidth: '120px', minHeight: '80px' }}>
      <CardContent sx={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography component="h3" className="cardStatsValue" variant="h5">
            <animated.span>
              {props.number.to((n) => Math.floor(n))}
            </animated.span>
          </Typography>
        </div>
        <Typography component="h4" id="highlightTitle" className="cardStatsTitle" sx={{ mb: 0.5 }}>
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
};

interface HighlightTilesProps {
  data: { title: string; value: number; color: string; icon: React.ReactNode }[];
}

const HighlightTiles: React.FC<HighlightTilesProps> = ({ data }) => {
  return (
    <Row gutter={16} className="highlight-tiles-row">
      {data.map((item, index) => (
        <Col
          key={index}
          xs={12}  // Mobile: 2 tiles per row
          sm={12}  // Small screens: 2 tiles per row
          md={8}   // Medium screens: 3 tiles per row
          lg={6}   // Large screens: 4 tiles per row
          xl={3}   // Extra large screens: 6 tiles per row
        >
          <HighlightTile
            title={item.title}
            value={item.value}
            color={item.color}
            icon={item.icon}
          />
        </Col>
      ))}
    </Row>
  );
};

export default HighlightTiles;
