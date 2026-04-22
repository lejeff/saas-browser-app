import { z } from "zod";

const roleSchema = z.enum(["owner", "admin", "member"]);
export type Role = z.infer<typeof roleSchema>;

export function assertRole(assignedRole: string, allowed: Role[]) {
  const role = roleSchema.parse(assignedRole);
  if (!allowed.includes(role)) {
    throw new Error("Forbidden");
  }
}
