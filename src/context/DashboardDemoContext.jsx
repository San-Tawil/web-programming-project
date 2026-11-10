
import React, { createContext, useContext, useReducer, useState } from 'react';
import { demoReducer, initialDemo } from '../data/dashboardDemo.js';

const DashboardDemoContext = createContext(null);
const sessionKey = 'aidconnect-session';

function profileKey(account) {
  return 'aidconnect-profile:' + account.id;
}

function withSavedProfile(account) {
  try {
    const saved = JSON.parse(localStorage.getItem(profileKey(account)));
    return saved ? { ...account, ...saved } : account;
  } catch {
    return account;
  }
}

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

    return withSavedProfile(account);
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
    phone: account.phone,
    website: account.website,
    cv: account.cv,
    bio: account.bio,
    tags: account.tags,
  } : initialDemo.volunteer;

  const organization = account.role === 'organizations' ? {
    id: account.id === 'organizations-demo'
      ? initialDemo.organization.id
      : account.id,
    name: account.name,
    location: account.location,
    photo: account.photo,
    phone: account.phone,
    website: account.website,
  } : initialDemo.organization;

  let demo = demoReducer(initialDemo, {
    type: 'selectVolunteer',
    volunteer,
  });

  demo = demoReducer(demo, {
    type: 'selectOrganization',
    organization,
  });

  return account.role === 'organizations'
    ? demoReducer(demo, { type: 'updateProfile', role: 'organization', changes: organization })
    : demo;
}

export function DashboardDemoProvider({ children }) {
  const [account, setAccount] = useState(getSavedAccount);

  const [demo, dispatch] = useReducer(
    demoReducer,
    account,
    getInitialDemo
  );

  const accountRole = account?.role ?? null;

  function saveProfile(role, changes) {
    const accountRole = role === 'organization' ? 'organizations' : role;
    if (account?.role === accountRole) {
      const { name, location, phone, website, bio, tags } = changes;
      localStorage.setItem(profileKey(account), JSON.stringify({ name, location, phone, website, bio, tags }));
    }
    dispatch({ type: 'updateProfile', role, changes });
  }

  function selectAccount(nextAccount, rememberMe = false) {
    if (nextAccount) nextAccount = withSavedProfile(nextAccount);
    const volunteer = nextAccount?.role === 'volunteer' ? {
      id: nextAccount.id === 'volunteer-demo'
        ? initialDemo.volunteer.id
        : nextAccount.id,
      name: nextAccount.name,
      location: nextAccount.location,
      photo: nextAccount.photo,
      phone: nextAccount.phone,
      website: nextAccount.website,
      cv: nextAccount.cv,
      bio: nextAccount.bio,
      tags: nextAccount.tags,
    } : initialDemo.volunteer;

    const organization = nextAccount?.role === 'organizations' ? {
      id: nextAccount.id === 'organizations-demo'
        ? initialDemo.organization.id
        : nextAccount.id,
      name: nextAccount.name,
      location: nextAccount.location,
      photo: nextAccount.photo,
      phone: nextAccount.phone,
      website: nextAccount.website,
    } : initialDemo.organization;

    setAccount(nextAccount);

    dispatch({ type: 'selectVolunteer', volunteer });
    dispatch({ type: 'selectOrganization', organization });
    if (nextAccount?.role === 'organizations') {
      dispatch({ type: 'updateProfile', role: 'organization', changes: organization });
    }

    localStorage.removeItem(sessionKey);
    sessionStorage.removeItem(sessionKey);

    if (nextAccount) {
      const savedAccount = {
        id: nextAccount.id,
        role: nextAccount.role,
        name: nextAccount.name,
        email: nextAccount.email,
        phone: nextAccount.phone,
        website: nextAccount.website,
        location: nextAccount.location,
      };

      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem(sessionKey, JSON.stringify(savedAccount));
    }
  }

  return (
    <DashboardDemoContext.Provider
      value={{ ...demo, dispatch, accountRole, selectAccount, saveProfile }}
    >
      {children}
    </DashboardDemoContext.Provider>
  );
}

export function useDashboardDemo() {
  return useContext(DashboardDemoContext);
}
