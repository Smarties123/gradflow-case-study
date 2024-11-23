import React from 'react';
import './AwesomeButton.less';

interface AwesomeButtonProps {
    children?: React.ReactNode;
    onClick: () => void;
    className?: string;
    style?: React.CSSProperties;
}
const AwesomeButton: React.FC<AwesomeButtonProps> = ({ children, onClick, className = '', style }) => {
    return (
        <div
            className={`button ${className}`} 
            style={style}
            onClick={onClick}
            role="button"
            tabIndex={0}
        >
            <span>
                {children}
            </span>
        </div>
    );
};

export default AwesomeButton;
