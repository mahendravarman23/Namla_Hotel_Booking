import test from 'node:test';
import assert from 'node:assert/strict';
import hotelsReducer, { setFilter, clearCurrent } from '../src/features/hotels/hotelsSlice.js';
import authReducer, { logout, clearAuthError } from '../src/features/auth/authSlice.js';

test('Redux Hotels Slice Unit Tests', async (t) => {
  await t.test('setFilter should update search and reset page to 1', () => {
    const previousState = {
      filters: { search: '', minPrice: '', maxPrice: '', page: 3 },
    };
    const nextState = hotelsReducer(previousState, setFilter({ name: 'search', value: 'Udaipur' }));
    assert.equal(nextState.filters.search, 'Udaipur');
    assert.equal(nextState.filters.page, 1, 'Changing filter must reset page to 1');
  });

  await t.test('setFilter should change page without altering other filters', () => {
    const previousState = {
      filters: { search: 'Goa', minPrice: '100', maxPrice: '500', page: 1 },
    };
    const nextState = hotelsReducer(previousState, setFilter({ name: 'page', value: 2 }));
    assert.equal(nextState.filters.page, 2);
    assert.equal(nextState.filters.search, 'Goa');
    assert.equal(nextState.filters.minPrice, '100');
  });

  await t.test('clearCurrent should reset current hotel details', () => {
    const previousState = {
      current: { id: 1, title: 'Sample Hotel' },
      currentStatus: 'succeeded',
      currentError: null,
    };
    const nextState = hotelsReducer(previousState, clearCurrent());
    assert.equal(nextState.current, null);
    assert.equal(nextState.currentStatus, 'idle');
  });
});

test('Redux Auth Slice Unit Tests', async (t) => {
  await t.test('logout should clear authenticated user and session', () => {
    const stateWithUser = {
      user: { id: 1, name: 'Admin', role: 'admin' },
      token: 'jwt.sample.token',
      isAuthenticated: true,
      error: null,
      fieldErrors: {},
    };
    const nextState = authReducer(stateWithUser, logout());
    assert.equal(nextState.user, null);
    assert.equal(nextState.token, null);
    assert.equal(nextState.isAuthenticated, false);
  });

  await t.test('clearAuthError should wipe errors', () => {
    const stateWithError = {
      error: 'Invalid credentials',
      fieldErrors: { email: 'Email required' },
    };
    const nextState = authReducer(stateWithError, clearAuthError());
    assert.equal(nextState.error, null);
    assert.deepEqual(nextState.fieldErrors, {});
  });
});
