import { NextRequest, NextResponse } from "next/server";
import { createUser, getUserByEmail, type NewUserData } from "@/lib/storage/users";
import { hashPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { toPublicUser } from "@/lib/auth/middleware";
import { isValidEmail, isStrongPassword, getPasswordStrengthError } from "@/lib/auth/validation";
import { sendVerificationEmail } from "@/lib/auth/email-verification";
import type { SignupRequest, AuthResponse } from "@/lib/types/user";

export async function POST(request: NextRequest): Promise<NextResponse<AuthResponse>> {
  try {
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

    createSession(user.id, response);

    // Send verification email (non-blocking)
    const protocol = request.headers.get("x-forwarded-proto") || "http";
    const host = request.headers.get("host") || "localhost:3000";
    const baseUrl = `${protocol}://${host}`;

    sendVerificationEmail(user.id, user.email, user.username, baseUrl).catch((err) => {
      console.error("Failed to send verification email:", err);
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
