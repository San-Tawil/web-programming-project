import React, { useState } from 'react';
import { useDashboardDemo } from '../context/DashboardDemoContext.jsx';
import DashboardAvatar from './DashboardAvatar.jsx';
import FormField from './FormField.jsx';

const photoTypes = ['image/jpeg', 'image/png', 'image/webp'];
const photoLimit = 2 * 1024 * 1024;

export default function DashboardProfileSettings({ profile, role }) {
  const { dispatch } = useDashboardDemo();
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  function save(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = data.get('profile-name').trim();
    const location = data.get('profile-location').trim();
    const photo = form.elements.namedItem('profile-photo').files[0];
    if (!name) {
      setError('Enter a display name.');
      form.elements.namedItem('profile-name').focus();
      return;
    }
    if (photo && (!photoTypes.includes(photo.type) || !photo.size || photo.size > photoLimit)) {
      setError('Choose a JPG, PNG, or WebP picture up to 2 MB.');
      form.elements.namedItem('profile-photo').focus();
      return;
    }
    dispatch({ type: 'updateProfile', role, changes: { name, location, ...(photo && { photo }) } });
    form.elements.namedItem('profile-photo').value = '';
    setError('');
    setNotice('Profile saved.');
  }

  return (
    <section id="profile-settings" tabIndex={-1} aria-labelledby="profile-settings-title" className="scroll-mt-32 overflow-hidden rounded-xl border border-(--line) bg-(--panel) lg:scroll-mt-20">
      <header className="flex flex-wrap items-center gap-4 border-b border-(--line) p-5 sm:p-6">
        <DashboardAvatar profile={profile} className="size-14 text-lg" />
        <div>
          <h1 id="profile-settings-title" className="mb-1 font-display text-2xl font-bold">Profile settings</h1>
          <p className="m-0 text-sm text-(--muted)">Update how you appear in this demo.</p>
        </div>
      </header>
      <form className="grid gap-4 p-5 sm:p-6" onSubmit={save} onChange={() => { setError(''); setNotice(''); }}>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label={role === 'organization' ? 'Organization name' : 'Display name'} name="profile-name" autoComplete={role === 'organization' ? 'organization' : 'name'} defaultValue={profile.name} required maxLength={80} />
          <FormField label="Location" name="profile-location" defaultValue={profile.location ?? ''} maxLength={100} />
        </div>
        <FormField label="Profile picture" name="profile-photo" type="file" accept={photoTypes.join(',')} aria-describedby="profile-photo-help"
          className="min-w-0 text-sm file:mr-2 file:rounded-md file:border-0 file:bg-(--nav-panel) file:px-3 file:py-2 file:font-semibold file:text-(--primary-strong)" />
        <p id="profile-photo-help" className="m-0 text-sm text-(--muted)">JPG, PNG, or WebP up to 2 MB. Profile changes last until refresh.</p>
        {error && <p role="alert" className="m-0 text-sm text-rose-800 dark:text-rose-300">{error}</p>}
        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" className="min-h-11 cursor-pointer rounded-lg border-0 bg-(--primary) px-4 font-semibold text-(--bg) hover:bg-(--primary-strong)">Save profile</button>
          <p role="status" className="m-0 text-sm font-semibold text-(--primary-strong)">{notice}</p>
        </div>
      </form>
    </section>
  );
}
