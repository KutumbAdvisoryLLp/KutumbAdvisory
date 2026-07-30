import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

// Service-role client — bypasses RLS entirely. Server-only: never import
// this from a Client Component, it would leak the service role key.
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
