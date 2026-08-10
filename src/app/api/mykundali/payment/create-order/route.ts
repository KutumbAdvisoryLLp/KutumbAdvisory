import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin-client";

const AMOUNT_PAISE = 99900; // ₹999

export async function POST() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      return NextResponse.json({ error: "Payments are not configured" }, { status: 500 });
    }

    const admin = createAdminClient();

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
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
