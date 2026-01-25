import { NextResponse } from "next/server";
import { clearSession, getSession } from "@/lib/auth/session";
import { clearSessionSecretHash } from "@/lib/storage/users";
import { AuditLogger } from "@/lib/security/audit-logger";
import { authLogger } from "@/lib/logging";
import type { AuthResponse } from "@/lib/types/user";

export async function POST(): Promise<NextResponse<AuthResponse>> {
  try {
    // Get user ID before clearing session (for hash cleanup)
    const userId = await getSession();

    const response = NextResponse.json({
      success: true,
    });

    clearSession(response);

    // Clear server-side session secret hash
    if (userId) {
      await clearSessionSecretHash(userId);
      // Log successful signout
      await AuditLogger.log({ event: "signout.success", userId });
    }

    return response;
  } catch (error) {
    authLogger.error({ error }, "Signout error");
    return NextResponse.json(
      { success: false, error: "An error occurred during signout" },
      { status: 500 }
    );
  }
}
