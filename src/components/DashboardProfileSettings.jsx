import React, { useState } from 'react';
import { useDashboardDemo } from '../context/DashboardDemoContext.jsx';
import DashboardAvatar from './DashboardAvatar.jsx';
import { isValidPhone, isValidWebsite } from '../data/mockAccounts.js';
import FormField from './FormField.jsx';
import PhoneField, { readPhone } from './PhoneField.jsx';

const photoTypes = ['image/jpeg', 'image/png', 'image/webp'];
const photoLimit = 2 * 1024 * 1024;
const cvLimit = 5 * 1024 * 1024;
const fileField = 'min-w-0 text-sm file:mr-2 file:cursor-pointer file:rounded-md file:border-0 file:bg-(--nav-panel) file:px-3 file:py-2 file:font-semibold file:text-(--primary-strong)';

export default function DashboardProfileSettings({ profile, role }) {
  const { accountRole, saveProfile } = useDashboardDemo();
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  function save(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = data.get('profile-name').trim();
    const location = data.get('profile-location').trim();
    const { phone, number, code, invalidCode } = readPhone(form.elements, 'profile-phone');
    const website = data.get('profile-website').trim();
    const bio = data.get('profile-bio')?.trim().slice(0, 500);
    const tags = [...new Set((data.get('profile-tags') ?? '').split(',').map(tag => tag.trim().slice(0, 30)).filter(Boolean))].slice(0, 8);
    const photo = form.elements.namedItem('profile-photo').files[0];
    if (!name) {
      setError('Enter a display name.');
      form.elements.namedItem('profile-name').focus();
      return;
    }
    if (invalidCode || (number && !code && number !== profile.phone)) {
      setError('Select a country calling code.');
      form.elements.namedItem('profile-phone-code').focus();
      return;
    }
    if (phone && (number.startsWith('+') || !isValidPhone(phone))) {
      setError('Enter a phone number with 7 to 15 digits.');
      form.elements.namedItem('profile-phone').focus();
      return;
    }
    if (website && !isValidWebsite(website)) {
      setError('Enter a website URL starting with https:// or http://.');
      form.elements.namedItem('profile-website').focus();
      return;
    }
    if (photo && (!photoTypes.includes(photo.type) || !photo.size || photo.size > photoLimit)) {
      setError('Choose a JPG, PNG, or WebP picture up to 2 MB.');
      form.elements.namedItem('profile-photo').focus();
      return;
    }
    const cvInput = form.elements.namedItem('profile-cv');
    const cv = cvInput?.files[0];
    if (cv && (cv.type !== 'application/pdf' || !cv.size || cv.size > cvLimit)) {
      setError('Choose a PDF CV up to 5 MB.');
      cvInput.focus();
      return;
    }
    try {
      saveProfile(role, { name, location, phone, website, ...(role === 'volunteer' && { bio, tags }), ...(photo && { photo }), ...(cv && { cv }) });
    } catch {
      setError('Your browser could not save these profile changes.');
      return;
    }
    if (cvInput) cvInput.value = '';
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
        <PhoneField name="profile-phone" defaultValue={profile.phone} />
        <FormField label="Website URL (optional)" name="profile-website" type="url" autoComplete="url"
          defaultValue={profile.website ?? ''} placeholder="https://example.com" maxLength={500} />
        {role === 'volunteer' && (
          <>
            <FormField label="Bio (optional)" name="profile-bio" as="textarea" rows={4} maxLength={500} defaultValue={profile.bio ?? ''} />
            <FormField label="Tags (optional)" name="profile-tags" maxLength={250} defaultValue={profile.tags?.join(', ') ?? ''}
              placeholder="e.g. Tutoring, food packing, teamwork" aria-describedby="profile-tags-help" />
            <p id="profile-tags-help" className="m-0 text-sm text-(--muted)">Separate up to 8 tags with commas.</p>
          </>
        )}
        <FormField label="Profile picture" name="profile-photo" type="file" accept={photoTypes.join(',')} aria-describedby="profile-photo-help"
          className={fileField} />
        <p id="profile-photo-help" className="m-0 text-sm text-(--muted)">JPG, PNG, or WebP up to 2 MB. Uploaded files last until refresh. {accountRole === (role === 'organization' ? 'organizations' : role) ? 'Profile details are saved in this browser.' : 'Sign in to keep profile details after refresh.'}</p>
        {role === 'volunteer' && (
          <>
            <FormField label="Upload a CV" name="profile-cv" type="file" accept="application/pdf" aria-describedby="profile-cv-help" className={fileField} />
            <p id="profile-cv-help" className="m-0 text-sm text-(--muted)">PDF up to 5 MB. Choose a file, then select Save profile.</p>
            {profile.cv && <p className="m-0 break-words text-sm text-(--muted)">Saved CV: {profile.cv.name}</p>}
          </>
        )}
        {error && <p role="alert" className="m-0 text-sm text-rose-800 dark:text-rose-300">{error}</p>}
        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" className="min-h-11 cursor-pointer rounded-lg border-0 bg-(--primary) px-4 font-semibold text-(--bg) hover:bg-(--primary-strong)">Save profile</button>
          <p role="status" className="m-0 text-sm font-semibold text-(--primary-strong)">{notice}</p>
        </div>
      </form>
    </section>
  );
}
