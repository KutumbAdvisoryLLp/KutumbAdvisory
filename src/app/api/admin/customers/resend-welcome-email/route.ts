import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin-client";
import { sendWelcomeEmail } from "@/lib/email";
import { logAdminAction } from "@/lib/auditLog";

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

  const { data: customer } = await admin
    .from("customers")
    .select("email, full_name")
    .eq("id", customerId)
    .maybeSingle();
  if (!customer) {
    return NextResponse.json({ error: "Customer not found" }, { status: 404 });
  }

  const { error } = await sendWelcomeEmail(customer.email, customer.full_name);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 502 });
  }

  logAdminAction({
    adminId: user.id,
    adminEmail: user.email ?? "unknown",
    action: "customer.resend_welcome_email",
    targetType: "customer",
    targetId: customerId,
    request,
  });

  return NextResponse.json({ ok: true });
}
