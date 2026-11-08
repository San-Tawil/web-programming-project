import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout, { DashboardSection } from '../components/DashboardLayout.jsx';
import ShiftCalendar from '../components/ShiftCalendar.jsx';
import { useDashboardDemo } from '../context/DashboardDemoContext.jsx';
import { completedShifts, isConfirmed, shiftDate, shiftTime } from '../data/dashboardDemo.js';

function VolunteerHours() {
  const total = completedShifts.reduce((hours, shift) => hours + shift.hours, 0);
  const max = Math.max(1, ...completedShifts.map(shift => shift.hours));
  const axis = Array.from({ length: max + 1 }, (_, hours) => hours);

  return (
    <DashboardSection title="Volunteer hours">
      <p className="mb-1 text-2xl font-bold">{total} confirmed hours</p>
      <p className="mb-4 text-sm text-(--muted)">Sample data · Hours by month</p>
      <svg viewBox="0 0 320 168" role="img"
        aria-label={`Monthly volunteer hours. ${completedShifts.map(shift => `${shift.month}: ${shift.hours} hours`).join(', ')}.`}
        className="block w-full max-w-sm">
        <text x="4" y="14" className="fill-(--muted) text-xs">Hours</text>
        {axis.map(hours => {
          const y = 138 - hours / max * 106;
          return (
            <g key={hours}>
              <line x1="36" x2="308" y1={y} y2={y} className="stroke-(--line)" />
              <text x="25" y={y} textAnchor="end" dominantBaseline="middle" className="fill-(--muted) text-xs">{hours}</text>
            </g>
          );
        })}
        <line x1="36" x2="36" y1="32" y2="138" className="stroke-(--line)" />
        {completedShifts.map(({ month, hours }, index) => {
          const slot = 272 / completedShifts.length;
          const x = 36 + slot * (index + 0.5);
          const height = hours / max * 106;
          return (
            <g key={month}>
              <rect x={x - 17} y={138 - height} width="34" height={height} rx="3" className="fill-(--primary)" />
              <text x={x} y={131 - height} textAnchor="middle" className="fill-(--text) text-xs font-semibold">{hours} h</text>
              <text x={x} y="158" textAnchor="middle" className="fill-(--muted) text-xs">{month}</text>
            </g>
          );
        })}
      </svg>
      <h3 className="mt-6 text-base font-semibold">Completed shifts</h3>
      <ul className="m-0 list-none divide-y divide-(--aid-rule) p-0 text-sm">
        {completedShifts.map(({ date, title, hours }) => (
          <li key={date} className="flex flex-wrap justify-between gap-2 py-2">
            <span>{title}<span className="block text-(--muted)">{shiftDate(date)}</span></span>
            <span>{hours} h</span>
          </li>
        ))}
      </ul>
    </DashboardSection>
  );
}

export default function VolunteerDashboard() {
  const { opportunities, signups, volunteer } = useDashboardDemo();
  const mine = signups.filter(signup => signup.volunteerId === volunteer.id);
  const confirmed = opportunities.filter(item => mine.some(signup => signup.opportunityId === item.id && isConfirmed(signup)));
  const upcoming = confirmed.filter(item => item.kind === 'shift')
    .sort((first, second) => first.date.localeCompare(second.date));
  const programs = confirmed.filter(item => item.kind === 'opportunity');
  const applications = mine.filter(signup => signup.status !== 'Reserved');

  return (
    <DashboardLayout title="Volunteer dashboard" otherRole="Organization"
      action={<Link className="rounded-md bg-aid-primary px-4 py-3 font-semibold text-white hover:underline" to="/opportunities">Browse opportunities</Link>}>
      <div className="grid gap-6">
        <DashboardSection title="Upcoming shifts">
          {upcoming.length === 0 ? (
            <p className="mb-0 text-(--muted)">No upcoming shifts yet. <Link to="/opportunities" className="underline">Find a shift</Link>.</p>
          ) : (
            <ul className="m-0 list-none divide-y divide-(--aid-rule) p-0">
              {upcoming.map(shift => (
                <li key={shift.id} className="py-3">
                  <h3 className="mb-1 text-base font-bold">{shift.title}</h3>
                  <p className="mb-1 text-sm text-(--muted)">{shiftDate(shift.date)} · {shiftTime(shift)} · {shift.location}</p>
                  <p className="mb-0 text-sm">{shift.organizer}</p>
                </li>
              ))}
            </ul>
          )}
        </DashboardSection>
        {programs.length > 0 && (
          <DashboardSection title="Confirmed opportunities">
            <ul className="m-0 list-none divide-y divide-(--aid-rule) p-0">
              {programs.map(item => (
                <li key={item.id} className="py-2">
                  <strong>{item.title}</strong>
                  <span className="block text-sm text-(--muted)">{item.organizer} · {item.location}</span>
                </li>
              ))}
            </ul>
          </DashboardSection>
        )}
        <DashboardSection title="My applications">
          {applications.length === 0 ? <p className="mb-0 text-(--muted)">No applications yet.</p> : (
            <ul className="m-0 list-none divide-y divide-(--aid-rule) p-0">
              {applications.map(({ opportunityId, status }) => (
                <li key={opportunityId} className="flex flex-wrap items-center justify-between gap-2 py-3">
                  <span>{opportunities.find(item => item.id === opportunityId).title}</span>
                  <span className="rounded-full border border-(--line) px-3 py-1 text-sm font-semibold">{status}</span>
                </li>
              ))}
            </ul>
          )}
        </DashboardSection>
      </div>
      <div className="grid gap-6">
        <ShiftCalendar shifts={upcoming} initialDate={upcoming[0]?.date ?? opportunities.find(item => item.kind === 'shift')?.date} />
        <VolunteerHours />
      </div>
    </DashboardLayout>
  );
}
