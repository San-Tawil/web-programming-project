import React from 'react';

const labelClasses = 'grid gap-[0.45rem] font-medium text-(--muted)';
const fieldClasses = 'w-full rounded-xl border border-(--line) bg-white/2 px-[0.9rem] py-[0.8rem] text-(--text) focus:outline-2 focus:outline-offset-2 focus:outline-(--primary)';
const errorClasses = 'text-sm text-red-600';

// Shared field wrapper so every form on the site (register, opportunities,
// and later login) renders its label, input, and error text the same way.
// `as` picks the underlying element: 'input' (default), 'textarea', or 'select'.
export default function FormField({ label, name, as = 'input', error, className = '', children, ...fieldProps }) {
  const Field = as;
  const describedBy = error ? `${name}-error` : undefined;

  return (
    <label className={labelClasses}>
      {label}
      <Field
        id={name}
        name={name}
        className={`${fieldClasses} ${className}`}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        {...fieldProps}
      >
        {children}
      </Field>
      {error && <span id={describedBy} className={errorClasses}>{error}</span>}
    </label>
  );
}