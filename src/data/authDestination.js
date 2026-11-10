// Only allow returning to this app's opportunity details after authentication.
export function authDestination(role, returnTo) {
  return role === 'volunteer' && typeof returnTo === 'string' && /^\/opportunities\/[a-zA-Z0-9-]+$/.test(returnTo)
    ? returnTo : `/${role}/dashboard`;
}
