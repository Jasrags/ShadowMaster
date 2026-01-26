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

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RulesetProvider, useRulesetStatus, useRuleset, usePriorityTable } from "@/lib/rules";
import { CreationBudgetProvider } from "@/lib/contexts";
import { SheetCreationLayout } from "./components/SheetCreationLayout";
import { EditionSelector } from "@/components/creation/EditionSelector";
import { CreationErrorBoundary } from "@/components/creation/CreationErrorBoundary";
import type { EditionCode, Campaign, CreationState, ID } from "@/lib/types";
import { Loader2, ArrowLeft } from "lucide-react";
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
  existingCharacter?: { id: string; editionCode: string; creationState?: CreationState } | null;
}

function SheetCreationContent({
  campaignId,
  campaign,
  existingCharacter,
}: SheetCreationContentProps) {
  const router = useRouter();
  const [selectedEdition, setSelectedEdition] = useState<EditionCode | null>(
    (existingCharacter?.editionCode as EditionCode) || campaign?.editionCode || null
  );
  const { loading, error, ready } = useRulesetStatus();
  const { loadRuleset, editionCode, ruleset } = useRuleset();
  const priorityTable = usePriorityTable();

  // Creation state management - initialize from existing character if provided
  const [creationState, setCreationState] = useState<CreationState>(() => {
    if (existingCharacter?.creationState) {
      return existingCharacter.creationState;
    }
    return createInitialCreationState();
  });
  const [characterId, setCharacterId] = useState<ID | null>(existingCharacter?.id || null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Refs for managing auto-save race conditions
  const abortControllerRef = useRef<AbortController | null>(null);
  const saveVersionRef = useRef(0);

  // Auto-load ruleset if campaign or existing character is provided
  useEffect(() => {
    const edition = existingCharacter?.editionCode || campaign?.editionCode;
    if (edition && !ready && !loading) {
      loadRuleset(edition as EditionCode, campaign?.enabledBookIds);
    }
  }, [existingCharacter, campaign, ready, loading, loadRuleset]);

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

  // Auto-save draft to server (debounced with race condition protection)
  useEffect(() => {
    // Only save if we have priorities set (meaningful progress)
    if (!creationState.priorities || Object.keys(creationState.priorities).length === 0) {
      return;
    }

    // Increment version for this save attempt
    const currentVersion = ++saveVersionRef.current;

    const saveTimeout = setTimeout(async () => {
      // Abort any in-flight request before starting a new one
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      setIsSaving(true);
      try {
        if (characterId) {
          // Update existing draft - include name so it syncs with characterName
          const characterName = (creationState.selections.characterName as string) || undefined;
          await fetch(`/api/characters/${characterId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...(characterName && { name: characterName }),
              metadata: {
                creationState,
                creationMode: "sheet",
              },
            }),
            signal,
          });
        } else {
          // Create new draft
          const res = await fetch("/api/characters", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              editionId: ruleset?.editionId || "sr5",
              editionCode: editionCode || selectedEdition,
              creationMethodId: creationState.creationMethodId,
              name: (creationState.selections.characterName as string) || "Unnamed Runner",
              campaignId,
            }),
            signal,
          });
          const data = await res.json();
          if (data.success && data.character?.id) {
            // Ignore response if a newer save has started
            if (currentVersion !== saveVersionRef.current) return;

            setCharacterId(data.character.id);
            updateState({ characterId: data.character.id });
            // Save the creation state to the new character
            const newCharacterName =
              (creationState.selections.characterName as string) || undefined;
            await fetch(`/api/characters/${data.character.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...(newCharacterName && { name: newCharacterName }),
                metadata: {
                  creationState: {
                    ...creationState,
                    characterId: data.character.id,
                  },
                  creationMode: "sheet",
                },
              }),
              signal,
            });
          }
        }

        // Only update lastSaved if this is still the current version
        if (currentVersion === saveVersionRef.current) {
          setLastSaved(new Date());
          setSaveError(null);
        }
      } catch (e) {
        // Ignore aborted requests
        if (e instanceof Error && e.name === "AbortError") {
          return;
        }
        console.error("Failed to save draft:", e);
        // Set error state if this is still the current version
        if (currentVersion === saveVersionRef.current) {
          setSaveError("Failed to save changes");
        }
      } finally {
        // Only update isSaving if this is still the current version
        if (currentVersion === saveVersionRef.current) {
          setIsSaving(false);
        }
      }
    }, 1000); // 1 second debounce

    return () => clearTimeout(saveTimeout);
  }, [creationState, characterId, editionCode, selectedEdition, campaignId, updateState, ruleset]);

  // Handle retry after save failure
  const handleRetry = useCallback(() => {
    // Clear the error and trigger a save by updating the state with same values
    setSaveError(null);
    setCreationState((prev) => ({
      ...prev,
      updatedAt: new Date().toISOString(),
    }));
  }, []);

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
          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">Loading ruleset...</p>
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
          saveError={saveError}
          onRetry={handleRetry}
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
  const existingCharacterId = searchParams.get("characterId") || undefined;
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [existingCharacter, setExistingCharacter] = useState<{
    id: string;
    editionCode: string;
    creationState?: CreationState;
  } | null>(null);
  const [loading, setLoading] = useState(!!campaignId || !!existingCharacterId);

  // Load campaign and/or existing character if IDs are provided
  useEffect(() => {
    async function loadData() {
      try {
        // Load campaign if campaignId provided
        if (campaignId) {
          const res = await fetch(`/api/campaigns/${campaignId}`);
          const data = await res.json();
          if (data.success) {
            setCampaign(data.campaign);
          }
        }

        // Load existing character if characterId provided
        if (existingCharacterId) {
          const res = await fetch(`/api/characters/${existingCharacterId}`);
          const data = await res.json();
          if (data.success && data.character) {
            setExistingCharacter({
              id: data.character.id,
              editionCode: data.character.editionCode,
              creationState: data.character.metadata?.creationState as CreationState | undefined,
            });
          }
        }
      } catch (e) {
        console.error("Failed to load data", e);
      } finally {
        setLoading(false);
      }
    }

    if (campaignId || existingCharacterId) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [campaignId, existingCharacterId]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-grid">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/90 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/90">
        <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-6">
          <div className="flex items-center gap-4">
            <Link
              href="/characters"
              className="flex items-center gap-2 text-sm text-zinc-600 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back
            </Link>
            <div className="h-4 w-px bg-zinc-300 dark:bg-zinc-700" />
            <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Create Character
            </h1>
            {campaign && (
              <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                {campaign.title}
              </span>
            )}
          </div>
        </div>
        <div className="neon-divider mx-4" />
      </header>

      {/* Content wrapped in RulesetProvider and ErrorBoundary */}
      <main className="mx-auto max-w-screen-2xl px-4 py-6 sm:px-6 lg:px-6">
        <RulesetProvider>
          <CreationErrorBoundary characterId={existingCharacterId}>
            <SheetCreationContent
              campaignId={campaignId}
              campaign={campaign}
              existingCharacter={existingCharacter}
            />
          </CreationErrorBoundary>
        </RulesetProvider>
      </main>
    </div>
  );
}
