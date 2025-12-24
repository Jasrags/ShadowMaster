import { NextRequest, NextResponse } from "next/server";
import { getCampaignEvents, createCampaignEvent } from "@/lib/storage/campaigns";
import type { CampaignEvent } from "@/lib/types";
import { authorizeCampaign } from "@/lib/auth/campaign";
import { getSession } from "@/lib/auth/session";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const userId = await getSession();
        if (!userId) {
            return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 });
        }

        const { id } = await params;
        const { authorized, role, error, status } = await authorizeCampaign(id, userId, { requireMember: true });

        if (!authorized) {
            return NextResponse.json({ success: false, error }, { status });
        }

        let events: CampaignEvent[] = await getCampaignEvents(id);

        // Filter for players
        if (role !== "gm") {
            events = events.filter(event => event.playerVisible);
        }

        return NextResponse.json({ success: true, events });
    } catch (error) {
        console.error("Get events error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch events" },
            { status: 500 }
        );
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const userId = await getSession();
        if (!userId) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const { authorized, error, status } = await authorizeCampaign(id, userId, { requireGM: true });

        if (!authorized) {
            return NextResponse.json({ success: false, error }, { status });
        }

        const body = await request.json();

        if (!body.title || !body.date || !body.type) {
            return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
        }

        const event = await createCampaignEvent(id, {
            title: body.title,
            description: body.description,
            date: body.date,
            type: body.type,
            playerVisible: body.playerVisible ?? true,
            createdBy: userId
        });

        return NextResponse.json({ success: true, event });
    } catch (error) {
        console.error("Create event error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to create event" },
            { status: 500 }
        );
    }
}
