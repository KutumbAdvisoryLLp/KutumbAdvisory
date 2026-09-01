import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin-client";
import { logAdminAction } from "@/lib/auditLog";

export async function POST(request: Request) {
  const { paymentId, note } = await request.json();
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
    .update({ status: "refunded" })
    .eq("id", paymentId)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // The refund note is a record of the admin's own reasoning, not part of
  // the payment itself — kept in the audit log entry rather than adding
  // another column to a money table for it.
  logAdminAction({
    adminId: user.id,
    adminEmail: user.email ?? "unknown",
    action: "payment.refund",
    targetType: "payment",
    targetId: paymentId,
    details: { customerId: payment.customer_id, note: note || null },
    request,
  });

  return NextResponse.json({ ok: true, payment });
}
