import React, { useState } from 'react';

function initialDark() {
  return document.documentElement.classList.contains('dark');
}

export default function ThemeSwitch() {
  const [dark, setDark] = useState(initialDark);

  function toggle() {
    const next = !dark;
    document.documentElement.classList.toggle('dark', next);
    setDark(next);
    try {
      localStorage.setItem('aidconnect-theme', next ? 'dark' : 'light');
    } catch {
      // The switch still works when browser storage is unavailable.
    }
  }

  return (
    <button type="button" role="switch" aria-label="Dark mode" aria-checked={dark} onClick={toggle}
      className="relative inline-flex h-11 w-16 shrink-0 cursor-pointer items-center rounded-full border border-white/60 bg-aid-footer">
      <span aria-hidden="true" className={`absolute left-1 grid size-9 place-items-center rounded-full bg-white text-lg text-aid-footer transition-transform motion-reduce:transition-none ${dark ? 'translate-x-5' : 'translate-x-0'}`}>
        {dark ? '☾' : '☀'}
      </span>
    </button>
  );
}
