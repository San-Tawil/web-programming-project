import React, { useState } from 'react';
import { useDashboardDemo } from '../context/DashboardDemoContext.jsx';

const field = 'w-full rounded-md border border-(--line) bg-(--bg) px-3 py-2 text-(--text)';
const causes = [
  'Environment', 'Food support', 'Education', 'Health', 'Animal welfare',
  'Community support', 'Senior support', 'Arts and culture', 'Youth sports', 'Accessibility',
];

export default function OpportunityForm({ kind }) {
  const { dispatch, opportunities, organization } = useDashboardDemo();
  const [parentId, setParentId] = useState('');
  const [notice, setNotice] = useState('');
  const isShift = kind === 'shift';
  const parents = opportunities.filter(item => item.kind === 'opportunity' && item.organizationId === organization.id);
  const parent = parents.find(item => item.id === parentId);

  function addListing(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const title = data.get('title').trim();
    const location = parent?.location ?? data.get('location').trim();
    const description = parent?.description ?? data.get('description').trim();
    const startTime = data.get('startTime');
    const endTime = data.get('endTime');
    if (!title || !location || !description) {
      setNotice('Enter a title, location, and description.');
      return;
    }
    if (isShift && endTime <= startTime) {
      setNotice('End time must be after the start time on the same day.');
      return;
    }

    dispatch({
      type: 'post',
      opportunity: {
        kind, title, location, description,
        cause: parent?.cause ?? data.get('cause'),
        capacity: Number(data.get('capacity')),
        signup: data.get('signup'),
        ...(isShift && { parentId, date: data.get('date'), startTime, endTime }),
      },
    });
    form.reset();
    setParentId('');
    setNotice(`${title} is now in the demo catalog.`);
  }

  return (
    <form className="grid gap-4 text-sm [&_label]:grid [&_label]:gap-1" onSubmit={addListing}>
      <label>Title <input className={field} name="title" required maxLength={80} /></label>
      {isShift && (
        <label>Opportunity
          <select className={field} value={parentId} onChange={event => setParentId(event.target.value)}>
            <option value="">Standalone shift</option>
            {parents.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}
          </select>
        </label>
      )}
      {!parent && (
        <>
          <label>Cause
            <select className={field} name="cause">
              {causes.map(cause => <option key={cause}>{cause}</option>)}
            </select>
          </label>
          <label>Location <input className={field} name="location" required maxLength={100} /></label>
          <label>Description <textarea className={field} name="description" required rows={3} maxLength={300} /></label>
        </>
      )}
      {isShift && (
        <div className="grid gap-4 sm:grid-cols-3">
          <label>Date <input className={field} type="date" name="date" required /></label>
          <label>Start time <input className={field} type="time" name="startTime" required /></label>
          <label>End time <input className={field} type="time" name="endTime" required /></label>
        </div>
      )}
      <label>Capacity <input className={field} type="number" name="capacity" min={1} max={100} required /></label>
      <label>Signup type
        <select className={field} name="signup">
          <option value="open">Open signup</option>
          <option value="approval">Approval required</option>
        </select>
      </label>
      <button type="submit" className="min-h-11 cursor-pointer rounded-md border-0 bg-aid-primary px-4 font-semibold text-white">Add {kind}</button>
      <p role="status" className="mb-0 text-(--muted)">{notice}</p>
    </form>
  );
}
