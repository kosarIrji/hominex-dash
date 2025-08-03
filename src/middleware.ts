import { NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  //   console.log("middleware works");
  //   const { pathname } = request.nextUrl;
  //   // Define protected routes and auth route
  //   const protectedRoutes = ["/", "/dashboard", "/users"];
  //   const authRoute = "/auth";
  //   // Get the token from cookies
  //   const token = request.cookies.get("auth_token")?.value;
  //   // Decode and verify token
  //   let userRole: string | null = null;
  //   if (token) {
  //     try {
  //       const decoded = verify(
  //         token,
  //         process.env.JWT_SECRET || "your-secret"
  //       ) as {
  //         role: string;
  //       };
  //       userRole = decoded.role; // e.g., "admin", "consultant", "regular"
  //     } catch (error) {
  //       console.error("Invalid token:", error);
  //     }
  //   }
  //   // Protect routes
  //   if (protectedRoutes.includes(pathname)) {
  //     if (!token || !userRole) {
  //       return NextResponse.redirect(new URL("/auth", request.url));
  //     }
  //     // Restrict /users route to admins only
  //     if (pathname === "/users" && userRole !== "admin") {
  //       return NextResponse.redirect(new URL("/", request.url));
  //     }
  //   }
  //   // Redirect authenticated users from /auth to home
  //   if (pathname === authRoute && token && userRole) {
  //     return NextResponse.redirect(new URL("/", request.url));
  //   }
  //   // Allow request to proceed and pass user role in headers
  //   const response = NextResponse.next();
  //   if (userRole) {
  //     response.headers.set("x-user-role", userRole);
  //   }
  //   return response;
  // }
  // export const config = {
  //   matcher: ["/", "/dashboard", "/users", "/auth"],
}
