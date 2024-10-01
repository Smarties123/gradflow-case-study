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
      <img
        src="https://i.imgur.com/ctEoTCl.png"  // replace with the actual direct URL
        alt="Logo"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
