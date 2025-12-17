
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import { getUserCharacters } from "@/lib/storage/characters";

// GET: Export user data
export async function GET() {
    try {
        const userId = await getSession();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await getUserById(userId);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { passwordHash: _unused, ...userProfile } = user;
        const characters = await getUserCharacters(userId);

        const exportData = {
            meta: {
                date: new Date().toISOString(),
                version: "1.0",
                type: "shadow-master-export"
            },
            user: userProfile,
            characters: characters,
        };

        // Return as a downloadable file
        const filename = `shadow-master-export-${new Date().toISOString().split('T')[0]}.json`;

        return new NextResponse(JSON.stringify(exportData, null, 2), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Content-Disposition": `attachment; filename="${filename}"`
            }
        });

    } catch (error) {
        console.error("Failed to export data:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
