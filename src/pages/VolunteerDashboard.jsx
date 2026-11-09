import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout, { DashboardSection } from '../components/DashboardLayout.jsx';
import ListingDetails from '../components/ListingDetails.jsx';
import ShiftCalendar from '../components/ShiftCalendar.jsx';
import VolunteerProfile, { VolunteerShiftBoard } from '../components/VolunteerProfile.jsx';
import { useDashboardDemo } from '../context/DashboardDemoContext.jsx';
import { completedShifts, initialDemo, isClosed, isConfirmed, shiftDate, shiftTime } from '../data/dashboardDemo.js';

const textAction = 'min-h-11 cursor-pointer rounded-md border border-(--line) bg-(--panel) px-3 text-sm font-semibold text-(--text) hover:border-(--primary) focus-visible:outline-2 focus-visible:outline-(--primary)';
const sections = [['overview', 'Overview'], ['find-shifts', 'Find shifts'], ['my-applications', 'Applications'], ['my-shifts', 'My shifts'], ['hours', 'Hours & planning']];
const applicationCopy = {
  Pending: 'Waiting for the organizer to review your application.',
  Accepted: 'Your place is confirmed.',
  Declined: 'The organizer declined this application.',
  Cancelled: 'The organizer cancelled this shift.',
  Closed: 'Signup closed before a decision was made.',
};

