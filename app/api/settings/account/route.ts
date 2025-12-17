
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { updateUser, getUserById, getUserByEmail, getUserByUsername } from "@/lib/storage/users";

// PUT: Update user account (email/username)
// DELETE: Delete user account
export async function PUT(request: NextRequest) {
    try {
        const userId = await getSession();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const updates = await request.json();
        const { email, username } = updates;

        const user = await getUserById(userId);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Validation
        if (email && email !== user.email) {
            const existingEmail = await getUserByEmail(email);
            if (existingEmail && existingEmail.id !== userId) {
                return NextResponse.json({ error: "Email already in use" }, { status: 400 });
            }
        }

        if (username && username !== user.username) {
            const existingUsername = await getUserByUsername(username);
            if (existingUsername && existingUsername.id !== userId) {
                return NextResponse.json({ error: "Username already taken" }, { status: 400 });
            }
        }

        const updatedUser = await updateUser(userId, {
            ...(email && { email }),
            ...(username && { username }),
        });

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { passwordHash: _unused, ...safeUser } = updatedUser;

        return NextResponse.json({ success: true, user: safeUser });
    } catch (error) {
        console.error("Failed to update account:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE() {
    try {
        const userId = await getSession();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { deleteUser } = await import("@/lib/storage/users");
        // Also need to implement logout/cleanup logic typically, but for now just delete the user record.
        // Ideally we should also delete the session cookie.

        await deleteUser(userId);

        const response = NextResponse.json({ success: true });
        // Clear session cookie
        response.cookies.delete("session");

        return response;
    } catch (error) {
        console.error("Failed to delete account:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
