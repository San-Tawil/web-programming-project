import React from 'react';
import OpportunityGrid from '../components/OpportunityGrid.jsx';
import './home.css';

export default function OpportunitiesPage() {
  return (
    <div className="aid-opportunities">
      <section aria-labelledby="opportunities-title" className="aid-shell py-12 md:py-16">
        <div className="aid-section-heading">
          <div>
            <p className="aid-kicker">Browse by cause</p>
            <h1 id="opportunities-title" className="aid-section-title">Featured opportunities</h1>
          </div>
          <p className="aid-demo">Sample listings for the course demo</p>
        </div>
        <OpportunityGrid />
      </section>
    </div>
  );
}
