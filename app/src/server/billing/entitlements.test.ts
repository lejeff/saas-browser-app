import { describe, expect, it } from "vitest";
import { getEntitlements } from "@/server/billing/entitlements";

describe("getEntitlements", () => {
  it("returns free-tier defaults", async () => {
    const result = await getEntitlements("user-1");
    expect(result.plan).toBe("free");
    expect(result.canUseProjects).toBe(true);
    expect(result.canUsePrioritySupport).toBe(false);
  });
});
