import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin-client";
import { logAdminAction } from "@/lib/auditLog";
import { FINANCIAL_KUNDALI_PRICE_INR, getFinancialKundaliPriceInr } from "@/lib/payment";

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

  const { data: customer } = await admin.from("customers").select("id").eq("id", customerId).maybeSingle();
  if (!customer) {
    return NextResponse.json({ error: "Customer not found" }, { status: 404 });
  }

  const { data: existingPaid } = await admin
    .from("payments")
    .select("id")
    .eq("customer_id", customerId)
    .eq("status", "paid")
    .maybeSingle();
  if (existingPaid) {
    return NextResponse.json({ error: "This customer already has an active unlock" }, { status: 400 });
  }

  const priceInr = await getFinancialKundaliPriceInr(admin);
  const { data: payment, error } = await admin
    .from("payments")
    .insert({
      customer_id: customerId,
      razorpay_order_id: `manual-${randomUUID()}`,
      razorpay_payment_id: null,
      amount: (priceInr || FINANCIAL_KUNDALI_PRICE_INR) * 100,
      status: "paid",
      source: "manual",
      paid_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  logAdminAction({
    adminId: user.id,
    adminEmail: user.email ?? "unknown",
    action: "payment.grant",
    targetType: "payment",
    targetId: payment.id,
    details: { customerId },
    request,
  });

  return NextResponse.json({ ok: true, payment });
}
