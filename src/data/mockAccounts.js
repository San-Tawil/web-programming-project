// Phase 1 mock account store shared by the register and login pages.
// It lives in memory only, so a full page refresh resets it to the demo
// accounts below. Passwords are plain text because this is demo data;
// Phase 2 moves accounts to the backend, which will hash them.
// `role` matches the route paths: 'volunteer' or 'organizations'.
export const mockAccounts = [
  {
    id: "volunteer-demo",
    role: "volunteer",
    name: "Maya Haddad",
    email: "maya@example.com",
    password: "password123",
  },
  {
    id: "organizations-demo",
    role: "organizations",
    name: "AidConnect Community",
    email: "team@aidconnect.example",
    password: "password123",
  },
];

export function findAccount(email) {
  const target = email.trim().toLowerCase();
  return mockAccounts.find((account) => account.email === target);
}

export function addAccount({ role, name, email, password }) {
  const account = {
    id: `${role}-${mockAccounts.length + 1}`,
    role,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password,
  };
  mockAccounts.push(account);
  return account;
}
