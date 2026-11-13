
import React, { useState } from "react";
import { Modal } from "../components/DashboardUI.jsx";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { causeColors } from "../components/OpportunityGrid.jsx";
import { useDashboardDemo } from "../context/DashboardDemoContext.jsx";
import DashboardNav from "../components/DashboardNav.jsx";
import {
  completedShifts,
  initialDemo,
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
  Clock3,
  MapPin,
  Users,
} from "lucide-react";

export default function OpportunityDetailsPage() {
  const { id } = useParams();
  const {
    opportunities,
    signups,
    volunteer,
    organization,
    dispatch,
    accountRole,
  } = useDashboardDemo();
  const [searchParams] = useSearchParams();
  const [showConfirmation, setShowConfirmation] = useState(false);
  
// Check where the user came from to show the correct navigation
  const fromDashboard = searchParams.get("from") === "dashboard";
  const fromOrganization =
    fromDashboard && accountRole === "organizations";
  const fromMyShifts =
    fromDashboard && searchParams.get("section") === "my-shifts";
  const fromMyApplications =
    fromDashboard && searchParams.get("section") === "my-applications";
  const organizationView = accountRole === "organizations";
 
  //Check if shift is completed
  const completedShift = (!organizationView || organization.id === initialDemo.organization.id) && completedShifts.find(
  (shift) => shift.id === id
);

// Find the selected opportunity or completed shift
  const opportunity =
    opportunities.find(item => item.id === id && (!organizationView || item.organizationId === organization.id)) ?? completedShift;

  if (!opportunity) {
    return <Container className="py-10">
      <h1>Opportunity not found</h1>
      <Link to="/opportunities" className="text-(--primary) underline">Back to opportunities</Link>
    </Container>;
  }

  //Calculate the remaining available spots
  const availableSpots =
    opportunity.capacity == null
      ? null
      : Math.max(
        0,
        opportunity.capacity - spotsFilled(signups, opportunity.id)
      );
  // Check if the current volunteer has signed up
  const signup = signups.find(
    (item) =>
      item.opportunityId === opportunity.id &&
      item.volunteerId === volunteer.id
  );
  // Determine the listing status and available signup action
  const status = completedShift
    ? null
    : listingStatus(opportunity, signups);

  const action = completedShift
    ? null
    : signupAction(opportunity, signup?.status, status);
  return (
    <div className={fromDashboard ? "dashboard-shell bg-(--bg) text-(--text)" : ""}>
      {fromDashboard && (
        <DashboardNav
          standalone
          pageTitle="Opportunity Details"
          profile={fromOrganization ? organization : volunteer}
          base={
            fromOrganization
              ? "/organizations/dashboard"
              : "/volunteer/dashboard"
          }
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
              fromOrganization
                ? "/organizations/dashboard?section=listings"
                : fromMyShifts
                  ? "/volunteer/dashboard?section=my-shifts"
                  : fromMyApplications
                    ? "/volunteer/dashboard?section=my-applications"
                    : fromDashboard
                      ? "/volunteer/dashboard?section=find-shifts"
                      : "/opportunities"
            }
            className={`mb-6 flex w-fit items-center gap-2 ${fromDashboard ? "text-(--primary)" : "text-aid-primary"
              }`}
          >
            <ArrowLeft size={18} />
            {fromOrganization
              ? "Back to Listings"
              : fromMyShifts
                ? "Back to My shifts"
                : fromMyApplications
                  ? "Back to My applications"
                  : fromDashboard
                    ? "Back to Find shifts"
                    : "Back to opportunities"}
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

            {!completedShift && (
              <p className="mt-2 text-(--muted)">
                Organized by {opportunity.organizer ?? "Not specified"}
              </p>
            )}
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left side */}
            <div className="space-y-6 lg:col-span-2">
              <div className="rounded-2xl border border-(--line) bg-(--panel) p-6">
                <h2 className="text-xl font-semibold text-(--text)">
                  About this opportunity
                </h2>

                {opportunity.description ? (
                  <p className="mt-4 text-(--muted)">
                    {opportunity.description}
                  </p>
                ) : (
                  <p className="mt-4 text-(--muted)">
                    No additional description was recorded.
                  </p>
                )}

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
                {opportunity.startTime && opportunity.endTime && (
                  <div className="grid grid-cols-[20px_1fr] items-center gap-3">
                    <Clock
                      className={fromDashboard ? "text-(--primary)" : "text-aid-primary"}
                      size={20}
                    />
                    <span className="text-(--text)">
                      {shiftTime(opportunity)}
                    </span>
                  </div>
                )}

                {/* Location */}
                {opportunity.location && (
                  <div className="grid grid-cols-[20px_1fr] items-center gap-3">
                    <MapPin
                      className={fromDashboard ? "text-(--primary)" : "text-aid-primary"}
                      size={20}
                    />
                    <span className="text-(--text)">
                      {opportunity.location}
                    </span>
                  </div>
                )}

                {/* Available spots */}
                <div className="grid grid-cols-[20px_1fr] items-center gap-3">
                  {completedShift ? (
                    <Clock3
                      className={fromDashboard ? "text-(--primary)" : "text-aid-primary"}
                      size={20}
                    />
                  ) : (
                    <Users
                      className={fromDashboard ? "text-(--primary)" : "text-aid-primary"}
                      size={20}
                    />
                  )}
                  <span className="text-(--text)">
                    {completedShift
                      ? `${completedShift.hours} hours completed`
                      : availableSpots === null
                        ? "Not specified"
                        : `${availableSpots} ${availableSpots === 1 ? "spot" : "spots"
                        } available`}
                  </span>
                </div>
              </div>

              {!completedShift &&
                !fromOrganization &&
                accountRole === "volunteer" ? (
                <button
                  type="button"
                  disabled={action.disabled}
                  onClick={() => {
                    if (action.type === "leave") {
                      setShowConfirmation(true);
                    } else {
                      dispatch({
                        type: action.type,
                        opportunityId: opportunity.id,
                      });
                    }
                  }}
                  className={`mt-8 w-full cursor-pointer rounded-xl border px-4 py-3 font-semibold disabled:cursor-not-allowed disabled:opacity-60 ${action.type === "leave"
                    ? "border-red-600 bg-(--panel) text-red-600 hover:bg-red-50 dark:border-red-400 dark:text-red-400 dark:hover:bg-red-950/30"
                    : fromDashboard
                      ? "border-transparent bg-(--primary) text-(--bg)"
                      : "border-transparent bg-aid-primary text-white"
                    }`}
                >
                  {action.label}
                </button>
              ) : accountRole === null && !fromOrganization && !completedShift ? (
                <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/login"
                  state={{
                    from: "/volunteer/dashboard?section=find-shifts",
                  }}
                  className={`inline-flex min-h-11 items-center justify-center rounded-xl px-4 py-3 font-semibold ${fromDashboard
                    ? "bg-(--primary) text-(--bg)"
                    : "bg-aid-primary text-white"
                    }`}
                >
                  Log in to join
                </Link>
                <Link to="/register" className="inline-flex min-h-11 items-center rounded-xl border border-(--line) px-4 py-3 font-semibold">Sign up</Link>
                </div>
              ) : null}
            </div>
          </div>
        </Container>
      </section>

      {/* Confirm before withdrawing an application or cancelling a reservation */}
      {showConfirmation && (
        <Modal
          title={
            signup?.status === "Pending"
              ? "Withdraw application"
              : "Cancel reservation"
          }
          onClose={() => setShowConfirmation(false)}
        >
          <p className="mb-4">
            Are you sure you want to{" "}
            {signup?.status === "Pending"
              ? "withdraw your application"
              : "cancel your reservation"}{" "}
            for <strong>{opportunity.title}</strong>?
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="min-h-11 cursor-pointer rounded-md border border-(--line) bg-(--panel) px-3 text-sm font-semibold text-(--text) hover:border-(--primary)"
              onClick={() => setShowConfirmation(false)}
            >
              {signup?.status === "Pending"
                ? "Keep application"
                : "Keep reservation"}
            </button>

            <button
              type="button"
              className="min-h-11 cursor-pointer rounded-md bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-700"
              onClick={() => {
                dispatch({
                  type: "leave",
                  opportunityId: opportunity.id,
                });
                setShowConfirmation(false);
              }}
            >
              {signup?.status === "Pending"
                ? "Confirm withdrawal"
                : "Confirm cancellation"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
