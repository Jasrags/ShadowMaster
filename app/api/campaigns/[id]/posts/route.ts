import { NextRequest, NextResponse } from "next/server";
import { getCampaignPosts, createCampaignPost, getCampaignById } from "@/lib/storage/campaigns";
import { getSession } from "@/lib/auth/session";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const posts = await getCampaignPosts(id);
        return NextResponse.json({ success: true, posts });
    } catch {
        return NextResponse.json(
            { success: false, error: "Failed to fetch posts" },
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

        // Only GM and Players can post
        const isGm = campaign.gmId === userId;
        const isPlayer = campaign.playerIds.includes(userId);

        if (!isGm && !isPlayer) {
            return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
        }

        const body = await request.json();

        // Simple validation
        if (!body.title || !body.content || !body.type) {
            return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
        }

        const post = await createCampaignPost(id, {
            title: body.title,
            content: body.content,
            type: body.type,
            isPinned: body.isPinned || false,
            authorId: userId
        });

        return NextResponse.json({ success: true, post });
    } catch (error) {
        console.error("Create post error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to create post" },
            { status: 500 }
        );
    }
}
