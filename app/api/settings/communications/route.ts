import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getUserById, updateUser } from "@/lib/storage/users";
import { CommunicationPreferences } from "@/lib/types/user";
import { getDefaultCommunicationPreferences } from "@/lib/email/preferences";
import { AuditLogger } from "@/lib/security/audit-logger";

/**
 * GET: Fetch current user's communication preferences
 */
export async function GET() {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // Return preferences with defaults applied
    const preferences: CommunicationPreferences = {
      productUpdates: user.preferences?.communications?.productUpdates ?? false,
      campaignNotifications: user.preferences?.communications?.campaignNotifications ?? true,
    };

    return NextResponse.json({ success: true, preferences });
  } catch (error) {
    console.error("Error fetching communication preferences:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

/**
 * PATCH: Update user's communication preferences
 */
export async function PATCH(req: NextRequest) {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Validate the request body contains valid preference fields
    const validFields = ["productUpdates", "campaignNotifications"];
    const updates: Partial<CommunicationPreferences> = {};

    for (const field of validFields) {
      if (field in body) {
        if (typeof body[field] !== "boolean") {
          return NextResponse.json(
            { success: false, error: `${field} must be a boolean` },
            { status: 400 }
          );
        }
        updates[field as keyof CommunicationPreferences] = body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { success: false, error: "No valid preference fields provided" },
        { status: 400 }
      );
    }

    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // Get current preferences with defaults
    const currentComms = user.preferences?.communications ?? getDefaultCommunicationPreferences();

    // Merge with updates
    const updatedComms: CommunicationPreferences = {
      ...currentComms,
      ...updates,
    };

    // Update user preferences
    const updatedPreferences = {
      ...user.preferences,
      communications: updatedComms,
    };

    await updateUser(userId, { preferences: updatedPreferences });

    // Audit log the change
    await AuditLogger.log({
      event: "preferences.communications_updated",
      userId,
      metadata: {
        previousProductUpdates: currentComms.productUpdates,
        previousCampaignNotifications: currentComms.campaignNotifications,
        newProductUpdates: updatedComms.productUpdates,
        newCampaignNotifications: updatedComms.campaignNotifications,
      },
    });

    return NextResponse.json({ success: true, preferences: updatedComms });
  } catch (error) {
    console.error("Error updating communication preferences:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
