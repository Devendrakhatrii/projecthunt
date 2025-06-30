import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/projects/create", "/notifications"];

export function middleware(request: NextRequest) {

  //cookie
  const token = request.cookies.get("token")?.value;

  // Get the pathname
  const path = request.nextUrl.pathname;

  // If protected and token is missing, redirect to login
  if (protectedRoutes.includes(path) && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

// run middleware on these routes
export const config = {
  matcher: ["/projects/create", "/notifications"],
};
