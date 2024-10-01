import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../Logo';
import { Stack } from 'rsuite';

const LandingPageBrand = ({ ...props }) => {
    return (
        <Stack className="LandingPageBrand" {...props}>
            <Logo height={32} style={{ marginTop: 0 }} />
            <Link to="/">
                <span style={{ marginLeft: 0, color: '#FF6200' }}>GradFlow</span>
            </Link>
        </Stack >
    );
};

export default LandingPageBrand;
