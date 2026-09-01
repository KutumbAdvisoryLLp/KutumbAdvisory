import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin-client";
import { logAdminAction } from "@/lib/auditLog";

export async function POST(request: Request) {
  const { paymentId } = await request.json();
  if (!paymentId) {
    return NextResponse.json({ error: "Missing paymentId" }, { status: 400 });
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

  const { data: payment, error } = await admin
    .from("payments")
    .update({ status: "revoked" })
    .eq("id", paymentId)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  logAdminAction({
    adminId: user.id,
    adminEmail: user.email ?? "unknown",
    action: "payment.revoke",
    targetType: "payment",
    targetId: paymentId,
    details: { customerId: payment.customer_id },
    request,
  });

  return NextResponse.json({ ok: true, payment });
}
