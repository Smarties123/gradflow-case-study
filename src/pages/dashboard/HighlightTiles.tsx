import React from 'react';
import { Col, Row } from 'rsuite';
import './Styles/HighlightTile.less';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useSpring, useTrail, animated, useSprings } from 'react-spring';


// Highlight Tile Component
interface HighlightTileProps {
  title: string;
  value: number;
  color: string;
  icon: React.ReactNode;
  isLight: boolean;
}

const HighlightTile: React.FC<HighlightTileProps> = ({ title, value, color, icon, isLight }) => {
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
  isLight: boolean;
}


const AnimatedCol = animated(Col);

const HighlightTiles: React.FC<HighlightTilesProps> = ({ data, isLight }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const items = [{ title: "ALL", value: total, color: "#FF8C00", icon: null }, ...data];
  const maxRotation = 180;
  const step = maxRotation / items.length;

  const springs = useSprings(
    items.length,
    items.map((_, index) => ({
      from: {
        opacity: 0,
        transform: `rotateY(${step * index}deg) translateY(-50px)`
      },
      to: {
        opacity: 1,
        transform: 'rotateY(0deg) translateY(0px)'
      },
      config: { mass: 1, tension: 700, friction: 400 },
      delay: index * 120,  // Staggered effect
    }))
  );

  return (
    <Row gutter={16} className="highlight-tiles-row">
      {springs.map((style, index) => {
        const item = items[index];
        return (
          <AnimatedCol
            key={index}
            style={style}
            xs={12}
            sm={12}
            md={8}
            lg={6}
            xl={3}
          >
            <HighlightTile
              title={item.title}
              value={item.value}
              color={item.color}
              icon={item.icon}
              isLight={isLight}
            />
          </AnimatedCol>
        );
      })}
    </Row>
  );
};



export default HighlightTiles;
