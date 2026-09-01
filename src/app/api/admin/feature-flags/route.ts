import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin-client";
import { logAdminAction } from "@/lib/auditLog";
import type { FeatureFlagKey } from "@/lib/featureFlags";

export async function POST(request: Request) {
  const { flagKey, enabled } = await request.json();
  if (!flagKey || typeof enabled !== "boolean") {
    return NextResponse.json({ error: "Missing flagKey or enabled" }, { status: 400 });
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

  const { error } = await admin
    .from("feature_flags")
    .update({ enabled, updated_at: new Date().toISOString(), updated_by: user.email ?? null })
    .eq("flag_key", flagKey as FeatureFlagKey);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  logAdminAction({
    adminId: user.id,
    adminEmail: user.email ?? "unknown",
    action: "feature_flag.toggle",
    targetType: "feature_flag",
    targetId: flagKey,
    details: { enabled },
    request,
  });

  return NextResponse.json({ ok: true });
}
