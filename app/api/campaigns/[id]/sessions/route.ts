import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getCampaignById, updateCampaign } from "@/lib/storage/campaigns";
import type { CampaignSession } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";

/**
 * GET /api/campaigns/[id]/sessions - Get sessions for a campaign
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

        // All members can see sessions
        const sessions = campaign.sessions || [];

        return NextResponse.json({
            success: true,
            sessions,
        });
    } catch (error) {
        console.error("Get sessions error:", error);
        return NextResponse.json(
            { success: false, error: "An error occurred" },
            { status: 500 }
        );
    }
}

/**
 * POST /api/campaigns/[id]/sessions - Create a session (GM-only)
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

        // Only GM can create sessions
        if (campaign.gmId !== userId) {
            return NextResponse.json(
                { success: false, error: "Only the GM can create sessions" },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { title, scheduledAt, durationMinutes, attendeeIds, notes } = body;

        if (!title || !scheduledAt) {
            return NextResponse.json(
                { success: false, error: "Title and scheduledAt are required" },
                { status: 400 }
            );
        }

        const now = new Date().toISOString();
        const newSession: CampaignSession = {
            id: uuidv4(),
            title,
            scheduledAt,
            durationMinutes: durationMinutes || 180, // Default 3 hours
            status: "scheduled",
            attendeeIds: attendeeIds || campaign.playerIds,
            notes,
            createdAt: now,
            updatedAt: now,
        };

        const existingSessions = campaign.sessions || [];
        await updateCampaign(id, {
            sessions: [...existingSessions, newSession],
        });

        // Log activity and notify players asynchronously
        try {
            const { logActivity } = await import("@/lib/storage/activity");
            const { createNotification } = await import("@/lib/storage/notifications");
            
            await logActivity({
                campaignId: id,
                type: "session_scheduled",
                actorId: userId,
                targetId: newSession.id,
                targetType: "session",
                targetName: newSession.title,
                description: `New session "${newSession.title}" scheduled for ${new Date(newSession.scheduledAt).toLocaleDateString()} at ${new Date(newSession.scheduledAt).toLocaleTimeString()}.`,
            });
            
            // Notify all players
            for (const playerId of campaign.playerIds) {
                await createNotification({
                    userId: playerId,
                    campaignId: id,
                    type: "session_reminder",
                    title: "New Session Scheduled",
                    message: `A new session "${newSession.title}" has been scheduled for ${new Date(newSession.scheduledAt).toLocaleString()}.`,
                    actionUrl: `/campaigns/${id}?tab=calendar`,
                });
            }
        } catch (activityError) {
            console.error("Failed to log session scheduling activity:", activityError);
        }

        return NextResponse.json({
            success: true,
            session: newSession,
        }, { status: 201 });
    } catch (error) {
        console.error("Create session error:", error);
        return NextResponse.json(
            { success: false, error: "An error occurred" },
            { status: 500 }
        );
    }
}
