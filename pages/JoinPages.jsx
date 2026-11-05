import React from 'react';
import { Link } from 'react-router-dom';
import Container from '../components/Container.jsx';

export default function LoginPortalPage({ audience }) {
  return (
    <div className="aid-entry">
      <Container className="py-12">
        <h1>{audience} login portal</h1>
        <p>Login is coming soon.</p>
        <Link className="underline" to="/">Back to Home</Link>
      </Container>
    </div>
  );
}

export function AccountEntryPage({ registration = false }) {
  return (
    <div className="aid-entry">
      <Container className="py-12">
        <h1>{registration ? 'Organization registration' : 'Choose your login portal'}</h1>
        {registration ? (
          <>
            <p>Registration and opportunity posting are coming soon.</p>
            <Link className="underline" to="/organizations/login">Go to the organization login portal</Link>
          </>
        ) : (
          <div className="flex flex-wrap gap-4">
            <Link className="underline" to="/volunteer/login">Volunteer login</Link>
            <Link className="underline" to="/organizations/login">Organization login</Link>
          </div>
        )}
      </Container>
    </div>
  );
}
