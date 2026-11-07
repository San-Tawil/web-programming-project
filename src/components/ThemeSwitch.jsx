import React from 'react';
import { useTheme } from '../context/ThemeContext.jsx';

export default function ThemeSwitch() {
  const { dark, toggle } = useTheme();
  return (
    <button type="button" role="switch" aria-label="Dark mode" aria-checked={dark} onClick={toggle}
      className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-full border-0 bg-transparent text-(--text) hover:bg-(--panel)">
      <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        {dark ? (
          <path d="M20.5 15a9 9 0 0 1-11.5-11.5A9 9 0 1 0 20.5 15Z" />
        ) : (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
          </>
        )}
      </svg>
    </button>
  );
}
