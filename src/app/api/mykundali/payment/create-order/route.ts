import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin-client";
import { getFinancialKundaliPricePaise } from "@/lib/payment";
import { getFeatureFlag } from "@/lib/featureFlags";
import { logServerError } from "@/lib/errorLog";

// How long a not-yet-paid order stays reusable — long enough to survive a
// double-click or a page reload mid-checkout, short enough that a genuinely
// abandoned attempt doesn't linger indefinitely.
const RECENT_ORDER_WINDOW_MS = 60 * 60 * 1000;

export async function POST() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (await getFeatureFlag("pause_payments")) {
      return NextResponse.json(
        { error: "Payments are temporarily paused. Please try again shortly." },
        { status: 503 }
      );
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      return NextResponse.json({ error: "Payments are not configured" }, { status: 500 });
    }

    const admin = createAdminClient();
    const AMOUNT_PAISE = await getFinancialKundaliPricePaise(admin);

    const { data: existingPaid } = await admin
      .from("payments")
      .select("id")
      .eq("customer_id", user.id)
      .eq("status", "paid")
      .maybeSingle();
    if (existingPaid) {
      return NextResponse.json(
        { error: "This account has already unlocked the Financial Kundali" },
        { status: 400 }
      );
    }

    // Reuse a recent not-yet-paid order instead of minting a new one every
    // time — otherwise a double-click or a reload mid-checkout creates a
    // fresh duplicate Razorpay order and a fresh orphaned "created" row.
    const { data: existingCreated } = await admin
      .from("payments")
      .select("razorpay_order_id, amount, created_at")
      .eq("customer_id", user.id)
      .eq("status", "created")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (
      existingCreated &&
      Date.now() - new Date(existingCreated.created_at).getTime() < RECENT_ORDER_WINDOW_MS
    ) {
      // Ask Razorpay directly rather than trusting our own "created" status
      // blindly — this is also the best defense available (short of a real
      // webhook) against the case where the customer actually completed
      // payment on Razorpay's side but the client-side verify callback
      // never reached us (closed tab, crash, lost connection). Reopening
      // checkout on an order Razorpay already has as paid would be worse
      // than just minting a fresh one.
      try {
        const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
        const rzOrder = await razorpay.orders.fetch(existingCreated.razorpay_order_id);

        if (rzOrder.status === "paid") {
          await admin
            .from("payments")
            .update({ status: "paid", paid_at: new Date().toISOString() })
            .eq("razorpay_order_id", existingCreated.razorpay_order_id);
          return NextResponse.json(
            { error: "This account has already unlocked the Financial Kundali" },
            { status: 400 }
          );
        }

        if (rzOrder.status === "created" || rzOrder.status === "attempted") {
          return NextResponse.json({
            orderId: existingCreated.razorpay_order_id,
            amount: existingCreated.amount,
            keyId,
          });
        }
        // Any other status falls through to creating a fresh order below.
      } catch (rzFetchErr) {
        console.error("[create-order] Could not verify existing order with Razorpay:", rzFetchErr);
        // Fall through to creating a fresh order rather than blocking the
        // customer on our own inability to reach Razorpay.
      }
    }

    let order;
    try {
      const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
      order = await razorpay.orders.create({
        amount: AMOUNT_PAISE,
        currency: "INR",
        receipt: `kundali_${user.id.slice(0, 8)}_${Date.now()}`,
        notes: { customer_id: user.id },
      });
    } catch (rzErr) {
      console.error("[create-order] Razorpay error:", rzErr);
      return NextResponse.json({ error: "Could not create payment order. Please try again." }, { status: 500 });
    }

    const { error: insertError } = await admin.from("payments").insert({
      customer_id: user.id,
      razorpay_order_id: order.id,
      razorpay_payment_id: null,
      amount: AMOUNT_PAISE,
      status: "created",
      paid_at: null,
    });
    if (insertError) {
      console.error("[create-order] DB insert error:", insertError);
      // FK violation: customer_id not found in customers table
      if (insertError.code === "23503") {
        return NextResponse.json({ error: "Account setup incomplete. Please sign out and sign in again." }, { status: 400 });
      }
      return NextResponse.json({ error: "Could not create order" }, { status: 500 });
    }

    return NextResponse.json({ orderId: order.id, amount: AMOUNT_PAISE, keyId });
  } catch (err) {
    console.error("[create-order] Unexpected error:", err);
    logServerError("payment.create-order", err instanceof Error ? err.message : String(err));
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
