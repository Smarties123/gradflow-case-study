import React from 'react';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function Logo({ width, height, style, className = '' }: LogoProps) {
  const styles = { width, height, display: 'inline-block', ...style };
  return (
    <div
      style={styles}
      className={`rsuite-logo logo-animated logo-animated-delay-half-seconds bounce-in ${className} `}
    >
      <svg
        viewBox="0 0 120 138"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMin slice"
      >
        {/* ---------------------------------------- ADD GRADFLOW HERE. MAKE SURE ITS IN SVG FORMAT --------------------------------- */}
        <image href="https://upload.wikimedia.org/wikipedia/commons/2/21/Solid_black.svg" x="0" y="0" width="120" height="138" />
        {/* ---------------------------------------- --------------------------------------------------- */}

      </svg>
    </div>
  );
}
