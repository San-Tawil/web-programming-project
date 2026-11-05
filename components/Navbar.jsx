import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import aidConnectLogo from '../assets/aidconnect-logo.jpg';
import AuthActions from './AuthActions.jsx';
import Container from './Container.jsx';
import ThemeSwitch from './ThemeSwitch.jsx';

const links = [
  { to: '/', label: 'Home' },
  { to: '/opportunities', label: 'Find opportunities' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const [openPath, setOpenPath] = useState(null);
  const open = openPath === pathname;
  const close = () => setOpenPath(null);

  return (
    <header className="site-header">
      <Container className="relative flex min-h-20 items-center justify-between gap-3">
        <Link to="/" onClick={close} className="brand shrink-0">
          <img src={aidConnectLogo} alt="" width="32" height="32" className="rounded-full" />
          AidConnect
        </Link>

        <div className="flex items-center gap-2 lg:order-last">
          <ThemeSwitch />
          <button type="button" aria-expanded={open} aria-controls="site-navigation"
            onClick={() => setOpenPath(open ? null : pathname)}
            className="min-h-11 rounded-md border border-current bg-transparent px-2 text-inherit lg:hidden">
            {open ? 'Close' : 'Menu'}
          </button>
        </div>

        <nav id="site-navigation" aria-label="Main navigation"
          className={`${open ? 'flex' : 'hidden'} absolute inset-x-4 top-full z-10 max-h-[75vh] flex-col gap-2 overflow-auto rounded-md bg-aid-footer p-4 text-white lg:static lg:flex lg:max-h-none lg:flex-row lg:items-center lg:overflow-visible lg:bg-transparent lg:p-0 lg:text-inherit`}>
          {links.map(({ to, label }) => (
            <NavLink key={to} to={to} onClick={close} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              {label}
            </NavLink>
          ))}
          <AuthActions onImage={pathname === '/'} onNavigate={close} />
        </nav>
      </Container>
    </header>
  );
}
