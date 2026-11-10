import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import CauseBadge from './CauseBadge.jsx';
import { buttonClass } from './OpportunityUI.jsx';
import { useDashboardDemo } from '../context/DashboardDemoContext.jsx';
import { shiftDate, shiftTime, spotsFilled, isPublished } from '../data/dashboardDemo.js';

export function OpportunitySignup({ opportunity }) {
  const { signups, volunteer, dispatch, accountRole } = useDashboardDemo();
  const signup = signups.find(item => item.opportunityId === opportunity.id && item.volunteerId === volunteer.id);
  const available = opportunity.capacity - spotsFilled(signups, opportunity.id);
  const approval = opportunity.signup === 'approval';

  const returnTo = `/opportunities/${opportunity.id}`;
  if (!accountRole) return <div className="mt-4 flex flex-wrap items-center gap-3" aria-label={`Sign in to join ${opportunity.title}`}>
    <Link to="/volunteer/register" state={{ returnTo }} className={buttonClass}>Sign up<span className="sr-only"> to join {opportunity.title}</span></Link>
    <Link to="/login" state={{ returnTo }} className={`${buttonClass} underline`}>Log in<span className="sr-only"> to join {opportunity.title}</span></Link>
  </div>;
  if (accountRole !== 'volunteer') return <p className="mt-4 mb-0 text-sm text-(--muted)">Use a volunteer account to join this opportunity.</p>;
  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <button type="button" disabled={Boolean(signup) || available <= 0}
        className="min-h-11 cursor-pointer rounded-md border-0 bg-aid-primary px-3 font-semibold text-white disabled:cursor-default disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--primary)"
        onClick={() => dispatch({ type: 'join', opportunityId: opportunity.id })}>
        {approval ? 'Apply' : opportunity.kind === 'shift' ? 'Reserve a spot' : 'Join opportunity'}
      </button>
      <span role="status" className="text-sm text-(--muted)">
        {signup?.status ?? (available <= 0 ? 'Full' : approval ? 'Approval required' : 'Open signup')}
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
        <CauseBadge cause={cause} />
        {!featured && <span className="text-xs font-medium text-(--muted)">{isShift ? 'Shift' : 'Opportunity'}</span>}
      </div>
      <Heading className="mt-3 mb-2 text-lg font-bold"><Link className="underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-(--primary)" to={`/opportunities/${opportunity.id}`}>{title}</Link></Heading>
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
  const matching = opportunities.filter(item => !item.parentId && isPublished(item, opportunities) && (!cause || item.cause === cause));
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
          <OpportunityCard opportunity={opportunity} featured={featured} shifts={opportunities.filter(item => item.parentId === opportunity.id && isPublished(item, opportunities))} />
        </li>
      ))}
    </ul>
  );
}
