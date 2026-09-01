import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin-client";
import { logAdminAction } from "@/lib/auditLog";

function generateTempPassword(): string {
  // 16 random bytes -> base64url, trimmed to a comfortable length. Not
  // meant to be memorised — the admin relays it once and the customer is
  // expected to change it.
  return randomBytes(16).toString("base64url").slice(0, 20);
}

export async function POST(request: Request) {
  const { customerId } = await request.json();
  if (!customerId) {
    return NextResponse.json({ error: "Missing customerId" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { data: adminRow } = await supabase.from("admin_users").select("id").eq("id", user.id).maybeSingle();
  if (!adminRow) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const admin = createAdminClient();

  const tempPassword = generateTempPassword();
  const { error: updateError } = await admin.auth.admin.updateUserById(customerId, { password: tempPassword });
  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  // Password rotation does NOT instantly invalidate already-issued access
  // tokens (Supabase's admin API has no arbitrary-user session-kill
  // primitive) — clearing our own device_sessions rows at least stops our
  // single-device-login UI from treating the old device as trusted.
  await admin.from("device_sessions").delete().eq("user_id", customerId);

  logAdminAction({
    adminId: user.id,
    adminEmail: user.email ?? "unknown",
    action: "customer.reset_password",
    targetType: "customer",
    targetId: customerId,
    request,
  });

  return NextResponse.json({ ok: true, tempPassword });
}
