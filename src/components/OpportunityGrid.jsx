import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import CauseBadge from './CauseBadge.jsx';
import { buttonClass } from './OpportunityUI.jsx';
import { useDashboardDemo } from '../context/DashboardDemoContext.jsx';
import {
  isClosed,
  listingStatus,
  shiftDate,
  shiftTime,
  signupAction,
  isPublished,
} from '../data/dashboardDemo.js';
// All listings use the same card so visitors can compare the details in the same order.
export const causeColors = {
  Environment: 'bg-[#bff0cf]',
  'Food support': 'bg-[#ffd2bd]',
  Education: 'bg-[#bfe3ff]',
  'Animal welfare': 'bg-[#f5dd9f]',
  'Community support': 'bg-[#c9df9c]',
  Health: 'bg-[#ffd0da]',
  'Arts and culture': 'bg-[#efbaf1]',
};

export function OpportunitySignup({ opportunity }) {
  const { accountRole, signups, volunteer, dispatch } = useDashboardDemo();
  const returnTo = `/opportunities/${opportunity.id}`;
  if (!accountRole) return <div className="mt-4 flex flex-wrap gap-3">
    <Link to="/volunteer/register" state={{ returnTo }} className={buttonClass}>Sign up<span className="sr-only"> to join {opportunity.title}</span></Link>
    <Link to="/login" state={{ returnTo }} className={buttonClass}>Log in<span className="sr-only"> to join {opportunity.title}</span></Link>
  </div>;
  if (accountRole !== 'volunteer') return <p className="mt-4 mb-0 text-sm text-(--muted)">Use a volunteer account to join this opportunity.</p>;

  const signup = signups.find(item => item.opportunityId === opportunity.id && item.volunteerId === volunteer.id);
  const status = listingStatus(opportunity, signups);
  const action = signupAction(opportunity, signup?.status, status);

  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <button type="button" disabled={action.disabled}
        className="min-h-11 cursor-pointer rounded-md border-0 bg-aid-primary px-3 font-semibold text-white disabled:cursor-default disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--primary)"
        onClick={() => dispatch({ type: action.type, opportunityId: opportunity.id })}>
        {action.label}
      </button>
      <span role="status" className="text-sm text-(--muted)">
        {isClosed(opportunity) ? status : signup?.status ?? (status === 'Full' ? status : opportunity.signup === 'approval' ? 'Approval required' : 'Open signup')}
      </span>
    </div>
  );
}

function OpportunityCard({ opportunity, featured, shifts }) {
  const { cause, title, location, description } = opportunity;
  const Heading = featured ? 'h3' : 'h2';
  const isShift = opportunity.kind === 'shift';

  return (
    <article className="flex group-hover/listing:border-(--primary) motion-safe:group-hover/listing:-translate-x-1 h-full flex-col rounded-xl border border-(--aid-rule) bg-(--aid-surface) p-4 sm:p-5 motion-safe:transition-transform">
      <div className="flex flex-wrap items-center gap-2">
        <p className={`mb-0 rounded-full px-2.5 py-0.5 text-xs font-semibold text-[#11201a] ${causeColors[cause] ?? "bg-[#f6ef9a]"}`}>{cause}</p>
        <span className="text-xs font-medium text-(--muted)">{isShift ? 'Shift' : 'Opportunity'}</span>
      </div>
      <Heading className="mt-3 mb-2 text-lg font-bold">{title}</Heading>
      <p className="mb-3 text-sm leading-relaxed text-(--muted) sm:text-base">{description}</p>
      <dl className="mt-auto mb-0 grid gap-1.5 border-t border-(--aid-rule) pt-3 text-sm [&>div]:grid [&>div]:grid-cols-[4rem_1fr] [&>div]:gap-2 [&_dt]:text-(--muted) [&_dd]:m-0 [&_dd]:font-semibold">
        <div><dt>Location</dt><dd>{location}</dd></div>
        {opportunity.date && <div><dt>Date</dt><dd>{shiftDate(opportunity.date)}</dd></div>}
        {opportunity.date && <div><dt>Time</dt><dd>{shiftTime(opportunity)}</dd></div>}
        {featured && <div><dt>Signup</dt><dd>{opportunity.signup === 'approval' ? 'Application required' : 'Instant reservation'}</dd></div>}
      </dl>
      {featured ? (
        <Link
          to={`/opportunities/${opportunity.id}`}
          className="mt-4 inline-flex min-h-11 w-fit items-center font-semibold text-(--primary) underline underline-offset-4"
        >
          View details<span className="sr-only">: {title}</span>
        </Link>
      ) : (
        <OpportunitySignup opportunity={opportunity} />
      )}

      {!featured && (
        <Link
          to={`/opportunities/${opportunity.id}`}
          className="mt-4 inline-flex min-h-11 w-fit items-center font-semibold text-(--primary) underline underline-offset-4"
        >
          View details<span className="sr-only">: {title}</span>
        </Link>
      )}

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

export default function OpportunityGrid({ featured = false, cause, shiftId, search = '' }) {
  const { opportunities: allOpportunities, accountRole, organization } = useDashboardDemo();
  const published = allOpportunities.filter(item => isPublished(item, allOpportunities));
  const opportunities = accountRole === 'organizations'
    ? published.filter(item => item.organizationId === organization.id)
    : published;
  const query = search.trim().toLowerCase();
  const matching = opportunities.filter(item => !item.parentId && (!cause || item.cause === cause) &&
    [item.title, item.cause, item.location].some(value => value?.toLowerCase().includes(query)));
  const listings = featured
    ? opportunities.filter(item => !isClosed(item)).slice(-3).reverse()
    : shiftId ? opportunities.filter(item => item.kind === 'shift' && item.id === shiftId) : matching;
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

  if (!listings.length) return <p className="text-(--muted) mt-6">{shiftId ? 'This shift could not be found.' : query ? 'No listings match your search.' : accountRole === 'organizations' ? 'No matching listings from your organization.' : 'No sample opportunities are listed here yet.'}</p>;

  return (
    <ul ref={gridRef} data-animate={!featured || entered} className="mt-6 motion-safe:data-[animate=true]:[&>li]:animate-opportunity-enter grid list-none gap-4 p-0 md:grid-cols-3">
      {listings.map((opportunity, index) => (
        <li
          className="group/listing"
          key={opportunity.id}
          style={{ animationDelay: `${index * 65}ms` }}
        >
          <OpportunityCard
            opportunity={opportunity}
            featured={featured}
            shifts={opportunities.filter(
              item => item.parentId === opportunity.id
            )}
          />
        </li>
      ))}
    </ul>
  );
}
