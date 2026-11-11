import React from 'react';
import { Link } from 'react-router-dom';
import { useDashboardDemo } from '../context/DashboardDemoContext.jsx';
import { organizationProfiles as sampleProfiles } from '../data/organizations.js';
import { isPublished } from '../data/dashboardDemo.js';

export default function OrganizationProfile({ opportunity }) {
  const { organizationProfiles, opportunities } = useDashboardDemo();
  const profile = { ...sampleProfiles[opportunity.organizationId], ...organizationProfiles[opportunity.organizationId] };
  const name = profile.name || opportunity.organizer || opportunity.organization;
  const related = opportunities.filter(item => item.id !== opportunity.id && item.organizationId === opportunity.organizationId && isPublished(item, opportunities));
  const safeWebsite = /^https?:\/\//i.test(profile.website || '') ? profile.website : null;
  return <section id="organization-profile" tabIndex={-1} aria-labelledby="organization-profile-title" className="scroll-mt-28 rounded-2xl border border-(--line) bg-(--panel) p-6">
    <p className="text-sm font-bold uppercase tracking-widest text-(--primary)">Organization profile</p>
    <h2 id="organization-profile-title" className="text-xl font-semibold">{name}</h2>
    <p className="text-sm text-(--muted)">{profile.location || opportunity.city || opportunity.location} · Course demo organization</p>
    <p className="leading-relaxed">{profile.description || 'This organization shares local volunteer opportunities through AidConnect.'}</p>
    {profile.approach && <p className="leading-relaxed">{profile.approach}</p>}
    {safeWebsite && <p><a className="underline focus-visible:outline-2 focus-visible:outline-(--primary)" href={safeWebsite} target="_blank" rel="noreferrer">Organization website<span className="sr-only"> (opens in a new tab)</span></a></p>}
    <h3 className="text-lg">More from this organization</h3>
    {related.length ? <ul className="mb-0 space-y-3 pl-5">{related.slice(0, 3).map(item => <li key={item.id}><Link className="underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-(--primary)" to={`/opportunities/${item.id}`}>{item.title}</Link></li>)}</ul> : <p className="mb-0 text-(--muted)">No other published opportunities yet.</p>}
  </section>;
}
