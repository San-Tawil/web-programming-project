import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDashboardDemo } from '../context/DashboardDemoContext.jsx';
import { useOpportunities } from '../context/OpportunitiesContext.jsx';
import CauseBadge, { causeBorder } from '../components/CauseBadge.jsx';
import { isPublished } from '../data/dashboardDemo.js';
import { OpportunitySignup } from '../components/OpportunityGrid.jsx';
import { causes, formatDate } from '../data/opportunities.js';
import { WorkspacePage, buttonClass, fieldClass } from '../components/OpportunityUI.jsx';

function ListingCard({ item }) {
  return <article className={`group relative flex h-full flex-col rounded-2xl border border-t-4 border-(--line) ${causeBorder(item.cause)} bg-(--aid-surface) p-6 hover:shadow-lg focus-within:ring-2 focus-within:ring-(--primary) motion-safe:transition motion-safe:hover:-translate-y-1`}>
    <div className="mb-5 flex flex-wrap gap-2"><CauseBadge cause={item.cause} /><span className="text-xs text-(--muted)">{item.kind === 'shift' ? 'Scheduled shift' : 'Opportunity'}</span></div>
    <p className="mb-2 text-sm text-(--muted)">{item.organization}</p>
    <h2 className="mb-3 break-words"><Link to={`/opportunities/${item.id}`} className="after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none group-hover:underline">{item.title}<span className="sr-only"> - view opportunity details</span></Link></h2>
    <p className="leading-relaxed text-(--muted)">{item.description}</p>
    <dl className="mt-auto grid gap-3 border-t border-(--line) py-4 text-sm [&_dd]:m-0 [&_dd]:font-semibold [&_dt]:text-(--muted) [&>div]:flex [&>div]:justify-between [&>div]:gap-3">
      <div><dt>Where</dt><dd>{item.city}</dd></div>
      <div><dt>When</dt><dd>{item.date ? <time dateTime={item.date}>{formatDate(item.date)}</time> : 'Flexible schedule'}</dd></div>
      <div><dt>Commitment</dt><dd>{item.hours ? `${item.hours} ${Number(item.hours) === 1 ? 'hour' : 'hours'}` : item.startTime ? `${item.startTime} - ${item.endTime}` : 'Arrange with organizer'}</dd></div>
      <div><dt>Team size</dt><dd>{item.capacity} volunteers</dd></div>
    </dl>
    <p aria-hidden="true" className="mb-0 text-sm font-bold text-(--primary) group-hover:underline">Explore opportunity &rarr;</p>
    <div className="relative z-10"><OpportunitySignup opportunity={item} /></div>
  </article>;
}

export default function OpportunitiesPage() {
  const { opportunities } = useOpportunities();
  const { accountRole } = useDashboardDemo();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(() => params.get('q') || '');
  const cause = params.get('cause') || '';
  const city = params.get('city') || '';
  const sort = params.get('sort') || 'date';
  useEffect(() => { document.title = 'Find opportunities | AidConnect'; }, []);
  function filter(key, value) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    setParams(next, { replace: true });
  }
  const published = opportunities.filter(item => isPublished(item, opportunities));
  const cities = [...new Set(published.map(item => item.city))].sort();
  const listings = published.filter(item => (!cause || item.cause === cause) && (!city || item.city === city) && `${item.title} ${item.description} ${item.organization} ${item.location} ${item.city}`.toLowerCase().includes(query.trim().toLowerCase()))
    .sort((a, b) => sort === 'title' ? a.title.localeCompare(b.title) : sort === 'hours' ? (a.hours || 24) - (b.hours || 24) : (a.date || '9999').localeCompare(b.date || '9999'));
  return <WorkspacePage>
    <header className="mb-8 max-w-3xl"><p className="text-sm font-bold uppercase tracking-widest text-(--primary)">Small actions. Shared impact.</p><h1>Find your next<br />way to give back.</h1><p className="text-lg leading-relaxed text-(--muted)">Discover volunteer opportunities across Lebanon. Find a cause you care about and a role that fits your time.</p><p className="text-sm text-(--muted)">Demo listings for the course project.</p></header>
    {accountRole === 'volunteer' && <p><Link to="/volunteer/dashboard" className="font-semibold underline">My volunteer dashboard</Link></p>}
    <section aria-label="Search and filter opportunities" className="rounded-2xl border border-(--line) bg-(--panel) p-5">
      <form role="search" onSubmit={event => event.preventDefault()} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
        <label className="text-sm font-bold">Search opportunities<input type="search" className={fieldClass} value={query} placeholder="Search roles, places, or organizations" onChange={event => setQuery(event.target.value)} /></label>
        <label className="text-sm font-bold">Cause<select aria-label="Cause" className={fieldClass} value={cause} onChange={event => filter('cause', event.target.value)}><option value="">All causes</option>{cause && !causes.includes(cause) && <option>{cause}</option>}{causes.map(value => <option key={value}>{value}</option>)}</select></label>
        <label className="text-sm font-bold">City<select aria-label="City" className={fieldClass} value={city} onChange={event => filter('city', event.target.value)}><option value="">All cities</option>{city && !cities.includes(city) && <option>{city}</option>}{cities.map(value => <option key={value}>{value}</option>)}</select></label>
        <label className="text-sm font-bold">Sort by<select aria-label="Sort by" className={fieldClass} value={sort} onChange={event => filter('sort', event.target.value)}><option value="date">Soonest first</option><option value="hours">Shortest commitment</option><option value="title">Title A-Z</option></select></label>
      </form>
    </section>
    <div className="my-6 flex flex-wrap items-center justify-between gap-3"><p role="status" className="m-0 font-bold">{listings.length} {listings.length === 1 ? 'opportunity' : 'opportunities'} found</p><button className={buttonClass} onClick={() => { setQuery(''); setParams({}); }}>Reset filters</button></div>
    {listings.length ? <ul className="m-0 grid list-none gap-5 p-0 md:grid-cols-2 lg:grid-cols-3">{listings.map(item => <li key={item.id}><ListingCard item={item} /></li>)}</ul> : <section className="rounded-2xl border border-dashed border-(--line) p-10 text-center"><h2>No matching opportunities</h2><p className="text-(--muted)">Try another search term or reset your filters to explore all published roles.</p></section>}
  </WorkspacePage>;
}
