import React from 'react';
import './AwesomeButton.less';

const AwesomeButton = ({ children, onClick, className, style, disabled }) => {
    return (
        <div
            className={`button ${className}`} // Use the button class from LESS
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
