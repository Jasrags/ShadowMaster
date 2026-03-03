"use client";

import { useState } from "react";
import type { Character, CyberwareItem, BiowareItem } from "@/lib/types";
import { isGlobalWirelessEnabled } from "@/lib/rules/wireless";
import { DisplayCard } from "./DisplayCard";
import { WirelessIndicator } from "./WirelessIndicator";
import { ChevronDown, ChevronRight, Cpu, Wifi, WifiOff } from "lucide-react";

// ---------------------------------------------------------------------------
// Section & variant configuration
// ---------------------------------------------------------------------------

const AUGMENTATION_SECTIONS = [
  { key: "cyber" as const, label: "Cyberware" },
  { key: "bio" as const, label: "Bioware" },
];

// ---------------------------------------------------------------------------
// Wireless toggle helper
// ---------------------------------------------------------------------------

function toggleAugWireless(
  character: Character,
  itemId: string,
  isCyberware: boolean,
  enabled: boolean,
  onCharacterUpdate: (updated: Character) => void
) {
  if (isCyberware) {
    const updatedCyberware = character.cyberware?.map((c) =>
      (c.id || c.catalogId) === itemId ? { ...c, wirelessEnabled: enabled } : c
    );
    onCharacterUpdate({ ...character, cyberware: updatedCyberware });
  } else {
    const updatedBioware = character.bioware?.map((b) =>
      (b.id || b.catalogId) === itemId ? { ...b, wirelessEnabled: enabled } : b
    );
    onCharacterUpdate({ ...character, bioware: updatedBioware });
  }
}

// ---------------------------------------------------------------------------
// AugmentationRow
// ---------------------------------------------------------------------------

interface AugmentationRowProps {
  item: CyberwareItem | BiowareItem;
  character: Character;
  isCyberware: boolean;
  onCharacterUpdate?: (updatedCharacter: Character) => void;
  editable?: boolean;
}

