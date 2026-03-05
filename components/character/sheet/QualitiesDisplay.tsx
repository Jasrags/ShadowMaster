"use client";

import { useState, useCallback } from "react";
import type { Character, QualitySelection } from "@/lib/types";
import type { QualityData } from "@/lib/rules/loader-types";
import type { CharacterStateFlags } from "@/lib/types/effects";
import { useQualities } from "@/lib/rules";
import {
  formatEffectBadge,
  isUnifiedEffect,
  resolveRatingBasedValue,
  buildCharacterStateFlags,
} from "@/lib/rules/effects";
import type { EffectBadgeContext } from "@/lib/rules/effects";
import { DisplayCard } from "./DisplayCard";
import {
  ShieldCheck,
  Clock,
  AlertCircle,
  Settings2,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { DynamicStateModal } from "@/app/characters/[id]/components/DynamicStateModal";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface QualitiesDisplayProps {
  character: Character;
  onUpdate?: (updatedCharacter: Character) => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderDynamicStateText(
  dynamicState: NonNullable<QualitySelection["dynamicState"]>
): string {
  switch (dynamicState.type) {
    case "addiction":
      return `${dynamicState.state.severity.toUpperCase()} \u2022 ${dynamicState.state.substance} (${dynamicState.state.substanceType})`;
    case "allergy":
      return `${dynamicState.state.severity.toUpperCase()} \u2022 ${dynamicState.state.allergen} (${dynamicState.state.prevalence})`;
    case "dependent":
      return `TIER ${dynamicState.state.tier} \u2022 ${dynamicState.state.relationship} (${dynamicState.state.currentStatus})`;
    default:
      return "";
  }
}

// ---------------------------------------------------------------------------
// StateTogglePill
// ---------------------------------------------------------------------------

function StateTogglePill({
  label,
  active,
  activeColor,
  onToggle,
}: {
  label: string;
  active: boolean;
  activeColor: "red" | "amber";
  onToggle: () => void;
}) {
  const colors = {
    red: {
      active: "border-red-500/40 bg-red-500/20 text-red-400 animate-pulse",
      inactive:
        "border-zinc-500/20 bg-zinc-500/10 text-zinc-500 hover:border-red-500/30 hover:text-red-400",
    },
    amber: {
      active: "border-amber-500/40 bg-amber-500/20 text-amber-400",
      inactive:
        "border-zinc-500/20 bg-zinc-500/10 text-zinc-500 hover:border-amber-500/30 hover:text-amber-400",
    },
  };

  return (
    <button
      data-testid="state-toggle-pill"
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className={`shrink-0 rounded border px-1.5 py-0.5 text-[9px] font-bold uppercase transition-colors ${
        active ? colors[activeColor].active : colors[activeColor].inactive
      }`}
      title={`${active ? "Deactivate" : "Activate"} ${label}`}
    >
      {label}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Section config
// ---------------------------------------------------------------------------

const QUALITY_SECTIONS = [
  {
    key: "positive" as const,
    label: "Positive",
    getKarma: (data: QualityData | undefined) => data?.karmaCost,
    karmaPillClasses:
      "border-emerald-500/20 bg-emerald-500/12 text-emerald-600 dark:text-emerald-300",
  },
  {
    key: "negative" as const,
    label: "Negative",
    getKarma: (data: QualityData | undefined) => data?.karmaBonus,
    karmaPillClasses: "border-rose-500/20 bg-rose-500/12 text-rose-600 dark:text-rose-300",
  },
];

// ---------------------------------------------------------------------------
// QualityRow
// ---------------------------------------------------------------------------

function QualityRow({
  selection,
  data,
  karmaPillClasses,
  karmaValue,
  character,
  characterStateFlags,
  onSettingsClick,
  onStateToggle,
  onFirstMeetingToggle,
}: {
  selection: QualitySelection;
  data: QualityData | undefined;
  karmaPillClasses: string;
  karmaValue: number | undefined;
  character: Character;
  characterStateFlags: CharacterStateFlags;
  onSettingsClick: (sel: QualitySelection) => void;
  onStateToggle?: (qualityId: string, field: string, value: boolean) => void;
  onFirstMeetingToggle?: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const rawSelection =
    typeof selection === "string" ? ({} as Partial<QualitySelection>) : selection;
  const id = typeof selection === "string" ? selection : selection.qualityId || selection.id || "";
  const name = data?.name || (id ? id.replace(/-/g, " ") : "Unknown Quality");

  // Extract level/spec from creationState
  const creationState = character.metadata?.creationState;
  const stateSelections =
    creationState && typeof creationState === "object" && "selections" in creationState
      ? (creationState.selections as Record<string, unknown>)
      : undefined;
  const qualityLevels =
    stateSelections && typeof stateSelections === "object" && "qualityLevels" in stateSelections
      ? (stateSelections.qualityLevels as Record<string, number | undefined> | undefined)
      : undefined;
  const qualitySpecifications =
    stateSelections &&
    typeof stateSelections === "object" &&
    "qualitySpecifications" in stateSelections
      ? (stateSelections.qualitySpecifications as Record<string, string | undefined> | undefined)
      : undefined;

  const level = rawSelection.rating ?? qualityLevels?.[id];
  const spec = rawSelection.specification ?? qualitySpecifications?.[id];

  const extraParts: string[] = [];
  if (level !== undefined && level !== null) {
    if (data?.levels) {
      const levelInfo = data.levels.find(
        (l: { level: number; name?: string }) => l.level === level
      );
      if (levelInfo) {
        extraParts.push(levelInfo.name);
      } else {
        extraParts.push(`Rating ${level}`);
      }
    } else {
      extraParts.push(`Rating ${level}`);
    }
  }
  if (spec) {
    extraParts.push(spec);
  }
  if (character.sinnerQuality && id === "sinner") {
    extraParts.push(
      character.sinnerQuality.charAt(0).toUpperCase() + character.sinnerQuality.slice(1)
    );
  }
  const extra = extraParts.join(", ");

  // Build context for condition filtering and rating-based value resolution
  const charRating = rawSelection.rating ?? qualityLevels?.[id];
  const addictionState =
    rawSelection.dynamicState?.type === "addiction" ? rawSelection.dynamicState.state : undefined;
  const ratingEntry =
    data?.ratings && charRating !== undefined
      ? (data.ratings as Record<string, Record<string, unknown>>)[String(charRating)]
      : undefined;

  const rawEffects = (data?.effects || []) as unknown[];
  const hasFirstMeetingTrigger = rawEffects
    .filter(isUnifiedEffect)
    .some((e) => e.triggers.includes("first-meeting"));
  const effectBadges = rawEffects
    .filter(isUnifiedEffect)
    .map((effect) => {
      const ctx: EffectBadgeContext = {
        rating: charRating,
        dependencyType: addictionState?.substanceType,
        activeCharacterStates: characterStateFlags,
      };
      // Resolve "rating-based" values from the quality's rating table
      if (typeof effect.value === "string" && ratingEntry) {
        const resolved = resolveRatingBasedValue(effect, ratingEntry);
        if (resolved !== null) ctx.resolvedValue = resolved;
      }
      return formatEffectBadge(effect, ctx);
    })
    .filter((b): b is NonNullable<typeof b> => b !== null);
  const hasExpandableContent =
    !!data?.summary || effectBadges.length > 0 || !!rawSelection.dynamicState;

  return (
    <div
      data-testid="quality-row"
      className={`px-3 py-1.5 [&+&]:border-t [&+&]:border-zinc-200 dark:[&+&]:border-zinc-800/50${
        hasExpandableContent
          ? " cursor-pointer transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-700/30"
          : ""
      }`}
      onClick={hasExpandableContent ? () => setIsExpanded(!isExpanded) : undefined}
    >
      {/* Collapsed row: chevron + name + pending badge + extra + karma pill */}
      <div className="flex min-w-0 items-center gap-1.5">
        {hasExpandableContent ? (
          <span data-testid="expand-button" className="shrink-0 text-zinc-400">
            {isExpanded ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )}
          </span>
        ) : (
          <div className="w-3.5 shrink-0" />
        )}
        <span className="truncate text-[13px] font-medium text-zinc-800 dark:text-zinc-200">
          {name}
        </span>
        {extra && (
          <span className="shrink-0 text-[10px] text-zinc-400 dark:text-zinc-500">({extra})</span>
        )}
        {rawSelection.gmApproved === false && (
          <span
            data-testid="pending-badge"
            className="flex shrink-0 items-center gap-0.5 rounded border border-amber-500/20 bg-amber-500/10 px-1 text-[8px] font-bold uppercase text-amber-500"
            title="Awaiting GM Approval"
          >
            <Clock className="h-2 w-2" />
            Pending
          </span>
        )}
        {/* State toggle pills */}
        {rawSelection.dynamicState?.type === "addiction" &&
          onStateToggle &&
          (() => {
            const addState = rawSelection.dynamicState as {
              type: "addiction";
              state: { withdrawalActive: boolean };
            };
            return (
              <StateTogglePill
                label="Withdrawal"
                active={addState.state.withdrawalActive}
                activeColor="red"
                onToggle={() =>
                  onStateToggle(id, "withdrawalActive", !addState.state.withdrawalActive)
                }
              />
            );
          })()}
        {rawSelection.dynamicState?.type === "allergy" &&
          onStateToggle &&
          (() => {
            const allState = rawSelection.dynamicState as {
              type: "allergy";
              state: { currentlyExposed: boolean };
            };
            return (
              <StateTogglePill
                label="Exposed"
                active={allState.state.currentlyExposed}
                activeColor="amber"
                onToggle={() =>
                  onStateToggle(id, "currentlyExposed", !allState.state.currentlyExposed)
                }
              />
            );
          })()}
        {hasFirstMeetingTrigger && onFirstMeetingToggle && (
          <StateTogglePill
            label="First Meeting"
            active={characterStateFlags.firstMeeting ?? false}
            activeColor="amber"
            onToggle={onFirstMeetingToggle}
          />
        )}
        {karmaValue !== undefined && (
          <span
            data-testid="karma-pill"
            className={`ml-auto shrink-0 rounded border px-1.5 py-0.5 font-mono text-[10px] font-semibold ${karmaPillClasses}`}
          >
            {karmaValue}
          </span>
        )}
      </div>

      {/* Expanded section */}
      {isExpanded && hasExpandableContent && (
        <div
          data-testid="expanded-content"
          className="ml-5 mt-2 space-y-2 border-l-2 border-zinc-200 pl-3 dark:border-zinc-700"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Summary */}
          {data?.summary && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{data.summary}</p>
          )}

          {/* Effect badges */}
          {effectBadges.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {effectBadges.map((badge, idx) => (
                <span
                  key={idx}
                  data-testid="effect-badge"
                  className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium ${badge.colorClass}`}
                >
                  {badge.label}
                  {badge.trigger && (
                    <span
                      className={badge.triggerActive ? "font-semibold text-red-400" : "opacity-50"}
                    >
                      · {badge.trigger}
                    </span>
                  )}
                </span>
              ))}
            </div>
          )}

          {/* Dynamic state text + settings button */}
          {rawSelection.dynamicState && (
            <div className="flex items-center justify-between">
              <div
                data-testid="dynamic-state-text"
                className="flex items-center gap-1.5 text-[9px] font-medium text-amber-500 dark:text-amber-400"
              >
                <AlertCircle className="h-2.5 w-2.5" />
                <span>{renderDynamicStateText(rawSelection.dynamicState)}</span>
              </div>
              <button
                data-testid="settings-button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSettingsClick(rawSelection as QualitySelection);
                }}
                className="rounded p-1 text-zinc-400 transition-colors hover:bg-amber-500/20 hover:text-amber-500"
                title="Manage Dynamic State"
              >
                <Settings2 className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function QualitiesDisplay({ character, onUpdate }: QualitiesDisplayProps) {
  const { positive: positiveData, negative: negativeData } = useQualities();
  const [activeSelection, setActiveSelection] = useState<QualitySelection | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [firstMeeting, setFirstMeeting] = useState(false);

  const persistedFlags = buildCharacterStateFlags(character);
  const characterStateFlags: CharacterStateFlags = {
    ...persistedFlags,
    ...(firstMeeting ? { firstMeeting: true } : {}),
  };

  const handleStateToggle = useCallback(
    async (qualityId: string, field: string, value: boolean) => {
      if (!onUpdate) return;
      try {
        const characterId = character.id;
        const res = await fetch(`/api/characters/${characterId}/qualities/${qualityId}/state`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ [field]: value }),
        });
        if (!res.ok) return;
        const data = await res.json();
        onUpdate(data.character);
      } catch {
        // Toggle failed — UI stays unchanged
      }
    },
    [character.id, onUpdate]
  );

  const positiveSelections = character.positiveQualities || [];
  const negativeSelections = character.negativeQualities || [];
  const hasQualities = positiveSelections.length > 0 || negativeSelections.length > 0;

  const sectionData: Array<{
    config: (typeof QUALITY_SECTIONS)[number];
    selections: QualitySelection[];
    catalog: QualityData[];
  }> = [
    { config: QUALITY_SECTIONS[0], selections: positiveSelections, catalog: positiveData },
    { config: QUALITY_SECTIONS[1], selections: negativeSelections, catalog: negativeData },
  ];

  const handleSettingsClick = (sel: QualitySelection) => {
    setActiveSelection(sel);
    setIsModalOpen(true);
  };

  return (
    <>
      <DisplayCard
        id="sheet-qualities"
        title="Qualities"
        icon={<ShieldCheck className="h-4 w-4 text-zinc-400" />}
        collapsible
      >
        {!hasQualities ? (
          <p className="px-1 text-sm italic text-zinc-500">No qualities selected</p>
        ) : (
          <div className="space-y-3">
            {sectionData
              .filter((s) => s.selections.length > 0)
              .map((s) => {
                const { config, selections, catalog } = s;
                return (
                  <div key={config.key}>
                    <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                      {config.label}
                    </div>
                    <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
                      {selections.map((selection) => {
                        const id =
                          typeof selection === "string"
                            ? selection
                            : selection.qualityId || selection.id || "";
                        const data = catalog.find((q: QualityData) => q.id === id);
                        const karmaValue = config.getKarma(data);

                        return (
                          <QualityRow
                            key={id}
                            selection={selection}
                            data={data}
                            karmaPillClasses={config.karmaPillClasses}
                            karmaValue={karmaValue}
                            character={character}
                            characterStateFlags={characterStateFlags}
                            onSettingsClick={handleSettingsClick}
                            onStateToggle={onUpdate ? handleStateToggle : undefined}
                            onFirstMeetingToggle={() => setFirstMeeting((prev) => !prev)}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </DisplayCard>

      {activeSelection && (
        <DynamicStateModal
          character={character}
          selection={activeSelection}
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          onUpdate={(updated) => {
            onUpdate?.(updated);
          }}
        />
      )}
    </>
  );
}
