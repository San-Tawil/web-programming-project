import React, { lazy, Suspense, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import Layout from '../components/Layout.jsx';
import AdaptiveNavbar from '../components/AdaptiveNavbar.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import Footer from '../components/Footer.jsx';
import './index.css';

const HomePage = lazy(() => import('../pages/HomePage.jsx'));
const LoginPortalPage = lazy(() => import('../pages/JoinPages.jsx'));
const AccountEntryPage = lazy(() => import('../pages/JoinPages.jsx').then(module => ({ default: module.AccountEntryPage })));
const OpportunitiesPage = lazy(() => import('../pages/OpportunitiesPage.jsx'));
const AboutPage = lazy(() => import('../pages/AboutPage.jsx'));
const ContactPage = lazy(() => import('../pages/ContactPage.jsx'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage.jsx'));

function PageSkeleton() {
  return (
    <div className="aid-page-skeleton" role="status">
      <span className="sr-only">Loading page…</span>
      <div className="aid-skeleton" aria-hidden="true" />
      <div className="aid-skeleton" aria-hidden="true" />
      <div className="aid-skeleton" aria-hidden="true" />
    </div>
  );
}

function RouteFocus() {
  const { key } = useLocation();
  const initialKey = useRef(key);

  useEffect(() => {
    if (key !== initialKey.current) {
      document.getElementById('main-content')?.focus();
      initialKey.current = key;
    }
  }, [key]);

  return null;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
    <BrowserRouter>
      <Layout>
        <a className="aid-skip-link" href="#main-content">Skip to main content</a>
        <AdaptiveNavbar />
        <RouteFocus />

        <main id="main-content" tabIndex={-1}>
          <Suspense fallback={<PageSkeleton />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/opportunities" element={<OpportunitiesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<AccountEntryPage />} />
            <Route path="/register" element={<AccountEntryPage registration />} />
            <Route path="/volunteer/register" element={<LoginPortalPage audience="Volunteer" registration />} />
            <Route path="/organizations/register" element={<LoginPortalPage audience="Organization" registration />} />
            <Route path="/volunteer/login" element={<LoginPortalPage audience="Volunteer" />} />
            <Route path="/organizations/login" element={<LoginPortalPage audience="Organization" />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          </Suspense>
        </main>

        <Footer />
      </Layout>
    </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
