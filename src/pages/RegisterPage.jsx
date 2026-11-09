import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "../components/Container.jsx";
import RegisterForm from "../components/RegisterForm.jsx";
import RoleToggle from "../components/RoleToggle.jsx";

const roles = [
  {
    path: "volunteer",
    label: "a volunteer",
    toggleLabel: "Volunteer",
    blurb: "Find shifts near you and track your hours.",
  },
  {
    path: "organizations",
    label: "an organization",
    toggleLabel: "Organization",
    blurb: "Post opportunities and manage your volunteers.",
  },
];

const toggleOptions = roles.map((item) => ({
  value: item.path,
  label: item.toggleLabel,
}));

export default function RegisterPage({ audience }) {
  const navigate = useNavigate();
  // /register has no audience in the route, so it opens on the volunteer form.
  const role = roles.find((item) => item.label === audience) ?? roles[0];

  // Mobile: intro stacks above the toggle and form. Desktop: intro sits beside them.
  return (
    <Container className="py-12">
      <div className="grid items-start gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="mt-0 mb-3 text-[0.72rem] font-bold tracking-[0.12em] text-(--primary) uppercase">
            Sign up
          </p>
          <h1 className="text-[clamp(2rem,4vw,3.2rem)]">
            Sign up as {role.label}
          </h1>
          <p className="text-(--muted)">{role.blurb}</p>
          <p className="text-sm text-(--muted)">
            Already have an account?{" "}
            <Link className="underline" to="/login">
              Log in
            </Link>
          </p>
        </div>
        <div className="grid gap-4">
          <RoleToggle
            label="Sign up as"
            options={toggleOptions}
            value={role.path}
            onChange={(path) =>
              navigate(`/${path}/register`, { replace: true })
            }
          />
          {/* key resets the form when the toggle switches between sign-up types */}
          <RegisterForm key={role.path} role={role.path} />
        </div>
      </div>
    </Container>
  );
}
