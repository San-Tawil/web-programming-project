import React from 'react';
import Container from './Container.jsx';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-(--line) bg-(--bg) text-(--text)">
      <Container className="py-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-current pb-6">
          <Link to="/" className="text-xl font-bold hover:underline">AidConnect</Link>
          <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-6 gap-y-3">
            <Link to="/" className="hover:underline">Home</Link>
            <Link to="/opportunities" className="hover:underline">Find opportunities</Link>
            <Link to="/organizations/tools" className="hover:underline">Organization tools</Link>
            <Link to="/about" className="hover:underline">About</Link>
            <Link to="/contact" className="hover:underline">Contact us</Link>
          </nav>
        </div>
        <div className="flex flex-wrap justify-between gap-x-6 gap-y-2 pt-5 text-sm">
          <p className="m-0">© 2026 AidConnect</p>
          <p className="m-0">Made by JavaJunkies</p>
        </div>
      </Container>
    </footer>
  );
}
