import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin-client";

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

  const { data: adminRow } = await supabase
    .from("admin_users")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (!adminRow) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const admin = createAdminClient();

  const { data: customer } = await admin
    .from("customers")
    .select("email")
    .eq("id", customerId)
    .maybeSingle();

  const { error } = await admin.auth.admin.deleteUser(customerId);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (customer?.email) {
    await admin
      .from("leads")
      .delete()
      .eq("email", customer.email)
      .eq("primary_goal", "MyKundali Account Registration");
  }

  return NextResponse.json({ ok: true });
}
