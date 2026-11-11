import React, { lazy, Suspense, useEffect, useRef } from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,

  useLocation,
} from "react-router-dom";

import AdaptiveNavbar from "./components/AdaptiveNavbar.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { DashboardDemoProvider, useDashboardDemo } from "./context/DashboardDemoContext.jsx";
import { OpportunitiesProvider } from "./context/OpportunitiesContext.jsx";
import Footer from "./components/Footer.jsx";

import HomePage from "./pages/HomePage.jsx";

const OrganizationToolsPage = lazy(() => import("./pages/OrganizationToolsPage.jsx"));
const OrganizationOverviewPage = lazy(() => import("./pages/OpportunityDetailPage.jsx"));
const OpportunitiesPage = lazy(() => import("./pages/OpportunitiesPage.jsx"));
const AboutPage = lazy(() => import("./pages/AboutPage.jsx"));
const ContactPage = lazy(() => import("./pages/ContactPage.jsx"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage.jsx"));

const OpportunityFormPage = lazy(() => import("./pages/OpportunityFormPage.jsx"));

const OpportunityDetailsPage = lazy(() =>
  import("./pages/OpportunityDetailsPage.jsx")
);

const VolunteerDashboard = lazy(() =>
  import("./pages/VolunteerDashboard.jsx")
);
const OrganizationDashboard = lazy(() =>
  import("./pages/OrganizationDashboard.jsx")
);

const Login = lazy(() => import("./pages/Login.jsx"));
const RegisterPage = lazy(() => import("./pages/RegisterPage.jsx"));
function PageSkeleton({ pathname }) {
  const home = pathname === "/";
  return (
    <div className="mx-auto min-h-[65vh] max-w-[70rem] px-5 py-8" role="status">
      <span className="sr-only">Loading page…</span>
      <div
        className={
          home
            ? "grid min-h-[55vh] content-center rounded-2xl border border-(--placeholder) p-6"
            : undefined
        }
        aria-hidden="true"
      >
        <div className="motion-safe:animate-skeleton mb-4 h-10 w-[min(75%,27rem)] rounded-lg bg-(--placeholder)" />
        <div className="motion-safe:animate-skeleton h-4 w-[min(90%,34rem)] rounded-lg bg-(--placeholder)" />
        {home && (
          <div className="motion-safe:animate-skeleton mt-6 h-11 w-40 rounded-lg bg-(--placeholder)" />
        )}
      </div>
      {(pathname === "/opportunities" || pathname.endsWith("/dashboard")) && (
        <div
          className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(min(100%,15rem),1fr))] gap-4"
          aria-hidden="true"
        >
          <div className="motion-safe:animate-skeleton min-h-44 rounded-lg bg-(--placeholder)" />
          <div className="motion-safe:animate-skeleton min-h-44 rounded-lg bg-(--placeholder)" />
          <div className="motion-safe:animate-skeleton min-h-44 rounded-lg bg-(--placeholder)" />
        </div>
      )}
    </div>
  );
}

function App() {
  const { accountRole } = useDashboardDemo();
  const { pathname, hash, search } = useLocation();
  const dashboard = /^\/(volunteer|organizations)\/dashboard(?:\/profile)?\/?$/.test(pathname);
  const fromDashboard =
    pathname.startsWith("/opportunities/") &&
    new URLSearchParams(search).get("from") === "dashboard";
  const dashboardProfile = dashboard && /\/profile\/?$/.test(pathname);
  const Content = dashboard ? 'div' : 'main';
  const main = useRef(null);
  const previousKey = useRef(pathname + hash);


  useEffect(() => {
    if (previousKey.current !== pathname + hash) {
      if (dashboard) {
        window.scrollTo(0, 0);
      }

    if (!dashboard) {
      main.current?.focus({ preventScroll: true });
      if (!hash) window.scrollTo({ top: 0, behavior: 'instant' });
    }

      previousKey.current = pathname + hash;
    }
  }, [pathname, dashboard, hash]);

  return (
    <div
      className={`group/app flex min-h-screen flex-col has-[.aid-home]:relative ${dashboard ? "dashboard-route" : ""
        }`}
    >
      <a
        className="fixed top-3 left-3 z-[100] -translate-y-[200%] bg-(--panel) px-4 py-3 text-(--text) focus:translate-y-0"
        href={dashboardProfile ? '#profile-settings' : dashboard ? '#overview' : '#main-content'}
      >
        Skip to main content
      </a>
      {!dashboard && !fromDashboard && <AdaptiveNavbar />}
      <Content
        ref={main}
        id="main-content"
        tabIndex={-1}
        className="flex-1 has-[.aid-home]:flex has-[.aid-home]:flex-col"
      >
        <Suspense
          key={pathname}
          fallback={<PageSkeleton pathname={pathname} />}
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/opportunities" element={<OpportunitiesPage />} />
            <Route path="/organizations/tools" element={<OrganizationToolsPage />} />
            <Route path="/opportunities/:opportunityId/organization" element={<OrganizationOverviewPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route
              path="/volunteer/login"
              element={<Navigate to="/login" replace />}
            />
            <Route
              path="/volunteer/register"
              element={<RegisterPage audience="a volunteer" />}
            />

            <Route
              path="/organizations/login"
              element={<Navigate to="/login" replace />}
            />
            <Route
              path="/organizations/register"
              element={<RegisterPage audience="an organization" />}
            />

            <Route
              path="/volunteer/dashboard"
              element={accountRole === "organizations" ? <Navigate to="/organizations/dashboard" replace /> : <VolunteerDashboard />}
            />
            <Route
              path="/organizations/dashboard"
              element={<OrganizationDashboard />}
            />

            <Route
              path="/volunteer/dashboard/profile"
              element={accountRole === "organizations" ? <Navigate to="/organizations/dashboard" replace /> : <VolunteerDashboard />}
            />
            <Route
              path="/organizations/opportunities/new"
              element={<OpportunityFormPage />}
            />
            <Route
              path="/organizations/dashboard/profile"
              element={<OrganizationDashboard />}
            />

            <Route
              path="/opportunities/:id"
              element={<OpportunityDetailsPage />}
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </Content>
      {!dashboard && !fromDashboard && <Footer />}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <DashboardDemoProvider>
          <OpportunitiesProvider><App /></OpportunitiesProvider>
        </DashboardDemoProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
);
