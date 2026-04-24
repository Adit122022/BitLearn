import { betterFetch } from "@better-fetch/fetch";
import type { Session } from "better-auth/types";
import { NextResponse, type NextRequest } from "next/server";

// Routes that only ADMIN can access (not TEACHER)
const ADMIN_ONLY_PATHS = [
  "/admin/users",
  "/admin/universities",
  "/admin/teacher-applications",
  "/admin/university-requests",
];

export async function middleware(request: NextRequest) {
  const { data } = await betterFetch<{ session: Session; user: any }>(
    "/api/auth/get-session",
    {
      baseURL: request.nextUrl.origin,
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    },
  );

  const pathname = request.nextUrl.pathname;

  // Protect /dashboard (must be logged in)
  if (pathname.startsWith("/dashboard")) {
    if (!data) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Protect /admin
  if (pathname.startsWith("/admin")) {
    if (!data) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    const role = data.user.role;
    // Must be ADMIN or TEACHER
    if (role !== "ADMIN" && role !== "TEACHER") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    // Admin-only sub-routes: TEACHER cannot access
    const isAdminOnly = ADMIN_ONLY_PATHS.some((p) => pathname.startsWith(p));
    if (isAdminOnly && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  // Protect /classroom (must be logged in)
  if (pathname.startsWith("/classroom")) {
    if (!data) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Protect /university (must be UNIVERSITY_ADMIN only)
  if (pathname.startsWith("/university")) {
    if (!data) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    const role = data.user.role;
    if (role !== "UNIVERSITY_ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/classroom/:path*",
    "/university/:path*",
  ],
};
