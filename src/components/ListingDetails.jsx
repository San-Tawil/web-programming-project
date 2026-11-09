import React from 'react';
import { listingStatus, shiftDate, shiftTime, spotsFilled } from '../data/dashboardDemo.js';

export default function ListingDetails({ listing, signups, parent }) {
  const status = listingStatus(listing, signups);
  const spots = listing.capacity - spotsFilled(signups, listing.id);

  return (
    <details className="mt-2 text-sm">
      <summary className="w-fit cursor-pointer py-2 font-semibold text-(--primary) underline underline-offset-4">
        View details<span className="sr-only"> for {listing.title}</span>
      </summary>
      <p className="mb-2 text-(--muted) break-words">{listing.description}</p>
      <dl className="m-0 grid gap-1.5 [&_dd]:m-0 [&_dt]:font-semibold">
        <div className="flex flex-wrap gap-x-2"><dt>Organizer</dt><dd>{listing.organizer}</dd></div>
        <div className="flex flex-wrap gap-x-2"><dt>Meeting location</dt><dd className="min-w-0 break-words">{listing.location}</dd></div>
        {listing.kind === 'shift' && (
          <div className="flex flex-wrap gap-x-2"><dt>When</dt><dd>{shiftDate(listing.date)} · {shiftTime(listing)}</dd></div>
        )}
        {parent && <div className="flex flex-wrap gap-x-2"><dt>Program</dt><dd>{parent.title}</dd></div>}
        <div className="flex flex-wrap gap-x-2">
          <dt>Signup</dt><dd>{status === 'Open' ? `${spots} ${spots === 1 ? 'spot' : 'spots'} left · ${listing.signup === 'approval' ? 'Approval required' : 'Open signup'}` : status}</dd>
        </div>
        {listing.bring && <div className="flex flex-wrap gap-x-2"><dt>What to bring</dt><dd>{listing.bring}</dd></div>}
      </dl>
    </details>
  );
}
