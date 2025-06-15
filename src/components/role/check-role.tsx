// roleChecker.ts

let cachedRoles: string[] | null = null;

async function fetchUserRoles(): Promise<string[]> {
  if (cachedRoles) return cachedRoles;

  const res = await fetch("/api/user/roles", { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch user roles");

  const data = await res.json();
  cachedRoles = data.roles;
  return cachedRoles || [];
}

const roleChecker = {
  async init() {
    await fetchUserRoles();
  },

  ADMIN() {
    return cachedRoles?.includes("admin") ?? false;
  },

  MANAGER() {
    return cachedRoles?.includes("manager") ?? false;
  },

  CUSTOMER() {
    return cachedRoles?.includes("customer") ?? false;
  },

  reset() {
    cachedRoles = null;
  },
};

export default roleChecker;
