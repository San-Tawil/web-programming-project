import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import aidConnectLogo from '../assets/brand/aidconnect-logo.webp';
import { useAuth } from '../context/AuthContext.jsx';
import Container from './Container.jsx';
import ThemeSwitch from './ThemeSwitch.jsx';
import CardNav from './fx/CardNav/CardNav.jsx';

function RouterLink({ href, ...props }) {
  return <Link to={href} {...props} />;
}

export default function Navbar() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const accountLinks = user
    ? [{ label: 'Dashboard', href: '/dashboard' }, { label: 'Log out' }]
    : [{ label: 'Login', href: '/login' }, { label: 'Register', href: '/register' }];
  const items = [
    { label: 'Home', className: 'card-nav__card--home', description: 'Back to the AidConnect homepage.', links: [{ label: 'Go to Home', href: '/' }] },
    { label: 'Volunteer', description: 'Find a role close to home.', links: [{ label: 'Browse opportunities', href: '/opportunities' }] },
    { label: 'Organizations', description: 'Share a role with local volunteers.', links: [{ label: 'Post an opportunity', href: '/organizations/register' }, { label: 'Organization login', href: '/organizations/login' }] },
    { label: 'AidConnect', description: 'Get to know the project.', links: [{ label: 'About', href: '/about' }, { label: 'Contact us', href: '/contact' }] },
    { label: 'Account', links: accountLinks },
  ];

  return (
    <header className="site-header">
      <Container className="flex min-h-20 items-center gap-3">
        <div className="min-w-0 flex-1">
          <CardNav key={pathname} items={items} ariaLabel="Main navigation"
            logo={<span className="flex items-center gap-2 font-bold"><img src={aidConnectLogo} alt="" width="28" height="28" className="aid-nav-logo rounded-full" />AidConnect</span>}
            logoAlt="AidConnect home" logoHref="/" maxWidth={1120} intro={false}
            surface="solid" openOn="click" accentColor="#1f6b4a" linkComponent={RouterLink}
            style={{
              '--cn-panel': 'var(--nav-panel)',
              '--cn-tile': 'var(--panel)',
              '--cn-text': 'var(--text)',
              '--cn-muted': 'var(--muted)',
              '--cn-ring': '#c6f432',
            }}
            cta={user ? { label: 'Dashboard', href: '/dashboard' } : { label: 'Login', href: '/login' }}
            onLinkClick={(link) => { if (link.label === 'Log out') logout(); }} />
        </div>
        <ThemeSwitch />
      </Container>
    </header>
  );
}
