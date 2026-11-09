import React, { useState } from 'react';
import { listingStatus, shiftDate, shiftTime, signupAction, spotsFilled } from '../data/dashboardDemo.js';

const row = 'flex flex-wrap items-center justify-between gap-3 py-3';
const button = 'min-h-11 cursor-pointer rounded-lg border border-(--line) bg-(--panel) px-3 text-sm font-semibold text-(--text) hover:border-(--primary) disabled:cursor-default disabled:opacity-60';
const field = 'min-h-11 w-full min-w-0 rounded-lg border border-(--line) bg-(--bg) px-3 text-(--text)';
const hoursLabel = new Intl.NumberFormat('en', { maximumFractionDigits: 2 });

function shiftHours({ startTime, endTime }) {
  const minutes = (time) => {
    const [hour, minute] = time.split(':').map(Number);
    return hour * 60 + minute;
  };
  return (minutes(endTime) - minutes(startTime)) / 60;
}

export default function VolunteerProfile({ shifts, history, entries, plannedIds, dispatch }) {
  const [notice, setNotice] = useState('');
  const plannedShifts = shifts.filter(shift => plannedIds.includes(shift.id));
  const logged = [...history, ...entries].reduce((total, shift) => total + shift.hours, 0);
  const planned = plannedShifts.reduce((total, shift) => total + shiftHours(shift), 0);
  const today = new Date().toLocaleDateString('sv-SE');

  function logTime(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const title = data.get('task').trim();
    const date = data.get('date');
    const hours = Number(data.get('hours'));
    if (!title || !date || date > today || !Number.isFinite(hours) || hours <= 0 || hours > 24) {
      setNotice('Enter an activity, a completed date, and up to 24 hours.');
      return;
    }
    dispatch({ type: 'logHours', entry: { id: crypto.randomUUID(), title, date, hours } });
    form.reset();
    setNotice('Time logged.');
  }

  return (
    <section id="hours" aria-labelledby="hours-title" tabIndex={-1} className="min-w-0 scroll-mt-32 rounded-xl border border-(--line) bg-(--panel) p-4 sm:p-5 lg:scroll-mt-20">
      <h2 id="hours-title" className="mb-1 font-display text-xl font-bold">Hours &amp; planning</h2>
      <p className="mb-4 text-sm text-(--muted)">Log time you spent volunteering or estimate time for a future shift.</p>
      <dl className="m-0 grid grid-cols-3 divide-x divide-(--line) rounded-lg border border-(--line) bg-(--bg)">
        {[
          ['Logged', logged],
          ['Planned', planned],
          ['Projected', logged + planned],
        ].map(([label, hours]) => (
          <div key={label} className="p-3">
            <dt className="text-sm text-(--muted)">{label}</dt>
            <dd className="mt-1 ml-0 text-xl font-bold tabular-nums">{hoursLabel.format(hours)} h</dd>
          </div>
        ))}
      </dl>
      <div className="mt-5 grid gap-6 xl:grid-cols-2">
        <div>
          <h3 className="mb-2 text-base">Log volunteer time</h3>
          <form className="grid gap-3 text-sm [&_label]:grid [&_label]:min-w-0 [&_label]:gap-1" onSubmit={logTime}>
            <label>Activity<input name="task" className={field} placeholder="e.g. Packed grocery boxes" required maxLength={100} /></label>
            <div className="grid grid-cols-2 gap-3">
              <label>Date<input name="date" type="date" className={field} defaultValue={today} max={today} required /></label>
              <label>Hours<input name="hours" type="number" className={field} placeholder="e.g. 1.5" min="0.01" max="24" step="any" required /></label>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button type="submit" className="min-h-11 cursor-pointer rounded-lg border-0 bg-(--primary) px-4 font-semibold text-(--bg)">Log time</button>
              <span role="status" className="text-sm text-(--muted)">{notice}</span>
            </div>
          </form>
          {entries.length > 0 && (
            <ul aria-label="Your time entries" className="mt-3 mb-0 list-none divide-y divide-(--line) p-0">
              {entries.slice().reverse().map(entry => (
                <li key={entry.id} className={row}>
                  <div className="min-w-0 break-words"><strong>{entry.title}</strong><span className="block text-sm text-(--muted)">{shiftDate(entry.date)} · {hoursLabel.format(entry.hours)} h</span></div>
                  <button type="button" className={button} aria-label={'Remove time entry for ' + entry.title} onClick={() => { dispatch({ type: 'removeHours', id: entry.id }); setNotice('Time entry removed.'); }}>Remove</button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h3 className="mb-1 text-base">Plan future shifts</h3>
          <p className="mb-2 text-sm text-(--muted)">Planning estimates hours. To sign up, use <a href="#find-shifts" className="underline">Find shifts</a>.</p>
          <ul className="m-0 list-none divide-y divide-(--line) p-0">
            {shifts.map(shift => (
              <li key={shift.id}>
                <label className={row + ' cursor-pointer text-sm'}>
                  <span className="flex min-w-0 flex-1 items-start gap-2">
                    <input type="checkbox" checked={plannedIds.includes(shift.id)} onChange={() => dispatch({ type: 'togglePlan', opportunityId: shift.id })} className="mt-1 size-4 shrink-0 accent-(--primary)" />
                    <span className="break-words">{shift.title}</span>
                  </span>
                  <span className="text-(--muted)">{hoursLabel.format(shiftHours(shift))} h</span>
                </label>
              </li>
            ))}
          </ul>
          {!shifts.length && <p className="m-0 text-sm text-(--muted)">No upcoming shifts to plan yet.</p>}
        </div>
      </div>
    </section>
  );
}

export function VolunteerShiftBoard({ shifts, signups, mine, onChange }) {
  const [filter, setFilter] = useState('All');
  const causes = [...new Set(shifts.map(shift => shift.cause))];
  const currentFilter = causes.includes(filter) ? filter : 'All';
  const visible = shifts.filter(shift => currentFilter === 'All' || shift.cause === currentFilter);

  return (
    <section id="find-shifts" aria-labelledby="shift-board-title" tabIndex={-1} className="min-w-0 scroll-mt-32 rounded-xl border border-(--line) bg-(--panel) p-4 sm:p-5 lg:scroll-mt-20">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="shift-board-title" className="mb-1 font-display text-xl font-bold">Find shifts</h2>
          <p className="m-0 text-sm text-(--muted)">Reserve to confirm your place now. Apply when an organizer needs to approve your signup.</p>
        </div>
        <label className="grid gap-1 text-sm font-semibold">Cause
          <select value={currentFilter} className={field} onChange={event => setFilter(event.target.value)}>
            <option value="All">All causes</option>
            {causes.map(cause => <option key={cause}>{cause}</option>)}
          </select>
        </label>
      </div>
      {visible.length === 0 && <p className="mt-4 mb-0 text-sm text-(--muted)">No upcoming shifts are listed yet.</p>}
      <ul className="mt-3 mb-0 list-none divide-y divide-(--line) p-0">
        {visible.map(shift => {
          const status = mine.find(signup => signup.opportunityId === shift.id)?.status;
          const availability = listingStatus(shift, signups);
          const action = signupAction(shift, status, availability);
          const remaining = Math.max(0, shift.capacity - spotsFilled(signups, shift.id));
          return (
            <li key={shift.id} className={row}>
              <div className="min-w-0 flex-1 break-words">
                <strong className="block">{shift.title}</strong>
                <span className="block text-sm text-(--muted)">{shiftDate(shift.date)} · {shiftTime(shift)} · {shift.location}</span>
                <span className="block text-sm text-(--muted)">{status ?? (availability === 'Full' ? 'Full' : remaining + (remaining === 1 ? ' spot left' : ' spots left'))}</span>
              </div>
              <button type="button" className={button} disabled={action.disabled}
                aria-label={action.label + ': ' + shift.title} onClick={() => onChange(shift, action.type, status)}>
                {action.label}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
