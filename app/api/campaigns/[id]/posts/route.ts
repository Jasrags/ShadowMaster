import { NextRequest, NextResponse } from "next/server";
import { getCampaignPosts, createCampaignPost } from "@/lib/storage/campaigns";
import type { CampaignPost } from "@/lib/types";
import { getSession } from "@/lib/auth/session";
import { authorizeMember } from "@/lib/auth/campaign";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const auth = await authorizeMember(id, userId);
    if (!auth.authorized || !auth.campaign) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }
    const isGM = auth.role === "gm";

    let posts: CampaignPost[] = await getCampaignPosts(id);

    // Filter for players
    if (!isGM) {
      posts = posts.filter((post) => post.playerVisible);
    }

    return NextResponse.json({ success: true, posts });
  } catch (error) {
    console.error("Get posts error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const auth = await authorizeMember(id, userId);
    if (!auth.authorized || !auth.campaign) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }
    const campaign = auth.campaign;
    const isGm = auth.role === "gm";

    const body = await request.json();

    // Simple validation
    if (!body.title || !body.content || !body.type) {
      return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
    }

    // Only GMs can create GM-only posts (playerVisible: false)
    const playerVisible = isGm ? (body.playerVisible ?? true) : true;

    const post = await createCampaignPost(id, {
      title: body.title,
      content: body.content,
      type: body.type,
      isPinned: body.isPinned || false,
      playerVisible,
      authorId: userId,
    });

    // Log activity and notify members asynchronously
    try {
      const { logActivity } = await import("@/lib/storage/activity");
      const { createNotification } = await import("@/lib/storage/notifications");
      const { getUserById } = await import("@/lib/storage/users");

      const author = await getUserById(userId);

      await logActivity({
        campaignId: id,
        type: "post_created",
        actorId: userId,
        targetId: post.id,
        targetType: "post",
        targetName: post.title,
        description: `${author?.username || "A member"} created a new post: "${post.title}".`,
      });

      // Notify all other members
      const allMembersExceptAuthor = [campaign.gmId, ...campaign.playerIds].filter(
        (m) => m !== userId
      );
      for (const memberId of allMembersExceptAuthor) {
        await createNotification({
          userId: memberId,
          campaignId: id,
          type: "post_created",
          title: "New Bulletin Board Post",
          message: `${author?.username || "A member"} posted: "${post.title}".`,
          actionUrl: `/campaigns/${id}?tab=bulletin`,
        });
      }
    } catch (activityError) {
      console.error("Failed to log post activity:", activityError);
    }

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error("Create post error:", error);
    return NextResponse.json({ success: false, error: "Failed to create post" }, { status: 500 });
  }
}
