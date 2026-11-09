import React, { useState } from 'react';
import { DashboardSection } from './DashboardLayout.jsx';
import { shiftDate, shiftTime } from '../data/dashboardDemo.js';

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const monthFormat = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' });
const button = 'min-h-9 cursor-pointer rounded-md border border-(--line) bg-transparent px-2 text-sm text-(--text) hover:bg-(--panel) focus-visible:outline-2 focus-visible:outline-(--primary)';

function dateKey(date) {
  return [date.getFullYear(), date.getMonth() + 1, date.getDate()]
    .map(value => String(value).padStart(2, '0')).join('-');
}

function offsetDay(date, days) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

function weekStart(date) {
  return offsetDay(date, -((date.getDay() + 6) % 7));
}

export default function ShiftCalendar({ shifts, initialDate }) {
  const [view, setView] = useState('month');
  const [cursor, setCursor] = useState(() => initialDate ? new Date(initialDate + 'T00:00:00') : new Date());
  const [selected, setSelected] = useState(null);
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const weekly = view === 'week';
  const first = weekly ? weekStart(cursor) : weekStart(new Date(year, month, 1));
  const last = weekly ? offsetDay(first, 6) : new Date(year, month + 1, 0);
  const startOffset = (new Date(year, month, 1).getDay() + 6) % 7;
  const weekCount = weekly ? 1 : Math.ceil((startOffset + last.getDate()) / 7);
  const firstKey = weekly ? dateKey(first) : dateKey(new Date(year, month, 1));
  const lastKey = dateKey(last);
  const title = weekly ? `${shiftDate(firstKey)} – ${shiftDate(lastKey)}` : monthFormat.format(cursor);
  const periodShifts = shifts.filter(shift => shift.date >= firstKey && shift.date <= lastKey)
    .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime));
  const shown = selected ? periodShifts.filter(shift => shift.date === selected) : periodShifts;

  function move(direction) {
    setSelected(null);
    setCursor(current => weekly
      ? offsetDay(current, direction * 7)
      : new Date(current.getFullYear(), current.getMonth() + direction, 1));
  }

  return (
    <DashboardSection title="Shift calendar">
      <div role="group" aria-label="Calendar view" className="mb-3 flex flex-wrap gap-2">
        {['week', 'month'].map(option => (
          <button key={option} type="button" aria-pressed={view === option}
            className={button + ' capitalize aria-pressed:border-(--primary) aria-pressed:bg-(--nav-panel) aria-pressed:font-semibold'}
            onClick={() => {
              if (selected) setCursor(new Date(selected + 'T00:00:00'));
              setView(option);
            }}>
            {option}
          </button>
        ))}
      </div>
      <div className="mb-3 flex items-center justify-between gap-2">
        <button type="button" className={button} aria-label={`Previous ${view}`} onClick={() => move(-1)}>‹</button>
        <p role="status" className="m-0 text-center text-sm font-semibold">{title}</p>
        <button type="button" className={button} aria-label={`Next ${view}`} onClick={() => move(1)}>›</button>
      </div>
      <table className="w-full table-fixed border-collapse text-center text-sm">
        <caption className="sr-only">{title} shift dates</caption>
        <thead className="text-xs text-(--muted)">
          <tr>{weekdays.map(day => <th key={day} scope="col" className="pb-2 font-medium">{day}</th>)}</tr>
        </thead>
        <tbody>
          {Array.from({ length: weekCount }, (_, week) => (
            <tr key={week}>
              {weekdays.map((weekday, index) => {
                const date = offsetDay(first, week * 7 + index);
                const key = dateKey(date);
                const count = periodShifts.filter(shift => shift.date === key).length;
                return (
                  <td key={weekday} className="h-10">
                    {(weekly || date.getMonth() === month) && (
                      <button type="button" aria-pressed={selected === key}
                        aria-label={`${shiftDate(key)}, ${count} scheduled shifts`}
                        className={`mx-auto grid min-h-9 w-full max-w-10 cursor-pointer place-items-center rounded-md border border-transparent text-sm hover:border-(--line) focus-visible:outline-2 focus-visible:outline-(--primary) aria-pressed:border-(--primary) ${count ? 'bg-(--nav-panel) font-bold text-(--primary)' : 'bg-transparent text-(--text)'}`}
                        onClick={() => setSelected(current => current === key ? null : key)}>
                        {date.getDate()}
                      </button>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 border-t border-(--aid-rule) pt-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="mb-0 text-sm font-semibold">{selected ? shiftDate(selected) : weekly ? 'This week' : 'This month'}</h3>
          {selected && <button type="button" className={button} onClick={() => setSelected(null)}>Show all</button>}
        </div>
        {shown.length === 0 ? (
          <p className="mt-2 mb-0 text-sm text-(--muted)">No shifts scheduled for {selected ? 'this day' : `this ${view}`}.</p>
        ) : (
          <ul className="m-0 list-none divide-y divide-(--aid-rule) p-0 text-sm">
            {shown.map(shift => (
              <li key={shift.id} className="py-2">
                <strong>{shift.title}</strong>
                <span className="block text-(--muted)">{shiftDate(shift.date)} · {shiftTime(shift)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </DashboardSection>
  );
}
