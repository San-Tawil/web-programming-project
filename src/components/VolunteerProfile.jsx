import React, { useEffect, useState } from 'react';
import { listingStatus, shiftDate, shiftTime, signupLabel, spotsFilled } from '../data/dashboardDemo.js';

const goal = 40;
const row = 'flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6';
const button = 'min-h-11 cursor-pointer rounded-lg border border-(--line) bg-(--panel) px-3 text-sm font-semibold text-(--text) hover:border-(--primary) disabled:cursor-default disabled:opacity-60';
const hoursLabel = new Intl.NumberFormat('en', { maximumFractionDigits: 2 });

function shiftHours({ startTime, endTime }) {
  const minutes = (time) => {
    const [hour, minute] = time.split(':').map(Number);
    return hour * 60 + minute;
  };
  return (minutes(endTime) - minutes(startTime)) / 60;
}

function HoursBar({ logged, planned, max }) {
  const loggedWidth = Math.min(100, logged / max * 100);
  const plannedWidth = Math.min(100 - loggedWidth, planned / max * 100);
  return (
    <div className="flex h-2.5 overflow-hidden rounded-full bg-(--nav-panel)" aria-hidden="true">
      <div className="bg-(--primary)" style={{ width: loggedWidth + '%' }} />
      <div className="bg-[repeating-linear-gradient(135deg,transparent_0_3px,var(--primary)_3px_5px)]" style={{ width: plannedWidth + '%' }} />
    </div>
  );
}

