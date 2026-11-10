import React from "react";

// Row of buttons where exactly one option is active, used to switch between
// views on the same page. Options look like { value, label }.
export default function RoleToggle({ label, options, value, onChange }) {
  return (
    <div
      role="group"
      aria-label={label}
      className="flex flex-wrap gap-1 rounded-xl border border-(--text)/25 bg-(--panel) p-1"
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className="min-h-11 flex-1 cursor-pointer rounded-lg border-0 bg-transparent px-3 text-sm font-semibold text-(--text) hover:bg-(--text)/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--primary) aria-pressed:bg-(--primary) aria-pressed:text-white dark:aria-pressed:text-(--bg)"
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
