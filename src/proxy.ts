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
        return NextResponse.redirect(new URL("/mykundali/assessment/unlock", request.url));
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
