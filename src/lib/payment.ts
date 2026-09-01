// Fallback default — used whenever an admin hasn't set a price in
// site_settings.financial_kundali_price_inr, or the read fails.
export const FINANCIAL_KUNDALI_PRICE_INR = 999;
export const FINANCIAL_KUNDALI_PRICE_PAISE = FINANCIAL_KUNDALI_PRICE_INR * 100;

// Accepts any Supabase client (server, browser, or service-role — their
// exact generic types differ enough that a precise shared interface isn't
// worth it here) with a `.from("site_settings").select().eq().maybeSingle()`
// query builder. site_settings is publicly readable, so this is safe to
// call from client components too.
export async function getFinancialKundaliPriceInr(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any
): Promise<number> {
  try {
    const { data } = await supabase
      .from("site_settings")
      .select("financial_kundali_price_inr")
      .eq("id", 1)
      .maybeSingle();
    return data?.financial_kundali_price_inr ?? FINANCIAL_KUNDALI_PRICE_INR;
  } catch (err) {
    console.error("[payment] Failed to read configured price, using default:", err);
    return FINANCIAL_KUNDALI_PRICE_INR;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getFinancialKundaliPricePaise(supabase: any): Promise<number> {
  // Math.round guards against float imprecision if an admin ever sets a
  // fractional rupee price (e.g. 499.50 * 100 can land on 49949.999999999
  // in JS) — Razorpay requires an integer paise amount, and order creation
  // would silently send a mismatched amount otherwise.
  return Math.round((await getFinancialKundaliPriceInr(supabase)) * 100);
}
