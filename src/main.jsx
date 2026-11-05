import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from '../components/Layout.jsx';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import HomePage from '../pages/HomePage.jsx';
import LoginPortalPage, { AccountEntryPage } from '../pages/JoinPages.jsx';
import OpportunitiesPage from '../pages/OpportunitiesPage.jsx';
import AboutPage from '../pages/AboutPage.jsx';
import ContactPage from '../pages/ContactPage.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';

import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Layout>
        <Navbar />

        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/opportunities" element={<OpportunitiesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<AccountEntryPage />} />
            <Route path="/register" element={<AccountEntryPage registration />} />
            <Route path="/volunteer/login" element={<LoginPortalPage audience="Volunteer" />} />
            <Route path="/organizations/login" element={<LoginPortalPage audience="Organization" />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        <Footer />
      </Layout>
    </BrowserRouter>
  </React.StrictMode>
);
