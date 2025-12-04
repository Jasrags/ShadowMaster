"use client";

import { CampaignCard } from "./CampaignCard";
import type { Campaign } from "@/lib/supabase/schema";

interface CampaignListProps {
  campaigns: (Campaign & {
    gm_user?: {
      id: string;
      username: string;
      avatar_url: string | null;
    };
  })[];
  isLoading?: boolean;
  error?: string | null;
}

export function CampaignList({ campaigns, isLoading = false, error = null }: CampaignListProps) {
  if (error) {
    return (
      <div className="rounded-lg border border-danger/50 bg-danger/10 p-6 text-center">
        <p className="text-danger font-medium">Error loading campaigns</p>
        <p className="text-sm text-muted-fg mt-2">{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <CampaignCard key={i} campaign={{} as any} isLoading={true} />
        ))}
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-bg-muted p-12 text-center">
        <p className="text-muted-fg">No campaigns found.</p>
        <p className="text-sm text-muted-fg mt-2">
          Create your first campaign to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {campaigns.map((campaign) => (
        <CampaignCard key={campaign.id} campaign={campaign} />
      ))}
    </div>
  );
}

