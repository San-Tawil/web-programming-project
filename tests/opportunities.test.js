import test from 'node:test';
import assert from 'node:assert/strict';
import { demoReducer, initialDemo, isPublished } from '../src/data/dashboardDemo.js';

const post = (state, values = {}) => demoReducer(state, { type: 'post', opportunity: {
  kind: 'opportunity', title: 'Test program', location: 'Beirut', description: 'Test program description', capacity: 8, signup: 'open', ...values,
} });

test('creation IDs remain unique after deletion and re-creation', () => {
  let state = post(post(initialDemo));
  const deleted = state.opportunities.at(-2).id;
  state = demoReducer(state, { type: 'deleteOpportunity', opportunityId: deleted });
  state = post(state);
  assert.equal(new Set(state.opportunities.map(item => item.id)).size, state.opportunities.length);
});

test('closing a parent hides shifts and prevents new reservations', () => {
  let state = post(initialDemo);
  const parentId = state.opportunities.at(-1).id;
  state = post(state, { kind: 'shift', parentId, date: '2026-12-20', startTime: '09:00', endTime: '11:00' });
  const shift = state.opportunities.at(-1);
  state = demoReducer(state, { type: 'updateOpportunity', opportunityId: parentId, values: { status: 'Closed' } });
  assert.equal(isPublished(shift, state.opportunities), false);
  assert.equal(demoReducer(state, { type: 'join', opportunityId: shift.id }), state);
});

test('deleting a parent also removes its shifts and their signups', () => {
  let state = post(initialDemo);
  const parentId = state.opportunities.at(-1).id;
  state = post(state, { kind: 'shift', parentId, date: '2026-12-20', startTime: '09:00', endTime: '11:00' });
  const shiftId = state.opportunities.at(-1).id;
  state = demoReducer(state, { type: 'join', opportunityId: shiftId });
  state = demoReducer(state, { type: 'deleteOpportunity', opportunityId: parentId });
  assert(!state.opportunities.some(item => item.id === parentId || item.id === shiftId));
  assert(!state.signups.some(item => item.opportunityId === shiftId));
});

test('capacity respects reservations and duration updates the dashboard schedule', () => {
  let state = demoReducer(initialDemo, { type: 'join', opportunityId: 'coastal-cleanup' });
  assert.equal(demoReducer(state, { type: 'updateOpportunity', opportunityId: 'coastal-cleanup', values: { capacity: 1 } }), state);
  state = demoReducer(state, { type: 'updateOpportunity', opportunityId: 'coastal-cleanup', values: { hours: 3 } });
  assert.equal(state.opportunities.find(item => item.id === 'coastal-cleanup').endTime, '12:00');
});
