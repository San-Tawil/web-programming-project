import React, { useEffect, useRef, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { CalendarDays, ChevronDown, ClipboardList, Clock3, LayoutDashboard, ListChecks, Menu, PanelLeftClose, PanelLeftOpen, Settings } from 'lucide-react';
import ThemeSwitch from './ThemeSwitch.jsx';
import DashboardAvatar from './DashboardAvatar.jsx';
import DashboardProfileSettings from './DashboardProfileSettings.jsx';
import { Modal, StatCard } from './DashboardUI.jsx';
import logo from '../assets/brand/aidconnect-logo.webp';
import DashboardNav from "./DashboardNav.jsx";

export { Card as DashboardSection } from './DashboardUI.jsx';

const icons = {
  overview: LayoutDashboard,
  'my-shifts': CalendarDays,
  'my-applications': ClipboardList,
  applications: ClipboardList,
  hours: Clock3,
  listings: ListChecks,
  'find-shifts': CalendarDays,
  schedule: CalendarDays,
  profile: Settings,
};

export function useDashboardView(sections) {
  const { pathname, search, hash } = useLocation();
  if (/\/profile\/?$/.test(pathname)) return 'profile';
  const section = new URLSearchParams(search).get('section') || hash.slice(1);
  if (section === 'next-shift') return 'my-shifts';
  return sections.some(([id]) => id === section) ? section : 'overview';
}

export function dashboardSection(path, id) {
  if (id === 'overview') return path;
  if (id === 'profile') return path + '/profile';
  return path + '?section=' + (id === 'next-shift' ? 'my-shifts' : id);
}

export default function DashboardLayout({ title, profile, otherRole, sections, metrics, action, children }) {
  const { key, hash } = useLocation();
  const org = otherRole === 'Volunteer';
  const base = org ? '/organizations/dashboard' : '/volunteer/dashboard';
  const view = useDashboardView(sections);
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const scroller = useRef(null);
  const main = useRef(null);
  const pageTitle = view === 'profile' ? 'Profile settings' : sections.find(([id]) => id === view)?.[1];
  const items = [...sections, ['profile', 'Profile settings']];

  useEffect(() => {
    scroller.current?.scrollTo({ top: 0, behavior: 'instant' });
    if (!hash) main.current?.focus({ preventScroll: true });
  }, [key, hash]);

  function navItems(iconOnly = false, close) {
    return items.map(([id, label]) => {
      const Icon = icons[id];
      return <Link key={id} to={dashboardSection(base, id)} onClick={close} title={iconOnly ? label : undefined}
        aria-label={iconOnly ? label : undefined} aria-current={view === id ? 'page' : undefined}
        className={`flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold text-(--muted) hover:bg-(--nav-panel) aria-[current=page]:bg-(--nav-panel) aria-[current=page]:text-(--primary) ${iconOnly ? 'justify-center' : ''}`}>
        <Icon size={18} aria-hidden="true" className="shrink-0" />{!iconOnly && label}
      </Link>;
    });
  }

  // Dashboard shell structure adapted from Cruip Mosaic Lite (MIT), https://github.com/cruip/tailwind-dashboard-template
  return <div className="dashboard-shell flex h-dvh min-w-0 bg-(--bg) font-body text-(--text)">
    <aside className={`hidden shrink-0 flex-col overflow-y-auto border-r border-(--line) bg-(--panel) p-3 lg:flex ${collapsed ? 'w-18' : 'w-64'}`}>
      <Link to="/" aria-label="AidConnect home" className={`flex min-h-12 items-center gap-2 rounded-lg px-2 font-semibold ${collapsed ? 'justify-center' : ''}`}>
        <img src={logo} alt="" width="32" height="32" className="size-8 shrink-0 rounded-full object-contain" />{!collapsed && 'AidConnect'}
      </Link>
      <nav aria-label="Dashboard sections" className="mt-6 grid gap-1">{navItems(collapsed)}</nav>
    </aside>
    {drawerOpen && <Modal title="AidConnect" drawer onClose={() => setDrawerOpen(false)}>
      <nav aria-label="Mobile dashboard sections" className="grid gap-1">{navItems(false, () => setDrawerOpen(false))}</nav>
    </Modal>}
    <div ref={scroller} className="min-w-0 flex-1 overflow-y-auto overscroll-y-contain" data-dashboard-scroll>
      <DashboardNav
        pageTitle={view === "overview" ? title : pageTitle}
        profile={profile}
        base={base}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        setDrawerOpen={setDrawerOpen}
      />
      <main ref={main} id="overview" tabIndex={-1} aria-label={title} className="mx-auto w-full min-w-0 max-w-[96rem] scroll-mt-14 px-4 py-8 sm:px-6 lg:px-8">
        <nav aria-label="Dashboard tabs" className="mb-6 flex flex-wrap gap-x-4 border-b border-(--line)">
          {sections.map(([id, label]) => <Link key={id} to={dashboardSection(base, id)}
            aria-current={view === id ? 'page' : undefined}
            className="inline-flex min-h-11 items-center border-b-2 border-transparent px-1 text-sm font-semibold text-(--muted) hover:text-(--text) aria-[current=page]:border-(--primary) aria-[current=page]:text-(--primary)">{label}</Link>)}
        </nav>
        {view === 'overview' && <>
          <section aria-labelledby="dashboard-title" className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-(--line) bg-(--nav-panel) p-5 sm:p-6">
            <div className="min-w-0">
              <h1 id="dashboard-title" className="mb-2 break-words text-2xl font-semibold">Hello {profile.name}</h1>
              <p className="m-0 text-sm text-(--muted)">{title} · Course demo</p>
            </div>
            {action}
          </section>
          <dl className="mt-0 mb-6 grid grid-cols-12 gap-6">
            {metrics.map(metric => {
              const id = metric.href.slice(1);
              return <StatCard key={metric.label} {...metric} to={dashboardSection(base, id)} icon={metric.icon ?? icons[id] ?? CalendarDays} />;
            })}
          </dl>
        </>}
        {view === 'profile' ? <DashboardProfileSettings key={profile.id} profile={profile} role={org ? 'organization' : 'volunteer'} /> :
          <>{view !== 'overview' && <h1 className="mb-4 text-2xl font-semibold">{pageTitle}</h1>}{children ?? <Outlet />}</>}
        <p className="mt-6 mb-0 text-xs text-(--muted)">Course demo. Listings and activity reset on refresh.</p>
      </main>
    </div>
  </div>;
}
