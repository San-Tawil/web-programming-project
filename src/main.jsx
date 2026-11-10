import React, { lazy, Suspense, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import AdaptiveNavbar from './components/AdaptiveNavbar.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { DashboardDemoProvider } from './context/DashboardDemoContext.jsx';
import Footer from './components/Footer.jsx';

const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const AccountPage = lazy(() => import('./pages/AccountPage.jsx'));
const OpportunitiesPage = lazy(() => import('./pages/OpportunitiesPage.jsx'));
const AboutPage = lazy(() => import('./pages/AboutPage.jsx'));
const ContactPage = lazy(() => import('./pages/ContactPage.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));
const VolunteerDashboard = lazy(() => import('./pages/VolunteerDashboard.jsx'));
const OrganizationDashboard = lazy(() => import('./pages/OrganizationDashboard.jsx'));
const OpportunityFormPage = lazy(() => import("./pages/OpportunityFormPage.jsx"));

function PageSkeleton({ pathname }) {
  const home = pathname === '/';
  return (
    <div className="mx-auto min-h-[65vh] max-w-[70rem] px-5 py-8" role="status">
      <span className="sr-only">Loading page…</span>
      <div className={home ? 'grid min-h-[55vh] content-center rounded-2xl border border-(--placeholder) p-6' : undefined} aria-hidden="true">
        <div className="motion-safe:animate-skeleton mb-4 h-10 w-[min(75%,27rem)] rounded-lg bg-(--placeholder)" />
        <div className="motion-safe:animate-skeleton h-4 w-[min(90%,34rem)] rounded-lg bg-(--placeholder)" />
        {home && <div className="motion-safe:animate-skeleton mt-6 h-11 w-40 rounded-lg bg-(--placeholder)" />}
      </div>
      {(pathname === '/opportunities' || pathname.endsWith('/dashboard')) && (
        <div className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(min(100%,15rem),1fr))] gap-4" aria-hidden="true">
          <div className="motion-safe:animate-skeleton min-h-44 rounded-lg bg-(--placeholder)" />
          <div className="motion-safe:animate-skeleton min-h-44 rounded-lg bg-(--placeholder)" />
          <div className="motion-safe:animate-skeleton min-h-44 rounded-lg bg-(--placeholder)" />
        </div>
      )}
    </div>
  );
}

function App() {
  const { key, pathname } = useLocation();
  const main = useRef(null);
  const previousKey = useRef(key);

  useEffect(() => {
    if (previousKey.current !== key) {
      main.current?.focus();
      previousKey.current = key;
    }
  }, [key]);

  return (
    <div className="group/app flex min-h-screen flex-col has-[.aid-home]:relative">
      <a className="fixed top-3 left-3 z-[100] -translate-y-[200%] bg-(--panel) px-4 py-3 text-(--text) focus:translate-y-0" href="#main-content">Skip to main content</a>
      <AdaptiveNavbar />
      <main ref={main} id="main-content" tabIndex={-1} className="flex-1 has-[.aid-home]:flex has-[.aid-home]:flex-col">
        <Suspense key={pathname} fallback={<PageSkeleton pathname={pathname} />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/opportunities" element={<OpportunitiesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<AccountPage />} />
            <Route path="/register" element={<AccountPage signUp />} />
            <Route path="/volunteer/login" element={<AccountPage audience="a volunteer" />} />
            <Route path="/volunteer/register" element={<AccountPage audience="a volunteer" signUp />} />
            <Route path="/organizations/login" element={<AccountPage audience="an organization" />} />
            <Route path="/organizations/register" element={<AccountPage audience="an organization" signUp />} />
            <Route path="/volunteer/dashboard" element={<VolunteerDashboard />} />
            <Route path="/organizations/dashboard" element={<OrganizationDashboard />} />
            <Route path="/organizations/opportunities/new" element={<OpportunityFormPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <DashboardDemoProvider>
          <App />
        </DashboardDemoProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
);
