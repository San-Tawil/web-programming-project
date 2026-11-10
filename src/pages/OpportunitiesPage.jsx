import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import OpportunityGrid from '../components/OpportunityGrid.jsx';

export default function OpportunitiesPage() {
  const [params] = useSearchParams();
  const cause = params.get('cause');
  const shiftId = params.get('shift');
  return (
    <div className="font-body [&_:is(h1,h2,h3)]:font-display [&_:is(h1,h2,h3)]:tracking-[-0.02em]">
      <section aria-labelledby="opportunities-title" className="mx-auto w-[calc(100%-2rem)] max-w-[1120px] pt-6 pb-12 sm:w-[calc(100%-3rem)] md:py-12">
        <h1 id="opportunities-title" className="mb-2 text-[clamp(2rem,5vw,4.2rem)] font-bold">{shiftId ? 'Shift details' : cause || 'All opportunities'}</h1>
        <p className="m-0 text-sm text-(--muted)">Sample listings for the course demo</p>
        <Link to="/volunteer/dashboard" className="mt-3 mr-4 inline-block font-semibold underline">My volunteer dashboard</Link>
        {(cause || shiftId) && <Link to="/opportunities" className="underline">See all opportunities</Link>}
        <OpportunityGrid cause={cause} shiftId={shiftId} />
      </section>
    </div>
  );
}
