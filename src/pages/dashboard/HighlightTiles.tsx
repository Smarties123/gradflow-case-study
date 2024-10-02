import React from 'react';
import { Col, Row } from 'rsuite';
import { useSpring, animated } from 'react-spring';
import './Styles/HighlightTile.less';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import './Styles/HighlightTile.less';

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
    <>
      {/* // <Panel id='card' shaded style={{ background: color, color: '#FFF', borderRadius: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {/* Information Icon with Tooltip 
        <div style={{ position: 'absolute', top: 0, right: 0 }}>
          <Tooltip title={`Number Of ${title} Applications Made`}>
            <IconButton>
              <InfoIcon />
            </IconButton>
          </Tooltip>
        </div>

        {/* <div style={{ marginRight: '10px' }}>{icon}</div> 
        <div style={{ marginLeft: '8px' }}>
          <h4 style={{ margin: 0 }}>{title}</h4>
          <h2 style={{ margin: 0 }}>
            </animated.span>
          </h2>
        </div>
      </div> 
     </Panel > */}
      <Card className="cardStats" sx={{ backgroundColor: { color } }}>
        <CardContent sx={{ textAlign: 'center' }}>
          <Typography className="cardStatsValue" variant="h5" component="div">
            <animated.span>
              {props.number.to((n) => Math.floor(n))}
            </animated.span>
          </Typography>
          <Typography className="cardStatsTitle" sx={{ mb: 0.5 }}>{title}</Typography>
        </CardContent>

      </Card>
    </>
  );
};

interface HighlightTilesProps {
  data: { title: string; value: number; color: string; icon: React.ReactNode }[];
}

const HighlightTiles: React.FC<HighlightTilesProps> = ({ data }) => {
  return (
    <Row gutter={4}>
      {data.map((item, index) => (
        <Col key={index} xs={24} sm={6} md={3}>
          <HighlightTile title={item.title} value={item.value} color={item.color} icon={item.icon} />
        </Col>
      ))}
    </Row>
  );
};

export default HighlightTiles;
