// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { url } from "@/config/urls"; // <-- Your backend URL helper

export async function POST(req: Request) {
  try {
    // 🔹 Get body from frontend
    const body = await req.json();

    // 🔹 Forward request to backend
    const response = await fetch(url("/auth/register"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    // 🔹 Parse backend response
    const data = await response.json();

    // 🔹 Return exactly what backend returned
    return NextResponse.json(data, { status: response.status });
  } catch (err) {
    console.error("❌ Proxy error (register):", err);
    return NextResponse.json(
      { ok: false, message: "خطای سرور. دوباره تلاش کنید." },
      { status: 500 }
    );
  }
}
