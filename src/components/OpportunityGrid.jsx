import React, { useEffect, useRef, useState } from 'react';
import { useDashboardDemo } from '../context/DashboardDemoContext.jsx';
import { isClosed, listingStatus, shiftDate, shiftTime, signupLabel } from '../data/dashboardDemo.js';

// All listings use the same card so visitors can compare the details in the same order.
const causeColors = {
  Environment: 'bg-[#bff0cf]',
  'Food support': 'bg-[#ffd2bd]',
  Education: 'bg-[#bfe3ff]',
  'Animal welfare': 'bg-[#f5dd9f]',
  'Community support': 'bg-[#c9df9c]',
  Health: 'bg-[#ffd0da]',
  'Arts and culture': 'bg-[#efbaf1]',
};

function OpportunitySignup({ opportunity }) {
  const { signups, volunteer, dispatch } = useDashboardDemo();
  const signup = signups.find(item => item.opportunityId === opportunity.id && item.volunteerId === volunteer.id);
  const status = listingStatus(opportunity, signups);

  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <button type="button" disabled={Boolean(signup) || status !== 'Open'}
        className="min-h-11 cursor-pointer rounded-md border-0 bg-aid-primary px-3 font-semibold text-white disabled:cursor-default disabled:opacity-60"
        onClick={() => dispatch({ type: 'join', opportunityId: opportunity.id })}>
        {signupLabel(opportunity)}
      </button>
      <span role="status" className="text-sm text-(--muted)">
        {isClosed(opportunity) ? status : signup?.status ?? (status === 'Full' ? status : opportunity.signup === 'approval' ? 'Approval required' : 'Open signup')}
      </span>
    </div>
  );
}

function OpportunityCard({ opportunity, featured, shifts }) {
  const { cause, title, location, time, description } = opportunity;
  const Heading = featured ? 'h3' : 'h2';
  const isShift = opportunity.kind === 'shift';

  return (
    <article className="flex group-hover/listing:border-(--primary) motion-safe:group-hover/listing:-translate-x-1 h-full flex-col rounded-xl border border-(--aid-rule) bg-(--aid-surface) p-4 sm:p-5 motion-safe:transition-transform">
      <div className="flex flex-wrap items-center gap-2">
        <p className={`mb-0 rounded-full px-2.5 py-0.5 text-xs font-semibold text-[#11201a] ${causeColors[cause] ?? "bg-[#f6ef9a]"}`}>{cause}</p>
        {!featured && <span className="text-xs font-medium text-(--muted)">{isShift ? 'Shift' : 'Opportunity'}</span>}
      </div>
      <Heading className="mt-3 mb-2 text-lg font-bold">{title}</Heading>
      <p className="mb-3 text-sm leading-relaxed text-(--muted) sm:text-base">{description}</p>
      <dl className="mt-auto mb-0 grid gap-1.5 border-t border-(--aid-rule) pt-3 text-sm [&>div]:grid [&>div]:grid-cols-[4rem_1fr] [&>div]:gap-2 [&_dt]:text-(--muted) [&_dd]:m-0 [&_dd]:font-semibold">
        <div><dt>Location</dt><dd>{location}</dd></div>
        {isShift && <div><dt>Time</dt><dd>{featured && time ? time : shiftTime(opportunity)}</dd></div>}
        {!featured && isShift && <div><dt>Date</dt><dd>{shiftDate(opportunity.date)}</dd></div>}
      </dl>
      {!featured && <OpportunitySignup opportunity={opportunity} />}
      {!featured && shifts.length > 0 && (
        <details className="mt-4 border-t border-(--aid-rule) pt-3">
          <summary className="cursor-pointer font-semibold">Scheduled shifts ({shifts.length})</summary>
          <ul className="m-0 list-none divide-y divide-(--aid-rule) p-0 text-sm">
            {shifts.map(shift => (
              <li key={shift.id} className="py-3">
                <strong>{shift.title}</strong>
                <p className="mb-0 text-(--muted)">{shiftDate(shift.date)} · {shiftTime(shift)}</p>
                <OpportunitySignup opportunity={shift} />
              </li>
            ))}
          </ul>
        </details>
      )}
    </article>
  );
}

export default function OpportunityGrid({ featured = false, cause }) {
  const { opportunities } = useDashboardDemo();
  const matching = opportunities.filter(item => !item.parentId && (!cause || item.cause === cause));
  const listings = featured ? matching.slice(0, 3) : matching;
  const gridRef = useRef(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (!featured || !gridRef.current || !window.IntersectionObserver) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setEntered(true);
        observer.disconnect();
      }
    });
    observer.observe(gridRef.current);
    return () => observer.disconnect();
  }, [featured]);

  if (!listings.length) return <p className="text-(--muted) mt-6">No sample opportunities are listed for this cause yet.</p>;

  return (
    <ul ref={gridRef} data-animate={!featured || entered} className="mt-6 motion-safe:data-[animate=true]:[&>li]:animate-opportunity-enter grid list-none gap-4 p-0 md:grid-cols-3">
      {listings.map((opportunity, index) => (
        <li className="group/listing" key={opportunity.id} style={{ animationDelay: `${index * 65}ms` }}>
          <OpportunityCard opportunity={opportunity} featured={featured} shifts={opportunities.filter(item => item.parentId === opportunity.id)} />
        </li>
      ))}
    </ul>
  );
}
