import { NextResponse, type NextRequest } from "next/server";
import { createMiddlewareClient } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { supabase, response } = createMiddlewareClient(request);

  // getUser() (not getSession()) revalidates the JWT against Supabase Auth
  // on every request — the only safe way to trust a session in middleware.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdminRoute = pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isCustomerRoute =
    pathname.startsWith("/mykundali/dashboard") ||
    pathname.startsWith("/mykundali/assessment");

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
  matcher: ["/admin/:path*", "/mykundali/dashboard/:path*", "/mykundali/assessment/:path*"],
};
