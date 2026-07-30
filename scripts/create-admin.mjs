// Provisions the initial admin account from env vars: creates the Supabase
// Auth user (service-role, bypasses RLS/email confirmation) and inserts the
// matching admin_users row so it can sign in at /admin/login.
//
// Usage: npm run create-admin
// Requires ADMIN_EMAIL, ADMIN_PASSWORD, NEXT_PUBLIC_SUPABASE_URL,
// SUPABASE_SERVICE_ROLE_KEY in .env.local.

import { createClient } from "@supabase/supabase-js";

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!email || !password || !url || !serviceKey) {
  console.error(
    "Missing one of ADMIN_EMAIL, ADMIN_PASSWORD, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY in .env.local"
  );
  process.exit(1);
}

// Polyfill WebSocket for older Node versions since we don't use Realtime features
global.WebSocket = class {};

const supabase = createClient(url, serviceKey);

const { data: existing } = await supabase.auth.admin.listUsers();
const alreadyExists = existing?.users?.find((u) => u.email === email);

let userId = alreadyExists?.id;

if (!userId) {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    console.error("Failed to create admin auth user:", error.message);
    process.exit(1);
  }

  userId = data.user.id;
  console.log(`Created Supabase Auth user ${email} (${userId})`);
} else {
  console.log(`Auth user ${email} already exists (${userId}) — updating password`);
  const { error } = await supabase.auth.admin.updateUserById(userId, { password });
  if (error) {
    console.error("Failed to update existing user's password:", error.message);
    process.exit(1);
  }
}

const { error: insertError } = await supabase
  .from("admin_users")
  .upsert({ id: userId, email }, { onConflict: "id" });

if (insertError) {
  console.error("Auth user is ready, but failed to upsert admin_users row:", insertError.message);
  process.exit(1);
}

console.log(`Admin account ready: ${email} can now sign in at /admin/login`);
