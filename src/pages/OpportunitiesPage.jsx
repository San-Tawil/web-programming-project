import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import OpportunityGrid from '../components/OpportunityGrid.jsx';
import '../styles/home.css';

export default function OpportunitiesPage() {
  const [params] = useSearchParams();
  const cause = params.get('cause');
  return (
    <div className="aid-opportunities">
      <section aria-labelledby="opportunities-title" className="mx-auto w-[calc(100%-2rem)] max-w-[1120px] pt-6 pb-12 sm:w-[calc(100%-3rem)] md:py-12">
        <h1 id="opportunities-title" className="mb-2 text-[clamp(2rem,5vw,4.2rem)] font-bold">{cause || 'All opportunities'}</h1>
        <p className="m-0 text-sm text-(--muted)">Sample listings for the course demo</p>
        {cause && <Link to="/opportunities" className="underline">See all opportunities</Link>}
        <OpportunityGrid cause={cause} />
      </section>
    </div>
  );
}
