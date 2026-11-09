import React, { createContext, useContext, useState } from 'react';
import { initialOpportunities } from '../data/opportunities.js';

const OpportunitiesContext = createContext(null);

// Phase 1: shared in-memory data survives route changes and resets on refresh.
export function OpportunitiesProvider({ children }) {
  const [opportunities, setOpportunities] = useState(initialOpportunities);
  function saveOpportunity(values, id) {
    if (id) setOpportunities(items => items.map(item => item.id === id ? { ...item, ...values } : item));
    else setOpportunities(items => [...items, { ...values, id: crypto.randomUUID(), organization: 'Together Lebanon', organizationId: 'together' }]);
  }
  function removeOpportunity(id) {
    setOpportunities(items => items.filter(item => item.id !== id));
  }
  return <OpportunitiesContext.Provider value={{ opportunities, saveOpportunity, removeOpportunity }}>{children}</OpportunitiesContext.Provider>;
}

export function useOpportunities() { return useContext(OpportunitiesContext); }
