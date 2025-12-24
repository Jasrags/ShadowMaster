import { NextRequest, NextResponse } from "next/server";
import { createUser, getUserByEmail, type NewUserData } from "@/lib/storage/users";
import { hashPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { isValidEmail, isStrongPassword, getPasswordStrengthError } from "@/lib/auth/validation";
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
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
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
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
        characters: user.characters,
        failedLoginAttempts: user.failedLoginAttempts,
        lockoutUntil: user.lockoutUntil,
        sessionVersion: user.sessionVersion,
        preferences: user.preferences,
      },
    });

    createSession(user.id, response);

    return response;
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred during signup" },
      { status: 500 }
    );
  }
}

