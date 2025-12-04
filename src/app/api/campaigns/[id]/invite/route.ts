import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isGMOfCampaign } from "@/lib/auth/route-protection";
import { addPlayerToCampaign } from "@/lib/supabase/schema";

interface InviteRequestBody {
  username?: string;
  email?: string;
}

/**
 * POST /api/campaigns/[id]/invite
 * Invite a player to a campaign by username or email
 * Only the GM can invite players
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: campaignId } = await params;
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Verify GM permission
    const isGM = await isGMOfCampaign(campaignId, user.id);
    if (!isGM) {
      return NextResponse.json(
        { error: "Only the GM can invite players to this campaign" },
        { status: 403 }
      );
    }

    // Parse request body
    const body: InviteRequestBody = await request.json();
    const { username, email } = body;

    if (!username && !email) {
      return NextResponse.json(
        { error: "Username or email is required" },
        { status: 400 }
      );
    }

    // Find user by username or email
    let targetUser: { id: string; username: string } | null = null;

    if (username) {
      const { data, error } = await supabase
        .from("users_profile")
        .select("id, username")
        .eq("username", username.trim())
        .single();

      if (error || !data) {
        return NextResponse.json(
          { error: `User "${username}" not found` },
          { status: 404 }
        );
      }
      targetUser = data;
    } else if (email) {
      // Look up user by email via auth
      // Note: This requires admin privileges in production
      // For now, we'll only support username-based invites
      return NextResponse.json(
        { error: "Email-based invites are not yet supported. Please use username." },
        { status: 400 }
      );
    }

    if (!targetUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if user is already in the campaign
    const { data: existingPlayer } = await supabase
      .from("campaign_players")
      .select("user_id")
      .eq("campaign_id", campaignId)
      .eq("user_id", targetUser.id)
      .single();

    if (existingPlayer) {
      return NextResponse.json(
        { error: "User is already a member of this campaign" },
        { status: 409 }
      );
    }

    // Add player to campaign
    const { data: newPlayer, error: addError } = await addPlayerToCampaign(
      supabase,
      {
        campaign_id: campaignId,
        user_id: targetUser.id,
        role: "player",
      }
    );

    if (addError) {
      console.error("Error adding player to campaign:", addError);
      return NextResponse.json(
        { error: "Failed to add player to campaign" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          userId: targetUser.id,
          username: targetUser.username,
          player: newPlayer,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/campaigns/[id]/invite:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

