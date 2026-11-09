import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout, { DashboardSection } from '../components/DashboardLayout.jsx';
import ListingDetails from '../components/ListingDetails.jsx';
import ShiftCalendar from '../components/ShiftCalendar.jsx';
import VolunteerProfile, { VolunteerShiftBoard } from '../components/VolunteerProfile.jsx';
import { useDashboardDemo } from '../context/DashboardDemoContext.jsx';
import { completedShifts, initialDemo, isClosed, isConfirmed, shiftDate, shiftTime } from '../data/dashboardDemo.js';

const textAction = 'min-h-11 cursor-pointer rounded-md border border-(--line) bg-(--panel) px-3 text-sm font-semibold text-(--text) hover:border-(--primary) focus-visible:outline-2 focus-visible:outline-(--primary)';
const sections = [['next-shift', 'Overview'], ['my-shifts', 'My shifts'], ['my-applications', 'Applications'], ['hours', 'Hours & planning']];
const applicationCopy = {
  Pending: 'Waiting for the organizer to review your application.',
  Accepted: 'Your place is confirmed.',
  Declined: 'The organizer declined this application.',
  Cancelled: 'The organizer cancelled this shift.',
  Closed: 'Signup closed before a decision was made.',
};

export default function VolunteerDashboard() {
  const { opportunities, signups, volunteer, plannedByVolunteer, dispatch } = useDashboardDemo();
  const [notice, setNotice] = useState('');
  const history = volunteer.id === initialDemo.volunteer.id ? completedShifts : [];
  const shifts = opportunities.filter(item => item.kind === 'shift' && !isClosed(item));
  const mine = signups.filter(signup => signup.volunteerId === volunteer.id);
  const confirmed = opportunities.filter(item => mine.some(signup => signup.opportunityId === item.id && isConfirmed(signup)));
  const upcoming = confirmed.filter(item => item.kind === 'shift' && !isClosed(item))
    .sort((first, second) => first.date.localeCompare(second.date) || first.startTime.localeCompare(second.startTime));
  const cancelled = confirmed.filter(item => item.cancelled);
  const programs = confirmed.filter(item => item.kind === 'opportunity');
  const applications = mine.filter(signup => signup.status !== 'Reserved');
  const next = upcoming[0];

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
    <DashboardLayout title="Volunteer dashboard" otherRole="Organization"
      action={<Link className="rounded-md bg-aid-primary px-4 py-3 font-semibold text-white hover:underline" to="/opportunities">Browse opportunities</Link>}>
      <nav aria-label="Volunteer dashboard sections" className="flex flex-wrap gap-x-4 border-b border-(--line) pb-2 lg:col-span-2">
        {sections.map(([id, label]) => <a className="inline-flex min-h-11 items-center text-sm font-semibold text-(--primary) hover:underline" key={id} href={`#${id}`}>{label}</a>)}
      </nav>
      <p role="status" className={notice ? 'm-0 text-sm text-(--primary) lg:col-span-2' : 'sr-only'}>{notice}</p>
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
            <Link to="/opportunities" className="inline-flex min-h-11 items-center font-semibold text-(--primary) underline">Find a shift</Link>
          </>
        )}
      </DashboardSection>
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
      <div id="my-shifts" className="grid min-w-0 scroll-mt-24 gap-6">
        <ShiftCalendar shifts={upcoming} initialDate={upcoming[0]?.date ?? shifts[0]?.date} />
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
      <VolunteerShiftBoard shifts={shifts} signups={signups} mine={mine} onChange={changeSignup} />
      <VolunteerProfile key={volunteer.id} volunteer={volunteer} shifts={shifts} completedShifts={history}
        plannedIds={plannedByVolunteer[volunteer.id] ?? []} dispatch={dispatch} />
    </DashboardLayout>
  );
}
