import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { full_name, email, phone, password } = await request.json();

  const res = await fetch("https://amirpeyravan.ir/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ full_name, email, phone, password }),
  });

  const result = await res.json();

  //   if (!result.success) {
  //     return NextResponse.json(
  //       { success: false, message: "Invalid login" },
  //       { status: 401 }
  //     );
  //   }
  console.log(result);
  return NextResponse.json(result);
}
