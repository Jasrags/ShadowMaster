import { NextResponse } from "next/server";
import { clearSession } from "@/lib/auth/session";
import type { AuthResponse } from "@/lib/types/user";

export async function POST(): Promise<NextResponse<AuthResponse>> {
  try {
    const response = NextResponse.json({
      success: true,
    });

    clearSession(response);

    return response;
  } catch (error) {
    console.error("Signout error:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred during signout" },
      { status: 500 }
    );
  }
}

