import { NextResponse, type NextRequest } from "next/server";
import { createMiddlewareClient } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { supabase, response } = createMiddlewareClient(request);

  // getUser() (not getSession()) revalidates the JWT against Supabase Auth
  // on every request — the only safe way to trust a session in middleware/proxy.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdminRoute = pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isCustomerRoute =
    pathname.startsWith("/mykundali/dashboard") ||
    pathname.startsWith("/mykundali/assessment");

  // Maintenance mode covers the customer portal only (not /admin — an
  // admin still needs to work while it's on, and not
  // /mykundali/payment-failed, so nobody mid-checkout gets stranded).
  // /mykundali/maintenance itself is deliberately excluded from the
  // middleware matcher below, so this can never redirect-loop.
  const isMaintenanceGated =
    pathname === "/mykundali" || pathname === "/mykundali/login" || isCustomerRoute;

  if (isMaintenanceGated) {
    const { data: flag } = await supabase
      .from("feature_flags")
      .select("enabled")
      .eq("flag_key", "maintenance_mode_customer_portal")
      .maybeSingle();
    if (flag?.enabled) {
      return NextResponse.redirect(new URL("/mykundali/maintenance", request.url));
    }
  }

  if (isAdminRoute) {
    if (!user) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    const { data: adminRow } = await supabase
      .from("admin_users")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (!adminRow) {
      await supabase.auth.signOut();
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  if (isCustomerRoute) {
    if (!user) {
      return NextResponse.redirect(new URL("/mykundali/login", request.url));
    }
    const { data: customerRow } = await supabase
      .from("customers")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (!customerRow) {
      return NextResponse.redirect(new URL("/mykundali/login", request.url));
    }

    // The dashboard itself is paywalled — the assessment/preview/unlock
    // flow above stays open to everyone so there's a funnel into payment.
    if (pathname.startsWith("/mykundali/dashboard")) {
      const { data: paidRow } = await supabase
        .from("payments")
        .select("id")
        .eq("customer_id", user.id)
        .eq("status", "paid")
        .maybeSingle();

      if (!paidRow) {
        // Don't send someone straight to the payment page unless they
        // actually have a completed assessment to pay for — otherwise a
        // customer who signs up, logs out mid-assessment, and logs back in
        // lands on "Unlock Your Financial Kundali" for a report that
        // doesn't exist yet. Send them back to finish the assessment
        // instead; their progress (family profile, graha answers) resumes
        // automatically.
        const { data: resultsRow } = await supabase
          .from("assessment_results")
          .select("customer_id")
          .eq("customer_id", user.id)
          .maybeSingle();

        const destination = resultsRow ? "/mykundali/assessment/unlock" : "/mykundali/assessment/landing";
        return NextResponse.redirect(new URL(destination, request.url));
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/mykundali/dashboard/:path*",
    "/mykundali/assessment/:path*",
    "/mykundali/login",
    "/mykundali",
  ],
};
