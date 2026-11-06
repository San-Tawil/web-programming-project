import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import OpportunityGrid from '../components/OpportunityGrid.jsx';
import './home.css';

export default function OpportunitiesPage() {
  const [params] = useSearchParams();
  const cause = params.get('cause');
  return (
    <div className="aid-opportunities">
      <section aria-labelledby="opportunities-title" className="aid-shell py-12 md:py-16">
        <div className="aid-section-heading">
          <div>
            <p className="aid-kicker">Browse by cause</p>
            <h1 id="opportunities-title" className="aid-section-title">{cause || 'All opportunities'}</h1>
          </div>
          <p className="aid-demo">Sample listings for the course demo</p>
        </div>
        {cause && <Link to="/opportunities" className="underline">See all opportunities</Link>}
        <OpportunityGrid cause={cause} />
      </section>
    </div>
  );
}
