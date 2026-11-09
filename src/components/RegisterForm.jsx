import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormField from "./FormField.jsx";
import { useDashboardDemo } from "../context/DashboardDemoContext.jsx";
import { findAccount, addAccount } from "../data/mockAccounts.js";

const emptyForm = { firstName: "", lastName: "", email: "", location: "", password: "", confirmPassword: "" };
const uploadClasses = "min-w-0 cursor-pointer text-sm text-(--muted) file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-(--nav-panel) file:px-3 file:py-2 file:font-semibold file:text-(--primary) hover:file:bg-(--line)";

function validate(form, emailIsValid) {
  const errors = {};
  if (!form.firstName.trim()) errors.firstName = "Enter your first name.";
  if (!form.lastName.trim()) errors.lastName = "Enter your last name.";
  if (!emailIsValid) errors.email = "Enter a valid email address.";
  else if (findAccount(form.email))
    errors.email = "An account with this email already exists.";
  if (form.password.length < 8) errors.password = "Use at least 8 characters.";
  if (form.confirmPassword !== form.password)
    errors.confirmPassword = "Passwords do not match.";
  return errors;
}

export default function RegisterForm({ role, children }) {
  const navigate = useNavigate();
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
    const nextErrors = validate(form, emailField.validity.valid);
    setErrors(nextErrors);
    const firstError = Object.keys(nextErrors)[0];
    if (firstError) {
      event.currentTarget.elements.namedItem(firstError).focus();
      return;
    }

    const fields = event.currentTarget.elements;
    setSaving(true);
    try {
      const account = await addAccount({
        role,
        name: `${form.firstName.trim()} ${form.lastName.trim()}`,
        email: form.email,
        password: form.password,
        location: role === "volunteer" ? form.location : "",
        cv: fields.namedItem("cv")?.files[0],
        photo: fields.namedItem("photo")?.files[0],
      });
      if (!account) {
        setErrors({ email: "An account with this email already exists." });
        return;
      }
      selectAccount(account);
      navigate(`/${account.role}/dashboard`, { replace: true });
    } catch {
      setErrors({ form: "Your account could not be saved in this browser. Try again." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      className="grid gap-4 rounded-[22px] border border-(--line) bg-(--panel) p-5 sm:p-6"
      aria-label={role === "organizations" ? "Organization sign up" : "Volunteer sign up"}
      noValidate
      onSubmit={handleSubmit}
    >
      {children}
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
      <FormField
        label="Email *"
        name="email"
        type="email"
        autoComplete="email"
        pattern=".+@.+\..+"
        required
        className="aria-invalid:border-red-600 dark:aria-invalid:border-red-300"
        placeholder="you@example.com"
        value={form.email}
        onChange={handleChange}
        error={errors.email}
      />
      {role === "volunteer" && (
        <FormField
          label="City or area (optional)"
          name="location"
          autoComplete="address-level2"
          placeholder="e.g. Beirut"
          value={form.location}
          onChange={handleChange}
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
      {errors.form && <p role="alert" className="m-0 text-sm text-red-700 dark:text-red-300">{errors.form}</p>}
      <button
        type="submit"
        disabled={saving}
        className="w-full cursor-pointer rounded-xl border-0 bg-(--primary) px-5 py-3 font-semibold text-white hover:bg-(--primary-strong) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--primary) disabled:opacity-60 dark:text-(--bg) sm:w-auto sm:justify-self-start"
      >
        {saving ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}
