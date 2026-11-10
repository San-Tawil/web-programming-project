import React, { useEffect, useId, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, X } from 'lucide-react';

export const control = 'inline-flex min-h-11 cursor-pointer items-center justify-center rounded-lg border border-(--line) bg-(--panel) px-3 text-sm font-semibold text-(--text) hover:border-(--primary) disabled:cursor-default disabled:opacity-60';

export function SectionHeader({ title, actions, id }) {
  return <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
    <h2 id={id} className="m-0 text-base font-semibold">{title}</h2>
    {actions}
  </header>;
}

export function Card({ title, id, actions, className = '', children }) {
  const heading = useId();
  return <section id={id} aria-labelledby={heading} tabIndex={-1}
    className={`min-w-0 scroll-mt-28 rounded-xl border border-(--line) bg-(--panel) p-5 ${className}`}>
    <SectionHeader title={title} id={heading} actions={actions} />
    {children}
  </section>;
}

export function StatCard({ label, value, detail, to, icon: Icon, badge }) {
  return <div className="col-span-full min-w-0 rounded-xl border border-(--line) bg-(--panel) p-5 sm:col-span-6 xl:col-span-3">
    <dt className="flex items-start justify-between gap-2 text-sm font-medium text-(--muted)">
      {label}
      <Icon aria-hidden="true" size={18} className="shrink-0 text-(--primary)" />
    </dt>
    <dd className="mt-2 ml-0 text-2xl font-semibold tabular-nums">{value}</dd>
    <dd className="mt-2 ml-0 flex flex-wrap items-center gap-2 text-sm">
      <Link to={to} className="inline-flex items-center gap-1 font-semibold text-(--primary) hover:underline">{detail}<ArrowUpRight aria-hidden="true" size={14} /></Link>
      {badge && <Badge label={badge} />}
    </dd>
  </div>;
}

const tones = { Open: 'positive', Confirmed: 'positive', Reserved: 'positive', Accepted: 'positive', Pending: 'pending', 'Approval required': 'pending', Full: 'negative', 'Full capacity': 'negative', Cancelled: 'negative', Declined: 'negative' };
export function Badge({ label }) {
  return <span data-tone={tones[label] ?? 'neutral'} className="dashboard-badge inline-flex rounded-full px-2 py-1 text-xs font-semibold">{label}</span>;
}

export function ProgressBar({ value, max, label }) {
  return <progress aria-label={label} max={Math.max(1, max)} value={value} className="dashboard-progress block h-1.5 w-full" />;
}

export function Tabs({ label, items, current, onChange }) {
  return <div role="group" aria-label={label} className="mb-4 flex flex-wrap gap-2">
    {items.map(item => <button key={item} type="button" aria-pressed={current === item} onClick={() => onChange(item)}
      className={control + ' aria-pressed:border-(--primary) aria-pressed:bg-(--nav-panel) aria-pressed:text-(--primary)'}>{item}</button>)}
  </div>;
}

export function EmptyState({ children, action }) {
  return <div className="rounded-lg bg-(--bg) p-3 text-sm text-(--muted)">
    <p className="m-0">{children}</p>
    {action}
  </div>;
}

export function Modal({ title, onClose, drawer = false, children }) {
  const dialog = useRef(null);
  const heading = useId();
  const outside = useRef(false);
  useEffect(() => {
    const element = dialog.current;
    element.showModal();
    return () => { if (element.open) element.close(); };
  }, []);
  return <dialog ref={dialog} aria-labelledby={heading} onCancel={event => { event.preventDefault(); onClose(); }}
    onPointerDown={event => { outside.current = event.target === event.currentTarget; }}
    onClick={event => { if (outside.current && event.target === event.currentTarget) onClose(); }}
    className={`fixed border border-(--line) bg-(--panel) p-0 text-(--text) backdrop:bg-black/60 ${drawer
      ? 'inset-y-0 left-0 m-0 h-dvh max-h-dvh w-72 max-w-[90vw] overflow-y-auto'
      : 'inset-0 m-auto max-h-[90dvh] w-[calc(100%_-_2rem)] max-w-3xl overflow-y-auto rounded-xl'}`}>
    <div className="p-5 sm:p-6">
      <header className="mb-4 flex items-center justify-between gap-3">
        <h2 id={heading} className="m-0 text-xl font-semibold">{title}</h2>
        <button type="button" onClick={onClose} aria-label={drawer ? 'Close navigation' : 'Close dialog'} className={control}><X aria-hidden="true" size={18} /></button>
      </header>
      {children}
    </div>
  </dialog>;
}
