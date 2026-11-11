import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout, { DashboardSection, useDashboardView } from '../components/DashboardLayout.jsx';
import { Badge, EmptyState, Modal } from '../components/DashboardUI.jsx';
import ShiftCalendar from '../components/ShiftCalendar.jsx';
import VolunteerProfile, { VolunteerShiftBoard } from '../components/VolunteerProfile.jsx';
import { useDashboardDemo } from '../context/DashboardDemoContext.jsx';
import { completedShifts, initialDemo, isClosed, isConfirmed, shiftDate, shiftTime } from '../data/dashboardDemo.js';

const textAction = 'min-h-11 cursor-pointer rounded-md border border-(--line) bg-(--panel) px-3 text-sm font-semibold text-(--text) hover:border-(--primary) focus-visible:outline-2 focus-visible:outline-(--primary)';
const sections = [['overview', 'Overview'], ['my-applications', 'Applications'], ['my-shifts', 'My shifts'], ['find-shifts', 'Find shifts'], ['hours', 'Hours & planning']];
const applicationCopy = {
  Pending: 'Waiting for the organizer to review your application.',
  Accepted: 'Your place is confirmed.',
  Declined: 'The organizer declined this application.',
  Cancelled: 'The organizer cancelled this shift.',
  Closed: 'Signup closed before a decision was made.',
};

