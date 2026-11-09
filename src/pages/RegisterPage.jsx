import React from "react";
import { Link } from "react-router-dom";
import Container from "../components/Container.jsx";
import RegisterForm from "../components/RegisterForm.jsx";

const roles = [
  {
    path: "volunteer",
    label: "a volunteer",
    blurb: "Find shifts near you and track your hours.",
  },
  {
    path: "organizations",
    label: "an organization",
    blurb: "Post opportunities and manage your volunteers.",
  },
];

export default function RegisterPage({ audience }) {
  const role = roles.find((item) => item.label === audience);

  // Mobile: intro stacks above the form. Desktop: intro and form sit side by side.
  return (
    <Container className="py-12">
      <div className="grid items-start gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="mt-0 mb-3 text-[0.72rem] font-bold tracking-[0.12em] text-(--primary) uppercase">
            Sign up
          </p>
          <h1 className="text-[clamp(2rem,4vw,3.2rem)]">
            Sign up as {audience}
          </h1>
          <p className="text-(--muted)">{role?.blurb}</p>
          <Link className="underline" to="/register">
            Back to account options
          </Link>
        </div>
        <RegisterForm role={role?.path} />
      </div>
    </Container>
  );
}
