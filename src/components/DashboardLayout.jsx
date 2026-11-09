import React, { useEffect, useId, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeftRight, ArrowUpRight, CalendarDays, ClipboardList, Clock3, LayoutDashboard, ListChecks, Settings } from 'lucide-react';
import ThemeSwitch from './ThemeSwitch.jsx';
import DashboardAvatar from './DashboardAvatar.jsx';
import DashboardProfileSettings from './DashboardProfileSettings.jsx';
import logo from '../assets/brand/aidconnect-logo.webp';

const sectionIcons = {
  Overview: LayoutDashboard,
  'My shifts': CalendarDays,
  Applications: ClipboardList,
  'Hours & planning': Clock3,
  Listings: ListChecks,
  'Find shifts': CalendarDays,
  Schedule: CalendarDays,
  'Profile settings': Settings,
};

export default function DashboardLayout({ title, profile, otherRole, sections, metrics, action, children }) {
  const { pathname, hash } = useLocation();
  const dashboardPath = otherRole === 'Volunteer' ? '/organizations/dashboard' : '/volunteer/dashboard';
  const profilePath = dashboardPath + '/profile';
  const settings = pathname.replace(/\/$/, '') === profilePath;
  const [activeSection, setActiveSection] = useState(sections[0][0]);
  const mobileNav = useRef(null);

  useEffect(() => {
    const nav = mobileNav.current;
    const active = nav?.querySelector('[aria-current]');
    if (!active || !nav.clientWidth) return;
    const item = active.getBoundingClientRect();
    const frame = nav.getBoundingClientRect();
    if (item.left < frame.left) nav.scrollLeft -= frame.left - item.left + 8;
    else if (item.right > frame.right) nav.scrollLeft += item.right - frame.right + 8;
  }, [activeSection, settings]);

  useEffect(() => {
    if (settings) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }
    const target = document.getElementById(hash.slice(1));
    if (target) {
      target.scrollIntoView({ behavior: 'instant' });
      target.focus({ preventScroll: true });
    }
    else window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, settings, hash]);

  useEffect(() => {
    if (settings) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const elements = sections.map(([id]) => document.getElementById(id)).filter(Boolean)
          .sort((a, b) => a.offsetTop - b.offsetTop);
        const bottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
        const visible = bottom && window.scrollY > 0 ? elements.at(-1) : elements.findLast(element => element.getBoundingClientRect().top <= 135);
        setActiveSection(visible?.id ?? sections[0][0]);
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      cancelAnimationFrame(frame);
    };
  }, [sections, settings]);

  const navLink = 'flex min-h-10 shrink-0 items-center gap-2 rounded-lg px-2 text-sm font-semibold text-(--muted) hover:bg-(--nav-panel) aria-[current]:bg-(--nav-panel) aria-[current]:text-(--primary-strong) lg:min-h-11 lg:px-3';
  const sectionLinks = sections.map(([id, label]) => {
    const Icon = sectionIcons[label];
    return (
      <Link key={id} to={dashboardPath + '#' + id} aria-current={!settings && activeSection === id ? 'location' : undefined}
        className={navLink} onClick={() => { if (!settings && hash === '#' + id) document.getElementById(id)?.scrollIntoView(); }}>
        <Icon aria-hidden="true" size={17} className="hidden shrink-0 lg:block" />
        {label}
      </Link>
    );
  });
  const profileLink = (
    <Link to={profilePath} aria-current={settings ? 'page' : undefined} className={navLink}>
      <Settings aria-hidden="true" size={17} className="hidden lg:block" /> Profile settings
    </Link>
  );

  return (
    <div className="dashboard-shell grid min-h-screen min-w-0 bg-(--bg) font-body text-(--text) lg:grid-cols-[13.5rem_minmax(0,1fr)] xl:grid-cols-[15rem_minmax(0,1fr)]">
      <aside className="sticky top-0 hidden h-dvh flex-col overflow-y-auto border-r border-(--line) bg-(--panel) p-4 lg:flex">
        <Link to="/" className="flex min-h-12 items-center gap-2 px-2 font-display text-xl font-extrabold">
          <img src={logo} alt="" className="size-9 rounded-lg object-cover" />
          AidConnect
        </Link>
        <nav aria-label="Dashboard sections" className="mt-8 grid gap-2">
          {sectionLinks}
          {profileLink}
        </nav>
        <div className="mt-auto border-t border-(--line) px-2 pt-4">
          <Link to="/opportunities" className="flex min-h-11 items-center gap-2 text-sm font-semibold hover:underline">
            <ArrowUpRight aria-hidden="true" size={17} /> Browse catalog
          </Link>
          <p className="mt-2 mb-0 text-xs leading-relaxed text-(--muted)">Course demo. Dashboard changes reset on refresh.</p>
        </div>
      </aside>
      <div className="min-w-0">
        <header className="sticky top-0 z-20 flex h-14 min-w-0 items-center justify-between gap-2 border-b border-(--line) bg-(--panel) px-3 lg:px-6">
          <Link to="/" className="flex items-center gap-2 text-sm font-bold lg:hidden"><img src={logo} alt="" className="size-7 rounded-md object-cover" /> AidConnect</Link>
          <span className="hidden text-sm font-semibold text-(--muted) lg:block">{title}</span>
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <Link to={otherRole === 'Volunteer' ? '/volunteer/dashboard' : '/organizations/dashboard'} aria-label={`View ${otherRole.toLowerCase()} demo`}
              className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-md px-2 text-sm font-semibold hover:bg-(--nav-panel)">
              <ArrowLeftRight aria-hidden="true" size={16} />
              <span className="hidden sm:inline">View {otherRole.toLowerCase()} demo</span>
            </Link>
            <ThemeSwitch />
            <Link to={profilePath} aria-label={`Profile settings for ${profile.name}`}
              className="flex min-h-11 min-w-0 items-center gap-2 rounded-lg px-2 hover:bg-(--nav-panel) focus-visible:outline-2 focus-visible:outline-(--primary)">
              <DashboardAvatar profile={profile} className="size-8 text-xs" />
              <span className="hidden max-w-36 truncate text-sm font-semibold sm:block" title={profile.name}>{profile.name}</span>
              <Settings aria-hidden="true" size={14} className="shrink-0 text-(--muted)" />
            </Link>
          </div>
        </header>
        <nav ref={mobileNav} aria-label="Dashboard sections" className="sticky top-14 z-10 flex gap-1 overflow-x-auto border-b border-(--line) bg-(--panel) px-3 py-1 lg:hidden">
          {sectionLinks}
          {profileLink}
        </nav>
        <div className="mx-auto w-full min-w-0 max-w-[77rem] px-4 py-6 sm:px-6 lg:py-8 xl:px-9">
          {settings ? (
            <DashboardProfileSettings key={profile.id} profile={profile} role={otherRole === 'Volunteer' ? 'organization' : 'volunteer'} />
          ) : <>
          <section id="overview" tabIndex={-1} aria-labelledby="dashboard-title" className="mb-6 scroll-mt-32 lg:scroll-mt-20">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-(--line) bg-(--nav-panel) p-5 sm:p-7">
              <div className="min-w-0">
                <h1 id="dashboard-title" className="mb-2 font-display text-[clamp(1.75rem,4vw,2.75rem)] font-bold tracking-tight break-words">Hello {profile.name}</h1>
                <p className="m-0 text-sm text-(--muted)">{title} · Course demo</p>
              </div>
              {action}
            </div>
            <dl className="mt-4 mb-0 grid grid-cols-2 gap-3 md:grid-cols-4">
              {metrics.map(({ label, value, href, detail }) => (
                <div key={label} className="grid min-w-0 content-start gap-2 rounded-xl border border-(--line) bg-(--panel) p-4 sm:p-5">
                  <dt className="text-sm font-semibold text-(--muted)">{label}</dt>
                  <dd className="m-0 text-2xl leading-none font-bold text-(--primary-strong) tabular-nums sm:text-3xl">{value}</dd>
                  <dd className="m-0 text-xs">
                    <Link to={dashboardPath + href} className="inline-flex min-h-8 items-center gap-1 font-semibold text-(--primary-strong) underline underline-offset-4">{detail}<ArrowUpRight aria-hidden="true" size={13} className="shrink-0" /></Link>
                  </dd>
                </div>
              ))}
            </dl>
          </section>
          {children}
          </>}
          <div className="mt-6 border-t border-(--line) pt-3 lg:hidden">
            <Link to="/opportunities" className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold underline">
              Browse catalog <ArrowUpRight aria-hidden="true" size={15} />
            </Link>
            <p className="mb-0 text-xs text-(--muted)">Course demo. Dashboard changes reset on refresh.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DashboardSection({ title, id, children }) {
  const heading = useId();
  return (
    <section id={id} aria-labelledby={heading} tabIndex={-1} className="min-w-0 scroll-mt-32 rounded-xl border border-(--aid-rule) bg-(--aid-surface) p-4 sm:p-5 lg:scroll-mt-20">
      <h2 id={heading} className="mb-4 font-display text-xl font-bold">{title}</h2>
      {children}
    </section>
  );
}
