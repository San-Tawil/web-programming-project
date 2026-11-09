import React, { useState } from "react";
import { Link } from "react-router-dom";
import FormField from "./FormField.jsx";
import { findAccount, addAccount } from "../data/mockAccounts.js";

// One form for both sign-up types. Volunteers fill in the basics;
// organizations (role === 'organizations') get a few extra fields.

const emptyForm = {
  name: "",
  contactName: "",
  email: "",
  location: "",
  description: "",
  password: "",
  confirmPassword: "",
};

function validate(form, isOrganization) {
  const errors = {};
  if (!form.name.trim())
    errors.name = isOrganization
      ? "Enter your organization name."
      : "Enter your full name.";
  if (isOrganization && !form.contactName.trim())
    errors.contactName = "Enter a contact person.";
  if (!/^\S+@\S+\.\S+$/.test(form.email))
    errors.email = "Enter a valid email address.";
  else if (findAccount(form.email))
    errors.email = "An account with this email already exists.";
  if (isOrganization && !form.location.trim())
    errors.location = "Enter where you are based.";
  if (isOrganization && form.description.trim().length < 20)
    errors.description =
      "Describe your organization in at least 20 characters.";
  if (form.password.length < 8) errors.password = "Use at least 8 characters.";
  if (form.confirmPassword !== form.password)
    errors.confirmPassword = "Passwords do not match.";
  return errors;
}

export default function RegisterForm({ role }) {
  const isOrganization = role === "organizations";
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [created, setCreated] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate(form, isOrganization);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const account = addAccount({
      role,
      name: form.name,
      email: form.email,
      password: form.password,
      ...(isOrganization && {
        contactName: form.contactName.trim(),
        location: form.location.trim(),
        description: form.description.trim(),
      }),
    });
    setCreated(account);
  };

  if (created) {
    return (
      <div
        role="status"
        className="grid gap-3 rounded-[22px] border border-(--line) bg-(--panel) p-5 sm:p-6"
      >
        <h2 className="mb-0 text-xl">Welcome, {created.name}!</h2>
        <p className="mb-0 text-(--muted)">
          Your demo account is ready. It only lasts until you refresh the page.
        </p>
        <Link
          className="inline-flex w-full items-center justify-center rounded-full bg-[#c6f432] px-[1.3rem] py-[0.8rem] font-semibold text-[#08111f] sm:w-auto sm:justify-self-start"
          to={
            isOrganization ? "/organizations/dashboard" : "/volunteer/dashboard"
          }
        >
          Go to your dashboard
        </Link>
      </div>
    );
  }

  const emailField = (
    <FormField
      label="Email"
      name="email"
      type="email"
      autoComplete="email"
      placeholder="you@example.com"
      value={form.email}
      onChange={handleChange}
      error={errors.email}
    />
  );

  return (
    <form
      className="grid gap-4 rounded-[22px] border border-(--line) bg-(--panel) p-5 sm:p-6"
      aria-label={isOrganization ? "Organization sign up" : "Volunteer sign up"}
      noValidate
      onSubmit={handleSubmit}
    >
      {/* Mobile: one column. Tablet and up: related fields share a row. */}
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          label={isOrganization ? "Organization name" : "Full name"}
          name="name"
          type="text"
          autoComplete={isOrganization ? "organization" : "name"}
          placeholder={isOrganization ? "Your organization" : "Your name"}
          value={form.name}
          onChange={handleChange}
          error={errors.name}
        />
        {isOrganization ? (
          <FormField
            label="Contact person"
            name="contactName"
            type="text"
            autoComplete="name"
            placeholder="Who volunteers will hear from"
            value={form.contactName}
            onChange={handleChange}
            error={errors.contactName}
          />
        ) : (
          emailField
        )}
      </div>

      {isOrganization && (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            {emailField}
            <FormField
              label="Location"
              name="location"
              type="text"
              placeholder="City or area"
              value={form.location}
              onChange={handleChange}
              error={errors.location}
            />
          </div>
          <FormField
            label="About your organization"
            name="description"
            as="textarea"
            rows="4"
            placeholder="What does your organization do?"
            value={form.description}
            onChange={handleChange}
            error={errors.description}
          />
        </>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
        />
        <FormField
          label="Confirm password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="Re-enter your password"
          value={form.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
        />
      </div>

      <button
        type="submit"
        className="inline-flex w-full items-center justify-center rounded-full border border-transparent bg-[#c6f432] px-[1.3rem] py-[0.8rem] font-semibold text-[#08111f] transition sm:w-auto sm:justify-self-start"
      >
        {isOrganization ? "Create organization account" : "Create account"}
      </button>
    </form>
  );
}
