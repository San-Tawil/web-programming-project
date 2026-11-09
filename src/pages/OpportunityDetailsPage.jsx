
import React from "react";
import { useParams, Link } from "react-router-dom";
import { opportunities, causeColors } from "../components/OpportunityGrid.jsx";
import Container from "../components/Container.jsx";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  Users,
} from "lucide-react";

export default function OpportunityDetailsPage() {
  const { id } = useParams();

  const opportunity = opportunities.find(
    (item) => item.id === id
  );

  if (!opportunity) {
    return <p>Opportunity not found.</p>;
  }

  return (
    <section className="py-10">
      <Container>
        <Link
          to="/opportunities"
          className="mb-6 inline-flex items-center gap-2 text-aid-primary"
        >
          <ArrowLeft size={18} />
          Back to opportunities
        </Link>

        <div className="mb-8">
          <span
            className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold text-[#11201a] ${
                causeColors[opportunity.cause] ?? "bg-[#f6ef9a]"
            }`}
            >
            {opportunity.cause}
            </span>

          <h1 className="mt-4 text-3xl font-bold text-(--text)">
            {opportunity.title}
          </h1>

          <p className="mt-2 text-(--muted)">
            Organized by {opportunity.organization}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left side */}
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-2xl border border-(--line) bg-(--panel) p-6">
              <h2 className="text-xl font-semibold text-(--text)">
                About this opportunity
              </h2>

              <p className="mt-4 text-(--muted)">
                {opportunity.description}
              </p>
            </div>
          </div>

          {/* Right side */}
          <div className="rounded-2xl border border-(--line) bg-(--panel) p-6">
            <h2 className="mb-6 text-xl font-semibold text-(--text)">
              Opportunity Details
            </h2>

            <div className="space-y-5">
              {/* Date */}
              <div className="grid grid-cols-[20px_1fr] items-center gap-3">
                <CalendarDays
                  className="text-aid-primary"
                  size={20}
                />
                <span className="text-(--text)">
                  {opportunity.date}
                </span>
              </div>

              {/* Time */}
              <div className="grid grid-cols-[20px_1fr] items-center gap-3">
                <Clock
                  className="text-aid-primary"
                  size={20}
                />
                <span className="text-(--text)">
                  {opportunity.time}
                </span>
              </div>

              {/* Location */}
              <div className="grid grid-cols-[20px_1fr] items-center gap-3">
                <MapPin
                  className="text-aid-primary"
                  size={20}
                />
                <span className="text-(--text)">
                  {opportunity.location}
                </span>
              </div>

              {/* Available spots */}
              <div className="grid grid-cols-[20px_1fr] items-center gap-3">
                <Users
                  className="text-aid-primary"
                  size={20}
                />
                <span className="text-(--text)">
                  {opportunity.spots} {opportunity.spots === 1 ? "spot" : "spots"} available
                </span>
              </div>
            </div>

            <button
              type="button"
              disabled
              className="mt-8 w-full cursor-not-allowed rounded-xl bg-aid-primary py-3 font-semibold text-white opacity-60"
            >
              Sign up
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
