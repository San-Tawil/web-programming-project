import React, { useState } from 'react';
import FormField from './FormField.jsx';

// Phase 1: volunteer sign-up fields live here first. Organization sign-up
// will reuse this form and add its own fields in a later pass, so the
// `role` prop is already here even though only volunteer fields render.

const emptyForm = { name: '', email: '', password: '', confirmPassword: '' };

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = 'Enter your full name.';
  if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Enter a valid email address.';
  if (form.password.length < 8) errors.password = 'Use at least 8 characters.';
  if (form.confirmPassword !== form.password) errors.confirmPassword = 'Passwords do not match.';
  return errors;
}

export default function RegisterForm({ role }) {
  const isOrganization = role === 'organizations';
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const handleChange = event => {
    const { name, value } = event.target;
    setForm(current => ({ ...current, [name]: value }));
  };

  const handleSubmit = event => {
    event.preventDefault();
    setErrors(validate(form));
  };

  return (
    <form
      className="grid gap-4 rounded-[22px] border border-(--line) bg-(--panel) p-5 sm:p-6"
      aria-label={isOrganization ? 'Organization sign up' : 'Volunteer sign up'}
      noValidate
      onSubmit={handleSubmit}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Full name" name="name" type="text" autoComplete="name" placeholder="Your name" value={form.name} onChange={handleChange} error={errors.name} />
        <FormField label="Email" name="email" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={handleChange} error={errors.email} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Password" name="password" type="password" autoComplete="new-password" placeholder="At least 8 characters" value={form.password} onChange={handleChange} error={errors.password} />
        <FormField label="Confirm password" name="confirmPassword" type="password" autoComplete="new-password" placeholder="Re-enter your password" value={form.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />
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