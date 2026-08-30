import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin-client";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { data: adminRow } = await supabase
    .from("admin_users")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (!adminRow) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const admin = createAdminClient();

  const { data: customers, error: custErr } = await admin.from("customers").select("id");
  if (custErr) {
    return NextResponse.json({ error: custErr.message }, { status: 500 });
  }

  let deleted = 0;
  for (const c of customers ?? []) {
    const { error } = await admin.auth.admin.deleteUser(c.id);
    if (!error) deleted += 1;
  }

  await admin.from("leads").delete().eq("primary_goal", "MyKundali Account Registration");

  return NextResponse.json({ ok: true, deleted });
}
