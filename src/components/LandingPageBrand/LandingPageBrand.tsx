import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../Logo';
import { Stack } from 'rsuite';
import BetaBadge from '../BetaBadge/BetaBadge';

const LandingPageBrand = ({ ...props }) => {
    return (
        <Stack className="LandingPageBrand" {...props} style={{ alignItems: 'center', position: 'relative' }}>
            <Logo height={32} style={{ marginTop: 0 }} />
            <Link to="/" style={{ textDecoration: 'none', position: 'relative', display: 'inline-block' }}>
                <span style={{ color: '#FF6200', fontWeight: 'bold', fontSize: '20px', position: 'relative' }}>
                    GradFlow
                    <BetaBadge /> 
                </span>
            </Link>
        </Stack>
    );
};

export default LandingPageBrand;
