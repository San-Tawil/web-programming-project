import React from 'react';
import FormField from './FormField.jsx';

// Phase 1: volunteer sign-up fields live here first. Organization sign-up
// will reuse this form and add its own fields in a later pass, so the
// `role` prop is already here even though only volunteer fields render.
export default function RegisterForm({ role }) {
  const isOrganization = role === 'organizations';

  return (
    <form
      className="grid gap-4 rounded-[22px] border border-(--line) bg-(--panel) p-5 sm:p-6"
      aria-label={isOrganization ? 'Organization sign up' : 'Volunteer sign up'}
    >
      {/* Mobile: one column. Tablet and up: name + email share a row. */}
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Full name" name="name" type="text" autoComplete="name" placeholder="Your name" />
        <FormField label="Email" name="email" type="email" autoComplete="email" placeholder="you@example.com" />
      </div>

      {/* Mobile: one column. Tablet and up: password + confirm share a row. */}
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Password" name="password" type="password" autoComplete="new-password" placeholder="At least 8 characters" />
        <FormField label="Confirm password" name="confirmPassword" type="password" autoComplete="new-password" placeholder="Re-enter your password" />
      </div>

      <button
        type="submit"
        className="inline-flex w-full items-center justify-center rounded-full border border-transparent bg-[#c6f432] px-[1.3rem] py-[0.8rem] font-semibold text-[#08111f] transition sm:w-auto sm:justify-self-start"
      >
        Create account
      </button>
    </form>
  );
}