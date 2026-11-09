import React, { createContext, useContext } from 'react';
import { useDashboardDemo } from './DashboardDemoContext.jsx';

const OpportunitiesContext = createContext(null);

// Adapt the tools to the same reducer used by signups and both dashboards.
export function OpportunitiesProvider({ children }) {
  const { opportunities, organization, dispatch } = useDashboardDemo();
  function saveOpportunity(values, id) {
    dispatch(id
      ? { type: 'updateOpportunity', opportunityId: id, values }
      : { type: 'post', opportunity: { ...values, kind: 'opportunity', signup: 'open' } });
  }
  function removeOpportunity(id) { dispatch({ type: 'deleteOpportunity', opportunityId: id }); }
  return <OpportunitiesContext.Provider value={{ opportunities, organization, saveOpportunity, removeOpportunity }}>{children}</OpportunitiesContext.Provider>;
}

export function useOpportunities() { return useContext(OpportunitiesContext); }
