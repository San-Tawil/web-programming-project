import React, { useEffect, useRef, useState } from 'react';

// Phase 1 mock listings. The IDs can carry over to the team's shared opportunity data.
const opportunities = [
  { id: 'coastal-cleanup', cause: 'Environment', title: 'Coastal cleanup', location: 'Ramlet el Baida, Beirut', time: '2 hours · One shift', description: 'Walk the shoreline with a small team, collect litter, and sort recyclables at the end of the shift.' },
  { id: 'food-packing', cause: 'Food support', title: 'Community food packing', location: 'Beirut', time: '3 hours · One shift', description: 'Sort pantry staples and assemble grocery boxes for families in the community.' },
  { id: 'homework-club', cause: 'Education', title: 'After-school homework club', location: 'Hamra, Beirut', time: '1 hour · Weekly', description: 'Help students work through homework and build confidence by reading together.' },
  { id: 'shelter-care', cause: 'Animal welfare', title: 'Shelter care shift', location: 'Tripoli, North Lebanon', time: '2 hours · One shift', description: 'Help shelter staff refresh bedding and prepare food for rescued animals.' },
  { id: 'garden-day', cause: 'Community support', title: 'Neighborhood garden day', location: 'Sidon, South Lebanon', time: '3 hours · One shift', description: 'Prepare planting beds and water seedlings with neighborhood volunteers.' },
  { id: 'community-health-day', cause: 'Health', title: 'Community health welcome desk', location: 'Zahle, Beqaa', time: '2 hours · One shift', description: 'Welcome visitors, help them find the right station, and organize supplies.' },
  { id: 'arts-workshop', cause: 'Arts and culture', title: 'Community art workshop', location: 'Byblos, Mount Lebanon', time: '2 hours · One shift', description: 'Set up materials and support participants during a hands-on art session.' },
];

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
    <article className="aid-card flex h-full flex-col rounded-xl border border-(--aid-rule) bg-(--aid-surface) p-4 sm:p-5 motion-safe:transition-transform">
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
    <ul ref={gridRef} data-animate={!featured || entered} className="aid-opportunity-grid mt-6 grid list-none gap-4 p-0 md:grid-cols-3">
      {listings.map((opportunity, index) => (
        <li key={opportunity.id} style={{ animationDelay: `${index * 65}ms` }}><OpportunityCard opportunity={opportunity} heading={featured ? "h3" : "h2"} /></li>
      ))}
    </ul>
  );
}
