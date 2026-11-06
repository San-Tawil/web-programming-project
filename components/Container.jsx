import React from 'react';

export default function Container({ children, className = '' }) {
  return <div className={`aid-container mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}
