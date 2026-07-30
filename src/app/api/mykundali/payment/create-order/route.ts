import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin-client";

const AMOUNT_PAISE = 99900; // ₹999

export async function POST() {
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

  const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
  const order = await razorpay.orders.create({
    amount: AMOUNT_PAISE,
    currency: "INR",
    receipt: `kundali_${user.id.slice(0, 8)}_${Date.now()}`,
    notes: { customer_id: user.id },
  });

  const { error: insertError } = await admin.from("payments").insert({
    customer_id: user.id,
    razorpay_order_id: order.id,
    razorpay_payment_id: null,
    amount: AMOUNT_PAISE,
    status: "created",
    paid_at: null,
  });
  if (insertError) {
    return NextResponse.json({ error: "Could not create order" }, { status: 500 });
  }

  return NextResponse.json({ orderId: order.id, amount: AMOUNT_PAISE, keyId });
}
