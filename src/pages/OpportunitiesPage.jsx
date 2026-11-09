import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useOpportunities } from '../context/OpportunitiesContext.jsx';
import { causes, formatDate } from '../data/opportunities.js';
import { WorkspacePage, buttonClass, fieldClass } from '../components/OpportunityUI.jsx';

function ListingCard({ item }) {
  const [expanded, setExpanded] = useState(false);
  return <article className="flex h-full flex-col rounded-2xl border border-(--line) bg-(--aid-surface) p-6">
    <span className="mb-5 self-start rounded-full bg-[#bff0cf] px-3 py-1 text-xs font-bold text-[#11201a]">{item.cause}</span>
    <p className="mb-2 text-sm text-(--muted)">{item.organization}</p>
    <h2 className="mb-3 break-words">{item.title}</h2>
    <p className="leading-relaxed text-(--muted)">{item.description}</p>
    <dl className="mt-auto grid gap-3 border-t border-(--line) py-4 text-sm [&_dd]:m-0 [&_dd]:font-semibold [&_dt]:text-(--muted) [&>div]:flex [&>div]:justify-between [&>div]:gap-3">
      <div><dt>Where</dt><dd>{item.city}</dd></div>
      <div><dt>When</dt><dd><time dateTime={item.date}>{formatDate(item.date)}</time></dd></div>
      <div><dt>Commitment</dt><dd>{item.hours} {Number(item.hours) === 1 ? 'hour' : 'hours'}</dd></div>
      <div><dt>Team size</dt><dd>{item.capacity} volunteers</dd></div>
    </dl>
    <button type="button" className={buttonClass} aria-expanded={expanded} aria-controls={`details-${item.id}`} onClick={() => setExpanded(value => !value)}>{expanded ? 'Hide details' : 'View details'}<span className="sr-only"> for {item.title}</span></button>
    <div id={`details-${item.id}`} hidden={!expanded} className="mt-4 border-t border-(--line) pt-4 text-sm leading-relaxed"><h3>Before you join</h3><p>{item.requirements}</p><p className="mb-0"><strong>Meeting point:</strong> {item.location}</p></div>
  </article>;
}

export default function OpportunitiesPage() {
  const { opportunities } = useOpportunities();
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
  const published = opportunities.filter(item => item.status === 'Published');
  const cities = [...new Set(published.map(item => item.city))].sort();
  const listings = published.filter(item => (!cause || item.cause === cause) && (!city || item.city === city) && `${item.title} ${item.description} ${item.organization} ${item.location} ${item.city}`.toLowerCase().includes(query.trim().toLowerCase()))
    .sort((a, b) => sort === 'title' ? a.title.localeCompare(b.title) : sort === 'hours' ? a.hours - b.hours : a.date.localeCompare(b.date));
  return <WorkspacePage>
    <header className="mb-8 max-w-3xl"><p className="text-sm font-bold uppercase tracking-widest text-(--primary)">Small actions. Shared impact.</p><h1>Find your next<br />way to give back.</h1><p className="text-lg leading-relaxed text-(--muted)">Discover volunteer opportunities across Lebanon. Find a cause you care about and a role that fits your time.</p><p className="text-sm text-(--muted)">Demo listings for the course project.</p></header>
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
