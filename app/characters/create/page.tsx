"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RulesetProvider, useRulesetStatus, useRuleset } from "@/lib/rules";
import { CreationWizard } from "./components/CreationWizard";
import { EditionSelector } from "./components/EditionSelector";
import type { EditionCode, Campaign } from "@/lib/types";
import { Loader2 } from "lucide-react";

interface CreateCharacterContentProps {
  campaignId?: string;
  campaign?: Campaign | null;
}

function CreateCharacterContent({ campaignId, campaign }: CreateCharacterContentProps) {
  const router = useRouter();
  const [selectedEdition, setSelectedEdition] = useState<EditionCode | null>(
    campaign?.editionCode || null
  );
  const { loading, error, ready } = useRulesetStatus();
  const { loadRuleset } = useRuleset();

  // Auto-load ruleset if campaign is provided
  useEffect(() => {
    if (campaign?.editionCode && !ready && !loading) {
      loadRuleset(campaign.editionCode, campaign.enabledBookIds);
    }
  }, [campaign, ready, loading, loadRuleset]);

  // Handle edition selection
  const handleEditionSelect = async (editionCode: EditionCode) => {
    setSelectedEdition(editionCode);
    await loadRuleset(editionCode);
  };

  // Show edition selector if no edition selected (and no campaign)
  if (!selectedEdition && !campaign) {
    return <EditionSelector onSelect={handleEditionSelect} />;
  }

  // Show loading state
  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-r-transparent" />
          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
            Loading ruleset...
          </p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="max-w-md rounded-lg border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950">
          <div className="mx-auto h-12 w-12 rounded-full bg-red-100 p-3 dark:bg-red-900">
            <svg
              className="h-6 w-6 text-red-600 dark:text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="mt-4 text-sm font-medium text-red-800 dark:text-red-200">
            Failed to load ruleset
          </h3>
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={() => setSelectedEdition(null)}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show wizard when ready
  if (ready) {
    return (
      <CreationWizard
        campaignId={campaignId}
        campaign={campaign}
        onCancel={() => {
          if (campaignId) {
            router.push(`/campaigns/${campaignId}`);
          } else {
            setSelectedEdition(null);
          }
        }}
        onComplete={(characterId) => {
          // Navigate to the character sheet
          router.push(`/characters/${characterId}`);
        }}
      />
    );
  }

  return null;
}

export default function CreateCharacterPage() {
  const searchParams = useSearchParams();
  const campaignId = searchParams.get("campaignId") || undefined;
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loadingCampaign, setLoadingCampaign] = useState(!!campaignId);

  // Load campaign if campaignId is provided
  useEffect(() => {
    if (!campaignId) {
      setLoadingCampaign(false);
      return;
    }

    async function loadCampaign() {
      try {
        const res = await fetch(`/api/campaigns/${campaignId}`);
        const data = await res.json();
        if (data.success) {
          setCampaign(data.campaign);
        }
      } catch (e) {
        console.error("Failed to load campaign", e);
      } finally {
        setLoadingCampaign(false);
      }
    }

    loadCampaign();
  }, [campaignId]);

  if (loadingCampaign) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Create Character
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {campaign
            ? `Creating character for campaign: ${campaign.title}`
            : "Build a new Shadowrun character step by step"}
        </p>
      </div>

      {/* Content wrapped in RulesetProvider */}
      <RulesetProvider>
        <CreateCharacterContent campaignId={campaignId} campaign={campaign} />
      </RulesetProvider>
    </div>
  );
}
