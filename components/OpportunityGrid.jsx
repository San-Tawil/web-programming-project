import React from 'react';

// Phase 1 mock listings. The IDs can carry over to the team's shared opportunity data.
const featured = [
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
  Environment: 'aid-chip-mint',
  'Food support': 'aid-chip-peach',
  Education: 'aid-chip-sky',
  'Animal welfare': 'aid-chip-gold',
  'Community support': 'aid-chip-lime',
  Health: 'aid-chip-rose',
  'Arts and culture': 'aid-chip-lilac',
};

function OpportunityCard({ opportunity }) {
  const { cause, title, location, time, description } = opportunity;

  return (
    <article className="aid-card aid-sticker aid-lift flex h-full flex-col p-6">
      <p className={`aid-chip self-start ${causeColors[cause] ?? ""}`}>{cause}</p>
      <h3 className="mt-3 text-xl font-bold">{title}</h3>
      <p className="aid-muted">{description}</p>
      <dl className="aid-details mt-auto grid gap-2 pt-4 text-sm">
        <div><dt>Location</dt><dd>{location}</dd></div>
        <div><dt>Time</dt><dd>{time}</dd></div>
      </dl>
    </article>
  );
}

export default function OpportunityGrid() {
  return (
    <ul className="mt-6 grid list-none gap-4 p-0 md:grid-cols-3">
      {featured.map((opportunity) => (
        <li key={opportunity.id}><OpportunityCard opportunity={opportunity} /></li>
      ))}
    </ul>
  );
}
