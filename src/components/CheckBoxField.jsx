import React from "react";

const errorClasses = "text-sm text-red-600";

// Checkbox with a label and optional error text. The label content is passed
// as children so it can include links. Pass `checked` and `onChange` like a
// normal checkbox input.
export default function CheckboxField({
  name,
  error,
  children,
  ...inputProps
}) {
  const describedBy = error ? `${name}-error` : undefined;

  return (
    <div className="grid gap-1">
      <label className="flex items-start gap-3 text-sm text-(--text)">
        <input
          id={name}
          name={name}
          type="checkbox"
          className="mt-0.5 size-5 shrink-0 accent-(--primary)"
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          {...inputProps}
        />
        <span>{children}</span>
      </label>
      {error && (
        <span id={describedBy} className={errorClasses}>
          {error}
        </span>
      )}
    </div>
  );
}
