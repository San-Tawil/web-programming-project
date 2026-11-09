import React, { useId } from 'react';
import { Link } from 'react-router-dom';
import Container from './Container.jsx';

export default function DashboardLayout({ title, otherRole, action, children }) {
  const volunteer = otherRole === 'Volunteer';
  return (
    <Container className="py-8 font-body md:py-12">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="mb-2 font-display text-[clamp(2rem,5vw,3.5rem)]">{title}</h1>
          <p className="mb-0 text-sm text-(--muted)">Course demo · Changes reset on refresh</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Link className="text-sm font-semibold underline" to={volunteer ? '/volunteer/dashboard' : '/organizations/dashboard'}>
            View {otherRole.toLowerCase()} demo
          </Link>
          {action}
        </div>
      </header>
      <div className="grid items-start gap-6 lg:grid-cols-[1.6fr_1fr]">
        {children}
      </div>
    </Container>
  );
}

export function DashboardSection({ title, id, children }) {
  const heading = useId();
  return (
    <section id={id} aria-labelledby={heading} tabIndex={-1} className="min-w-0 scroll-mt-24 rounded-xl border border-(--aid-rule) bg-(--aid-surface) p-4 sm:p-5">
      <h2 id={heading} className="mb-4 font-display text-xl font-bold">{title}</h2>
      {children}
    </section>
  );
}
