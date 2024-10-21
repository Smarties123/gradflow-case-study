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
          {/* SEO optimized heading */}
          <Typography component="h3" className="cardStatsValue" variant="h5">
            <animated.span>
              {props.number.to((n) => Math.floor(n))}
            </animated.span>
          </Typography>
          <Typography component="h4" id="highlightTitle" className="cardStatsTitle" sx={{ mb: 0.5 }}>
            {title}
          </Typography>
        </CardContent>
      </Card>
    </>
  );
};

interface HighlightTilesProps {
  data: { title: string; value: number; color: string; icon: React.ReactNode }[];
}

const HighlightTiles: React.FC<HighlightTilesProps> = ({ data }) => {
  // Calculate the flex basis for the tiles based on the number of tiles
  const tilesPerRow = 8;
  const colSize = data.length <= tilesPerRow ? Math.floor(24 / data.length) : 3;

  return (
    <Row gutter={16} className="highlight-tiles-row">
      {data.map((item, index) => (
        <Col
          key={index}
          xs={24}  // Mobile: Full width
          sm={12}  // Small screens: 2 tiles per row
          md={8}   // Medium screens: 3 tiles per row
          lg={6}   // Large screens: 4 tiles per row
          xl={colSize}  // Adjust column size based on the number of tiles
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

