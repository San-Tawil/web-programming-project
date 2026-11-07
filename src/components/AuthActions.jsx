import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const base = 'inline-flex min-h-11 items-center justify-center rounded-md px-4 text-sm font-semibold';

export default function AuthActions({ onImage, onNavigate }) {
  const { user, logout } = useAuth();
  const outline = onImage ? 'border-white text-white hover:bg-white/10' : 'border-current hover:bg-white/10';
  const primary = base + ' bg-aid-primary text-white hover:underline';

  return (
    <div className="flex flex-col gap-2 lg:flex-row">
      <Link to={user ? '/dashboard' : '/login'} onClick={onNavigate} className={`${base} border ${outline}`}>
        {user ? 'Dashboard' : 'Login'}
      </Link>
      {user ? (
        <button type="button" onClick={() => { logout(); onNavigate(); }} className={primary}>Log out</button>
      ) : (
        <Link to="/register" onClick={onNavigate} className={primary}>Register</Link>
      )}
    </div>
  );
}
