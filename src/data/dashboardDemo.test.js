import assert from 'node:assert/strict';
import test from 'node:test';
import { demoReducer, initialDemo, spotsFilled } from './dashboardDemo.js';

const cleanup = initialDemo.opportunities.find(item => item.id === 'coastal-cleanup');
const homework = initialDemo.opportunities.find(item => item.id === 'homework-club');
const newOrganization = { id: 'org-new', name: 'Beirut Volunteers' };
const selectOrganization = (state, organization) => demoReducer(state, { type: 'selectOrganization', organization });
const review = (state, status) => demoReducer(state, {
  type: 'review', opportunityId: homework.id, volunteerId: 'nour-khoury', status,
});

test('a new organization owns its own listings and cannot manage the seeded listings', () => {
  const state = selectOrganization(initialDemo, newOrganization);
  assert.equal(state.opportunities.filter(item => item.organizationId === newOrganization.id).length, 0);
  assert.equal(demoReducer(state, { type: 'cancelShift', opportunityId: cleanup.id }), state);
  assert.equal(demoReducer(state, { type: 'editShift', opportunityId: cleanup.id, changes: { title: 'Changed' } }), state);
  assert.equal(review(state, 'Accepted'), state);
  assert.equal(demoReducer(state, { type: 'post', opportunity: { ...cleanup, parentId: 'community-tutoring' } }), state);

  const posted = demoReducer(state, { type: 'post', opportunity: { ...cleanup, title: 'New shift' } });
  const listing = posted.opportunities.at(-1);
  assert.equal(listing.organizationId, newOrganization.id);
  assert.equal(listing.organizer, newOrganization.name);
  const seeded = selectOrganization(posted, initialDemo.organization);
  assert.equal(demoReducer(seeded, { type: 'cancelShift', opportunityId: listing.id }), seeded);
});

test('organization profile edits follow the organization and only rename its listings', () => {
  const state = selectOrganization(initialDemo, newOrganization);
  const posted = demoReducer(state, { type: 'post', opportunity: cleanup });
  const updated = demoReducer(posted, { type: 'updateProfile', role: 'organization', changes: { name: 'Beirut Community' } });
  assert.equal(updated.opportunities.at(-1).organizer, 'Beirut Community');
  assert.equal(updated.opportunities.find(item => item.id === cleanup.id).organizer, initialDemo.organization.name);
  const seeded = selectOrganization(updated, initialDemo.organization);
  assert.equal(seeded.organization.name, initialDemo.organization.name);
  assert.equal(selectOrganization(seeded, newOrganization).organization.name, 'Beirut Community');
});

test('reservations stop at capacity and an existing reservation cannot be repeated', () => {
  const state = {
    ...initialDemo,
    opportunities: initialDemo.opportunities.map(item => item.id === cleanup.id ? { ...item, capacity: 2 } : item),
  };
  const action = { type: 'join', opportunityId: cleanup.id };
  const reserved = demoReducer(state, action);
  assert.equal(spotsFilled(reserved.signups, cleanup.id), 2);
  assert.equal(demoReducer(reserved, action), reserved);
  const anotherVolunteer = demoReducer(reserved, { type: 'selectVolunteer', volunteer: { id: 'other', name: 'Other' } });
  assert.equal(demoReducer(anotherVolunteer, action), anotherVolunteer);
  assert.equal(demoReducer(reserved, { type: 'editShift', opportunityId: cleanup.id, changes: { capacity: 1 } }), reserved);
});

test('application review keeps decisions and allows a decline when a shift is full', () => {
  const accepted = review(initialDemo, 'Accepted');
  assert.equal(accepted.signups.find(item => item.volunteerId === 'nour-khoury').status, 'Accepted');
  assert.equal(review(accepted, 'Declined').signups.find(item => item.volunteerId === 'nour-khoury').status, 'Accepted');

  const full = {
    ...initialDemo,
    opportunities: initialDemo.opportunities.map(item => item.id === homework.id ? { ...item, capacity: 1 } : item),
    signups: [...initialDemo.signups, { opportunityId: homework.id, volunteerId: 'other', status: 'Reserved' }],
  };
  assert.equal(review(full, 'Accepted'), full);
  assert.equal(review(full, 'Declined').signups.find(item => item.volunteerId === 'nour-khoury').status, 'Declined');
});

test('a new shift cannot start before its program', () => {
  const program = { ...homework, kind: 'opportunity' };
  const posted = demoReducer(initialDemo, { type: 'post', opportunity: program });
  const parentId = posted.opportunities.at(-1).id;
  const earlier = { ...cleanup, parentId };
  assert.equal(demoReducer(posted, { type: 'post', opportunity: earlier }), posted);
});
