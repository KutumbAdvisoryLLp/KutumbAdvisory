import { createClient } from "@/lib/supabase/server";

// Shared "is this request from a logged-in admin" check for Route Handlers.
// Reuses the same admin_users membership pattern as middleware.ts and
// AdminAuthContext.tsx — a Supabase session alone is not enough.
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { supabase, user: null, isAdmin: false };

  const { data: adminRow } = await supabase
    .from("admin_users")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  return { supabase, user, isAdmin: !!adminRow };
}
