import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { Stack } from 'rsuite';

const Brand = ({ showText, ...props }) => {
  return (
    <Stack className="brand" {...props}>
      <Logo height={32} style={{ marginTop: 0 }} />
      {showText && (
        <Link to="/">
          <span style={{ marginLeft: 0 }}>GradFlow</span>
        </Link>
      )}
    </Stack>
  );
};

export default Brand;
