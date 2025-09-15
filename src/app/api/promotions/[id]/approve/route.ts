import { url_v1 } from "@/config/urls";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// POST handler for approving consultant requests
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // 👈 params must be awaited
) {
  try {
    const { token } = await req.json();
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token is required" },
        { status: 400 }
      );
    }

    const { id } = await context.params; // 👈 await here

    const res = await fetch(
      url_v1(`/admin/consultant-requests/${id}/approve`),
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Error approving request:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
