export type Entitlements = {
  plan: "free" | "pro";
  canUseProjects: boolean;
  canUsePrioritySupport: boolean;
};

export async function getEntitlements(_userId: string): Promise<Entitlements> {
  // Placeholder for DB-backed subscription lookup.
  return {
    plan: "free",
    canUseProjects: true,
    canUsePrioritySupport: false
  };
}