function AugmentationRow({
  item,
  character,
  isCyberware,
  onCharacterUpdate,
  editable,
}: AugmentationRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasWireless = !!(
    item.wirelessBonus ||
    (item.wirelessEffects && item.wirelessEffects.length > 0)
  );
  const globalWireless = isGlobalWirelessEnabled(character);
  const wirelessEnabled = item.wirelessEnabled ?? true;
  const isWirelessActive = hasWireless && globalWireless && wirelessEnabled;

  const itemId = item.id || item.catalogId;

  return (
    <div
      data-testid="augmentation-row"
      onClick={() => setIsExpanded(!isExpanded)}
      className="cursor-pointer px-3 py-1.5 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-700/30 [&+&]:border-t [&+&]:border-zinc-200 dark:[&+&]:border-zinc-800/50"
    >
      {/* Collapsed row: Chevron + Name + Rating + Wifi icon */}
      <div className="flex min-w-0 items-center gap-1.5">
        <span data-testid="expand-button" className="shrink-0 text-zinc-400">
          {isExpanded ? (
            <ChevronDown className="h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5" />
          )}
        </span>
        <span className="truncate text-[13px] font-medium text-zinc-800 dark:text-zinc-200">
          {item.name.replace(/\s*\(Rating \d+\)/, "")}
        </span>
        {item.rating != null && (
          <span
            data-testid="rating-pill"
            className="font-mono text-xs text-zinc-500 dark:text-zinc-500"
          >
            {item.rating}
          </span>
        )}

        <span className="ml-auto" />

        {hasWireless &&
          (isWirelessActive ? (
            <Wifi
              data-testid="wireless-icon"
              className="h-3 w-3 shrink-0 text-cyan-500 dark:text-cyan-400"
            />
          ) : (
            <WifiOff
              data-testid="wireless-icon-off"
              className="h-3 w-3 shrink-0 text-zinc-400 dark:text-zinc-500"
            />
          ))}
      </div>

      {/* Expanded section */}
      {isExpanded && (
        <div
          data-testid="expanded-content"
          onClick={(e) => e.stopPropagation()}
          className="ml-5 mt-2 space-y-1.5 border-l-2 border-zinc-200 pl-3 dark:border-zinc-700"
        >
          {/* Stats row */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
            <span data-testid="stat-essence">
              Essence{" "}
              <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                {(item.essenceCost ?? 0).toFixed(2)}
              </span>
            </span>
            <span data-testid="stat-grade">
              Grade{" "}
              <span className="font-mono font-semibold capitalize text-zinc-700 dark:text-zinc-300">
                {item.grade}
              </span>
            </span>
            <span data-testid="stat-category">
              Category{" "}
              <span className="font-medium capitalize text-zinc-700 dark:text-zinc-300">
                {item.category.replace(/-/g, " ")}
              </span>
            </span>
          </div>

          {/* Attribute bonuses (conditional) */}
          {item.attributeBonuses && Object.keys(item.attributeBonuses).length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(item.attributeBonuses).map(([attr, bonus]) => (
                <span
                  key={attr}
                  data-testid="bonus-pill"
                  className="inline-flex rounded-full bg-emerald-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                >
                  {attr.toUpperCase()} +{bonus}
                </span>
              ))}
            </div>
          )}

          {/* Notes (conditional) */}
          {item.notes && (
            <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">{item.notes}</p>
          )}

          {/* Wireless toggle (editable mode) */}
          {editable && onCharacterUpdate && hasWireless && (
            <div data-testid="wireless-toggle" className="flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                Wireless
              </span>
              <WirelessIndicator
                enabled={wirelessEnabled}
                globalEnabled={globalWireless}
                bonusDescription={item.wirelessBonus}
                effects={item.wirelessEffects}
                onToggle={(enabled) =>
                  toggleAugWireless(character, itemId, isCyberware, enabled, onCharacterUpdate)
                }
                size="sm"
              />
            </div>
          )}

          {/* Wireless bonus text (read-only or always-visible) */}
          {hasWireless && !(editable && onCharacterUpdate) && (
            <p
              data-testid="wireless-bonus-text"
              className={`text-xs leading-relaxed text-cyan-600 dark:text-cyan-400 ${!isWirelessActive ? "opacity-40" : ""}`}
            >
              {item.wirelessBonus}
            </p>
          )}

          {/* Wireless effects pills */}
          {item.wirelessEffects && item.wirelessEffects.length > 0 && (
            <div
              data-testid="wireless-effects"
              className={`flex flex-wrap gap-1.5 ${!isWirelessActive ? "opacity-40" : ""}`}
            >
              {item.wirelessEffects.map((effect, i) => (
                <span
                  key={i}
                  className="inline-flex rounded-full bg-cyan-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300"
                >
                  {effect.type === "attribute"
                    ? `${effect.attribute?.toUpperCase()} ${effect.modifier > 0 ? "+" : ""}${effect.modifier}`
                    : effect.type === "special"
                      ? effect.description || "Special"
                      : `${effect.type} ${effect.modifier > 0 ? "+" : ""}${effect.modifier}`}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// AugmentationsDisplay
// ---------------------------------------------------------------------------

interface AugmentationsDisplayProps {
  character: Character;
  onCharacterUpdate?: (updatedCharacter: Character) => void;
  editable?: boolean;
}

export function AugmentationsDisplay({
  character,
  onCharacterUpdate,
  editable,
}: AugmentationsDisplayProps) {
  const hasCyber = (character.cyberware?.length || 0) > 0;
  const hasBio = (character.bioware?.length || 0) > 0;

  if (!hasCyber && !hasBio) return null;

  const items: Record<"cyber" | "bio", (CyberwareItem | BiowareItem)[]> = {
    cyber: hasCyber
      ? [...character.cyberware!].sort((a, b) => (b.essenceCost ?? 0) - (a.essenceCost ?? 0))
      : [],
    bio: hasBio
      ? [...character.bioware!].sort((a, b) => (b.essenceCost ?? 0) - (a.essenceCost ?? 0))
      : [],
  };

  return (
    <DisplayCard
      id="sheet-augmentations"
      title="Augmentations"
      icon={<Cpu className="h-4 w-4 text-zinc-400" />}
      collapsible
    >
      <div className="space-y-3">
        {AUGMENTATION_SECTIONS.map(({ key, label }) => {
          if (items[key].length === 0) return null;
          return (
            <div key={key}>
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                {label}
              </div>
              <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
                {items[key].map((item, idx) => (
                  <AugmentationRow
                    key={`${key}-${idx}`}
                    item={item}
                    character={character}
                    isCyberware={key === "cyber"}
                    onCharacterUpdate={onCharacterUpdate}
                    editable={editable}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </DisplayCard>
  );
}
