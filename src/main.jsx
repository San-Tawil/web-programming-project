import React, { lazy, Suspense, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import AdaptiveNavbar from './components/AdaptiveNavbar.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import Footer from './components/Footer.jsx';
import './styles/index.css';

const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const AccountPage = lazy(() => import('./pages/AccountPage.jsx'));
const OpportunitiesPage = lazy(() => import('./pages/OpportunitiesPage.jsx'));
const AboutPage = lazy(() => import('./pages/AboutPage.jsx'));
const ContactPage = lazy(() => import('./pages/ContactPage.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));

function PageSkeleton({ pathname }) {
  const home = pathname === '/';
  return (
    <div className="aid-page-skeleton" role="status">
      <span className="sr-only">Loading page…</span>
      <div className={home ? 'aid-skeleton-hero' : undefined} aria-hidden="true">
        <div className="aid-skeleton aid-skeleton-title" />
        <div className="aid-skeleton aid-skeleton-line" />
        {home && <div className="aid-skeleton aid-skeleton-button" />}
      </div>
      {pathname === '/opportunities' && (
        <div className="aid-skeleton-grid" aria-hidden="true">
          <div className="aid-skeleton aid-skeleton-card" />
          <div className="aid-skeleton aid-skeleton-card" />
          <div className="aid-skeleton aid-skeleton-card" />
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
    <div className="app-shell flex min-h-screen flex-col">
      <a className="aid-skip-link" href="#main-content">Skip to main content</a>
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
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
);
