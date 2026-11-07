import React from 'react';
import { Link } from 'react-router-dom';

const button = 'inline-flex min-h-11 items-center whitespace-nowrap rounded-md px-2 text-sm font-semibold sm:px-3';

export default function AuthActions() {
  return (
    <nav aria-label="Account" className="flex shrink-0 gap-1 sm:gap-2">
      <Link to="/register" className={`${button} bg-aid-primary text-white hover:underline`}>Sign up</Link>
      <Link to="/login" className={`${button} text-(--text) hover:underline`}>Log in</Link>
    </nav>
  );
}
