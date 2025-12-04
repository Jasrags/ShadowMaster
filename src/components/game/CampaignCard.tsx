"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Campaign } from "@/lib/supabase/schema";

interface CampaignCardProps {
  campaign: Campaign & {
    gm_user?: {
      id: string;
      username: string;
      avatar_url: string | null;
    };
  };
  isLoading?: boolean;
}

export function CampaignCard({ campaign, isLoading = false }: CampaignCardProps) {
  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 w-3/4 bg-bg-muted rounded" />
          <div className="h-4 w-1/2 bg-bg-muted rounded mt-2" />
        </CardHeader>
        <CardContent>
          <div className="h-4 w-full bg-bg-muted rounded mb-2" />
          <div className="h-4 w-2/3 bg-bg-muted rounded" />
        </CardContent>
      </Card>
    );
  }

  const gmName = campaign.gm_user?.username || "Unknown GM";
  const description = campaign.description || "No description available.";

  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardHeader>
        <CardTitle>{campaign.name}</CardTitle>
        <CardDescription>
          GM: {gmName} • {campaign.is_active ? "Active" : "Inactive"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-fg line-clamp-2">{description}</p>
        {campaign.setting && (
          <p className="text-xs text-muted-fg mt-2">Setting: {campaign.setting}</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <span className="text-xs text-muted-fg">
          Created {new Date(campaign.created_at).toLocaleDateString()}
        </span>
        <Link href={`/campaigns/${campaign.id}`}>
          <Button intent="primary" size="sm">
            View Campaign
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

