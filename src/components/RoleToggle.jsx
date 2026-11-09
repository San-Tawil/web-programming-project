import React from "react";

// Row of buttons where exactly one option is active, used to switch between
// views on the same page. Options look like { value, label }.
export default function RoleToggle({ label, options, value, onChange }) {
  return (
    <div
      role="group"
      aria-label={label}
      className="flex gap-1 rounded-full border border-(--text)/25 bg-(--panel) p-1"
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={`flex-1 appearance-none rounded-full border border-transparent px-4 py-2 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--primary) ${
              active
                ? "bg-[#c6f432] text-[#08111f]"
                : "bg-transparent text-(--text) hover:bg-(--text)/10"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
