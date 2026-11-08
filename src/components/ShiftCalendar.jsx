import React, { useState } from 'react';
import { DashboardSection } from './DashboardLayout.jsx';
import { shiftDate, shiftTime } from '../data/dashboardDemo.js';

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const monthFormat = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' });
const monthButton = 'grid size-11 cursor-pointer place-items-center rounded-md border border-(--line) bg-transparent text-(--text) hover:bg-(--panel)';

export default function ShiftCalendar({ shifts, initialDate }) {
  const [month, setMonth] = useState(() => initialDate ? new Date(initialDate + 'T00:00:00') : new Date());
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const monthKey = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
  const monthName = monthFormat.format(month);
  const monthShifts = shifts
    .filter(shift => shift.date.startsWith(monthKey + '-'))
    .sort((first, second) => first.date.localeCompare(second.date) || first.startTime.localeCompare(second.startTime));
  const shiftDays = new Set(monthShifts.map(shift => Number(shift.date.slice(-2))));
  const firstWeekday = (new Date(year, monthIndex, 1).getDay() + 6) % 7;
  const days = new Date(year, monthIndex + 1, 0).getDate();
  const weeks = Math.ceil((firstWeekday + days) / 7);

  function moveMonth(direction) {
    setMonth(current => new Date(current.getFullYear(), current.getMonth() + direction, 1));
  }

  return (
    <DashboardSection title="Shift calendar">
      <div className="mb-3 flex items-center justify-between gap-2">
        <button type="button" className={monthButton} aria-label="Previous month" onClick={() => moveMonth(-1)}>‹</button>
        <p role="status" className="m-0 text-center font-semibold">{monthName}</p>
        <button type="button" className={monthButton} aria-label="Next month" onClick={() => moveMonth(1)}>›</button>
      </div>
      <table className="w-full table-fixed border-collapse text-center text-sm">
        <caption className="sr-only">{monthName} shift dates</caption>
        <thead className="text-xs text-(--muted)">
          <tr>{weekdays.map(day => <th key={day} scope="col" className="pb-2 font-medium">{day}</th>)}</tr>
        </thead>
        <tbody>
          {Array.from({ length: weeks }, (_, week) => (
            <tr key={week}>
              {weekdays.map((weekday, index) => {
                const day = week * 7 + index - firstWeekday + 1;
                return (
                  <td key={weekday} className="h-8">
                    {day >= 1 && day <= days && (
                      <span className={shiftDays.has(day) ? 'inline-grid size-7 place-items-center rounded-full bg-aid-primary font-semibold text-white' : undefined}>
                        {day}{shiftDays.has(day) && <span className="sr-only"> · Shift scheduled</span>}
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {monthShifts.length === 0 ? (
        <p className="mt-4 mb-0 text-sm text-(--muted)">No shifts scheduled this month.</p>
      ) : (
        <ul className="mt-4 mb-0 list-none divide-y divide-(--aid-rule) border-t border-(--aid-rule) p-0 text-sm">
          {monthShifts.map(shift => (
            <li key={shift.id} className="py-2">
              <strong>{shift.title}</strong>
              <span className="block text-(--muted)">{shiftDate(shift.date)} · {shiftTime(shift)}</span>
            </li>
          ))}
        </ul>
      )}
    </DashboardSection>
  );
}
