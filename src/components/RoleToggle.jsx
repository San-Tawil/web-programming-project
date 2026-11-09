import React from "react";

// Row of buttons where exactly one option is active, used to switch between
// views on the same page. Options look like { value, label }.
export default function RoleToggle({ label, options, value, onChange }) {
  return (
    <div
      role="group"
      aria-label={label}
      className="flex gap-1 rounded-full border border-(--line) bg-(--panel) p-1"
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${active ? "bg-[#c6f432] text-[#08111f]" : "text-(--muted) hover:text-(--text)"}`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
