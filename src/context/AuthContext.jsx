// Temporary guest adapter. Replace with Melissa's shared AuthContext when it lands.
export function useAuth() {
  return { user: null, logout() {} };
}
