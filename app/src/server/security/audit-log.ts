type AuditEvent = {
  userId: string;
  action: "billing.updated" | "account.updated" | "admin.action";
  metadata?: Record<string, string>;
};

export async function writeAuditEvent(event: AuditEvent) {
  // Replace with persistence in Postgres or event pipeline.
  console.info("AUDIT_EVENT", event);
}
