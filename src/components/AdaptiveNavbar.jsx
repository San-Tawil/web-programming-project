import React, { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import ThemeSwitch from './ThemeSwitch.jsx';
import logo from '../assets/brand/aidconnect-logo.webp';
import { useAuth } from '../context/AuthContext.jsx';
import useMediaQuery from '../hooks/useMediaQuery.js';
import useReducedMotion from '../hooks/useReducedMotion.js';
import useCssVar from '../hooks/useCssVar.js';

const BubbleMenu = lazy(() => import('./fx/BubbleMenu/BubbleMenu.jsx'));
const Navbar = lazy(() => import('./Navbar.jsx'));
const navigationFallback = <nav aria-label="Site pages"><Link to="/">Home</Link> · <Link to="/opportunities">Find opportunities</Link></nav>;

export default function AdaptiveNavbar() {
  const desktop = useMediaQuery('(min-width: 768px)');
  const reduced = useReducedMotion();
  const surface = useCssVar('--panel');
  const ink = useCssVar('--text');
  const chip = useCssVar('--fx-chip-mint');
  const chipInk = useCssVar('--fx-on-accent');
  const { user, logout } = useAuth();
  if (desktop) return <Suspense fallback={navigationFallback}><Navbar /></Suspense>;

  const items = [
    { label: 'Home', to: '/' }, { label: 'Find opportunities', to: '/opportunities' },
    { label: 'About', to: '/about' }, { label: 'Contact us', to: '/contact' },
    ...(user ? [{ label: 'Dashboard', to: '/dashboard' }, { label: 'Log out', onClick: logout }]
      : [{ label: 'Login', to: '/login' }, { label: 'Register', to: '/register' }]),
  ].map(item => ({ ...item, hoverStyles: { bgColor: chip, textColor: chipInk } }));

  return <div className="aid-mobile-nav">
    <Suspense fallback={navigationFallback}>
      <BubbleMenu useFixedPosition items={items} menuBg={surface} menuContentColor={ink}
        animationDuration={reduced ? 0.01 : 0.18} staggerDelay={reduced ? 0 : 0.025}
        logo={<Link to="/" aria-label="AidConnect home"><img src={logo} alt="" width="32" height="32" /></Link>}
        actions={<ThemeSwitch />} />
    </Suspense>
  </div>;
}
