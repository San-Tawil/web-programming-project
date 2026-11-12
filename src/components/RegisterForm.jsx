import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authDestination } from "../data/authDestination.js";
import FormField from "./FormField.jsx";
import PhoneField, { readPhone } from "./PhoneField.jsx";
import { useDashboardDemo } from "../context/DashboardDemoContext.jsx";
import { findAccount, addAccount, isValidPhone, isValidWebsite } from "../data/mockAccounts.js";

const emptyForm = {
  firstName: "", lastName: "", organizationName: "", contactName: "",
  email: "", website: "", location: "", description: "", password: "", confirmPassword: "",
};
const uploadClasses = "min-w-0 cursor-pointer text-sm text-(--muted) file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-(--nav-panel) file:px-3 file:py-2 file:font-semibold file:text-(--primary) hover:file:bg-(--line)";

function validate(form, emailIsValid, isOrganization, { number, phone, code, invalidCode }) {
  const errors = {};
  if (isOrganization) {
    if (!form.organizationName.trim()) errors.organizationName = "Enter your organization name.";
    if (!form.contactName.trim()) errors.contactName = "Enter a contact person.";
  } else {
    if (!form.firstName.trim()) errors.firstName = "Enter your first name.";
    if (!form.lastName.trim()) errors.lastName = "Enter your last name.";
  }
  if (!code || invalidCode) errors.phone = "Select a country calling code.";
  else if (!number || number.startsWith('+') || !isValidPhone(phone)) {
    errors.phone = "Enter a phone number with 7 to 15 digits.";
  }
  if (form.website.trim() && !isValidWebsite(form.website.trim())) {
    errors.website = "Enter a website URL starting with https:// or http://.";
  }
  if (!emailIsValid) errors.email = "Enter a valid email address.";
  else if (findAccount(form.email))
    errors.email = "An account with this email already exists.";
  if (isOrganization && !form.location.trim()) errors.location = "Enter where you are based.";
  if (isOrganization && form.description.trim().length < 20)
    errors.description = "Describe your organization in at least 20 characters.";
  if (form.password.length < 8) errors.password = "Use at least 8 characters.";
  if (form.confirmPassword !== form.password)
    errors.confirmPassword = "Passwords do not match.";
  return errors;
}

