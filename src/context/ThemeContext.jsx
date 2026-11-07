import React, { createContext, useContext, useLayoutEffect, useState } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));

  useLayoutEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    try { localStorage.setItem('aidconnect-theme', dark ? 'dark' : 'light'); } catch { /* Storage is optional. */ }
  }, [dark]);

  const toggle = () => setDark(current => !current);
  return <ThemeContext.Provider value={{ dark, toggle }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
