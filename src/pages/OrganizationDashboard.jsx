import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout, { DashboardSection, useDashboardView } from '../components/DashboardLayout.jsx';
import { Badge, EmptyState, Modal, ProgressBar, Tabs } from '../components/DashboardUI.jsx';
import OpportunityForm from '../components/OpportunityForm.jsx';
import ShiftCalendar from '../components/ShiftCalendar.jsx';
import { useDashboardDemo } from '../context/DashboardDemoContext.jsx';
import { completedShifts, initialDemo, isClosed, isConfirmed, listingStatus, shiftDate, shiftTime } from '../data/dashboardDemo.js';

const button = 'min-h-11 cursor-pointer rounded-md border border-(--line) bg-(--bg) px-3 text-sm font-semibold text-(--text) hover:border-(--primary) focus-visible:outline-2 focus-visible:outline-(--primary) disabled:cursor-default disabled:opacity-60';
const primaryButton = 'min-h-11 cursor-pointer rounded-md border-0 bg-(--primary) px-4 text-sm font-semibold text-white hover:bg-(--primary-strong) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--primary) dark:text-(--bg)';
const listingTabs = ['My shifts', 'My opportunities', 'Completed'];
const sections = [['overview', 'Overview'], ['listings', 'Listings'], ['applications', 'Applications'], ['schedule', 'Schedule']];

function ShiftRow({ item, signups, programs, onAction }) {
  const participants = signups.filter(signup => signup.opportunityId === item.id && isConfirmed(signup));
  const parent = programs.find(program => program.id === item.parentId);
  const availability = listingStatus(item, signups);
  const status = availability === 'Open' && item.signup === 'approval' ? 'Approval required' : availability;
  return (
    <tr className="grid gap-3 border-t border-(--line) py-4 sm:table-row">
      <td className="min-w-0 break-words align-top sm:py-4 sm:pr-4">
        <h3 className="mb-1 text-base font-semibold">
          <Link
            to={`/opportunities/${item.id}?from=dashboard&role=organizations`}
            className="text-(--text) hover:text-(--primary) hover:underline focus-visible:underline"
          >
            {item.title}
          </Link>
        </h3>
        {item.date && <p className="mb-0 text-sm text-(--muted)">{shiftDate(item.date)} · {shiftTime(item)}</p>}
        {parent && <p className="mb-0 text-sm text-(--muted)">Part of {parent.title}</p>}

      </td>
      <td className="align-top sm:py-4 sm:pr-4">
        <div className="grid min-w-24 gap-1 text-sm">
          <div className="flex items-center gap-2"><Badge label={status} /><span className="tabular-nums text-(--muted)">{participants.length} / {item.capacity}</span></div>
          <ProgressBar value={participants.length} max={item.capacity} label={`Confirmed spots for ${item.title}`} />
        </div>
      </td>
      <td className="align-top sm:py-4">
        <details className="text-sm">
          <summary className="w-fit cursor-pointer py-2 text-(--primary) underline underline-offset-4">Participants<span className="sr-only"> for {item.title}</span></summary>
          {participants.length ? (
            <ul className="mb-2 pl-5">
              {participants.map(signup => <li key={signup.volunteerId}>{signup.volunteer}</li>)}
            </ul>
          ) : <p className="mb-2 text-(--muted)">No confirmed participants yet.</p>}
        </details>
        {item.kind === 'shift' && !isClosed(item) && (
          <div className="mt-2 flex flex-wrap gap-2">
            <button type="button" className={button} aria-label={`Edit shift: ${item.title}`} onClick={() => onAction({ mode: 'edit', item })}>Edit shift</button>
            <button type="button" className={button} aria-label={`Cancel shift: ${item.title}`} onClick={() => onAction({ mode: 'cancel', item })}>Cancel shift</button>
          </div>
        )}
      </td>
    </tr>
  );
}

function ListingList({ items, signups, programs, onAction }) {
  if (!items.length) return <EmptyState>No listings match this view.</EmptyState>;

  return (
    <table className="block w-full border-collapse text-left sm:table">
      <thead className="hidden text-sm text-(--muted) sm:table-header-group">
        <tr><th scope="col" className="pb-3 font-medium">Listing</th><th scope="col" className="pb-3 font-medium">Status &amp; capacity</th><th scope="col" className="pb-3 font-medium">Actions</th></tr>
      </thead>
      <tbody className="block divide-y divide-(--line) sm:table-row-group">
        {items.map(item => <ShiftRow key={item.id} item={item} signups={signups} programs={programs} onAction={onAction} />)}
      </tbody>
    </table>
  );
}

