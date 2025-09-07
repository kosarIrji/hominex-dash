import { url_v1 } from "@/config/urls";
import { NextResponse } from "next/server";

interface Params {
  params: { id: string };
}

export async function POST(req: Request, { params }: Params) {
  try {
    const { token } = await req.json();
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token is required" },
        { status: 400 }
      );
    }

    const res = await fetch(
      url_v1(`/admin/consultant-requests/${params.id}/approve`),
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
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
