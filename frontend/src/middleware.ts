import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token"); // Get token from cookies
  
  // If the token doesn't exist and the route isn't the login page, redirect to login
  if (!token && req.nextUrl.pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Allow request to proceed
  return NextResponse.next();
}

// Optional: Define protected routes using matcher
export const config = {
  matcher: ["/todos",],
};
