
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getUserById, updateUser } from "@/lib/storage/users";
import { verifyPassword, hashPassword } from "@/lib/auth/password";

export async function POST(request: NextRequest) {
    try {
        const userId = await getSession();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { currentPassword, newPassword } = await request.json();

        if (!currentPassword || !newPassword) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        if (newPassword.length < 8) {
            return NextResponse.json({ error: "New password must be at least 8 characters long" }, { status: 400 });
        }

        const user = await getUserById(userId);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Verify current password
        const isValid = await verifyPassword(currentPassword, user.passwordHash);
        if (!isValid) {
            return NextResponse.json({ error: "Incorrect current password" }, { status: 400 });
        }

        // Update password
        const hashedPassword = await hashPassword(newPassword);
        await updateUser(userId, { passwordHash: hashedPassword });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to change password:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
