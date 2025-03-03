import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { Stack } from 'rsuite';
import BetaBadge from './BetaBadge/BetaBadge';

const Brand = ({ showText, ...props }) => {
  return (
    <Stack className="brand" {...props}>
      <Logo height={32} style={{ marginTop: 0 }} />
      {showText && (
         <Link to="/" style={{ textDecoration: 'none', position: 'relative', display: 'inline-block' }}>
              <span style={{ color: '#FF6200', fontWeight: 'bold', fontSize: '20px', position: 'relative' }}>
                  GradFlow
                  <BetaBadge />
              </span>
          </Link>
      )
      }
    </Stack >
  );
};

export default Brand;
