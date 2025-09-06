import { NextRequest, NextResponse } from "next/server";
import { token_name } from "./config/urls";
// use this for production : __Secure-authjs.session-token
// use for dev : authjs.session-token

export function middleware(request: NextRequest) {
  const token = request.cookies.get(token_name)?.value;
  const isAuthPage = request.nextUrl.pathname === "/auth";

  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/auth"],
};
