import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout, { DashboardSection } from '../components/DashboardLayout.jsx';
import ListingDetails from '../components/ListingDetails.jsx';
import OpportunityForm from '../components/OpportunityForm.jsx';
import ShiftCalendar from '../components/ShiftCalendar.jsx';
import { useDashboardDemo } from '../context/DashboardDemoContext.jsx';
import { completedShifts, initialDemo, isClosed, isConfirmed, listingStatus, shiftDate, shiftTime } from '../data/dashboardDemo.js';

const button = 'min-h-11 cursor-pointer rounded-md border border-(--line) bg-(--bg) px-3 text-sm font-semibold text-(--text) hover:border-(--primary) focus-visible:outline-2 focus-visible:outline-(--primary) disabled:cursor-default disabled:opacity-60';
const primaryButton = 'min-h-11 cursor-pointer rounded-md border-0 bg-(--primary) px-4 text-sm font-semibold text-white hover:bg-(--primary-strong) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--primary) dark:text-(--bg)';
const listingTabs = ['My shifts', 'My opportunities', 'Completed'];
const sections = [['overview', 'Overview'], ['listings', 'Listings'], ['applications', 'Applications'], ['schedule', 'Schedule']];

function ListingList({ items, signups, programs, onAction }) {
  if (!items.length) return <p className="mb-0 text-(--muted)">Nothing added yet.</p>;

  return (
    <ul className="m-0 list-none divide-y divide-(--aid-rule) p-0">
      {items.map(item => {
        const participants = signups.filter(signup => signup.opportunityId === item.id && isConfirmed(signup));
        const parent = programs.find(program => program.id === item.parentId);
        const status = listingStatus(item, signups);
        return (
          <li key={item.id} className="py-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0 break-words">
                <h3 className="mb-1 text-base font-semibold">{item.title}</h3>
                {item.date && <p className="mb-0 text-sm text-(--muted)">{shiftDate(item.date)} · {shiftTime(item)}</p>}
                {parent && <p className="mb-0 text-sm text-(--muted)">Part of {parent.title}</p>}
              </div>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="rounded-full bg-(--nav-panel) px-2.5 py-1 font-semibold text-(--primary)">{status}</span>
                <span className="tabular-nums text-(--muted)">{participants.length} / {item.capacity} spots filled</span>
              </div>
            </div>
            <ListingDetails listing={item} signups={signups} parent={parent} />
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
          </li>
        );
      })}
    </ul>
  );
}