export default function VolunteerDashboard() {
  const { opportunities, signups, volunteer, plannedByVolunteer, hoursByVolunteer, dispatch } = useDashboardDemo();
  const [notice, setNotice] = useState('');
  const history = volunteer.id === initialDemo.volunteer.id ? completedShifts : [];
  const entries = hoursByVolunteer[volunteer.id] ?? [];
  const shifts = opportunities.filter(item => item.kind === 'shift' && !isClosed(item));
  const mine = signups.filter(signup => signup.volunteerId === volunteer.id);
  const confirmed = opportunities.filter(item => mine.some(signup => signup.opportunityId === item.id && isConfirmed(signup)));
  const upcoming = confirmed.filter(item => item.kind === 'shift' && !isClosed(item))
    .sort((first, second) => first.date.localeCompare(second.date) || first.startTime.localeCompare(second.startTime));
  const cancelled = confirmed.filter(item => item.cancelled);
  const programs = confirmed.filter(item => item.kind === 'opportunity');
  const applications = mine.filter(signup => signup.status !== 'Reserved');
  const pendingApplications = applications.filter(signup =>
    signup.status === 'Pending' && opportunities.some(item => item.id === signup.opportunityId && !isClosed(item))
  );
  const plannedIds = plannedByVolunteer[volunteer.id] ?? [];
  const next = upcoming[0];
  const metrics = [
    { label: 'Confirmed shifts', value: upcoming.length, href: '#next-shift', detail: 'Next shift' },
    { label: 'Pending applications', value: pendingApplications.length, href: '#my-applications', detail: 'My applications' },
    { label: 'Hours logged', value: Number([...history, ...entries].reduce((total, shift) => total + shift.hours, 0).toFixed(2)), href: '#hours', detail: 'Hours & planning' },
    { label: 'Planned shifts', value: shifts.filter(shift => plannedIds.includes(shift.id)).length, href: '#hours', detail: 'Edit plan' },
  ];

  function changeSignup(listing, type, status) {
    if (isClosed(listing)) {
      setNotice(`Signup has closed for ${listing.title}.`);
      return;
    }
    dispatch({ type, opportunityId: listing.id });
    const message = type === 'join'
      ? (listing.signup === 'approval' ? 'Application submitted' : 'Reservation confirmed')
      : (status === 'Pending' ? 'Application withdrawn' : 'Reservation cancelled');
    setNotice(`${message} for ${listing.title}.`);
  }

  function leave(event, listing, status) {
    event.currentTarget.closest('section').focus({ preventScroll: true });
    changeSignup(listing, 'leave', status);
  }

  return (
    <DashboardLayout title="Volunteer dashboard" profile={volunteer} otherRole="Organization" sections={sections} metrics={metrics}
      action={<Link className="rounded-lg bg-(--primary) px-4 py-3 font-semibold text-(--bg) hover:underline" to="/volunteer/dashboard#find-shifts">Find a shift</Link>}>
      <div className="grid gap-5">
      <p role="status" className={notice ? 'm-0 text-sm text-(--primary)' : 'sr-only'}>{notice}</p>
      <VolunteerShiftBoard shifts={shifts} signups={signups} mine={mine} onChange={changeSignup} />
      <DashboardSection id="my-applications" title="My applications">
        {applications.length === 0 ? <p className="mb-0 text-(--muted)">Applications for approval-only opportunities will appear here.</p> : (
          <ul className="m-0 list-none divide-y divide-(--aid-rule) p-0">
            {applications.map(({ opportunityId, status }) => {
              const listing = opportunities.find(item => item.id === opportunityId);
              if (!listing) return null;
              const label = listing.cancelled ? 'Cancelled' : status === 'Pending' && isClosed(listing) ? 'Closed' : status;
              return (
                <li key={opportunityId} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <strong className="min-w-0 break-words">{listing.title}</strong>
                    <span className="rounded-full border border-(--line) px-2.5 py-0.5 text-sm font-semibold">{label}</span>
                  </div>
                  <p className="mt-1 mb-0 text-sm text-(--muted)">{applicationCopy[label]}</p>
                  {label === 'Pending' && (
                    <button type="button" aria-label={`Withdraw application for ${listing.title}`} className={`${textAction} mt-2`} onClick={event => leave(event, listing, 'Pending')}>Withdraw application</button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </DashboardSection>
      <div id="my-shifts" tabIndex={-1} className="grid min-w-0 scroll-mt-32 gap-5 lg:scroll-mt-20">
      <DashboardSection id="next-shift" title="Next confirmed shift">
        {next ? (
          <>
            <h3 className="mb-1 text-base font-bold break-words">{next.title}</h3>
            <p className="mb-1 text-sm text-(--muted)">{shiftDate(next.date)} · {shiftTime(next)}</p>
            <p className="mb-2 text-sm break-words">{next.location} · {next.organizer}</p>
            <ListingDetails key={next.id} listing={next} signups={signups} parent={opportunities.find(item => item.id === next.parentId)} />
            <button type="button" className={`${textAction} mt-2`} onClick={event => leave(event, next)}>Cancel reservation</button>
          </>
        ) : (
          <>
            <p className="mb-2 text-(--muted)">Your next booking will appear here.</p>
            <Link to="/volunteer/dashboard#find-shifts" className="inline-flex min-h-11 items-center font-semibold text-(--primary) underline">Find a shift</Link>
          </>
        )}
      </DashboardSection>
      <div className="grid min-w-0 gap-5 xl:grid-cols-[1.35fr_minmax(0,1fr)]">
        <ShiftCalendar shifts={upcoming} initialDate={upcoming[0]?.date ?? shifts[0]?.date} />
        <div className="grid min-w-0 gap-5">
        {(programs.length > 0 || cancelled.length > 0) && (
          <DashboardSection title="Other bookings">
            <ul className="m-0 list-none divide-y divide-(--aid-rule) p-0">
              {[...programs, ...cancelled].map(item => (
                <li key={item.id} className="py-2 break-words">
                  <strong>{item.title}</strong>
                  <span className="block text-sm text-(--muted)">{item.cancelled ? 'Cancelled by organizer' : `${item.organizer} · ${item.location}`}</span>
                </li>
              ))}
            </ul>
          </DashboardSection>
        )}
        <DashboardSection title="Completed shifts">
          {history.length === 0 && <p className="mb-0 text-sm text-(--muted)">Completed shifts and logged hours will appear here.</p>}
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
      </div>
      </div>
      <VolunteerProfile key={volunteer.id} shifts={shifts} history={history} entries={entries}
        plannedIds={plannedIds} dispatch={dispatch} />
      </div>
    </DashboardLayout>
  );
}
