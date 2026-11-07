import React from 'react';
import { Link } from 'react-router-dom';
import Container from '../components/Container.jsx';

export default function LoginPortalPage({ audience, registration = false }) {
  return (
    <div className="aid-entry">
      <Container className="py-12">
        <h1>{audience} {registration ? 'registration' : 'login portal'}</h1>
        <p>Under progress</p>
        <Link className="underline" to={registration ? '/register' : '/login'}>Back to account options</Link>
      </Container>
    </div>
  );
}

export function AccountEntryPage({ registration = false }) {
  const action = registration ? 'register' : 'login';

  return (
    <div className="aid-entry">
      <Container className="py-12">
        <h1>{registration ? 'Choose how to register' : 'Choose your login portal'}</h1>
        <div className="flex flex-wrap gap-4">
          <Link className="underline" to={'/volunteer/' + action}>{registration ? 'Register as a volunteer' : 'Volunteer login'}</Link>
          <Link className="underline" to={'/organizations/' + action}>{registration ? 'Register as an organization' : 'Organization login'}</Link>
        </div>
      </Container>
    </div>
  );
}
