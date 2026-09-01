import { createAdminClient } from "./supabase/admin-client";
import { getClientIp } from "./rateLimit";

// Best-effort device label from a server-side User-Agent header — mirrors
// src/lib/deviceInfo.ts's browser-side heuristic, but that file reads
// `navigator` and can't run here.
function deviceLabelFromUserAgent(ua: string | null): string | null {
  if (!ua) return null;

  const browser = /Edg\//.test(ua)
    ? "Edge"
    : /OPR\//.test(ua)
    ? "Opera"
    : /Chrome\//.test(ua)
    ? "Chrome"
    : /Firefox\//.test(ua)
    ? "Firefox"
    : /Safari\//.test(ua)
    ? "Safari"
    : "Browser";

  const os = /Windows/.test(ua)
    ? "Windows"
    : /Mac OS X/.test(ua)
    ? "macOS"
    : /Android/.test(ua)
    ? "Android"
    : /iPhone|iPad|iPod/.test(ua)
    ? "iOS"
    : /Linux/.test(ua)
    ? "Linux"
    : "Unknown OS";

  return `${browser} on ${os}`;
}

interface LogAdminActionInput {
  adminId: string;
  adminEmail: string;
  action: string;
  targetType?: string;
  targetId?: string;
  details?: Record<string, unknown>;
  request?: Request;
}

// Fire-and-forget by design — an audit-log write must never block or fail
// the actual admin action it's recording. Callers should NOT await this if
// they want the request to return immediately; awaiting it is still safe
// (errors are always swallowed here) but not required.
export async function logAdminAction(input: LogAdminActionInput): Promise<void> {
  try {
    const admin = createAdminClient();
    await admin.from("admin_audit_log").insert({
      admin_id: input.adminId,
      admin_email: input.adminEmail,
      action: input.action,
      target_type: input.targetType ?? null,
      target_id: input.targetId ?? null,
      details: (input.details as never) ?? null,
      device_label: input.request ? deviceLabelFromUserAgent(input.request.headers.get("user-agent")) : null,
      ip_address: input.request ? getClientIp(input.request) : null,
    });
  } catch (err) {
    console.error("[auditLog] Failed to record admin action:", err);
  }
}
