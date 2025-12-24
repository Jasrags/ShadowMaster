import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { triggerCampaignCharacterValidation } from "@/lib/storage/campaigns";
import { authorizeCampaign } from "@/lib/auth/campaign";
import type { ValidationResult } from "@/lib/rules/validation";

/**
 * POST /api/campaigns/[id]/validate - Manually trigger campaign-wide character validation
 */
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const userId = await getSession();
        if (!userId) {
            return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 });
        }

        const { id: campaignId } = await params;
        const { authorized, error, status } = await authorizeCampaign(campaignId, userId, { requireGM: true });

        if (!authorized) {
            return NextResponse.json({ success: false, error }, { status });
        }

        // Trigger bulk validation
        const results: ValidationResult[] = await triggerCampaignCharacterValidation(campaignId);

        return NextResponse.json({
            success: true,
            results: {
                total: results.length,
                invalidCount: results.filter((r: ValidationResult) => !r.valid).length
            }
        });
    } catch (error) {
        console.error("Bulk validation error:", error);
        return NextResponse.json(
            { success: false, error: "An error occurred during bulk validation" },
            { status: 500 }
        );
    }
}
