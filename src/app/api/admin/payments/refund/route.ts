import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin-client";
import { logAdminAction } from "@/lib/auditLog";
import { logServerError } from "@/lib/errorLog";

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

  const { data: payment, error: fetchError } = await admin
    .from("payments")
    .select("id, customer_id, amount, status, source, razorpay_payment_id")
    .eq("id", paymentId)
    .maybeSingle();

  if (fetchError || !payment) {
    return NextResponse.json({ error: "Payment not found" }, { status: 404 });
  }
  if (payment.status !== "paid") {
    return NextResponse.json({ error: `Cannot refund a payment with status "${payment.status}"` }, { status: 400 });
  }

  let razorpayRefundId: string | null = null;

  if (payment.source === "razorpay") {
    // Real money moved through Razorpay for this payment — issue an actual
    // refund via their API. Without this, "Refund" here only updated our
    // own records while the customer's money never moved, which is worse
    // than doing nothing (it looks resolved but isn't).
    if (!payment.razorpay_payment_id) {
      return NextResponse.json(
        { error: "This payment has no Razorpay payment ID on record — cannot refund automatically. Contact Razorpay support directly." },
        { status: 400 }
      );
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      return NextResponse.json({ error: "Payments are not configured" }, { status: 500 });
    }

    try {
      const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
      const refund = await razorpay.payments.refund(payment.razorpay_payment_id, {
        amount: payment.amount,
        speed: "normal",
      });
      razorpayRefundId = refund.id;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Razorpay refund failed";
      logServerError("payment.refund", message, { paymentId, razorpay_payment_id: payment.razorpay_payment_id });
      return NextResponse.json({ error: `Razorpay refund failed: ${message}` }, { status: 502 });
    }
  }
  // source === "manual": no real charge exists to refund (nothing was ever
  // paid to Razorpay) — falls through to just updating our own record,
  // which is the correct outcome for a manually-granted unlock.

  const { data: updated, error: updateError } = await admin
    .from("payments")
    .update({ status: "refunded" })
    .eq("id", paymentId)
    .select()
    .single();

  if (updateError) {
    // The Razorpay refund (if any) already succeeded at this point — this
    // is a "recorded but not reflected" state, not a lost-money state.
    logServerError("payment.refund", `Refund succeeded but DB update failed: ${updateError.message}`, {
      paymentId,
      razorpayRefundId,
    });
    return NextResponse.json(
      { error: "Refund was processed but could not be recorded — check /admin/audit-log and update manually." },
      { status: 500 }
    );
  }

  // The refund note (and the Razorpay refund ID, when there is one) is a
  // record of the admin's own action, not part of the payment itself —
  // kept in the audit log entry rather than adding more columns to a
  // money table for it.
  logAdminAction({
    adminId: user.id,
    adminEmail: user.email ?? "unknown",
    action: "payment.refund",
    targetType: "payment",
    targetId: paymentId,
    details: { customerId: payment.customer_id, note: note || null, razorpayRefundId },
    request,
  });

  return NextResponse.json({ ok: true, payment: updated });
}
