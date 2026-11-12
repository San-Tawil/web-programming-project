import test from 'node:test';
import assert from 'node:assert/strict';
import { authDestination } from '../src/data/authDestination.js';

test('volunteer login returns to the selected opportunity', () => {
  assert.equal(authDestination('volunteer', '/opportunities/coastal-cleanup'), '/opportunities/coastal-cleanup');
});

test('authentication rejects external and unrelated return destinations', () => {
  for (const target of ['https://example.com', '//example.com', '/organizations/tools', '/opportunities/../login', undefined]) {
    assert.equal(authDestination('volunteer', target), '/volunteer/dashboard');
  }
  assert.equal(authDestination('organizations', '/opportunities/coastal-cleanup'), '/organizations/dashboard');
});
