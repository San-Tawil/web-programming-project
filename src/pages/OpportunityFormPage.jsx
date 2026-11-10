import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "../components/Container.jsx";
import OpportunityForm from "../components/OpportunityForm.jsx";
import RoleToggle from "../components/RoleToggle.jsx";

const listingsPath = "/organizations/dashboard?section=listings";

const kinds = [
  { value: "opportunity", label: "Opportunity" },
  { value: "shift", label: "Shift" },
];

const intros = {
  opportunity: "A program volunteers can join, such as a weekly food drive. You can add shifts to it later.",
  shift: "A single dated session with its own time and capacity. It can stand alone or belong to one of your opportunities.",
};

export default function OpportunityFormPage() {
  const navigate = useNavigate();
  const [kind, setKind] = useState("opportunity");

  return (
    <Container className="py-12">
      <div className="mx-auto grid max-w-3xl gap-6">
        <div>
          <Link className="text-sm text-(--muted) underline" to={listingsPath}>Back to your listings</Link>
          <h1 className="mt-4 text-[clamp(2rem,4vw,3.2rem)]">Post an opportunity</h1>
          <p className="mb-0 text-(--muted)">{intros[kind]}</p>
        </div>
        <RoleToggle label="Listing type" options={kinds} value={kind} onChange={setKind} />
        <div className="rounded-[22px] border border-(--line) bg-(--panel) p-5 sm:p-6">
          {/* key resets the form when the toggle switches between listing types */}
          <OpportunityForm key={kind} kind={kind} onCancel={() => navigate(listingsPath)} onSave={() => navigate(listingsPath)} />
        </div>
      </div>
    </Container>
  );
}