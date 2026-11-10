import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, ClipboardList, Clock, LayoutDashboard, ListChecks } from 'lucide-react';
import logo from '../assets/brand/aidconnect-logo.webp';
import { DashboardSection } from '../components/DashboardLayout.jsx';
import OpportunityForm from '../components/OpportunityForm.jsx';
import ShiftCalendar from '../components/ShiftCalendar.jsx';
import { useDashboardDemo } from '../context/DashboardDemoContext.jsx';
import { completedShifts, initialDemo, isConfirmed, shiftDate, shiftTime, spotsFilled } from '../data/dashboardDemo.js';

const reviewButton = 'min-h-11 cursor-pointer rounded-md border border-(--line) bg-(--bg) px-3 text-sm font-semibold text-(--text)';
const listingActions = ['opportunity', 'shift'];
const listingTabs = ['My shifts', 'My opportunities', 'Completed'];
const sections = [
  { id: 'overview', label: 'Overview', Icon: LayoutDashboard },
  { id: 'applications', label: 'Applications', Icon: ClipboardList },
  { id: 'listings', label: 'Listings', Icon: ListChecks },
  { id: 'schedule', label: 'Schedule', Icon: CalendarDays },
];

function ListingList({ items, signups, opportunities }) {
  return (
    <>
      {items.length === 0 ? <p className="mb-0 text-(--muted)">Nothing added yet.</p> : (
        <ul className="m-0 list-none divide-y divide-(--aid-rule) p-0">
          {items.map(item => {
            const participants = signups.filter(signup => signup.opportunityId === item.id && isConfirmed(signup));
            const parent = opportunities.find(opportunity => opportunity.id === item.parentId);
            return (
              <li key={item.id} className="py-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="mb-1 text-base font-semibold break-words">{item.title}</h3>
                    {item.kind === 'shift' && (
                      <p className="mb-0 text-sm text-(--muted)">{shiftDate(item.date)} · {shiftTime(item)}</p>
                    )}
                    {parent && <p className="mb-0 text-sm text-(--muted)">Part of {parent.title}</p>}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span className={item.signup === 'approval'
                      ? 'rounded-full bg-(--bg) px-2.5 py-1 text-(--muted)'
                      : 'rounded-full bg-(--nav-panel) px-2.5 py-1 text-(--primary)'}>
                      {item.signup === 'approval' ? 'Approval required' : 'Open signup'}
                    </span>
                    <span className="tabular-nums" aria-label={`${participants.length} of ${item.capacity} spots filled`}>{participants.length} / {item.capacity}</span>
                  </div>
                </div>
                <details className="mt-2 text-sm">
                  <summary className="w-fit cursor-pointer text-(--primary) underline underline-offset-4">Participants</summary>
                  {participants.length ? (
                    <ul className="mt-2 mb-0 pl-5">
                      {participants.map(signup => <li key={signup.volunteerId}>{signup.volunteer}</li>)}
                    </ul>
                  ) : <p className="mt-2 mb-0 text-(--muted)">No confirmed participants yet.</p>}
                </details>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

export default function OrganizationDashboard() {
  const { opportunities, signups, organization, dispatch } = useDashboardDemo();
  const [creating, setCreating] = useState('');
  const [listingTab, setListingTab] = useState(listingTabs[0]);
  const [showAll, setShowAll] = useState(false);
  const dialog = useRef(null);
  useEffect(() => {
    if (creating && !dialog.current.open) dialog.current.showModal();
  }, [creating]);
  const owned = opportunities.filter(item => item.organizationId === organization.id);
  const shifts = owned.filter(item => item.kind === 'shift')
    .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime));
  const today = new Date().toLocaleDateString('sv-SE');
  const upcoming = shifts.filter(shift => shift.date >= today);
  const programs = owned.filter(item => item.kind === 'opportunity');
  const listed = listingTab === 'My shifts' ? upcoming : listingTab === 'My opportunities' ? programs : completedShifts;
  const visible = showAll ? listed : listed.slice(0, 5);
  const pending = signups.filter(signup =>
    signup.status === 'Pending' && owned.some(item => item.id === signup.opportunityId)
  );
  const recordedHours = completedShifts.reduce((total, shift) => total + shift.hours, 0);
  const metrics = [
    { label: 'Volunteer hours', value: recordedHours, detail: 'Logged in the demo', Icon: Clock },
    { label: 'Scheduled shifts', value: upcoming.length, detail: 'Across your listings', Icon: CalendarDays },
    { label: 'Pending applications', value: pending.length, detail: 'Waiting for review', Icon: ClipboardList },
  ];

  function review(signup, status) {
    dispatch({ type: 'review', opportunityId: signup.opportunityId, volunteerId: signup.volunteerId, status });
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 font-body sm:px-6">
      <div className="grid items-start gap-6 xl:grid-cols-[12rem_minmax(0,1fr)]">
        <aside className="rounded-xl bg-(--aid-surface) p-4">
          <div className="mb-3 flex items-center gap-2 font-bold">
            <img src={logo} alt="" width="28" height="28" className="size-7 rounded-full" />
            AidConnect
          </div>
          <nav aria-label="Organization dashboard" className="flex flex-wrap gap-1 xl:grid">
            {sections.map(({ id, label, Icon }) => (
              <a key={id} href={`#${id}`} className="flex min-h-11 items-center gap-2 rounded-lg px-3 font-medium hover:bg-(--nav-panel) focus-visible:outline-2 focus-visible:outline-(--primary)">
                <Icon size={20} aria-hidden="true" className="shrink-0 text-(--primary)" />
                {label}
              </a>
            ))}
          </nav>
          <Link className="mt-3 inline-block text-sm text-(--muted) underline underline-offset-4" to="/volunteer/dashboard">Volunteer demo</Link>
        </aside>

        <div className="grid min-w-0 gap-6">
          <header id="overview" className="flex scroll-mt-24 flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="mb-2 font-display text-2xl font-bold">Organization overview</h1>
              <p className="mb-0 text-sm text-(--muted)">{organization.name} · Course demo</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {listingActions.map(kind => (
                <button key={kind} type="button" aria-haspopup="dialog" aria-controls="create-listing"
                  className={kind === 'shift'
                    ? 'min-h-11 cursor-pointer rounded-md border-0 bg-(--primary) px-4 text-sm font-semibold text-white hover:bg-(--primary-strong) dark:text-(--bg)'
                    : reviewButton + ' hover:bg-(--panel)'}
                  onClick={() => setCreating(kind)}>
                  Add {kind}
                </button>
              ))}
            </div>
          </header>

          <dl className="m-0 grid gap-4 sm:grid-cols-3">
            {metrics.map(({ label, value, detail, Icon }) => (
              <div key={label} className="rounded-xl bg-(--aid-surface) p-5">
                <dt className="flex items-center gap-2 text-sm font-medium text-(--muted)">
                  <Icon size={20} aria-hidden="true" className="shrink-0 text-(--primary)" />
                  {label}
                </dt>
                <dd className="mt-2 ml-0 font-display text-3xl font-bold tabular-nums">{value}</dd>
                <dd className="mt-1 ml-0 text-sm text-(--muted)">{detail}</dd>
              </div>
            ))}
          </dl>

          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.8fr)_minmax(17rem,1fr)]">
            <div id="listings" className="min-w-0 scroll-mt-24">
              <DashboardSection title={listingTab === 'My shifts' ? 'Upcoming shifts' : listingTab === 'Completed' ? 'Completed shifts' : 'Opportunities'}>
                <div role="group" aria-label="Choose a listing view" className="mb-3 flex flex-wrap gap-2">
                  {listingTabs.map(tab => (
                    <button key={tab} type="button" aria-pressed={listingTab === tab}
                      className={reviewButton + ' aria-pressed:border-(--primary) aria-pressed:bg-(--nav-panel) aria-pressed:text-(--primary)'}
                      onClick={() => {
                        setListingTab(tab);
                        setShowAll(false);
                      }}>
                      {tab}
                    </button>
                  ))}
                </div>
                {listingTab === 'Completed' ? (
                  <ul className="m-0 list-none divide-y divide-(--aid-rule) p-0 text-sm">
                    {visible.map(shift => (
                      <li key={shift.date} className="flex flex-wrap justify-between gap-2 py-4">
                        <div>
                          <strong>{shift.title}</strong>
                          <p className="mb-0 text-(--muted)">{shiftDate(shift.date)} · {initialDemo.volunteer.name} attended</p>
                        </div>
                        <span className="shrink-0 tabular-nums">{shift.hours} h</span>
                      </li>
                    ))}
                  </ul>
                ) : <ListingList key={listingTab} items={visible} signups={signups} opportunities={programs} />}
                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                  {listed.length > 5 && (
                    <button type="button" className={reviewButton} aria-expanded={showAll} onClick={() => setShowAll(current => !current)}>
                      {showAll ? 'Show fewer' : `View all (${listed.length})`}
                    </button>
                  )}
                  <Link className="text-(--primary) underline underline-offset-4" to="/opportunities">View demo catalog</Link>
                  <Link className="text-(--primary) underline underline-offset-4" to="/organizations/opportunities/new">Open full posting form</Link>
                </div>
              </DashboardSection>
            </div>
            <aside aria-label="Schedule and applications" className="grid min-w-0 gap-6">
              <div id="schedule" className="scroll-mt-24">
                <ShiftCalendar shifts={shifts} initialDate={upcoming[0]?.date ?? shifts[0]?.date} />
              </div>
              <div id="applications" className="min-w-0 scroll-mt-24">
              <DashboardSection title="Applications to review">
                <p role="status" className="mb-0 text-sm text-(--muted)">
                  {pending.length ? `Pending applications: ${pending.length}` : 'No applications to review.'}
                </p>
                {owned.map(opportunity => {
                  const applicants = pending.filter(signup => signup.opportunityId === opportunity.id);
                  if (!applicants.length) return null;
                  const full = spotsFilled(signups, opportunity.id) >= opportunity.capacity;

                  return (
                    <div key={opportunity.id} className="mt-4 border-t border-(--aid-rule) pt-4">
                      <h3 className="text-base font-bold">{opportunity.title}</h3>
                      {full && <p className="text-sm text-(--muted)">All spots are filled.</p>}
                      <ul className="m-0 list-none p-0">
                        {applicants.map(signup => (
                          <li key={signup.volunteerId} className="flex flex-wrap items-center justify-between gap-2 py-2">
                            <span>{signup.volunteer}</span>
                            <div className="flex gap-2">
                              <button type="button" className={reviewButton + ' disabled:cursor-default disabled:opacity-60'} disabled={full}
                                aria-label={`Accept ${signup.volunteer} for ${opportunity.title}`} onClick={() => review(signup, 'Accepted')}>Accept</button>
                              <button type="button" className={reviewButton}
                                aria-label={`Decline ${signup.volunteer} for ${opportunity.title}`} onClick={() => review(signup, 'Declined')}>Decline</button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </DashboardSection>
            </div>
            </aside>
          </div>
          <p className="mb-0 text-sm text-(--muted)">Demo changes reset on refresh.</p>
        </div>
      </div>

      <dialog ref={dialog} id="create-listing" aria-labelledby="create-listing-title"
        className="fixed inset-0 m-auto max-h-[85dvh] w-[calc(100%_-_2rem)] max-w-xl overflow-y-auto rounded-xl border border-(--line) bg-(--panel) p-5 text-(--text) backdrop:bg-black/60 sm:p-6"
        onClose={() => setCreating('')}>
        <header className="mb-4 flex items-center justify-between gap-4">
          <h2 id="create-listing-title" className="mb-0 font-display text-xl">{creating === 'shift' ? 'Add a shift' : 'Add an opportunity'}</h2>
          <button type="button" className={reviewButton} onClick={() => dialog.current.close()}>Close</button>
        </header>
        {creating && <OpportunityForm key={creating} kind={creating} />}
      </dialog>
    </div>
  );
}
