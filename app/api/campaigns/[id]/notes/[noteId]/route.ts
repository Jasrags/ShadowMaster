import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getCampaignById, updateCampaign } from "@/lib/storage/campaigns";

/**
 * PUT /api/campaigns/[id]/notes/[noteId] - Update a note (GM-only)
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; noteId: string }> }
): Promise<NextResponse> {
    try {
        const userId = await getSession();
        if (!userId) {
            return NextResponse.json(
                { success: false, error: "Authentication required" },
                { status: 401 }
            );
        }

        const { id, noteId } = await params;
        const campaign = await getCampaignById(id);

        if (!campaign) {
            return NextResponse.json(
                { success: false, error: "Campaign not found" },
                { status: 404 }
            );
        }

        // Only GM can update notes
        if (campaign.gmId !== userId) {
            return NextResponse.json(
                { success: false, error: "Only the GM can update notes" },
                { status: 403 }
            );
        }

        const notes = campaign.notes || [];
        const noteIndex = notes.findIndex((n) => n.id === noteId);

        if (noteIndex === -1) {
            return NextResponse.json(
                { success: false, error: "Note not found" },
                { status: 404 }
            );
        }

        const body = await request.json();
        const { title, content, category, playerVisible } = body;

        const updatedNote = {
            ...notes[noteIndex],
            ...(title !== undefined && { title }),
            ...(content !== undefined && { content }),
            ...(category !== undefined && { category }),
            ...(playerVisible !== undefined && { playerVisible }),
            updatedAt: new Date().toISOString(),
        };

        notes[noteIndex] = updatedNote;
        await updateCampaign(id, { notes });

        return NextResponse.json({
            success: true,
            note: updatedNote,
        });
    } catch (error) {
        console.error("Update campaign note error:", error);
        return NextResponse.json(
            { success: false, error: "An error occurred" },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/campaigns/[id]/notes/[noteId] - Delete a note (GM-only)
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; noteId: string }> }
): Promise<NextResponse> {
    try {
        const userId = await getSession();
        if (!userId) {
            return NextResponse.json(
                { success: false, error: "Authentication required" },
                { status: 401 }
            );
        }

        const { id, noteId } = await params;
        const campaign = await getCampaignById(id);

        if (!campaign) {
            return NextResponse.json(
                { success: false, error: "Campaign not found" },
                { status: 404 }
            );
        }

        // Only GM can delete notes
        if (campaign.gmId !== userId) {
            return NextResponse.json(
                { success: false, error: "Only the GM can delete notes" },
                { status: 403 }
            );
        }

        const notes = campaign.notes || [];
        const filteredNotes = notes.filter((n) => n.id !== noteId);

        if (filteredNotes.length === notes.length) {
            return NextResponse.json(
                { success: false, error: "Note not found" },
                { status: 404 }
            );
        }

        await updateCampaign(id, { notes: filteredNotes });

        return NextResponse.json({
            success: true,
        });
    } catch (error) {
        console.error("Delete campaign note error:", error);
        return NextResponse.json(
            { success: false, error: "An error occurred" },
            { status: 500 }
        );
    }
}
