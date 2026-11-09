// Browser-local demo accounts. Built-in accounts use a public demo password.
const storageKey = 'aidconnect-demo-accounts';
const attachments = new Map();
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
  const account = [...mockAccounts, ...readAccounts()].find(item => item.email === target);
  return account && { ...account, ...attachments.get(account.id) };
}

function readAccounts() {
  try {
    const accounts = JSON.parse(localStorage.getItem(storageKey) ?? '[]');
    return Array.isArray(accounts) ? accounts : [];
  } catch {
    return [];
  }
}

async function passwordHash(password, salt) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({
    name: 'PBKDF2', hash: 'SHA-256', salt: encoder.encode(salt), iterations: 600000,
  }, key, 256);
  return Array.from(new Uint8Array(bits)).join(',');
}

export async function matchesPassword(account, password) {
  return account.salt
    ? account.hash === await passwordHash(password, account.salt)
    : account.password === password;
}

export async function addAccount({ role, name, email, password, location = "", cv, photo }) {
  const salt = crypto.randomUUID();
  const account = {
    id: crypto.randomUUID(),
    role,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    salt,
    hash: await passwordHash(password, salt),
    location: location.trim(),
  };
  if (findAccount(account.email)) return null;
  localStorage.setItem(storageKey, JSON.stringify([...readAccounts(), account]));
  if (cv || photo) attachments.set(account.id, { cv, photo });
  return { ...account, cv, photo };
}
