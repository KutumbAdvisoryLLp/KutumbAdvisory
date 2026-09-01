import { createAdminClient } from "./supabase/admin-client";

export type FeatureFlagKey =
  | "maintenance_mode_customer_portal"
  | "pause_new_signups"
  | "pause_testimonial_submissions"
  | "pause_payments";

// Every flag in this system means "when true, block/restrict something" —
// so failing open always means returning false (don't block), regardless
// of which flag or why the read failed (missing migration, transient DB
// error, etc). A flag check must never be the reason real functionality
// goes down.
export async function getFeatureFlag(key: FeatureFlagKey): Promise<boolean> {
  try {
    const admin = createAdminClient();
    const { data } = await admin.from("feature_flags").select("enabled").eq("flag_key", key).maybeSingle();
    return data?.enabled ?? false;
  } catch (err) {
    console.error(`[featureFlags] Failed to read flag "${key}", failing open:`, err);
    return false;
  }
}
