import { NextRequest, NextResponse } from "next/server";
import { getCampaignEvents, createCampaignEvent, getCampaignById } from "@/lib/storage/campaigns";
import { getSession } from "@/lib/auth/session";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const events = await getCampaignEvents(id);
        return NextResponse.json({ success: true, events });
    } catch {
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
        const campaign = await getCampaignById(id);
        if (!campaign) {
            return NextResponse.json({ success: false, error: "Campaign not found" }, { status: 404 });
        }

        if (campaign.gmId !== userId) {
            return NextResponse.json({ success: false, error: "Only GM can create events" }, { status: 403 });
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
