import React, { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import AuthActions from './AuthActions.jsx';
import ThemeSwitch from './ThemeSwitch.jsx';
import logo from '../assets/brand/aidconnect-logo.webp';
import useMediaQuery from '../hooks/useMediaQuery.js';
import useReducedMotion from '../hooks/useReducedMotion.js';

const BubbleMenu = lazy(() => import('./fx/BubbleMenu/BubbleMenu.jsx'));
const Navbar = lazy(() => import('./Navbar.jsx'));
const navigationFallback = <nav aria-label="Site pages" className="md:flex md:min-h-[81px] md:items-center md:gap-2 md:group-has-[.aid-home]/app:fixed md:group-has-[.aid-home]/app:inset-x-0 md:group-has-[.aid-home]/app:top-0 md:group-has-[.aid-home]/app:z-20 md:group-has-[.aid-home]/app:text-white"><Link to="/">Home</Link> · <Link to="/opportunities">Find opportunities</Link></nav>;
const items = [
  { label: 'Home', to: '/' },
  { label: 'Find opportunities', to: '/opportunities' },
  { label: 'Organization tools', to: '/organizations/tools' },
  { label: 'About', to: '/about' },
  { label: 'Contact us', to: '/contact' },
].map(item => ({
  ...item,
  hoverStyles: { bgColor: 'var(--fx-chip-mint)', textColor: 'var(--fx-on-accent)' },
}));

export default function AdaptiveNavbar() {
  const desktop = useMediaQuery('(min-width: 768px)');
  const reduced = useReducedMotion();
  if (desktop) return <Suspense fallback={navigationFallback}><Navbar /></Suspense>;

  return <div className="min-h-20">
    <Suspense fallback={navigationFallback}>
      <BubbleMenu useFixedPosition items={items} menuBg="var(--panel)" menuContentColor="var(--text)"
        animationDuration={reduced ? 0.01 : 0.18} staggerDelay={reduced ? 0 : 0.025}
        logo={<Link to="/" aria-label="AidConnect home"><img className="rounded-full" src={logo} alt="" width="32" height="32" /></Link>}
        leadingAction={<ThemeSwitch />}
        actions={<div className="justify-self-end"><AuthActions /></div>} />
    </Suspense>
  </div>;
}
