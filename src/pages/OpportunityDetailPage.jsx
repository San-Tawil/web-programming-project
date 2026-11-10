import React, { useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDashboardDemo } from '../context/DashboardDemoContext.jsx';
import { isPublished, spotsFilled } from '../data/dashboardDemo.js';
import { formatDate } from '../data/opportunities.js';
import { organizationProfiles } from '../data/organizations.js';
import CauseBadge, { causeBorder } from '../components/CauseBadge.jsx';
import { OpportunitySignup } from '../components/OpportunityGrid.jsx';
import { buttonClass, WorkspacePage } from '../components/OpportunityUI.jsx';

export default function OpportunityDetailPage() {
  const { opportunityId } = useParams();
  const { opportunities, signups } = useDashboardDemo();
  const item = opportunities.find(record => record.id === opportunityId && isPublished(record, opportunities));
  const heading = useRef(null);
  useEffect(() => {
    document.title = `${item?.title || 'Opportunity unavailable'} | AidConnect`;
    heading.current?.focus({ preventScroll: true });
  }, [opportunityId, item?.title]);

  if (!item) return <WorkspacePage><h1 ref={heading} tabIndex={-1}>Opportunity unavailable</h1><p>This opportunity may have been removed, closed, or reset with the demo data.</p><Link to="/opportunities" className={buttonClass}>Browse opportunities</Link></WorkspacePage>;

  const profile = organizationProfiles[item.organizationId] || { name: item.organizer || item.organization, location: item.city || item.location, description: 'This organization shares volunteer opportunities through the AidConnect demo.' };
  const related = opportunities.filter(record => record.organizationId === item.organizationId && record.id !== item.id && isPublished(record, opportunities));
  const shifts = related.filter(record => record.parentId === item.id);
  const available = Math.max(0, item.capacity - spotsFilled(signups, item.id));
  return <WorkspacePage>
    <nav aria-label="Breadcrumb" className="mb-6 text-sm"><Link to="/opportunities" className="underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-(--primary)">All opportunities</Link><span aria-hidden="true"> / </span><span aria-current="page">{item.title}</span></nav>
    <article aria-labelledby="opportunity-title">
      <header className={`mb-8 rounded-2xl border border-t-4 border-(--line) ${causeBorder(item.cause)} bg-(--panel) p-6 sm:p-8`}>
        <div className="mb-5 flex flex-wrap items-center gap-3"><CauseBadge cause={item.cause} /><span className="text-sm text-(--muted)">{item.kind === 'shift' ? 'Scheduled shift' : 'Volunteer opportunity'}</span></div>
        <h1 ref={heading} tabIndex={-1} id="opportunity-title" className="break-words">{item.title}</h1>
        <p className="mb-0 text-lg text-(--muted)">Organized by <a href="#organization-profile" className="font-bold underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-(--primary)">{profile.name}</a></p>
      </header>
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div className="grid min-w-0 gap-6">
          <section aria-labelledby="about-opportunity" className="rounded-2xl border border-(--line) bg-(--aid-surface) p-6"><h2 id="about-opportunity">About this opportunity</h2><p className="mb-0 whitespace-pre-line leading-relaxed">{item.description}</p></section>
          <section aria-labelledby="preparation" className="rounded-2xl border border-(--line) bg-(--aid-surface) p-6"><h2 id="preparation">Before you join</h2><p className="whitespace-pre-line leading-relaxed">{item.requirements || 'Ask the organizer about preparation and meeting details.'}</p><h3>Meeting point</h3><p className="mb-0">{item.location}</p></section>
          {shifts.length > 0 && <section aria-labelledby="scheduled-shifts"><h2 id="scheduled-shifts">Scheduled shifts</h2><ul className="grid list-none gap-3 p-0">{shifts.map(shift => <li key={shift.id}><Link className={`${buttonClass} w-full justify-between! gap-4`} to={`/opportunities/${shift.id}`}><span>{shift.title}</span><time dateTime={shift.date}>{formatDate(shift.date)}</time></Link></li>)}</ul></section>}
          <section id="organization-profile" tabIndex={-1} aria-labelledby="organization-title" className="scroll-mt-28 rounded-2xl border border-(--line) bg-(--panel) p-6">
            <p className="text-sm font-bold uppercase tracking-widest text-(--primary)">Organization profile</p><h2 id="organization-title">{profile.name}</h2><p className="text-sm text-(--muted)">{profile.location} · Course demo organization</p><p className="leading-relaxed">{profile.description}</p>{profile.approach && <p className="leading-relaxed">{profile.approach}</p>}
            <h3>More from this organization</h3>{related.length ? <ul className="mb-0 space-y-3 pl-5">{related.slice(0, 3).map(record => <li key={record.id}><Link className="underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-(--primary)" to={`/opportunities/${record.id}`}>{record.title}</Link></li>)}</ul> : <p className="mb-0 text-(--muted)">No other published opportunities yet.</p>}
          </section>
        </div>
        <aside aria-labelledby="participation-title" className="rounded-2xl border border-(--line) bg-(--aid-surface) p-6 lg:sticky lg:top-28">
          <h2 id="participation-title">Plan your participation</h2>
          <dl className="grid gap-4 [&_dt]:text-sm [&_dt]:text-(--muted) [&_dd]:m-0 [&_dd]:mt-1 [&_dd]:font-semibold">
            <div><dt>Date</dt><dd>{item.date ? <time dateTime={item.date}>{formatDate(item.date)}</time> : 'Flexible schedule'}</dd></div>
            {item.startTime && <div><dt>Time</dt><dd>{item.startTime}–{item.endTime}</dd></div>}
            <div><dt>Commitment</dt><dd>{item.hours ? `${item.hours} hours` : 'Arrange with the organizer'}</dd></div>
            <div><dt>Location</dt><dd>{item.city || item.location}</dd></div>
            <div><dt>Team capacity</dt><dd>{item.capacity} volunteers</dd></div>
            <div><dt>Available places</dt><dd aria-live="polite">{available} remaining</dd></div>
            <div><dt>Signup process</dt><dd>{item.signup === 'approval' ? 'Application reviewed by the organization' : 'Reserve an available place'}</dd></div>
          </dl>
          <OpportunitySignup opportunity={item} />
          <p className="mt-4 mb-0 text-xs leading-relaxed text-(--muted)">Course demonstration. Reservations and applications are simulated and reset on refresh.</p>
        </aside>
      </div>
    </article>
  </WorkspacePage>;
}
