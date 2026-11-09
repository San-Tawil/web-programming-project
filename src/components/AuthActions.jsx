import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDashboardDemo } from '../context/DashboardDemoContext.jsx';

const button = 'inline-flex min-h-11 items-center whitespace-nowrap rounded-md px-2 text-sm font-semibold sm:px-3';

export default function AuthActions() {
  const { accountRole, selectAccount } = useDashboardDemo();
  const navigate = useNavigate();

  if (accountRole) {
    return (
      <nav aria-label="Account" className="flex shrink-0 gap-1 sm:gap-2">
        <Link to={`/${accountRole}/dashboard`} className={`${button} bg-aid-primary text-white hover:underline`}>Dashboard</Link>
        <button type="button" className={`${button} cursor-pointer border-0 bg-transparent text-(--text) hover:underline`}
          onClick={() => {
            selectAccount(null);
            navigate('/login', { replace: true });
          }}>
          Log out
        </button>
      </nav>
    );
  }

  return (
    <nav aria-label="Account" className="flex shrink-0 gap-1 sm:gap-2">
      <Link to="/register" className={`${button} bg-aid-primary text-white hover:underline`}>Sign up</Link>
      <Link to="/login" className={`${button} text-(--text) hover:underline`}>Log in</Link>
    </nav>
  );
}
