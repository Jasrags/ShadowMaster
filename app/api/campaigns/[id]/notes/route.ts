import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getCampaignById, updateCampaign } from "@/lib/storage/campaigns";
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
        const campaign = await getCampaignById(id);

        if (!campaign) {
            return NextResponse.json(
                { success: false, error: "Campaign not found" },
                { status: 404 }
            );
        }

        // Check access
        const isGM = campaign.gmId === userId;
        const isPlayer = campaign.playerIds.includes(userId);

        if (!isGM && !isPlayer) {
            return NextResponse.json(
                { success: false, error: "Access denied" },
                { status: 403 }
            );
        }

        // Filter notes based on role
        let notes = campaign.notes || [];
        if (!isGM) {
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
        const campaign = await getCampaignById(id);

        if (!campaign) {
            return NextResponse.json(
                { success: false, error: "Campaign not found" },
                { status: 404 }
            );
        }

        // Only GM can create notes
        if (campaign.gmId !== userId) {
            return NextResponse.json(
                { success: false, error: "Only the GM can create notes" },
                { status: 403 }
            );
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

        const existingNotes = campaign.notes || [];
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
