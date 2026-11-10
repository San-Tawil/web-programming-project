import React, { createContext, useContext, useReducer, useState } from 'react';
import { demoReducer, initialDemo } from '../data/dashboardDemo.js';

const DashboardDemoContext = createContext(null);

export function DashboardDemoProvider({ children }) {
  const [demo, reducerDispatch] = useReducer(demoReducer, initialDemo);
  const [accountRole, setAccountRole] = useState(null);

  function dispatch(action) {
    if (action.type === 'join' && accountRole !== 'volunteer') return;
    reducerDispatch(action);
  }

  function selectAccount(account) {
    const volunteer = account?.role === 'volunteer' ? {
      id: account.id === 'volunteer-demo' ? initialDemo.volunteer.id : account.id,
      name: account.name,
      location: account.location,
      photo: account.photo,
    } : initialDemo.volunteer;
    setAccountRole(account?.role ?? null);
    dispatch({ type: 'selectVolunteer', volunteer });
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
