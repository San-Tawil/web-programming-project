import React from 'react';
import { Link } from 'react-router-dom';
import Container from '../components/Container.jsx';
import RegisterForm from '../components/RegisterForm.jsx';

const roles = [
  { path: 'volunteer', label: 'a volunteer' },
  { path: 'organizations', label: 'an organization' },
];

export default function AccountPage({ signUp = false, audience }) {
  const action = signUp ? 'Sign up' : 'Log in';
  const path = signUp ? 'register' : 'login';
  const selectedRole = roles.find(r => r.label === audience)?.path;

  return (
    <Container className="py-12">
      <h1>{audience ? `${action} as ${audience}` : action}</h1>
      {audience && signUp ? (
        <div className="mb-6 max-w-2xl">
          <RegisterForm role={selectedRole} />
        </div>
      ) : (
        <p>This page is a placeholder.</p>
      )}
      {audience ? (
        <div className="flex flex-wrap items-center gap-4">
          <Link className="rounded-md bg-aid-primary px-4 py-3 font-semibold text-white hover:underline"
            to={audience === 'a volunteer' ? '/volunteer/dashboard' : '/organizations/dashboard'}>
            Open demo dashboard
          </Link>
          <Link className="underline" to={`/${path}`}>Back to account options</Link>
        </div>
      ) : (
        <div className="flex flex-wrap gap-4">
          {roles.map(role => (
            <Link key={role.path} className="underline" to={`/${role.path}/${path}`}>
              {action} as {role.label}
            </Link>
          ))}
        </div>
      )}
    </Container>
  );
}