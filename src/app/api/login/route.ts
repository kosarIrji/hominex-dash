import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { phone, password } = await request.json();

  const res = await fetch("https://your-api.com/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, password }),
  });

  const result = await res.json();

  if (!result.success || !result.data?.access_token) {
    return NextResponse.json(
      { success: false, message: "Invalid login" },
      { status: 401 }
    );
  }

  const { access_token, user } = result.data;

  // Create a session object
  const session = {
    token: access_token,
    user,
  };

  // Save it as a cookie (JSON stringified)
  (await cookies()).set("session", JSON.stringify(session), {
    httpOnly: true,
    secure: true,
    path: "/",
    sameSite: "strict",
    maxAge: 3600,
  });

  return NextResponse.json({ success: true });
}