export default function VolunteerDashboard() {
  const { opportunities, signups, volunteer, plannedByVolunteer, hoursByVolunteer, dispatch } = useDashboardDemo();
  const view = useDashboardView(sections);
  const [notice, setNotice] = useState('');
  const [reservationToCancel, setReservationToCancel] = useState(null);
  const [appSearch, setAppSearch] = useState('');
  const [appStatus, setAppStatus] = useState('All');
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
  const visibleApplications = applications.flatMap(({ opportunityId, status }) => {
    const listing = opportunities.find(item => item.id === opportunityId);
    if (!listing) return [];
    const label = listing.cancelled ? 'Cancelled' : status === 'Pending' && isClosed(listing) ? 'Closed' : status;
    if (view === 'my-applications' && ((appStatus !== 'All' && label !== appStatus) ||
      !listing.title.toLowerCase().includes(appSearch.trim().toLowerCase()))) return [];
    return [{ listing, label }];
  });
  const plannedIds = plannedByVolunteer[volunteer.id] ?? [];
  const next = upcoming[0];
  const metrics = [
    { label: 'Confirmed shifts', value: upcoming.length, href: '#next-shift', detail: 'Next shift', badge: upcoming.length ? 'Confirmed' : undefined },
    { label: 'Pending applications', value: pendingApplications.length, href: '#my-applications', detail: 'My applications', badge: pendingApplications.length ? 'Pending' : undefined },
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

  const applicationsCard = (
    <DashboardSection id="my-applications" title="My applications">
      {view === 'my-applications' && <div className="mb-3 flex flex-wrap gap-3">
        <label className="grid gap-1 text-sm">Search applications<input className={textAction} type="search" value={appSearch} onChange={event => setAppSearch(event.target.value)} /></label>
        <label className="grid gap-1 text-sm">Status<select className={textAction} value={appStatus} onChange={event => setAppStatus(event.target.value)}>
          {['All', 'Pending', 'Accepted', 'Declined', 'Cancelled', 'Closed'].map(status => <option key={status}>{status}</option>)}
        </select></label>
      </div>}
      {visibleApplications.length === 0 ? <EmptyState action={<Link to="/volunteer/dashboard?section=find-shifts" className="mt-2 inline-block font-semibold text-(--primary) underline">Find a shift</Link>}>
        {applications.length ? 'No applications match these filters.' : 'Applications appear here after you apply for a shift.'}
      </EmptyState> : (
        <ul className="m-0 list-none divide-y divide-(--aid-rule) p-0">
          {visibleApplications.map(({ listing, label }) => {
            return (
              <li key={listing.id} className="py-3 first:pt-0 last:pb-0">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <strong className="min-w-0 break-words">{listing.title}</strong>
                  <Badge label={label} />
                </div>
                <p className="mt-1 mb-0 text-sm text-(--muted)">{applicationCopy[label]}</p>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <Link
                    to={`/opportunities/${listing.id}?from=dashboard&section=my-applications`}
                    className="inline-flex min-h-11 items-center font-semibold text-(--primary) underline underline-offset-4"
                  >
                    View details
                  </Link>

                  {label === 'Pending' && (
                    <button
                      type="button"
                      aria-label={`Withdraw application for ${listing.title}`}
                      className="min-h-11 cursor-pointer rounded-md border border-red-600 bg-(--panel) px-3 text-sm font-semibold text-red-600 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-red-600 dark:border-red-400 dark:text-red-400 dark:hover:bg-red-950/30"
                      onClick={() =>
                        setReservationToCancel({
                          ...listing,
                          signupStatus: 'Pending',
                        })
                      }
                    >
                      Withdraw application
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </DashboardSection>
  );
  const nextCard = (
    <DashboardSection id="next-shift" title="Next confirmed shift">
      {next ? (
        <>
          <h3 className="mb-1 text-base font-bold break-words">
            {next.title}
          </h3>
          <p className="mb-1 text-sm text-(--muted)">{shiftDate(next.date)} · {shiftTime(next)}</p>
          <p className="mb-2 text-sm break-words">{next.location} · {next.organizer}</p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <Link
              to={`/opportunities/${next.id}?from=dashboard&section=my-shifts`}
              className="font-semibold text-(--primary) underline underline-offset-4"
            >
              View details
            </Link>

            <button
              type="button"
              className="min-h-11 cursor-pointer rounded-md border border-red-600 bg-(--panel) px-3 text-sm font-semibold text-red-600 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-red-600 dark:border-red-400 dark:text-red-400 dark:hover:bg-red-950/30"
              onClick={() => setReservationToCancel(next)}
            >
              Cancel reservation
            </button>
          </div>
        </>
      ) : (
        <EmptyState action={<Link to="/volunteer/dashboard?section=find-shifts" className="mt-2 inline-block font-semibold text-(--primary) underline">Find a shift</Link>}>You have no upcoming confirmed shifts.</EmptyState>
      )}
    </DashboardSection>
  );
  const scheduleCards = (
    <>
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
        {history.length === 0 && <EmptyState action={<Link to="/volunteer/dashboard?section=hours" className="mt-2 inline-block font-semibold text-(--primary) underline">Log volunteer time</Link>}>Completed shifts will appear here.</EmptyState>}
        <ul className="m-0 list-none divide-y divide-(--line) p-0 text-sm">
          {history.map(shift => (
            <li key={shift.date} className="flex justify-between gap-3 py-2">
              <span>{shift.title}<span className="block text-(--muted)">{shiftDate(shift.date)}</span></span>
              <Badge label={shift.hours + ' h'} />
            </li>
          ))}
        </ul>
      </DashboardSection>
    </>
  );

  return (
    <DashboardLayout title="Volunteer dashboard" profile={volunteer} otherRole="Organization" sections={sections} metrics={metrics}
      action={<Link className="rounded-lg bg-(--primary) px-4 py-3 text-sm font-semibold text-(--bg) hover:underline" to="/volunteer/dashboard?section=find-shifts">Find a shift</Link>}>
      <p role="status" className={notice ? 'mb-4 text-sm text-(--primary)' : 'sr-only'}>{notice}</p>
      {view === 'overview' && (
        <div className="grid grid-cols-12 items-start gap-6">
          <div className="col-span-full grid min-w-0 gap-6 lg:col-span-8">{nextCard}{applicationsCard}</div>
          <div className="col-span-full grid min-w-0 gap-6 lg:col-span-4">{scheduleCards}</div>
        </div>
      )}
      {view === 'my-applications' && applicationsCard}
      {view === 'my-shifts' && <div className="grid gap-6">{nextCard}{scheduleCards}</div>}
      {view === 'find-shifts' && (
        <VolunteerShiftBoard
          shifts={shifts}
          signups={signups}
          mine={mine}
          onChange={(listing, type, status) => {
            if (type === 'leave') {
              setReservationToCancel({ ...listing, signupStatus: status });
            } else {
              changeSignup(listing, type, status);
            }
          }}
        />
      )}
      {view === 'hours' && <VolunteerProfile key={volunteer.id} shifts={shifts} history={history} entries={entries} plannedIds={plannedIds} dispatch={dispatch} />}
      {reservationToCancel && (
        <Modal
          title={
            reservationToCancel.signupStatus === 'Pending'
              ? "Withdraw application"
              : "Cancel reservation"
          }
          onClose={() => setReservationToCancel(null)}
        >
          <p className="mb-4">
            Are you sure you want to{" "}
            {reservationToCancel.signupStatus === 'Pending'
              ? "withdraw your application"
              : "cancel your reservation"}{" "}
            for <strong>{reservationToCancel.title}</strong>?
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className={textAction}
              onClick={() => setReservationToCancel(null)}
            >
              {reservationToCancel.signupStatus === 'Pending'
                ? "Keep application"
                : "Keep reservation"}
            </button>

            <button
              type="button"
              className="min-h-11 cursor-pointer rounded-md bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-700"
              onClick={() => {
                changeSignup(
                  reservationToCancel,
                  'leave',
                  reservationToCancel.signupStatus
                );
                setReservationToCancel(null);
              }}
            >
              {reservationToCancel.signupStatus === 'Pending'
                ? "Confirm withdrawal"
                : "Confirm cancellation"}
            </button>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
}
