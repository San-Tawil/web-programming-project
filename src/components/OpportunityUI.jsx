import React from 'react';
import { NavLink } from 'react-router-dom';

export const fieldClass = 'dark:[color-scheme:dark] mt-2 block min-h-11 w-full rounded-lg border border-(--line) bg-(--bg) px-3 py-2 font-[inherit] text-(--text) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--primary)';
export const buttonClass = 'inline-flex min-h-11 cursor-pointer items-center justify-center rounded-lg border border-(--line) bg-(--panel) px-4 py-2 text-sm font-bold text-(--text) hover:border-(--primary) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--primary)';
export const primaryClass = `${buttonClass} border-transparent! bg-[#c6f432]! text-[#11201a]! hover:bg-[#b5e327]!`;

export function WorkspacePage({ children }) {
  return <div className="mx-auto w-[calc(100%-2rem)] max-w-[1120px] py-7 font-body sm:w-[calc(100%-3rem)] md:py-12 [&_:is(h1,h2,h3)]:font-display [&_h2]:text-2xl [&_h3]:text-xl">
    <nav aria-label="Opportunity workspace" className="mb-8 flex flex-wrap gap-2">
      {[['/opportunities', 'Find opportunities'], ['/organizations/tools', 'Organization tools'], ['/organizations/dashboard', 'Organization dashboard']].map(([to, text]) => <NavLink key={to} to={to} className={({ isActive }) => `${buttonClass} ${isActive ? 'bg-(--text)! text-(--bg)!' : ''}`}>{text}</NavLink>)}
    </nav>
    {children}
  </div>;
}

export function StatusBadge({ status }) {
  const colors = { Published: 'bg-[#bff0cf]', Draft: 'bg-[#f5dd9f]', Closed: 'bg-[#e2e5df]' };
  return <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold text-[#11201a] ${colors[status]}`}>{status}</span>;
}
