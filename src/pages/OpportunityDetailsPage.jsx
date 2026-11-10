
import React from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { causeColors } from "../components/OpportunityGrid.jsx";
import { useDashboardDemo } from "../context/DashboardDemoContext.jsx";
import DashboardNav from "../components/DashboardNav.jsx";
import {
  shiftDate,
  shiftTime,
  spotsFilled,
  listingStatus,
  signupAction,
} from "../data/dashboardDemo.js";
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
  const {
    opportunities,
    signups,
    volunteer,
    dispatch,
    accountRole,
  } = useDashboardDemo();
  const [searchParams] = useSearchParams();
  const fromDashboard = searchParams.get("from") === "dashboard";

  const opportunity = opportunities.find(
    (item) => item.id === id
  );

  if (!opportunity) {
    return <p>Opportunity not found.</p>;
  }

  const availableSpots =
    opportunity.capacity == null
      ? null
      : Math.max(
        0,
        opportunity.capacity - spotsFilled(signups, opportunity.id)
      );
  const signup = signups.find(
    (item) =>
      item.opportunityId === opportunity.id &&
      item.volunteerId === volunteer.id
  );

  const status = listingStatus(opportunity, signups);

  const action = signupAction(
    opportunity,
    signup?.status,
    status
  );
  return (
  <div className={fromDashboard ? "dashboard-shell bg-(--bg) text-(--text)" : ""}>
    {fromDashboard && (
      <DashboardNav
        standalone
        pageTitle="Opportunity Details"
        profile={volunteer}
        otherRole="Organization"
        base="/volunteer/dashboard"
      />
    )}

    <section
      className={
        fromDashboard
          ? "min-h-screen bg-(--bg) py-10 font-body text-(--text)"
          : "py-10"
      }
    >
      <Container>
        <Link
          to={
            fromDashboard
              ? "/volunteer/dashboard?section=find-shifts"
              : "/opportunities"
          }
          className={`mb-6 flex w-fit items-center gap-2 ${
  fromDashboard ? "text-(--primary)" : "text-aid-primary"
}`}
        >
          <ArrowLeft size={18} />
          {fromDashboard ? "Back to Find shifts" : "Back to opportunities"}
        </Link>

        <div className="mb-8">
          <span
            className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold text-[#11201a] ${causeColors[opportunity.cause] ?? "bg-[#f6ef9a]"
              }`}
          >
            {opportunity.cause}
          </span>

          <h1 className="mt-4 text-3xl font-bold text-(--text)">
            {opportunity.title}
          </h1>

          <p className="mt-2 text-(--muted)">
            Organized by {opportunity.organizer ?? "Not specified"}
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

              {opportunity.bring && (
                <div className="mt-6">
                  <h3 className="font-semibold text-(--text)">
                    What to bring
                  </h3>
                  <p className="mt-2 text-(--muted)">
                    {opportunity.bring}
                  </p>
                </div>
              )}
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
                <CalendarDays className={fromDashboard ? "text-(--primary)" : "text-aid-primary"} size={20} />
                <span className="text-(--text)">
                  {opportunity.date
                    ? shiftDate(opportunity.date)
                    : "Not specified"}
                </span>
              </div>

              {/* Time */}
              <div className="grid grid-cols-[20px_1fr] items-center gap-3">
                <Clock className={fromDashboard ? "text-(--primary)" : "text-aid-primary"} size={20} />
                <span className="text-(--text)">
                  {opportunity.startTime && opportunity.endTime
                    ? shiftTime(opportunity)
                    : "Not specified"}
                </span>
              </div>

              {/* Location */}
              <div className="grid grid-cols-[20px_1fr] items-center gap-3">
                <MapPin className={fromDashboard ? "text-(--primary)" : "text-aid-primary"} size={20} />
                <span className="text-(--text)">
                  {opportunity.location}
                </span>
              </div>

              {/* Available spots */}
              <div className="grid grid-cols-[20px_1fr] items-center gap-3">
                <Users className={fromDashboard ? "text-(--primary)" : "text-aid-primary"} size={20} />
                <span className="text-(--text)">
                  {availableSpots === null
                    ? "Not specified"
                    : `${availableSpots} ${availableSpots === 1 ? "spot" : "spots"
                    } available`}
                </span>
              </div>
            </div>

            {accountRole === null ? (
              <Link
                to="/login"
                state={{
                  from: "/volunteer/dashboard?section=find-shifts",
                }}
                className={`mt-8 flex w-full items-center justify-center rounded-xl py-3 font-semibold ${
  fromDashboard
    ? "bg-(--primary) text-(--bg)"
    : "bg-aid-primary text-white"
}`}
              >
                Sign in to join
              </Link>
            ) : accountRole === "volunteer" ? (
              <button
                type="button"
                disabled={action.disabled}
                onClick={() =>
                  dispatch({
                    type: action.type,
                    opportunityId: opportunity.id,
                  })
                }
                className={`mt-8 w-full cursor-pointer rounded-xl py-3 font-semibold disabled:cursor-not-allowed disabled:opacity-60 ${
  fromDashboard
    ? "bg-(--primary) text-(--bg)"
    : "bg-aid-primary text-white"
}`}
              >
                {action.label}
              </button>
            ) : null}
          </div>
        </div>
            </Container>
    </section>
  </div>
);
}
