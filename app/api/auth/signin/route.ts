import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail, updateUser } from "@/lib/storage/users";
import { verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import type { SigninRequest, AuthResponse } from "@/lib/types/user";

export async function POST(request: NextRequest): Promise<NextResponse<AuthResponse>> {
  try {
    const body: SigninRequest = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Update last login
    await updateUser(user.id, {
      lastLogin: new Date().toISOString(),
    });

    // Create session
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        createdAt: user.createdAt,
        lastLogin: new Date().toISOString(),
        characters: user.characters,
      },
    });

    createSession(user.id, response);

    return response;
  } catch (error) {
    console.error("Signin error:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred during signin" },
      { status: 500 }
    );
  }
}

