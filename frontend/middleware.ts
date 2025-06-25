// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// const protectedRoutes = ["/projects/create", "/notifications"];

// export function middleware(request: NextRequest) {
//   //cookie
//   const token = request.cookies.get("token")?.value;
//   console.log(token);

//   // Get the pathname
//   const path = request.nextUrl.pathname;

//   // If protected and token is missing, redirect to login
//   if (protectedRoutes.includes(path) && !token) {
//     return NextResponse.redirect(new URL("/auth/login", request.url));
//   }

//   return NextResponse.next();
// }

// // run middleware on these routes
// export const config = {
//   matcher: ["/projects/create", "/notifications"],
// };

import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  console.log("Middleware executed for:", request.nextUrl.pathname);
  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"], // runs on all routes
};
