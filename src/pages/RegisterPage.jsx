import React, { useState } from "react";
import Container from "../components/Container.jsx";
import RegisterForm from "../components/RegisterForm.jsx";
import gardenPhoto from "../assets/photos/community-gardening.webp";
import cleanupPhoto from "../assets/photos/coastal-cleanup.webp";
import foodPhoto from "../assets/photos/volunteer-food-distribution.webp";

const previews = [
  { label: "Gardens", photo: gardenPhoto, alt: "Neighbors working in a community garden", caption: "Grow something with your neighbors." },
  { label: "Coast", photo: cleanupPhoto, alt: "Volunteers cleaning up a beach", caption: "Spend a morning looking after the shoreline." },
  { label: "Food aid", photo: foodPhoto, alt: "Volunteers carrying boxes of food for distribution", caption: "Help get food to families in your community." },
];

const roles = [
  {
    path: "volunteer",
    name: "Volunteer",
    label: "a volunteer",
    blurb: "Find shifts near you and track your hours.",
  },
  {
    path: "organizations",
    name: "Organization",
    label: "an organization",
    blurb: "Post opportunities and manage your volunteers.",
  },
];

export default function RegisterPage({ audience }) {
  const [selectedRole, setSelectedRole] = useState(null);
  const [preview, setPreview] = useState(previews[0]);
  const role = selectedRole ?? roles.find((item) => item.label === audience) ?? roles[0];

  // Mobile: intro stacks above the form. Desktop: intro and form sit side by side.
  return (
    <Container className="py-12">
      <div className="grid items-start gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:grid-rows-[auto_1fr]">
        <div>
          <h1 className="text-[clamp(2rem,4vw,3.2rem)]">
            Sign up as {role.label}
          </h1>
          <p className="text-(--muted)">{role.blurb}</p>

        </div>
        <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <RegisterForm role={role.path}>
            <fieldset className="m-0 min-w-0 border-0 p-0">
              <legend className="mb-2 p-0 font-medium">Account type</legend>
              <div className="inline-flex max-w-full flex-wrap gap-1 rounded-xl border border-(--line) bg-(--panel) p-1">
                {roles.map((option) => (
                  <button
                    key={option.path}
                    type="button"
                    aria-pressed={role.path === option.path}
                    onClick={() => setSelectedRole(option)}
                    className="min-h-11 cursor-pointer rounded-lg border-0 bg-transparent px-3 text-sm font-semibold text-(--text) hover:bg-(--nav-panel) focus-visible:outline-2 focus-visible:outline-(--primary) aria-pressed:bg-(--primary) aria-pressed:text-white dark:aria-pressed:text-(--bg)"
                  >
                    {option.name}
                  </button>
                ))}
              </div>
            </fieldset>
          </RegisterForm>
        </div>
        <section aria-labelledby="signup-preview" className="lg:col-start-1 lg:row-start-2">
          <h2 id="signup-preview" className="mb-3 font-display text-xl">What could your first shift look like?</h2>
          <div role="group" aria-label="Preview a volunteering activity" className="mb-3 flex flex-wrap gap-2">
            {previews.map((option) => (
              <button key={option.label} type="button" aria-pressed={preview === option}
                onClick={() => setPreview(option)}
                className="min-h-11 cursor-pointer rounded-lg border border-(--line) bg-(--panel) px-3 text-sm font-semibold text-(--text) hover:border-(--primary) focus-visible:outline-2 focus-visible:outline-(--primary) aria-pressed:bg-(--primary) aria-pressed:text-white dark:aria-pressed:text-(--bg)">
                {option.label}
              </button>
            ))}
          </div>
          <figure className="m-0">
            <img src={preview.photo} alt={preview.alt} className="aspect-video w-full rounded-xl object-cover" />
            <figcaption aria-live="polite" className="mt-3 text-sm text-(--muted)">{preview.caption}</figcaption>
          </figure>
        </section>
      </div>
    </Container>
  );
}
