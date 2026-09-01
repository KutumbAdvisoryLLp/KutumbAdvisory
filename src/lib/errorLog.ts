import { createAdminClient } from "./supabase/admin-client";

// Fire-and-forget, same discipline as logAdminAction — recording an error
// must never itself throw or block the route that's reporting it.
export async function logServerError(
  context: string,
  message: string,
  details?: Record<string, unknown>,
  customerId?: string | null
): Promise<void> {
  try {
    const admin = createAdminClient();
    await admin.from("error_log").insert({
      context,
      message,
      details: (details as never) ?? null,
      customer_id: customerId ?? null,
    });
  } catch (err) {
    console.error("[errorLog] Failed to record error:", err);
  }
}
