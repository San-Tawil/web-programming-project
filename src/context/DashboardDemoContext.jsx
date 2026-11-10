import React, { createContext, useContext, useReducer, useState } from 'react';
import { demoReducer, initialDemo } from '../data/dashboardDemo.js';

const DashboardDemoContext = createContext(null);

export function DashboardDemoProvider({ children }) {
  const [demo, dispatch] = useReducer(demoReducer, initialDemo);
  const [accountRole, setAccountRole] = useState(null);

  function selectAccount(account) {
    const volunteer = account?.role === 'volunteer' ? {
      id: account.id === 'volunteer-demo' ? initialDemo.volunteer.id : account.id,
      name: account.name,
      location: account.location,
      photo: account.photo,
    } : initialDemo.volunteer;
    setAccountRole(account?.role ?? null);
    dispatch({ type: 'selectVolunteer', volunteer });
    const organization = account?.role === 'organizations' ? {
      id: account.id === 'organizations-demo' ? initialDemo.organization.id : account.id,
      name: account.name,
      location: account.location,
      photo: account.photo,
    } : initialDemo.organization;
    dispatch({ type: 'selectOrganization', organization });
  }
  return (
    <DashboardDemoContext.Provider value={{ ...demo, dispatch, accountRole, selectAccount }}>
      {children}
    </DashboardDemoContext.Provider>
  );
}

export function useDashboardDemo() {
  return useContext(DashboardDemoContext);
}