export default function VolunteerProfile({ volunteer, shifts, completedShifts, plannedIds, dispatch }) {
  const [photoUrl, setPhotoUrl] = useState('');
  useEffect(() => {
    if (!volunteer.photo) return;
    const url = URL.createObjectURL(volunteer.photo);
    setPhotoUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [volunteer.photo]);
  const plannedShifts = shifts.filter(shift => plannedIds.includes(shift.id));
  const logged = completedShifts.reduce((total, shift) => total + shift.hours, 0);
  const planned = plannedShifts.reduce((total, shift) => total + shiftHours(shift), 0);
  const projected = logged + planned;
  const byCause = [...new Set([...completedShifts, ...plannedShifts].map(shift => shift.cause))].map(cause => ({
    cause,
    logged: completedShifts.filter(shift => shift.cause === cause).reduce((total, shift) => total + shift.hours, 0),
    planned: plannedShifts.filter(shift => shift.cause === cause).reduce((total, shift) => total + shiftHours(shift), 0),
  }));
  const causeMax = Math.max(1, ...byCause.map(item => item.logged + item.planned));

  return (
      <section id="hours" aria-labelledby="hours-title" className="min-w-0 scroll-mt-24 overflow-hidden rounded-xl border border-(--line) bg-(--aid-surface) lg:col-span-2">
        <header className={row}>
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-full bg-(--nav-panel) text-sm font-bold text-(--primary)">
              {photoUrl ? (
                <img src={photoUrl} alt="" className="size-full rounded-full object-cover" />
              ) : volunteer.name.split(' ').map(part => part[0]).slice(0, 2).join('')}
            </span>
            <div>
              <h2 id="hours-title" className="mb-1 font-display text-xl">Hours &amp; planning</h2>
              <p className="mb-0 text-sm text-(--muted)">{volunteer.name}{volunteer.location && ` · ${volunteer.location}`}</p>
            </div>
          </div>
        </header>
        <dl className="m-0 grid grid-cols-3 divide-x divide-(--line) border-y border-(--line)">
          {[
            ['Logged', logged],
            ['Planned', planned],
            ['Projected', projected],
          ].map(([label, hours]) => (
            <div key={label} className="px-4 py-3 sm:px-6">
              <dt className="text-xs text-(--muted) sm:text-sm">{label}</dt>
              <dd className="mt-1 ml-0 font-display text-xl font-bold tabular-nums sm:text-2xl">{hoursLabel.format(hours)} h</dd>
            </div>
          ))}
        </dl>
        <div className="px-4 py-4 sm:px-6">
          <div className="mb-3 flex flex-wrap justify-between gap-2 text-sm">
            <h3 className="mb-0 text-sm">Progress toward your demo goal</h3>
            <span className="text-(--muted)">{hoursLabel.format(projected)} of {goal} h</span>
          </div>
          <HoursBar logged={logged} planned={planned} max={goal} />
          <p className="mt-2 mb-0 text-xs text-(--muted)">Solid · Logged <span className="ml-3">Striped · Planned</span></p>
        </div>
        <div className={row + ' border-y border-(--line)'}>
          <div>
            <h3 className="mb-1 text-base">Plan your shifts</h3>
            <p className="m-0 text-sm text-(--muted)">Planning adds estimated hours. Book from the shift board.</p>
          </div>
          <span className="text-sm text-(--muted)" role="status">{plannedShifts.length} of {shifts.length} selected</span>
        </div>
        <ul className="m-0 list-none divide-y divide-(--line) p-0">
          {shifts.map(shift => (
            <li key={shift.id}>
              <label className={row + ' min-h-14 cursor-pointer hover:bg-(--panel)'}>
                <span className="flex min-w-0 flex-1 items-start gap-3">
                  <input type="checkbox" checked={plannedIds.includes(shift.id)} onChange={() => dispatch({ type: 'togglePlan', opportunityId: shift.id })} className="mt-1 size-4 shrink-0 accent-(--primary)" />
                  <span className="min-w-0 break-words">
                    <strong className="block text-sm">{shift.title}</strong>
                    <span className="block text-xs text-(--muted)">{shift.cause} · {shiftDate(shift.date)}</span>
                  </span>
                </span>
                <span className="rounded-full border border-(--line) px-2 py-0.5 text-xs tabular-nums">{hoursLabel.format(shiftHours(shift))} h</span>
              </label>
            </li>
          ))}
        </ul>
        <div className="border-t border-(--line) px-4 py-4 sm:px-6">
          <h3 className="mb-3 text-base">Hours by cause</h3>
          {byCause.length === 0 && <p className="mb-0 text-sm text-(--muted)">No logged or planned hours yet.</p>}
          <ul className="m-0 grid list-none gap-3 p-0">
            {byCause.map(item => (
              <li key={item.cause} className="grid grid-cols-[minmax(5rem,1fr)_2fr_auto] items-center gap-3 text-sm">
                <span>{item.cause}</span>
                <HoursBar {...item} max={causeMax} />
                <span className="text-(--muted) tabular-nums">{hoursLabel.format(item.logged + item.planned)} h</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
  );
}

export function VolunteerShiftBoard({ shifts, signups, mine, onChange }) {
  const [filter, setFilter] = useState('All');
  const causes = [...new Set(shifts.map(shift => shift.cause))];
  const currentFilter = causes.includes(filter) ? filter : 'All';

  return (
      <section aria-labelledby="shift-board-title" className="overflow-hidden rounded-xl border border-(--line) bg-(--aid-surface)">
        <div className={row + ' border-b border-(--line)'}>
          <h2 id="shift-board-title" className="mb-0 font-display text-xl">Shift board</h2>
          <div aria-label="Filter shifts by cause" role="group" className="flex flex-wrap gap-2">
            {['All', ...causes].map(cause => (
              <button type="button" key={cause} aria-pressed={currentFilter === cause} onClick={() => setFilter(cause)}
                className={button + ' aria-pressed:border-(--primary) aria-pressed:bg-(--nav-panel) aria-pressed:text-(--primary)'}>
                {cause}
              </button>
            ))}
          </div>
        </div>
        {causes.length === 0 && <p className="m-0 p-4 text-sm text-(--muted)">No shifts are listed yet.</p>}
        {causes.filter(cause => currentFilter === 'All' || currentFilter === cause).map(cause => (
          <div key={cause} className="border-b border-(--line) last:border-b-0">
            <h3 className="mb-0 px-4 pt-4 text-base sm:px-6">{cause}</h3>
            <ul className="m-0 list-none divide-y divide-(--line) p-0">
              {shifts.filter(shift => shift.cause === cause).map(shift => {
                const status = mine.find(signup => signup.opportunityId === shift.id)?.status;
                const filled = spotsFilled(signups, shift.id);
                const availability = listingStatus(shift, signups);
                const canLeave = status && status !== 'Declined';
                const actionLabel = status === 'Pending' ? 'Withdraw application' : canLeave ? 'Cancel reservation' : signupLabel(shift);
                return (
                  <li key={shift.id} className={row}>
                    <div className="min-w-0 flex-1 break-words">
                      <strong className="block text-sm">{shift.title}</strong>
                      <span className="block text-xs text-(--muted)">{shiftDate(shift.date)} · {shiftTime(shift)}</span>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-(--muted)">
                        <div className="w-20 sm:w-28"><HoursBar logged={filled} planned={0} max={shift.capacity} /></div>
                        <span>{filled} of {shift.capacity} spots · {status ?? (availability === 'Open' && shift.signup === 'approval' ? 'Approval required' : availability)}</span>
                      </div>
                    </div>
                    <button type="button" className={button} disabled={status === 'Declined' || (!status && availability !== 'Open')}
                      aria-label={`${actionLabel}: ${shift.title}`}
                      onClick={() => onChange(shift, canLeave ? 'leave' : 'join', status)}>
                      {actionLabel}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </section>
  );
}
