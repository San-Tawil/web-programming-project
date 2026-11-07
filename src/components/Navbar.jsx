import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import aidConnectLogo from '../assets/brand/aidconnect-logo.webp';
import AuthActions from './AuthActions.jsx';
import Container from './Container.jsx';
import ThemeSwitch from './ThemeSwitch.jsx';
import CardNav from './fx/CardNav/CardNav.jsx';

function RouterLink({ href, ...props }) {
  return <Link to={href} {...props} />;
}

const items = [
  { label: 'Home', className: "[&_.card-nav__link]:after:absolute [&_.card-nav__link]:after:inset-0 [&_.card-nav__link]:after:content-['']", description: 'Back to the AidConnect homepage.', links: [{ label: 'Go to Home', href: '/' }] },
  { label: 'Volunteer', description: 'Find a role close to home.', links: [{ label: 'Browse opportunities', href: '/opportunities' }] },
  { label: 'Organizations', description: 'Share a role with local volunteers.', links: [{ label: 'Post an opportunity', href: '/organizations/register' }, { label: 'Organization login', href: '/organizations/login' }] },
  { label: 'AidConnect', description: 'Get to know the project.', links: [{ label: 'About', href: '/about' }, { label: 'Contact us', href: '/contact' }] },
];

export default function Navbar() {
  const { pathname } = useLocation();
  return (
    <header className="sticky top-0 z-20 border-b border-(--line) bg-(--bg) backdrop-blur-[10px] group-has-[.aid-home]/app:fixed group-has-[.aid-home]/app:inset-x-0 group-has-[.aid-home]/app:border-0 group-has-[.aid-home]/app:bg-transparent group-has-[.aid-home]/app:text-[#f7f4eb] group-has-[.aid-home]/app:backdrop-blur-none">
      <Container className="flex min-h-20 items-center">
        <div className="min-w-0 flex-1">
          <CardNav key={pathname} items={items} ariaLabel="Main navigation"
            logo={<span className="flex items-center gap-2 font-bold"><img src={aidConnectLogo} alt="" width="28" height="28" className="shrink-0 rounded-full object-contain [.card-nav__logo_&]:size-7" />AidConnect</span>}
            logoAlt="AidConnect home" logoHref="/" maxWidth={1120} intro={false}
            surface="solid" openOn="click" linkComponent={RouterLink}
            actions={<div className="flex items-center justify-end gap-2"><ThemeSwitch /><AuthActions /></div>}
            style={{
              '--cn-panel': 'var(--nav-panel)',
              '--cn-tile': 'var(--panel)',
              '--cn-text': 'var(--text)',
              '--cn-muted': 'var(--muted)',
              '--cn-ring': '#c6f432',
            }} />
        </div>
      </Container>
    </header>
  );
}
