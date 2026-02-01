import { NextRequest, NextResponse } from "next/server";
import { createUser, getUserByEmail, type NewUserData } from "@/lib/storage/users";
import { hashPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { toPublicUser } from "@/lib/auth/middleware";
import { isValidEmail, isStrongPassword, getPasswordStrengthError } from "@/lib/auth/validation";
import { sendVerificationEmail } from "@/lib/auth/email-verification";
import { sendAdminNewUserNotification } from "@/lib/email";
import { RateLimiter } from "@/lib/security/rate-limit";
import { AuditLogger } from "@/lib/security/audit-logger";
import type { SignupRequest, AuthResponse } from "@/lib/types/user";

// Rate limit: 5 signups per hour per IP
const SIGNUP_LIMIT = { windowMs: 60 * 60 * 1000, max: 5 };

export async function POST(request: NextRequest): Promise<NextResponse<AuthResponse>> {
  const ip = request.headers.get("x-forwarded-for") || "unknown";

  try {
    // Rate limiting check (before parsing body)
    const rateLimiter = RateLimiter.get("signup", SIGNUP_LIMIT);
    if (rateLimiter.isRateLimited(ip)) {
      await AuditLogger.log({ event: "signup.rate_limited", ip });
      return NextResponse.json(
        { success: false, error: "Too many signup attempts. Please try again later." },
        { status: 429 }
      );
    }

    const body: SignupRequest = await request.json();
    const { email, username, password } = body;

    // Validate input
    if (!email || !username || !password) {
      return NextResponse.json(
        { success: false, error: "Email, username, and password are required" },
        { status: 400 }
      );
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json({ success: false, error: "Invalid email format" }, { status: 400 });
    }

    // Validate password strength
    if (!isStrongPassword(password)) {
      const errorMessage = getPasswordStrengthError(password);
      return NextResponse.json(
        { success: false, error: errorMessage || "Password does not meet strength requirements" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const userData: NewUserData = {
      email: email.toLowerCase().trim(),
      username: username.trim(),
      passwordHash,
      role: ["user"],
    };

    const user = await createUser(userData);

    // Create session
    const response = NextResponse.json({
      success: true,
      user: toPublicUser(user),
    });

    await createSession(user.id, response);

    // Send verification email (non-blocking)
    const protocol = request.headers.get("x-forwarded-proto") || "http";
    const host = request.headers.get("host") || "localhost:3000";
    const baseUrl = `${protocol}://${host}`;

    sendVerificationEmail(user.id, user.email, user.username, baseUrl).catch((err) => {
      console.error("Failed to send verification email:", err);
    });

    // Send admin notification (non-blocking)
    sendAdminNewUserNotification(user.id, user.email, user.username, new Date()).catch((err) => {
      console.error("Admin notification failed:", err);
    });

    return response;
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred during signup" },
      { status: 500 }
    );
  }
}