export default function OrganizationDashboard() {
  const { opportunities, signups, organization, dispatch } = useDashboardDemo();
  const [action, setAction] = useState(null);
  const [listingTab, setListingTab] = useState(listingTabs[0]);
  const [showAll, setShowAll] = useState(false);
  const [listingNotice, setListingNotice] = useState('');
  const [reviewNotice, setReviewNotice] = useState('');
  const dialog = useRef(null);
  const editor = useRef(null);
  const returnFocus = useRef(null);
  useEffect(() => {
    if (action?.mode === 'cancel' && !dialog.current.open) dialog.current.showModal();
    else if (action) editor.current?.focus();
  }, [action]);

  function openAction(next) {
    returnFocus.current = document.activeElement;
    setAction(next);
  }

  function closeEditor() {
    setAction(null);
    returnFocus.current?.focus();
  }

  const owned = opportunities.filter(item => item.organizationId === organization.id);
  const shifts = owned.filter(item => item.kind === 'shift')
    .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime));
  const upcoming = shifts.filter(item => !isClosed(item));
  const programs = owned.filter(item => item.kind === 'opportunity');
  const listed = listingTab === 'My shifts' ? shifts : listingTab === 'My opportunities' ? programs : completedShifts;
  const visible = showAll ? listed : listed.slice(0, 5);
  const applications = signups.filter(signup => signup.status !== 'Reserved' && owned.some(item => item.id === signup.opportunityId));
  const pending = applications.filter(signup => signup.status === 'Pending' && !isClosed(owned.find(item => item.id === signup.opportunityId)));
  const reviewed = applications.filter(signup => signup.status === 'Accepted' || signup.status === 'Declined');
  const recordedHours = completedShifts.reduce((total, shift) => total + shift.hours, 0);
  const metrics = [
    { label: 'Applications to review', value: pending.length, href: '#applications', detail: `${pending.length} ${pending.length === 1 ? 'application' : 'applications'} to review` },
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
    setShowAll(true);
    setListingNotice(message);
    if (dialog.current.open) dialog.current.close();
    setAction(null);
    document.getElementById('listings')?.focus();
  }

  function cancelShift() {
    if (isClosed(action.item)) {
      finishListing(`Signup has already closed for ${action.item.title}.`);
      return;
    }
    dispatch({ type: 'cancelShift', opportunityId: action.item.id });
    finishListing(`${action.item.title} was cancelled.`);
  }

  return (
    <DashboardLayout title="Organization dashboard" profile={organization} otherRole="Volunteer" sections={sections} metrics={metrics}
      action={
        <div className="flex flex-wrap gap-2">
          <button type="button" className={primaryButton} onClick={() => openAction({ mode: 'shift' })}>Add shift</button>
          <button type="button" className={button} onClick={() => openAction({ mode: 'opportunity' })}>Add opportunity</button>
        </div>
      }>

      {action && action.mode !== 'cancel' && (
        <section ref={editor} tabIndex={-1} aria-labelledby="listing-editor-title" className="mb-5 scroll-mt-32 rounded-xl border border-(--line) bg-(--panel) p-4 sm:p-5 lg:scroll-mt-20">
          <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 id="listing-editor-title" className="mb-0 font-display text-xl">{dialogTitle}</h2>
            <button type="button" className={button} onClick={closeEditor}>Close form</button>
          </header>
          <OpportunityForm key={action.item?.id ?? action.mode} kind={action.item?.kind ?? action.mode} listing={action.item}
            onCancel={closeEditor}
            onSave={title => finishListing(action.mode === 'edit' ? `${title} was updated.` : `${title} is now in the demo catalog.`)} />
        </section>
      )}
      <div className="grid gap-5">
        <div className="min-w-0">
          <DashboardSection id="listings" title="Manage listings">
            <p role="status" className={listingNotice ? 'mb-3 text-sm font-semibold text-(--primary)' : 'sr-only'}>{listingNotice}</p>
            <div role="group" aria-label="Choose a listing view" className="mb-3 flex flex-wrap gap-2">
              {listingTabs.map(tab => (
                <button key={tab} type="button" aria-pressed={listingTab === tab}
                  className={button + ' aria-pressed:border-(--primary) aria-pressed:bg-(--nav-panel) aria-pressed:text-(--primary)'}
                  onClick={() => { setListingTab(tab); setShowAll(false); }}>{tab}</button>
              ))}
            </div>
            {listingTab === 'Completed' ? (
              <ul className="m-0 list-none divide-y divide-(--aid-rule) p-0 text-sm">
                {visible.map(shift => (
                  <li key={shift.date} className="flex flex-wrap justify-between gap-2 py-4">
                    <div><strong>{shift.title}</strong><p className="mb-0 text-(--muted)">{shiftDate(shift.date)} · {initialDemo.volunteer.name} attended</p></div>
                    <span className="shrink-0 tabular-nums">{shift.hours} h</span>
                  </li>
                ))}
              </ul>
            ) : <ListingList key={listingTab} items={visible} signups={signups} programs={programs} onAction={openAction} />}
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
              {listed.length > 5 && <button type="button" className={button} aria-expanded={showAll} onClick={() => setShowAll(current => !current)}>{showAll ? 'Show fewer' : `View all (${listed.length})`}</button>}
              <Link className="text-(--primary) underline underline-offset-4" to="/opportunities">View demo catalog</Link>
            </div>
          </DashboardSection>
        </div>
        <DashboardSection id="applications" title="Applications to review">
          <p role="status" className={reviewNotice ? 'mb-3 text-sm font-semibold text-(--primary)' : 'sr-only'}>{reviewNotice}</p>
          {pending.length === 0 && <p className="mb-0 text-sm text-(--muted)">You’re caught up. New applications will appear here.</p>}
          {owned.map(item => {
            const applicants = pending.filter(signup => signup.opportunityId === item.id);
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
          {reviewed.length === 0 ? <p className="m-0 text-sm text-(--muted)">Decisions will appear here.</p> : (
            <ul className="m-0 list-none divide-y divide-(--aid-rule) p-0">
              {reviewed.map(signup => {
                const item = owned.find(listing => listing.id === signup.opportunityId);
                return (
                  <li key={`${signup.opportunityId}-${signup.volunteerId}`} className="flex flex-wrap items-start justify-between gap-2 py-2 text-sm">
                    <span className="min-w-0 break-words"><strong className="block">{signup.volunteer}</strong><span className="text-(--muted)">{item.title}</span></span>
                    <span className="rounded-full bg-(--nav-panel) px-2.5 py-0.5 font-semibold">{signup.status}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </DashboardSection>

        <div id="schedule" tabIndex={-1} className="min-w-0 scroll-mt-32 lg:scroll-mt-20">
          <ShiftCalendar shifts={upcoming} initialDate={upcoming[0]?.date} />
        </div>
      </div>

      <dialog ref={dialog} aria-labelledby="listing-dialog-title"
        className="fixed inset-0 m-auto max-h-[85dvh] w-[calc(100%_-_2rem)] max-w-xl overflow-y-auto rounded-xl border border-(--line) bg-(--panel) p-5 text-(--text) backdrop:bg-black/60 sm:p-6"
        onClose={() => setAction(current => current?.mode === 'cancel' ? null : current)}>
        <header className="mb-4 flex items-center justify-between gap-4">
          <h2 id="listing-dialog-title" className="mb-0 font-display text-xl">Cancel shift</h2>
          <button type="button" className={button} onClick={() => dialog.current.close()}>Keep shift</button>
        </header>
        {action?.mode === 'cancel' && (
          <>
            <p className="mb-4 break-words">Cancel <strong>{action.item.title}</strong>? This closes signup and removes the shift from volunteers’ upcoming schedules.</p>
            <button type="button" className={primaryButton} onClick={cancelShift}>Confirm cancellation</button>
          </>
        )}
      </dialog>
    </DashboardLayout>
  );
}
