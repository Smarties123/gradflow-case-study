// InfoTooltip.tsx
import React from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import ReactTooltip from 'react-tooltip';

interface InfoToolTipProps {
    id: string;
    text: string;
    position?: 'top' | 'right' | 'bottom' | 'left'; // Optional, default is 'top'
}

const InfoToolTip: React.FC<InfoToolTipProps> = ({ id, text, position = 'top' }) => {
    return (
        <div style={{ position: 'absolute', top: 10, right: 10 }}>
            <FaInfoCircle data-tip data-for={id} style={{ cursor: 'pointer', color: '#888' }} />
            <ReactTooltip id={id} place={position as any} effect="solid">
                {text}
            </ReactTooltip>
        </div>
    );
};

export default InfoToolTip;