export default function RegisterForm({ role, children }) {
  const isOrganization = role === "organizations";
  const navigate = useNavigate();
  const { state } = useLocation();
  const { selectAccount } = useDashboardDemo();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const handleChange = (event) => {
    const { name, value, validity } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({
      ...current,
      [name]: name === "email" && value && !validity.valid
        ? "Enter a valid email address."
        : undefined,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (saving) return;
    const emailField = event.currentTarget.elements.namedItem("email");
    const phone = readPhone(event.currentTarget.elements, 'phone');
    const nextErrors = validate(form, emailField.validity.valid, isOrganization, phone);
    setErrors(nextErrors);
    const firstError = Object.keys(nextErrors)[0];
    if (firstError) {
      event.currentTarget.elements.namedItem(firstError === 'phone' && !phone.code ? 'phone-code' : firstError).focus();
      return;
    }

    const fields = event.currentTarget.elements;
    setSaving(true);
    try {
      const account = await addAccount({
        role,
        name: isOrganization ? form.organizationName : `${form.firstName.trim()} ${form.lastName.trim()}`,
        email: form.email,
        phone: phone.phone,
        website: form.website,
        password: form.password,
        location: form.location,
        contactName: form.contactName,
        description: form.description,
        cv: fields.namedItem("cv")?.files[0],
        photo: fields.namedItem("photo")?.files[0],
      });
      if (!account) {
        setErrors({ email: "An account with this email already exists." });
        return;
      }
      selectAccount(account);
      navigate(authDestination(account.role, state?.returnTo), { replace: true });
    } catch {
      setErrors({ form: "Your account could not be saved in this browser. Try again." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      className="grid min-w-0 gap-5"
      aria-label={isOrganization ? "Organization sign up" : "Volunteer sign up"}
      noValidate
      onSubmit={handleSubmit}
    >
      {children}
      {isOrganization ? (
        <>
          <FormField
            label="Organization name *"
            name="organizationName"
            autoComplete="organization"
            required
            value={form.organizationName}
            onChange={handleChange}
            error={errors.organizationName}
          />
          <FormField
            label="Contact person *"
            name="contactName"
            autoComplete="name"
            required
            value={form.contactName}
            onChange={handleChange}
            error={errors.contactName}
          />
        </>
      ) : (
        <>
          <FormField
            label="First name *"
            name="firstName"
            autoComplete="given-name"
            required
            value={form.firstName}
            onChange={handleChange}
            error={errors.firstName}
          />
          <FormField
            label="Last name *"
            name="lastName"
            autoComplete="family-name"
            required
            value={form.lastName}
            onChange={handleChange}
            error={errors.lastName}
          />
        </>
      )}
      <FormField
        label="Email *"
        name="email"
        type="email"
        autoComplete="email"
        pattern=".+@.+\..+"
        required
        className="aria-invalid:border-rose-800/60 dark:aria-invalid:border-rose-300/60"
        placeholder="you@example.com"
        value={form.email}
        onChange={handleChange}
        error={errors.email}
      />
      <PhoneField name="phone" required error={errors.phone} />
      <FormField label="Website URL (optional)" name="website" type="url" autoComplete="url" maxLength={500}
        placeholder="https://example.com" value={form.website} onChange={handleChange} error={errors.website} />
      <FormField
        label={isOrganization ? "City or area *" : "City or area (optional)"}
        name="location"
        autoComplete="address-level2"
        placeholder="e.g. Beirut"
        required={isOrganization}
        value={form.location}
        onChange={handleChange}
        error={errors.location}
      />
      {isOrganization && (
        <FormField
          label="About your organization *"
          name="description"
          as="textarea"
          rows={4}
          required
          minLength={20}
          value={form.description}
          onChange={handleChange}
          error={errors.description}
        />
      )}
      <FormField
        label="Password *"
        name="password"
        type="password"
        autoComplete="new-password"
        required
        minLength={8}
        placeholder="At least 8 characters"
        value={form.password}
        onChange={handleChange}
        error={errors.password}
      />
      <FormField
        label="Confirm password *"
        name="confirmPassword"
        type="password"
        autoComplete="new-password"
        required
        placeholder="Re-enter your password"
        value={form.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
      />
      {role === "volunteer" && (
        <>
          <div className="grid min-w-0 gap-1">
            <FormField label="CV (optional)" name="cv" type="file" accept=".pdf,.doc,.docx" className={uploadClasses} aria-describedby="cv-formats" />
            <p id="cv-formats" className="m-0 text-xs text-(--muted)">PDF, DOC, or DOCX</p>
          </div>
          <div className="grid min-w-0 gap-1">
            <FormField label="Profile photo (optional)" name="photo" type="file" accept="image/jpeg,image/png,image/webp" className={uploadClasses} aria-describedby="photo-formats" />
            <p id="photo-formats" className="m-0 text-xs text-(--muted)">JPG, PNG, or WebP</p>
          </div>
        </>
      )}
      {errors.form && <p role="alert" className="m-0 text-sm text-rose-800 dark:text-rose-300">{errors.form}</p>}
      <button
        type="submit"
        disabled={saving}
        className="w-full cursor-pointer rounded-xl border-0 bg-(--primary) px-5 py-3 font-semibold text-white hover:bg-(--primary-strong) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--primary) disabled:opacity-60 dark:text-(--bg) sm:w-auto sm:justify-self-start"
      >
        {saving ? "Creating account…" : isOrganization ? "Create organization account" : "Create account"}
      </button>
    </form>
  );
}
