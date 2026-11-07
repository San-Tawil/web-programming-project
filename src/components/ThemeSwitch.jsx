import React from 'react';
import { useTheme } from '../context/ThemeContext.jsx';

export default function ThemeSwitch() {
  const { theme, toggle } = useTheme();
  const dark = theme === 'dark';
  return (
    <button type="button" role="switch" aria-label="Dark mode" aria-checked={dark} onClick={toggle}
      className="relative inline-flex h-11 w-16 shrink-0 cursor-pointer items-center rounded-full border border-current bg-transparent">
      <span aria-hidden="true" className={`absolute left-1 grid size-9 place-items-center rounded-full text-xl transition-transform motion-reduce:transition-none ${dark ? 'translate-x-5 bg-black text-white' : 'translate-x-0 bg-white text-black'}`}>
        {dark ? '☾' : '☀'}
      </span>
    </button>
  );
}
