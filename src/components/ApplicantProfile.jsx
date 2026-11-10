import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardAvatar from './DashboardAvatar.jsx';
import { isValidWebsite } from '../data/mockAccounts.js';

export default function ApplicantProfile({ applicant, fromListings, completed, ratings, onRate, ownRating }) {
  const [cvUrl, setCvUrl] = useState('');
  const cv = applicant?.cv;
  useEffect(() => {
    if (!cv) return;
    const url = URL.createObjectURL(cv);
    setCvUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [cv]);

  return (
    <section className="rounded-xl border border-(--line) bg-(--panel) p-5 sm:p-6" aria-labelledby="applicant-profile-title">
      <Link to={fromListings ? '/organizations/dashboard?section=listings' : '/organizations/dashboard?section=applications'}
        className="text-(--primary) underline">{fromListings ? 'Back to listings' : 'Back to applications'}</Link>
      <h2 id="applicant-profile-title" className="mt-4">Volunteer profile</h2>
      {applicant ? (
        <>
          <div className="flex items-center gap-3">
            <DashboardAvatar profile={{ name: applicant.volunteer, photo: applicant.photo }} className="size-12" />
            <h3 className="m-0 break-words">{applicant.volunteer}</h3>
          </div>
          <dl className="grid gap-3 break-words sm:grid-cols-2">
            <div><dt className="font-semibold">Completed shifts</dt><dd className="m-0">{completed}</dd></div>
            <div><dt className="font-semibold">Organizer rating</dt><dd className="m-0">
              {ratings.length ? `${(ratings.reduce((sum, stars) => sum + stars, 0) / ratings.length).toFixed(1)} / 5 (${ratings.length})` : 'No ratings yet'}
            </dd></div>
            <div><dt className="font-semibold">Location</dt><dd className="m-0">{applicant.location || 'Not provided'}</dd></div>
            <div><dt className="font-semibold">Phone</dt><dd className="m-0">{applicant.phone || 'Not provided'}</dd></div>
            <div><dt className="font-semibold">Website</dt><dd className="m-0">
              {isValidWebsite(applicant.website ?? '') ? <a href={applicant.website} target="_blank" rel="noopener noreferrer" className="text-(--primary) underline">{applicant.website}</a> : 'Not provided'}
            </dd></div>
            <div><dt className="font-semibold">CV</dt><dd className="m-0">
              {cv && cvUrl ? <a href={cvUrl} download={cv.name} className="text-(--primary) underline">Download {cv.name}</a> : 'Not provided'}
            </dd></div>
          </dl>
          <h3>Bio</h3>
          <p className="whitespace-pre-wrap break-words">{applicant.bio || 'No bio yet.'}</p>
          <h3>Tags</h3>
          {applicant.tags?.length ? (
            <ul className="flex list-none flex-wrap gap-2 p-0">
              {applicant.tags.map(tag => <li key={tag} className="rounded-full bg-(--nav-panel) px-3 py-1 text-sm">{tag}</li>)}
            </ul>
          ) : <p>No tags yet.</p>}
          {onRate && (
            <fieldset className="mt-4 border-0 p-0">
              <legend className="font-semibold">Your organization’s rating</legend>
              <div className="flex flex-wrap gap-1">
                {[1, 2, 3, 4, 5].map(stars => (
                  <button key={stars} type="button" aria-label={`Rate ${stars} out of 5 stars`}
                    aria-pressed={ownRating === stars} onClick={() => onRate(stars)}
                    className="size-11 cursor-pointer rounded-md border border-(--line) text-xl text-(--primary)">
                    {stars <= ownRating ? '★' : '☆'}
                  </button>
                ))}
              </div>
              <p role="status" className="mt-2 text-sm">{ownRating ? `Your rating is ${ownRating} out of 5.` : 'Select a star to save a rating.'}</p>
            </fieldset>
          )}
        </>
      ) : <p>This volunteer profile is unavailable.</p>}
    </section>
  );
}
