import React from "react";

export function CardContainer({ children, className }: any) {
  return <div className={`card-container ${className}`}>{children}</div>;
}

export function CardBody({ children, className }: any) {
  return <div className={`card-body ${className}`}>{children}</div>;
}

export function CardItem({ children, className, ...props }: any) {
  return (
    <div className={`card-item ${className}`} {...props}>
      {children}
    </div>
  );
}
