import { betterFetch } from "@better-fetch/fetch";
import type { Session } from "better-auth/types";
import { NextResponse, type NextRequest } from "next/server";

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

  // Protect /admin (must be logged in AND have ADMIN or TEACHER role)
  if (pathname.startsWith("/admin")) {
    if (!data) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    
    // Note: Assuming `role` is accessible via session.user.role
    const role = data.user.role;
    if (role !== "ADMIN" && role !== "TEACHER") {
      // Not allowed
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
  
  // Protect /classroom (must be logged in)
  if (pathname.startsWith("/classroom")) {
    if (!data) {
        return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/classroom/:path*"],
};
