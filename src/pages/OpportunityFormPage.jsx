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
  const [savedTitle, setSavedTitle] = useState("");
  const [round, setRound] = useState(0);

  return (
    <Container className="py-12">
      <div className="mx-auto grid max-w-3xl gap-6">
        <div>
          <Link className="text-sm text-(--muted) underline" to={listingsPath}>Back to your listings</Link>
          <h1 className="mt-4 text-[clamp(2rem,4vw,3.2rem)]">Post an opportunity</h1>
          <p className="mb-0 text-(--muted)">{intros[kind]}</p>
        </div>
        {savedTitle ? (
          <div role="status" className="grid gap-3 rounded-[22px] border border-(--line) bg-(--panel) p-5 sm:p-6">
            <h2 className="mb-0 text-xl break-words">{savedTitle} is now in the demo catalog.</h2>
            <p className="mb-0 text-(--muted)">It stays until you refresh the page.</p>
            <div className="flex flex-wrap gap-3">
              <Link className="inline-flex min-h-11 items-center rounded-md bg-(--primary) px-4 font-semibold text-white hover:bg-(--primary-strong) dark:text-(--bg)" to={listingsPath}>
                View your listings
              </Link>
              <button type="button" className="min-h-11 cursor-pointer rounded-md border border-(--line) bg-(--bg) px-4 font-semibold text-(--text)"
                onClick={() => { setSavedTitle(""); setRound(count => count + 1); }}>
                Add another
              </button>
            </div>
          </div>
        ) : (
          <>
            <RoleToggle label="Listing type" options={kinds} value={kind} onChange={setKind} />
            <div className="rounded-[22px] border border-(--line) bg-(--panel) p-5 sm:p-6">
              <OpportunityForm key={`${kind}-${round}`} kind={kind} onCancel={() => navigate(listingsPath)} onSave={setSavedTitle} />
            </div>
          </>
        )}
      </div>
    </Container>
  );
}