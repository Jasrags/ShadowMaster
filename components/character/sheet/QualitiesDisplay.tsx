"use client";

import { useState } from "react";
import type { Character, QualitySelection, QualityEffect } from "@/lib/types";
import type { QualityData } from "@/lib/rules/loader-types";
import { useQualities } from "@/lib/rules";
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
// Section config
// ---------------------------------------------------------------------------

const QUALITY_SECTIONS = [
  {
    key: "positive" as const,
    label: "Positive",
    getKarma: (data: QualityData | undefined) => data?.karmaCost,
    karmaPillClasses:
      "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-400/12 dark:border-emerald-400/20 dark:text-emerald-300",
  },
  {
    key: "negative" as const,
    label: "Negative",
    getKarma: (data: QualityData | undefined) => data?.karmaBonus,
    karmaPillClasses:
      "bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-400/12 dark:border-rose-400/20 dark:text-rose-300",
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
  onSettingsClick,
}: {
  selection: QualitySelection;
  data: QualityData | undefined;
  karmaPillClasses: string;
  karmaValue: number | undefined;
  character: Character;
  onSettingsClick: (sel: QualitySelection) => void;
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

  const effects = (data?.effects || []) as QualityEffect[];
  const hasExpandableContent =
    extra ||
    karmaValue !== undefined ||
    data?.summary ||
    effects.length > 0 ||
    rawSelection.dynamicState;

  return (
    <div
      data-testid="quality-row"
      className="rounded px-1 py-[7px] [&+&]:border-t [&+&]:border-zinc-200 dark:[&+&]:border-zinc-800/50"
    >
      {/* Collapsed row: chevron + name + pending badge */}
      <div
        className="flex cursor-pointer items-center gap-1.5"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {hasExpandableContent ? (
          <button
            data-testid="expand-button"
            className="shrink-0 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            {isExpanded ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )}
          </button>
        ) : (
          <div className="w-3.5 shrink-0" />
        )}
        <span className="truncate text-[13px] font-medium text-zinc-800 dark:text-zinc-200">
          {name}
        </span>
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
      </div>

      {/* Expanded section */}
      {isExpanded && hasExpandableContent && (
        <div
          data-testid="expanded-content"
          className="ml-5 mt-2 space-y-2 border-l-2 border-zinc-200 pl-3 dark:border-zinc-700"
        >
          {/* Extra info + karma pill */}
          {(extra || karmaValue !== undefined) && (
            <div className="flex items-center justify-between">
              {extra ? (
                <span
                  data-testid="extra-info"
                  className="rounded-sm bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-amber-500 dark:bg-zinc-800 dark:text-amber-400"
                >
                  {extra}
                </span>
              ) : (
                <span />
              )}
              {karmaValue !== undefined && (
                <span
                  data-testid="karma-pill"
                  className={`flex h-7 min-w-[32px] items-center justify-center rounded-md border px-1.5 font-mono text-sm font-bold ${karmaPillClasses}`}
                >
                  {karmaValue}
                </span>
              )}
            </div>
          )}

          {/* Summary */}
          {data?.summary && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{data.summary}</p>
          )}

          {/* Effect badges */}
          {effects.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {effects.map((eff, idx) => (
                <span
                  key={idx}
                  data-testid="effect-badge"
                  className="rounded-full border border-blue-500/20 bg-blue-500/10 px-1.5 py-px font-mono text-[9px] uppercase text-blue-400"
                  title={eff.description}
                >
                  {eff.type.replace(/-/g, " ")}
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
      <DisplayCard title="Qualities" icon={<ShieldCheck className="h-4 w-4 text-zinc-400" />}>
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
                    <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1 dark:border-zinc-800 dark:bg-zinc-950">
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
                            onSettingsClick={handleSettingsClick}
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
