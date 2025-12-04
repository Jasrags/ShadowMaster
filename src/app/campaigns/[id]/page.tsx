import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getUser } from "@/lib/auth/session";
import { getCampaignDetails } from "../actions";
import { CampaignDetailTabs } from "./_components/CampaignDetailTabs";
import { LinkButton } from "@/components/ui/link-button";

export const metadata = {
  title: "Campaign Details | ShadowMaster",
  description: "View campaign details and manage your Shadowrun adventure",
};

interface CampaignDetailPageProps {
  params: Promise<{ id: string }>;
}

async function CampaignContent({ campaignId }: { campaignId: string }) {
  const result = await getCampaignDetails(campaignId);

  if (!result.success) {
    if (result.error === "Campaign not found") {
      notFound();
    }
    return (
      <div className="rounded-lg border border-danger/50 bg-danger/10 p-6 text-center">
        <p className="text-danger font-medium">Error loading campaign</p>
        <p className="text-sm text-muted-fg mt-2">{result.error}</p>
      </div>
    );
  }

  const { campaign, isGM } = result.data;

  if (!campaign) {
    notFound();
  }

  const gmUser = campaign.gm_user as { id: string; username: string; avatar_url: string | null } | null;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-fg">{campaign.name}</h1>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                campaign.is_active
                  ? "bg-primary/20 text-primary"
                  : "bg-muted-fg/20 text-muted-fg"
              }`}
            >
              {campaign.is_active ? "Active" : "Inactive"}
            </span>
          </div>
          <p className="text-muted-fg">
            GM: {gmUser?.username || "Unknown"} • Created{" "}
            {new Date(campaign.created_at).toLocaleDateString()}
          </p>
          {campaign.setting && (
            <p className="text-sm text-muted-fg mt-1">
              Setting: {campaign.setting}
            </p>
          )}
        </div>
        {isGM && (
          <div className="flex gap-2">
            <LinkButton href={`/campaigns/${campaign.id}/edit`} intent="outline">
              Edit Campaign
            </LinkButton>
            <LinkButton href={`/campaigns/${campaign.id}/sessions/new`} intent="primary">
              Start Session
            </LinkButton>
          </div>
        )}
      </div>

      {/* Description */}
      {campaign.description && (
        <div className="rounded-lg border border-border bg-bg-muted p-4 mb-8">
          <p className="text-fg">{campaign.description}</p>
        </div>
      )}

      {/* Tabs */}
      <CampaignDetailTabs campaign={campaign} isGM={isGM} />
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header skeleton */}
      <div>
        <div className="h-9 w-64 bg-bg-muted rounded animate-pulse mb-2" />
        <div className="h-5 w-48 bg-bg-muted rounded animate-pulse" />
      </div>
      {/* Content skeleton */}
      <div className="h-64 bg-bg-muted rounded animate-pulse" />
    </div>
  );
}

export default async function CampaignDetailPage({
  params,
}: CampaignDetailPageProps) {
  const user = await getUser();
  const { id } = await params;

  if (!user) {
    redirect(`/login?redirectTo=/campaigns/${id}`);
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-fg mb-6">
        <Link href="/campaigns" className="hover:text-fg transition-colors">
          Campaigns
        </Link>
        <span>/</span>
        <span className="text-fg">Campaign Details</span>
      </nav>

      <Suspense fallback={<LoadingSkeleton />}>
        <CampaignContent campaignId={id} />
      </Suspense>
    </div>
  );
}

