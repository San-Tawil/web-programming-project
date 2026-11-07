import React from 'react';

export default function Container({ children, className = '' }) {
  return <div className={`mx-auto w-full max-w-6xl xl:[.aid-home_&]:max-w-[90rem] px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}
