import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth/session";
import { getUserCampaigns } from "./actions";
import { CampaignList } from "@/components/game/CampaignList";
import { LinkButton } from "@/components/ui/link-button";
import { CampaignSearchFilter } from "./_components/CampaignSearchFilter";

export const metadata = {
  title: "My Campaigns | ShadowMaster",
  description: "View and manage your Shadowrun campaigns",
};

async function CampaignsContent() {
  const result = await getUserCampaigns();

  if (!result.success) {
    return (
      <div className="rounded-lg border border-danger/50 bg-danger/10 p-6 text-center">
        <p className="text-danger font-medium">Error loading campaigns</p>
        <p className="text-sm text-muted-fg mt-2">{result.error}</p>
      </div>
    );
  }

  const { gmCampaigns, playerCampaigns } = result.data;
  const allCampaigns = [...(gmCampaigns || []), ...(playerCampaigns || [])];

  return (
    <div className="space-y-8">
      {/* GM Campaigns */}
      {gmCampaigns && gmCampaigns.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-fg mb-4">
            Campaigns You Run
          </h2>
          <CampaignList campaigns={gmCampaigns} />
        </section>
      )}

      {/* Player Campaigns */}
      {playerCampaigns && playerCampaigns.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-fg mb-4">
            Campaigns You Play In
          </h2>
          <CampaignList campaigns={playerCampaigns} />
        </section>
      )}

      {/* Empty state */}
      {allCampaigns.length === 0 && (
        <div className="rounded-lg border border-border bg-bg-muted p-12 text-center">
          <h3 className="text-lg font-medium text-fg mb-2">No campaigns yet</h3>
          <p className="text-muted-fg mb-6">
            Create your first campaign or join one to get started.
          </p>
          <LinkButton href="/campaigns/new" intent="primary">
            Create Your First Campaign
          </LinkButton>
        </div>
      )}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      <section>
        <div className="h-7 w-48 bg-bg-muted rounded animate-pulse mb-4" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-lg border border-border bg-bg p-6 animate-pulse"
            >
              <div className="h-6 w-3/4 bg-bg-muted rounded mb-2" />
              <div className="h-4 w-1/2 bg-bg-muted rounded mb-4" />
              <div className="h-4 w-full bg-bg-muted rounded mb-2" />
              <div className="h-4 w-2/3 bg-bg-muted rounded" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default async function CampaignsPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login?redirectTo=/campaigns");
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-fg">My Campaigns</h1>
          <p className="text-muted-fg mt-1">
            Manage your Shadowrun campaigns and adventures
          </p>
        </div>
          <LinkButton href="/campaigns/new" intent="primary">
            Create Campaign
          </LinkButton>
      </div>

      {/* Search/Filter (client component) */}
      <div className="mb-6">
        <CampaignSearchFilter />
      </div>

      {/* Campaigns List */}
      <Suspense fallback={<LoadingSkeleton />}>
        <CampaignsContent />
      </Suspense>
    </div>
  );
}

