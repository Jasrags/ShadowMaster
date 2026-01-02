"use client";

/**
 * Sheet-Driven Character Creation Page
 *
 * Alternative to the wizard-based creation flow.
 * All character creation happens on a single sheet interface
 * with all sections visible simultaneously.
 *
 * See ADR-011: Sheet-Driven Creation for design rationale.
 */

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RulesetProvider, useRulesetStatus, useRuleset, usePriorityTable } from "@/lib/rules";
import { CreationBudgetProvider } from "@/lib/contexts";
import { SheetCreationLayout } from "./components/SheetCreationLayout";
import { EditionSelector } from "../components/EditionSelector";
import type { EditionCode, Campaign, CreationState, ID } from "@/lib/types";
import { Loader2, ArrowLeft, Wand2 } from "lucide-react";
import Link from "next/link";

// =============================================================================
// INITIAL STATE
// =============================================================================

function createInitialCreationState(): CreationState {
  return {
    characterId: "",
    creationMethodId: "sr5-priority",
    currentStep: 0,
    completedSteps: [],
    budgets: {},
    selections: {},
    priorities: {},
    errors: [],
    warnings: [],
    updatedAt: new Date().toISOString(),
  };
}

// =============================================================================
// SHEET CREATION CONTENT
// =============================================================================

interface SheetCreationContentProps {
  campaignId?: string;
  campaign?: Campaign | null;
}

function SheetCreationContent({ campaignId, campaign }: SheetCreationContentProps) {
  const router = useRouter();
  const [selectedEdition, setSelectedEdition] = useState<EditionCode | null>(
    campaign?.editionCode || null
  );
  const { loading, error, ready } = useRulesetStatus();
  const { loadRuleset, editionCode } = useRuleset();
  const priorityTable = usePriorityTable();

  // Creation state management
  const [creationState, setCreationState] = useState<CreationState>(
    createInitialCreationState
  );
  const [characterId, setCharacterId] = useState<ID | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Auto-load ruleset if campaign is provided
  useEffect(() => {
    if (campaign?.editionCode && !ready && !loading) {
      loadRuleset(campaign.editionCode, campaign.enabledBookIds);
    }
  }, [campaign, ready, loading, loadRuleset]);

  // Handle edition selection
  const handleEditionSelect = async (edition: EditionCode) => {
    setSelectedEdition(edition);
    await loadRuleset(edition);
  };

  // Update creation state
  const updateState = useCallback((updates: Partial<CreationState>) => {
    setCreationState((prev) => ({
      ...prev,
      ...updates,
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  // Handle budget spent changes from context
  const handleSpentChange = useCallback(
    (budgetId: string, spent: number) => {
      updateState({
        budgets: {
          ...creationState.budgets,
          [`${budgetId}-spent`]: spent,
        },
      });
    },
    [creationState.budgets, updateState]
  );

  // Auto-save draft to server (debounced)
  useEffect(() => {
    // Only save if we have priorities set (meaningful progress)
    if (!creationState.priorities || Object.keys(creationState.priorities).length === 0) {
      return;
    }

    const saveTimeout = setTimeout(async () => {
      setIsSaving(true);
      try {
        if (characterId) {
          // Update existing draft
          await fetch(`/api/characters/${characterId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              metadata: {
                creationState,
                creationMode: "sheet",
              },
            }),
          });
        } else {
          // Create new draft
          const res = await fetch("/api/characters", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              editionCode: editionCode || selectedEdition,
              campaignId,
              status: "draft",
              metadata: {
                creationState,
                creationMode: "sheet",
              },
            }),
          });
          const data = await res.json();
          if (data.success && data.character?.id) {
            setCharacterId(data.character.id);
            updateState({ characterId: data.character.id });
          }
        }
        setLastSaved(new Date());
      } catch (e) {
        console.error("Failed to save draft:", e);
      } finally {
        setIsSaving(false);
      }
    }, 1000); // 1 second debounce

    return () => clearTimeout(saveTimeout);
  }, [creationState, characterId, editionCode, selectedEdition, campaignId, updateState]);

  // Handle character finalization
  const handleFinalize = useCallback(async () => {
    if (!characterId) return;

    setIsSaving(true);
    try {
      const res = await fetch(`/api/characters/${characterId}/finalize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.success) {
        router.push(`/characters/${characterId}`);
      }
    } catch (e) {
      console.error("Failed to finalize character:", e);
    } finally {
      setIsSaving(false);
    }
  }, [characterId, router]);

  // Show edition selector if no edition selected (and no campaign)
  if (!selectedEdition && !campaign) {
    return <EditionSelector onSelect={handleEditionSelect} />;
  }

  // Show loading state
  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-emerald-500" />
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

  // Show sheet creation when ready
  if (ready) {
    return (
      <CreationBudgetProvider
        creationState={creationState}
        priorityTable={priorityTable}
        onSpentChange={handleSpentChange}
      >
        <SheetCreationLayout
          creationState={creationState}
          updateState={updateState}
          onFinalize={handleFinalize}
          isSaving={isSaving}
          lastSaved={lastSaved}
          campaignId={campaignId}
          campaign={campaign}
        />
      </CreationBudgetProvider>
    );
  }

  return null;
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default function SheetCreationPage() {
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
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link
              href="/characters"
              className="flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
            <div className="h-4 w-px bg-zinc-300 dark:bg-zinc-700" />
            <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Create Character
            </h1>
            {campaign && (
              <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                {campaign.title}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Mode switcher - link to wizard mode */}
            <Link
              href={campaignId ? `/characters/create?campaignId=${campaignId}` : "/characters/create"}
              className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              <Wand2 className="h-3.5 w-3.5" />
              Switch to Wizard
            </Link>
          </div>
        </div>
      </header>

      {/* Content wrapped in RulesetProvider */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <RulesetProvider>
          <SheetCreationContent campaignId={campaignId} campaign={campaign} />
        </RulesetProvider>
      </main>
    </div>
  );
}
