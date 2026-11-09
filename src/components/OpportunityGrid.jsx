import React, { useEffect, useRef, useState } from 'react';

import { useOpportunities } from '../context/OpportunitiesContext.jsx';

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

function OpportunityCard({ opportunity, heading: Heading }) {
  const { cause, title, location, time, description } = opportunity;

  return (
    <article className="flex group-hover/listing:border-(--primary) motion-safe:group-hover/listing:-translate-x-1 h-full flex-col rounded-xl border border-(--aid-rule) bg-(--aid-surface) p-4 sm:p-5 motion-safe:transition-transform">
      <p className={`mb-0 self-start rounded-full px-2.5 py-0.5 text-xs font-semibold text-[#11201a] ${causeColors[cause] ?? "bg-[#f6ef9a]"}`}>{cause}</p>
      <Heading className="mt-3 mb-2 text-lg font-bold">{title}</Heading>
      <p className="mb-3 text-sm leading-relaxed text-(--muted) sm:text-base">{description}</p>
      <dl className="mt-auto mb-0 grid gap-1.5 border-t border-(--aid-rule) pt-3 text-sm [&>div]:grid [&>div]:grid-cols-[4rem_1fr] [&>div]:gap-2 [&_dt]:text-(--muted) [&_dd]:m-0 [&_dd]:font-semibold">
        <div><dt>Location</dt><dd>{location}</dd></div>
        <div><dt>Time</dt><dd>{time}</dd></div>
      </dl>
    </article>
  );
}

export default function OpportunityGrid({ featured = false, cause }) {
  const { opportunities: allOpportunities } = useOpportunities();
  const opportunities = allOpportunities.filter(item => item.status === 'Published').map(item => ({ ...item, time: `${item.hours} ${Number(item.hours) === 1 ? 'hour' : 'hours'} / One shift` }));
  const matching = cause ? opportunities.filter(opportunity => opportunity.cause === cause) : opportunities;
  const listings = featured ? matching.slice(0, 3) : matching;
  const gridRef = useRef(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (!featured || !window.IntersectionObserver) return;

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
        <li className="group/listing" key={opportunity.id} style={{ animationDelay: `${index * 65}ms` }}><OpportunityCard opportunity={opportunity} heading={featured ? "h3" : "h2"} /></li>
      ))}
    </ul>
  );
}
