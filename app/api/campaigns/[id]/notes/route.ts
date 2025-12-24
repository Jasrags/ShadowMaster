import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { updateCampaign } from "@/lib/storage/campaigns";
import { authorizeCampaign } from "@/lib/auth/campaign";
import type { CampaignNote } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";

/**
 * GET /api/campaigns/[id]/notes - Get notes for a campaign
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
    try {
        const userId = await getSession();
        if (!userId) {
            return NextResponse.json(
                { success: false, error: "Authentication required" },
                { status: 401 }
            );
        }

        const { id } = await params;
        const { authorized, campaign, role, error, status } = await authorizeCampaign(id, userId, { requireMember: true });

        if (!authorized) {
            return NextResponse.json({ success: false, error }, { status });
        }

        // Filter notes based on role
        let notes = campaign!.notes || [];
        if (role !== "gm") {
            // Players only see player-visible notes
            notes = notes.filter((note) => note.playerVisible);
        }

        return NextResponse.json({
            success: true,
            notes,
        });
    } catch (error) {
        console.error("Get campaign notes error:", error);
        return NextResponse.json(
            { success: false, error: "An error occurred" },
            { status: 500 }
        );
    }
}

/**
 * POST /api/campaigns/[id]/notes - Create a new note (GM-only)
 */
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
    try {
        const userId = await getSession();
        if (!userId) {
            return NextResponse.json(
                { success: false, error: "Authentication required" },
                { status: 401 }
            );
        }

        const { id } = await params;
        const { authorized, campaign, error, status } = await authorizeCampaign(id, userId, { requireGM: true });

        if (!authorized) {
            return NextResponse.json({ success: false, error }, { status });
        }

        const body = await request.json();
        const { title, content, category, playerVisible } = body;

        if (!title || !content) {
            return NextResponse.json(
                { success: false, error: "Title and content are required" },
                { status: 400 }
            );
        }

        const now = new Date().toISOString();
        const newNote: CampaignNote = {
            id: uuidv4(),
            title,
            content,
            category: category || "general",
            playerVisible: playerVisible || false,
            authorId: userId,
            createdAt: now,
            updatedAt: now,
        };

        const existingNotes = campaign!.notes || [];
        await updateCampaign(id, {
            notes: [...existingNotes, newNote],
        });

        return NextResponse.json({
            success: true,
            note: newNote,
        }, { status: 201 });
    } catch (error) {
        console.error("Create campaign note error:", error);
        return NextResponse.json(
            { success: false, error: "An error occurred" },
            { status: 500 }
        );
    }
}