export default function OrganizationDashboard() {
  const { opportunities, signups, organization, dispatch } = useDashboardDemo();
  const view = useDashboardView(sections);
  const [action, setAction] = useState(null);
  const [listingTab, setListingTab] = useState(listingTabs[0]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [appSearch, setAppSearch] = useState('');
  const [appStatus, setAppStatus] = useState('All');
  const [listingNotice, setListingNotice] = useState('');
  const [reviewNotice, setReviewNotice] = useState('');
  const owned = opportunities.filter(item => item.organizationId === organization.id);
  const history = organization.id === initialDemo.organization.id ? completedShifts : [];
  const shifts = owned.filter(item => item.kind === 'shift')
    .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime));
  const upcoming = shifts.filter(item => !isClosed(item));
  const programs = owned.filter(item => item.kind === 'opportunity');
  const listed = listingTab === 'My shifts' ? shifts : listingTab === 'My opportunities' ? programs : history;
  const visible = view === 'listings' ? listed.filter(item => item.title.toLowerCase().includes(search.trim().toLowerCase()) &&
    (statusFilter === 'All' || (listingTab !== 'Completed' && listingStatus(item, signups) === statusFilter))) : listed.slice(0, 5);
  const applications = signups.filter(signup => signup.status !== 'Reserved' && owned.some(item => item.id === signup.opportunityId));
  const pending = applications.filter(signup => signup.status === 'Pending' && !isClosed(owned.find(item => item.id === signup.opportunityId)));
  const reviewed = applications.filter(signup => signup.status === 'Accepted' || signup.status === 'Declined');
  const matchesApplication = signup => view !== 'applications' ||
    ((appStatus === 'All' || signup.status === appStatus) &&
      `${signup.volunteer} ${owned.find(item => item.id === signup.opportunityId)?.title}`.toLowerCase().includes(appSearch.trim().toLowerCase()));
  const visiblePending = pending.filter(matchesApplication);
  const visibleReviewed = reviewed.filter(matchesApplication);
  const recordedHours = history.reduce((total, shift) => total + shift.hours, 0);
  const metrics = [
    { label: 'Applications to review', value: pending.length, href: '#applications', detail: 'Review applications', badge: pending.length ? 'Pending' : undefined },
    { label: 'Scheduled shifts', value: upcoming.length, href: '#schedule', detail: 'View schedule' },
    { label: 'Volunteer hours logged', value: recordedHours, href: '#listings', detail: 'Manage listings' },
    { label: 'Open listings', value: owned.filter(item => listingStatus(item, signups) === 'Open').length, href: '#listings', detail: 'View listings' },
  ];
  const dialogTitle = { shift: 'Add a shift', opportunity: 'Add an opportunity', edit: 'Edit shift', cancel: 'Cancel shift' }[action?.mode];

  function review(event, signup, status) {
    const item = owned.find(listing => listing.id === signup.opportunityId);
    if (isClosed(item) || (status === 'Accepted' && listingStatus(item, signups) === 'Full')) {
      setReviewNotice(`This application can no longer be ${status.toLowerCase()}.`);
      return;
    }
    event.currentTarget.closest('section').focus({ preventScroll: true });
    dispatch({ type: 'review', opportunityId: signup.opportunityId, volunteerId: signup.volunteerId, status });
    setReviewNotice(`${status} ${signup.volunteer} for ${item.title}.`);
  }

  function finishListing(message) {
    if (action.mode === 'opportunity') setListingTab('My opportunities');
    else setListingTab('My shifts');
    setListingNotice(message);
    setAction(null);
  }

  function cancelShift() {
    if (isClosed(action.item)) {
      finishListing(`Signup has already closed for ${action.item.title}.`);
      return;
    }
    dispatch({ type: 'cancelShift', opportunityId: action.item.id });
    finishListing(`${action.item.title} was cancelled.`);
  }

  const listingsCard = (
    <DashboardSection id="listings" title="Manage listings" actions={view === 'listings' && <div className="flex flex-wrap gap-2">
      <button type="button" className={primaryButton} onClick={() => setAction({ mode: 'shift' })}>Add shift</button>
      <button type="button" className={button} onClick={() => setAction({ mode: 'opportunity' })}>Add opportunity</button>
    </div>}>
      <p role="status" className={listingNotice ? 'mb-3 text-sm font-semibold text-(--primary)' : 'sr-only'}>{listingNotice}</p>
      <Tabs label="Choose a listing view" items={listingTabs} current={listingTab} onChange={tab => { setListingTab(tab); setStatusFilter('All'); }} />
      {view === 'listings' && <div className="mb-3 flex flex-wrap gap-3">
        <label className="grid gap-1 text-sm">Search listings
          <input className={button + ' w-full'} type="search" value={search} onChange={event => setSearch(event.target.value)} />
        </label>
        {listingTab !== 'Completed' && <label className="grid gap-1 text-sm">Status
          <select className={button} value={statusFilter} onChange={event => setStatusFilter(event.target.value)}>
            {['All', 'Open', 'Full', 'Closed', 'Cancelled'].map(status => <option key={status}>{status}</option>)}
          </select>
        </label>}
      </div>}
      {listingTab === 'Completed' ? (
        visible.length ? <ul className="m-0 list-none divide-y divide-(--aid-rule) p-0 text-sm">
          {visible.map((shift, index) => (
            <li
              key={`${shift.date}-${index}`}
              className="flex flex-wrap items-center justify-between gap-3 py-4"
            >
              <div>
                <strong className="block">{shift.title}</strong>
                <p className="mb-0 text-(--muted)">
                  {shiftDate(shift.date)}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <span className="tabular-nums">{shift.hours} h</span>

                <Link
                  to={`/opportunities/${shift.id}?from=dashboard&role=organizations`}
                  className="font-semibold text-(--primary) underline underline-offset-4"
                >
                  View details
                </Link>
              </div>
            </li>
          ))}
        </ul> : <EmptyState>{history.length ? 'No completed shifts match your search.' : 'No completed shifts yet.'}</EmptyState>
      ) : <ListingList key={listingTab} items={visible} signups={signups} programs={programs} onAction={setAction} />}
      <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
        {view === 'overview' && listed.length > 5 && <Link to="/organizations/dashboard?section=listings" className={button}>View all ({listed.length})</Link>}
        <Link className="text-(--primary) underline underline-offset-4" to="/opportunities">View demo catalog</Link>
      </div>
    </DashboardSection>
  );
  const applicationsCard = (
    <DashboardSection id="applications" title="Applications to review">
      {view === 'applications' && <div className="mb-3 flex flex-wrap gap-3">
        <label className="grid gap-1 text-sm">Search applications<input className={button} type="search" value={appSearch} onChange={event => setAppSearch(event.target.value)} /></label>
        <label className="grid gap-1 text-sm">Status<select className={button} value={appStatus} onChange={event => setAppStatus(event.target.value)}>
          {['All', 'Pending', 'Accepted', 'Declined'].map(status => <option key={status}>{status}</option>)}
        </select></label>
      </div>}
      <p role="status" className={reviewNotice ? 'mb-3 text-sm font-semibold text-(--primary)' : 'sr-only'}>{reviewNotice}</p>
      {visiblePending.length === 0 && <EmptyState action={<Link to="/organizations/dashboard?section=listings" className="mt-2 inline-block font-semibold text-(--primary) underline">View listings</Link>}>
        {pending.length ? 'No pending applications match these filters.' : 'No applications to review yet.'}
      </EmptyState>}
      {owned.map(item => {
        const applicants = visiblePending.filter(signup => signup.opportunityId === item.id);
        if (!applicants.length) return null;
        const full = listingStatus(item, signups) === 'Full';
        return (
          <div key={item.id} className="border-b border-(--aid-rule) py-3 first:pt-0">
            <h3 className="mb-1 text-base font-bold break-words">{item.title}</h3>
            {full && <p className="mb-1 text-sm text-(--muted)">All spots are filled.</p>}
            <ul className="m-0 list-none p-0">
              {applicants.map(signup => (
                <li key={signup.volunteerId} className="flex flex-wrap items-center justify-between gap-2 py-2">
                  <span className="min-w-0 break-words">{signup.volunteer}</span>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" className={button} disabled={full} aria-label={`Accept ${signup.volunteer} for ${item.title}`} onClick={event => review(event, signup, 'Accepted')}>Accept</button>
                    <button type="button" className={button} aria-label={`Decline ${signup.volunteer} for ${item.title}`} onClick={event => review(event, signup, 'Declined')}>Decline</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
      <h3 className="mt-4 mb-2 text-base font-bold">Reviewed</h3>
      {visibleReviewed.length === 0 ? <p className="m-0 text-sm text-(--muted)">{reviewed.length ? 'No decisions match these filters.' : 'Decisions will appear here.'}</p> : (
        <ul className="m-0 list-none divide-y divide-(--aid-rule) p-0">
          {visibleReviewed.map(signup => {
            const item = owned.find(listing => listing.id === signup.opportunityId);
            return (
              <li key={`${signup.opportunityId}-${signup.volunteerId}`} className="flex flex-wrap items-start justify-between gap-2 py-2 text-sm">
                <span className="min-w-0 break-words"><strong className="block">{signup.volunteer}</strong><span className="text-(--muted)">{item.title}</span></span>
                <Badge label={signup.status} />
              </li>
            );
          })}
        </ul>
      )}
    </DashboardSection>
  );
  const calendar = <ShiftCalendar shifts={upcoming} initialDate={upcoming[0]?.date} />;
  const monthlyHours = Object.entries(history.reduce((months, shift) => {
    months[shift.month] = (months[shift.month] ?? 0) + shift.hours;
    return months;
  }, {}));
  const busiestMonth = Math.max(1, ...monthlyHours.map(([, hours]) => hours));
  return (
    <DashboardLayout title="Organization dashboard" profile={organization} otherRole="Volunteer" sections={sections} metrics={metrics}
      action={
        <div className="flex flex-wrap gap-2">
          <button type="button" className={primaryButton} aria-haspopup="dialog" onClick={() => setAction({ mode: 'shift' })}>Add shift</button>
          <button type="button" className={button} aria-haspopup="dialog" onClick={() => setAction({ mode: 'opportunity' })}>Add opportunity</button>
        </div>
      }>
      {view === 'overview' && (
        <div className="grid grid-cols-12 items-start gap-6">
          <div className="col-span-full min-w-0 lg:col-span-8">{listingsCard}</div>
          <div className="col-span-full grid min-w-0 gap-6 lg:col-span-4">
            {applicationsCard}
            {calendar}
            <DashboardSection title="Volunteer activity">
              <p className="mb-3 text-sm text-(--muted)">Logged hours by month</p>
              {monthlyHours.length ? <ul className="m-0 grid list-none gap-3 p-0">
                {monthlyHours.map(([month, hours]) => <li key={month} className="grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-2 text-sm">
                  <span>{month}</span><ProgressBar value={hours} max={busiestMonth} label={month + ' logged hours'} /><strong>{hours} h</strong>
                </li>)}
              </ul> : <EmptyState>No completed shift hours for this organization yet.</EmptyState>}
            </DashboardSection>
          </div>
        </div>
      )}
      {view === 'listings' && listingsCard}
      {view === 'applications' && applicationsCard}
      {view === 'schedule' && calendar}
      {action && <Modal key={action.item?.id ?? action.mode} title={dialogTitle} onClose={() => setAction(null)}>
        {action.mode === 'cancel' ? <>
          <p className="mb-4 break-words">Cancel <strong>{action.item.title}</strong>? This closes signup and removes the shift from volunteers’ upcoming schedules.</p>
          <div className="flex flex-wrap gap-3">
            <button type="button" className={button} onClick={() => setAction(null)}>Keep shift</button>
            <button type="button" className={primaryButton} onClick={cancelShift}>Confirm cancellation</button>
          </div>
        </> : <OpportunityForm kind={action.item?.kind ?? action.mode} listing={action.item}
          onCancel={() => setAction(null)}
          onSave={title => finishListing(action.mode === 'edit' ? `${title} was updated.` : `${title} is now in the demo catalog.`)} />}
      </Modal>}
    </DashboardLayout>
  );
}
