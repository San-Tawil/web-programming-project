import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout, { DashboardSection } from '../components/DashboardLayout.jsx';
import OpportunityForm from '../components/OpportunityForm.jsx';
import ShiftCalendar from '../components/ShiftCalendar.jsx';
import { useDashboardDemo } from '../context/DashboardDemoContext.jsx';
import { completedShifts, isConfirmed, shiftDate, shiftTime, spotsFilled } from '../data/dashboardDemo.js';

const reviewButton = 'min-h-11 cursor-pointer rounded-md border border-(--line) bg-(--bg) px-3 text-sm font-semibold text-(--text)';
const listingActions = ['opportunity', 'shift'];

function ListingList({ title, items, signups, opportunities }) {
  return (
    <DashboardSection title={title}>
      {items.length === 0 ? <p className="mb-0 text-(--muted)">Nothing added yet.</p> : (
        <ul className="m-0 list-none divide-y divide-(--aid-rule) p-0">
          {items.map(item => {
            const participants = signups.filter(signup => signup.opportunityId === item.id && isConfirmed(signup));
            const parent = opportunities.find(opportunity => opportunity.id === item.parentId);
            return (
              <li key={item.id} className="py-3">
                <h3 className="mb-1 text-base font-bold">{item.title}</h3>
                {parent && <p className="mb-1 text-sm text-(--muted)">Part of {parent.title}</p>}
                <p className="mb-1 text-sm text-(--muted)">
                  {item.kind === 'shift' && <>{shiftDate(item.date)} · {shiftTime(item)} · </>}
                  {item.signup === 'approval' ? 'Approval required' : 'Open signup'}
                </p>
                <p className="mb-1 text-sm">{participants.length} of {item.capacity} spots filled</p>
                <details className="text-sm">
                  <summary className="cursor-pointer underline">View participants</summary>
                  {participants.length ? (
                    <ul className="mt-2 pl-5">
                      {participants.map(signup => <li key={signup.volunteerId}>{signup.volunteer}</li>)}
                    </ul>
                  ) : <p className="mt-2 mb-0 text-(--muted)">No confirmed participants yet.</p>}
                </details>
              </li>
            );
          })}
        </ul>
      )}
    </DashboardSection>
  );
}

export default function OrganizationDashboard() {
  const { opportunities, signups, organization, volunteer, dispatch } = useDashboardDemo();
  const [creating, setCreating] = useState('');
  const owned = opportunities.filter(item => item.organizationId === organization.id);
  const shifts = owned.filter(item => item.kind === 'shift');
  const programs = owned.filter(item => item.kind === 'opportunity');
  const pending = signups.filter(signup =>
    signup.status === 'Pending' && owned.some(item => item.id === signup.opportunityId)
  );

  function review(signup, status) {
    dispatch({ type: 'review', opportunityId: signup.opportunityId, volunteerId: signup.volunteerId, status });
  }

  return (
    <DashboardLayout title={`Hello, ${organization.name}`} otherRole="Volunteer"
      action={
        <div className="flex flex-wrap gap-2">
          {listingActions.map(kind => (
            <button key={kind} type="button" aria-expanded={creating === kind} aria-controls="create-listing"
              className={reviewButton + ' aria-expanded:border-(--primary) aria-expanded:bg-(--panel)'}
              onClick={() => setCreating(current => current === kind ? '' : kind)}>
              Add {kind}
            </button>
          ))}
        </div>
      }>
      <div id="create-listing" hidden={!creating} className="lg:col-span-2">
        {creating && (
          <DashboardSection title={creating === 'shift' ? 'Add a shift' : 'Add an opportunity'}>
            <div className="max-w-2xl"><OpportunityForm key={creating} kind={creating} /></div>
          </DashboardSection>
        )}
      </div>
      <div className="grid gap-6">
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

        <ListingList title="My opportunities" items={programs} signups={signups} opportunities={programs} />
        <ListingList title="My shifts" items={shifts} signups={signups} opportunities={programs} />
        <Link className="text-sm underline" to="/opportunities">View demo catalog</Link>
      </div>

      <div className="grid gap-6">
        <ShiftCalendar shifts={shifts} initialDate={shifts[0]?.date} />
        <DashboardSection title="Completed shifts">
          <ul className="m-0 list-none divide-y divide-(--aid-rule) p-0 text-sm">
            {completedShifts.map(shift => (
              <li key={shift.date} className="py-2">
                <strong>{shift.title}</strong>
                <p className="mb-0 text-(--muted)">{shiftDate(shift.date)} · {volunteer.name} attended</p>
              </li>
            ))}
          </ul>
        </DashboardSection>
      </div>
    </DashboardLayout>
  );
}
