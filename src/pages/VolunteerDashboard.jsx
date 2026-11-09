import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout, { DashboardSection } from '../components/DashboardLayout.jsx';
import ShiftCalendar from '../components/ShiftCalendar.jsx';
import VolunteerProfile from '../components/VolunteerProfile.jsx';
import { useDashboardDemo } from '../context/DashboardDemoContext.jsx';
import { completedShifts, initialDemo, isConfirmed, shiftDate, shiftTime } from '../data/dashboardDemo.js';

export default function VolunteerDashboard() {
  const { opportunities, signups, volunteer, dispatch } = useDashboardDemo();
  const history = volunteer.id === initialDemo.volunteer.id ? completedShifts : [];
  const shifts = opportunities.filter(item => item.kind === 'shift');
  const mine = signups.filter(signup => signup.volunteerId === volunteer.id);
  const confirmed = opportunities.filter(item => mine.some(signup => signup.opportunityId === item.id && isConfirmed(signup)));
  const upcoming = confirmed.filter(item => item.kind === 'shift')
    .sort((first, second) => first.date.localeCompare(second.date));
  const programs = confirmed.filter(item => item.kind === 'opportunity');
  const applications = mine.filter(signup => signup.status !== 'Reserved');

  return (
    <DashboardLayout title="Volunteer dashboard" otherRole="Organization"
      action={<Link className="rounded-md bg-aid-primary px-4 py-3 font-semibold text-white hover:underline" to="/opportunities">Browse opportunities</Link>}>
      <VolunteerProfile key={volunteer.id} volunteer={volunteer} shifts={shifts} completedShifts={history} signups={signups} mine={mine} dispatch={dispatch} />
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
        <DashboardSection title="Completed shifts">
          {history.length === 0 && <p className="mb-0 text-sm text-(--muted)">No completed shifts yet.</p>}
          <ul className="m-0 list-none divide-y divide-(--line) p-0 text-sm">
            {history.map(shift => (
              <li key={shift.date} className="flex justify-between gap-3 py-2">
                <span>{shift.title}<span className="block text-(--muted)">{shiftDate(shift.date)}</span></span>
                <span className="shrink-0">{shift.hours} h</span>
              </li>
            ))}
          </ul>
        </DashboardSection>
      </div>
    </DashboardLayout>
  );
}
