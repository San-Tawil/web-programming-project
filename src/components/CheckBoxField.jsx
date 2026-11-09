import React from "react";

const errorClasses = "text-sm text-red-600";

// Custom-styled box so the checkbox matches the other form fields instead of
// using the browser default. The checkmark is a clipped ::before shape that
// scales in when the box is checked.
const boxClasses = [
  "mt-0.5 grid size-5 shrink-0 appearance-none place-content-center rounded-md",
  "border border-(--text)/40 bg-white/2 transition",
  "before:size-3 before:scale-0 before:bg-[#08111f] before:transition",
  "before:[clip-path:polygon(14%_44%,0_65%,50%_100%,100%_16%,80%_0%,43%_62%)]",
  "checked:border-[#c6f432] checked:bg-[#c6f432] checked:before:scale-100",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--primary)",
  "aria-[invalid=true]:border-red-600",
].join(" ");

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
          className={boxClasses}
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
