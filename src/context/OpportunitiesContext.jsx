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
  function removeOpportunity(id) { dispatch({ type: 'deleteToolOpportunity', opportunityId: id }); }
  return <OpportunitiesContext.Provider value={{ opportunities: opportunities.map(item => ({ ...item, hours: item.startTime && item.endTime ? (new Date(`2000-01-01T${item.endTime}`) - new Date(`2000-01-01T${item.startTime}`)) / 3600000 : item.hours, organization: item.organizer, city: item.city || item.location, displayStatus: item.cancelled || item.closed ? 'Closed' : item.status || 'Published' })), organization, saveOpportunity, removeOpportunity }}>{children}</OpportunitiesContext.Provider>;
}

export function useOpportunities() { return useContext(OpportunitiesContext); }
