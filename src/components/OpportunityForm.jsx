import React, { useState } from 'react';
import { useDashboardDemo } from '../context/DashboardDemoContext.jsx';
import { isClosed, listingScheduleError, spotsFilled } from '../data/dashboardDemo.js';

const field = 'w-full rounded-md border border-(--line) bg-(--bg) px-3 py-2 text-(--text)';
const causes = [
  'Environment', 'Food support', 'Education', 'Health', 'Animal welfare',
  'Community support', 'Senior support', 'Arts and culture', 'Youth sports', 'Accessibility',
];

export default function OpportunityForm({ kind, listing, onSave, onCancel }) {
  const { dispatch, opportunities, organization, signups } = useDashboardDemo();
  const [parentId, setParentId] = useState(listing?.parentId ?? '');
  const [notice, setNotice] = useState('');
  const isShift = kind === 'shift';
  const parents = opportunities.filter(item => item.kind === 'opportunity' && item.organizationId === organization.id);
  const parent = parents.find(item => item.id === parentId);
  const minCapacity = listing ? Math.max(1, spotsFilled(signups, listing.id)) : 1;
  const today = new Date().toLocaleDateString('sv-SE');

  function addListing(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const title = data.get('title').trim();
    const location = parent?.location ?? data.get('location').trim();
    const description = parent?.description ?? data.get('description').trim();
    const startTime = data.get('startTime');
    const endTime = data.get('endTime');
    if (!title || !location || !description) {
      setNotice('Enter a title, location, and description.');
      return;
    }
    const opportunity = {
      kind, title, location, description,
      cause: parent?.cause ?? data.get('cause'),
      capacity: Number(data.get('capacity')),
      signup: data.get('signup'),
      date: data.get('date'), startTime, endTime,
      ...(isShift && { parentId }),
    };
    const error = listingScheduleError(opportunity, parent);
    if (error || (listing && isClosed(listing))) {
      setNotice(error || 'Listings that have already started cannot be edited.');
      return;
    }
    dispatch(listing
      ? { type: 'editShift', opportunityId: listing.id, changes: opportunity }
      : { type: 'post', opportunity });
    onSave(title);
  }

  return (
    <form className="grid gap-4 text-sm [&_label]:grid [&_label]:gap-1" onSubmit={addListing}>
      <label>Title <input className={field} name="title" defaultValue={listing?.title} required maxLength={80} /></label>
      {isShift && (
        <label>Program (optional)
          <select className={field} value={parentId} onChange={event => setParentId(event.target.value)}>
            <option value="">Standalone shift</option>
            {parents.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}
          </select>
        </label>
      )}
      {parent && <p className="m-0 rounded-md bg-(--nav-panel) p-3 text-(--muted)">Part of <strong>{parent.title}</strong>. This shift uses the program’s cause, location, and description.</p>}
      {!parent && (
        <>
          <label>Cause
            <select className={field} name="cause" defaultValue={listing?.cause}>
              {causes.map(cause => <option key={cause}>{cause}</option>)}
            </select>
          </label>
          <label>Location <input className={field} name="location" defaultValue={listing?.location} required maxLength={100} /></label>
          <label>Description <textarea className={field} name="description" defaultValue={listing?.description} required rows={3} maxLength={300} /></label>
        </>
      )}
      <div className="grid gap-4 sm:grid-cols-3">
        <label>Date <input className={field} type="date" name="date" min={parent?.date > today ? parent.date : today} defaultValue={listing?.date} required /></label>
        <label>Start time <input className={field} type="time" name="startTime" defaultValue={listing?.startTime} required /></label>
        <label>End time <input className={field} type="time" name="endTime" defaultValue={listing?.endTime} required /></label>
      </div>
      <label>Capacity <input className={field} type="number" name="capacity" min={minCapacity} max={100} defaultValue={listing?.capacity} required /></label>
      <label>Signup type
        <select className={field} name="signup" defaultValue={listing?.signup ?? 'open'}>
          <option value="open">Open signup</option>
          <option value="approval">Approval required</option>
        </select>
      </label>
      <div className="flex flex-wrap gap-3">
        <button type="submit" className="min-h-11 cursor-pointer rounded-md border-0 bg-(--primary) px-4 font-semibold text-(--bg)">{listing ? 'Save changes' : `Add ${kind}`}</button>
        <button type="button" className="min-h-11 cursor-pointer rounded-md border border-(--line) bg-(--bg) px-4 font-semibold text-(--text)" onClick={onCancel}>Cancel</button>
      </div>
      <p role="status" className={notice ? 'm-0 text-(--muted)' : 'sr-only'}>{notice}</p>
    </form>
  );
}
