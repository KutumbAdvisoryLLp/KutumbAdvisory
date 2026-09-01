import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin-client";
import { sendPaymentConfirmationEmail, sendAdminAlertEmail } from "@/lib/email";
import { FINANCIAL_KUNDALI_PRICE_PAISE } from "@/lib/payment";
import { logServerError } from "@/lib/errorLog";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ error: "Missing payment details" }, { status: 400 });
  }

  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    return NextResponse.json({ error: "Payments are not configured" }, { status: 500 });
  }

  // Razorpay's signature scheme: HMAC-SHA256("order_id|payment_id", key_secret).
  // This is the actual proof that the payment succeeded — everything the
  // client sends is otherwise untrusted.
  const expectedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    logServerError(
      "payment.verify",
      "Signature verification failed",
      { razorpay_order_id, razorpay_payment_id },
      user.id
    );
    sendAdminAlertEmail(
      "Payment signature verification failed",
      `Customer: ${user.id}\nOrder: ${razorpay_order_id}\nPayment: ${razorpay_payment_id}\n\nThe signature Razorpay sent back did not match what we expected. This could mean tampering, or a Razorpay-side issue — check this order in the Razorpay dashboard.`
    );
    return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: order } = await admin
    .from("payments")
    .select("customer_id, amount")
    .eq("razorpay_order_id", razorpay_order_id)
    .maybeSingle();

  if (!order || order.customer_id !== user.id) {
    return NextResponse.json({ error: "Order does not belong to this account" }, { status: 403 });
  }

  const { error: updateError } = await admin
    .from("payments")
    .update({
      status: "paid",
      razorpay_payment_id,
      paid_at: new Date().toISOString(),
    })
    .eq("razorpay_order_id", razorpay_order_id);

  if (updateError) {
    logServerError(
      "payment.verify",
      `Could not record payment: ${updateError.message}`,
      { razorpay_order_id, razorpay_payment_id },
      user.id
    );
    sendAdminAlertEmail(
      "Payment verified but could not be recorded",
      `Customer: ${user.id}\nOrder: ${razorpay_order_id}\nPayment: ${razorpay_payment_id}\n\nRazorpay confirmed this payment (signature verified) but the database update failed: ${updateError.message}\n\nThis customer likely paid but isn't unlocked — check and grant manually from /admin/payments if needed.`
    );
    return NextResponse.json({ error: "Could not record payment" }, { status: 500 });
  }

  // Send payment confirmation email — fire-and-forget
  ;(async () => {
    try {
      const { data: customer } = await admin
        .from("customers")
        .select("full_name, email")
        .eq("id", user.id)
        .maybeSingle();
      if (customer?.email) {
        await sendPaymentConfirmationEmail(
          customer.email,
          customer.full_name || "Valued Client",
          order.amount ?? FINANCIAL_KUNDALI_PRICE_PAISE,
          razorpay_order_id
        );
      }
    } catch (err) {
      console.error("[verify] Payment confirmation email failed:", err);
    }
  })();

  return NextResponse.json({ ok: true });
}
