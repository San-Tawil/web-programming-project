import React, { createContext, useContext, useReducer } from 'react';
import { demoReducer, initialDemo } from '../data/dashboardDemo.js';

const DashboardDemoContext = createContext(null);

export function DashboardDemoProvider({ children }) {
  const [demo, dispatch] = useReducer(demoReducer, initialDemo);
  return (
    <DashboardDemoContext.Provider value={{ ...demo, dispatch }}>
      {children}
    </DashboardDemoContext.Provider>
  );
}

export function useDashboardDemo() {
  return useContext(DashboardDemoContext);
}
