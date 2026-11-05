import React from 'react';
import Container from './Container.jsx';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-aid-footer text-white">
      <Container className="py-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/40 pb-6">
          <Link to="/" className="text-xl font-bold hover:underline">AidConnect</Link>
          <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-6 gap-y-3">
            <Link to="/" className="hover:underline">Home</Link>
            <Link to="/opportunities" className="hover:underline">Find opportunities</Link>
            <Link to="/about" className="hover:underline">About</Link>
            <Link to="/contact" className="hover:underline">Contact</Link>
          </nav>
        </div>
        <div className="flex flex-wrap justify-between gap-x-6 gap-y-2 pt-5 text-sm text-white/85">
          <p className="m-0">© 2026 AidConnect</p>
          <p className="m-0">Made by JavaJunkies</p>
        </div>
      </Container>
    </footer>
  );
}
