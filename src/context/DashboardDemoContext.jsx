
import React, { createContext, useContext, useReducer, useState } from 'react';
import { demoReducer, initialDemo } from '../data/dashboardDemo.js';

const DashboardDemoContext = createContext(null);
const sessionKey = 'aidconnect-session';

function getSavedAccount() {
  try {
    const saved = sessionStorage.getItem(sessionKey)
      || localStorage.getItem(sessionKey);

    if (!saved) return null;

    const account = JSON.parse(saved);

    if (
      !account?.id ||
      !['volunteer', 'organizations'].includes(account.role)
    ) {
      return null;
    }

    return account;
  } catch {
    return null;
  }
}

function getInitialDemo(account) {
  if (!account) return initialDemo;

  const volunteer = account.role === 'volunteer' ? {
    id: account.id === 'volunteer-demo'
      ? initialDemo.volunteer.id
      : account.id,
    name: account.name,
    location: account.location,
    photo: account.photo,
  } : initialDemo.volunteer;

  const organization = account.role === 'organizations' ? {
    id: account.id === 'organizations-demo'
      ? initialDemo.organization.id
      : account.id,
    name: account.name,
    location: account.location,
    photo: account.photo,
  } : initialDemo.organization;

  let demo = demoReducer(initialDemo, {
    type: 'selectVolunteer',
    volunteer,
  });

  demo = demoReducer(demo, {
    type: 'selectOrganization',
    organization,
  });

  return demo;
}

export function DashboardDemoProvider({ children }) {
  const [account, setAccount] = useState(getSavedAccount);

  const [demo, dispatch] = useReducer(
    demoReducer,
    account,
    getInitialDemo
  );

  const accountRole = account?.role ?? null;

  function selectAccount(nextAccount, rememberMe = false) {
    const volunteer = nextAccount?.role === 'volunteer' ? {
      id: nextAccount.id === 'volunteer-demo'
        ? initialDemo.volunteer.id
        : nextAccount.id,
      name: nextAccount.name,
      location: nextAccount.location,
      photo: nextAccount.photo,
    } : initialDemo.volunteer;

    const organization = nextAccount?.role === 'organizations' ? {
      id: nextAccount.id === 'organizations-demo'
        ? initialDemo.organization.id
        : nextAccount.id,
      name: nextAccount.name,
      location: nextAccount.location,
      photo: nextAccount.photo,
    } : initialDemo.organization;

    setAccount(nextAccount);

    dispatch({ type: 'selectVolunteer', volunteer });
    dispatch({ type: 'selectOrganization', organization });

    localStorage.removeItem(sessionKey);
    sessionStorage.removeItem(sessionKey);

    if (nextAccount) {
      const savedAccount = {
        id: nextAccount.id,
        role: nextAccount.role,
        name: nextAccount.name,
        email: nextAccount.email,
        location: nextAccount.location,
      };

      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem(sessionKey, JSON.stringify(savedAccount));
    }
  }

  return (
    <DashboardDemoContext.Provider
      value={{ ...demo, dispatch, accountRole, selectAccount }}
    >
      {children}
    </DashboardDemoContext.Provider>
  );
}

export function useDashboardDemo() {
  return useContext(DashboardDemoContext);
}
