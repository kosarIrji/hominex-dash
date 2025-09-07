import { NextResponse } from "next/server";
import { url_v1 } from "@/config/urls";

export async function GET(req: Request) {
  try {
    // Get token from query parameters
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token is required" },
        { status: 400 }
      );
    }

    const res = await fetch(url_v1("/admin/consultant-requests/"), {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: "Failed to fetch consultant requests" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/promotions:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
