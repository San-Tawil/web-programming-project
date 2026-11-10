import React from "react";
import { Link } from "react-router-dom";
import Container from "../components/Container.jsx";

const listingsPath = "/organizations/dashboard?section=listings";

export default function OpportunityFormPage() {
  return (
    <Container className="py-12">
      <div className="mx-auto grid max-w-3xl gap-6">
        <div>
          <Link className="text-sm text-(--muted) underline" to={listingsPath}>Back to your listings</Link>
          <h1 className="mt-4 text-[clamp(2rem,4vw,3.2rem)]">Post an opportunity</h1>
          <p className="mb-0 text-(--muted)">Share a program or a single shift with local volunteers.</p>
        </div>
      </div>
    </Container>
  );
}