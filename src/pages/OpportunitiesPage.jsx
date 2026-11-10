import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import OpportunityGrid from '../components/OpportunityGrid.jsx';
import { useDashboardDemo } from '../context/DashboardDemoContext.jsx';

export default function OpportunitiesPage() {
  const [params] = useSearchParams();
  const [search, setSearch] = useState('');
  const { accountRole } = useDashboardDemo();
  const organizationView = accountRole === 'organizations';
  const cause = params.get('cause');
  const shiftId = params.get('shift');
  return (
    <div className="font-body [&_:is(h1,h2,h3)]:font-display [&_:is(h1,h2,h3)]:tracking-[-0.02em]">
      <section aria-labelledby="opportunities-title" className="mx-auto w-[calc(100%-2rem)] max-w-[1120px] pt-6 pb-12 sm:w-[calc(100%-3rem)] md:py-12">
        <h1 id="opportunities-title" className="mb-2 text-[clamp(2rem,5vw,4.2rem)] font-bold">{shiftId ? 'Shift details' : cause || (organizationView ? 'My organization’s opportunities' : 'All opportunities')}</h1>
        <p className="m-0 text-sm text-(--muted)">{organizationView ? 'Listings posted by your organization' : 'Sample listings for the course demo'}</p>
        <div className="mt-3 mb-2 flex flex-wrap items-center gap-3">
          {accountRole ? (
            <Link to={`/${accountRole}/dashboard`} className="font-semibold underline">
              {accountRole === 'volunteer' ? 'My volunteer dashboard' : 'My organization dashboard'}
            </Link>
          ) : (
            <>
              <Link to="/login" className="inline-flex min-h-11 items-center rounded-md bg-aid-primary px-3 font-semibold text-white">Log in</Link>
              <Link to="/register" className="inline-flex min-h-11 items-center rounded-md border border-(--line) px-3 font-semibold">Sign up</Link>
            </>
          )}
        </div>
        {(cause || shiftId) && <Link to="/opportunities" className="underline">{organizationView ? 'See my organization’s opportunities' : 'See all opportunities'}</Link>}
        {!shiftId && (
          <label className="mt-4 grid max-w-md gap-1 text-sm font-semibold">
            Search opportunities and shifts
            <input type="search" value={search} onChange={event => setSearch(event.target.value)}
              className="min-h-11 rounded-lg border border-(--line) bg-(--panel) px-3 text-(--text)"
              placeholder="Search by title, cause, or location" />
          </label>
        )}
        <OpportunityGrid cause={cause} shiftId={shiftId} search={search} />
      </section>
    </div>
  );
}
