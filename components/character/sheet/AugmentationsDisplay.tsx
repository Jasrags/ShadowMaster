"use client";

import { useState, useCallback } from "react";
import type { Character, CyberwareItem, BiowareItem, Effect } from "@/lib/types";
import type { CyberlimbItem } from "@/lib/types/cyberlimb";
import {
  getCyberlimbStrength,
  getCyberlimbAgility,
  getCyberlimbAvailableCapacity,
} from "@/lib/types/cyberlimb";
import { isGlobalWirelessEnabled } from "@/lib/rules/wireless";
import { useCyberwareCatalog, useBiowareCatalog } from "@/lib/rules/RulesetContext";
import { useInstallAugmentation, useRemoveAugmentation } from "@/lib/rules/augmentations/hooks";
import { getCurrentEssence } from "@/lib/rules/augmentations/essence";
import {
  useAddCyberlimbEnhancement,
  useRemoveCyberlimbEnhancement,
  useAddCyberlimbAccessory,
  useRemoveCyberlimbAccessory,
  useToggleCyberlimbWireless,
} from "@/lib/rules/augmentations/cyberlimb-hooks";
import { AugmentationModal } from "@/components/creation/augmentations/AugmentationModal";
import type { AugmentationSelection } from "@/components/creation/augmentations/AugmentationModal";
import { CyberlimbEnhancementModal } from "@/components/cyberlimbs/CyberlimbEnhancementModal";
import type { CyberlimbEnhancementSelection } from "@/components/cyberlimbs/CyberlimbEnhancementModal";
import { CyberlimbAccessoryModal } from "@/components/cyberlimbs/CyberlimbAccessoryModal";
import type { CyberlimbAccessorySelection } from "@/components/cyberlimbs/CyberlimbAccessoryModal";
import { DisplayCard } from "./DisplayCard";
import { RemoveAugmentationDialog } from "./RemoveAugmentationDialog";
import { WirelessIndicator } from "./WirelessIndicator";
import {
  ChevronDown,
  ChevronRight,
  Cpu,
  Wifi,
  WifiOff,
  CircuitBoard,
  Plus,
  Trash2,
} from "lucide-react";

/** Extract wireless bonus description from catalog effects with wirelessOverride. */
function getWirelessFromEffects(effects?: Effect[]): string | undefined {
  if (!effects) return undefined;
  const descriptions: string[] = [];
  for (const effect of effects) {
    if (effect.wirelessOverride?.description) {
      descriptions.push(effect.wirelessOverride.description);
    }
  }
  return descriptions.length > 0 ? descriptions.join("; ") : undefined;
}

// ---------------------------------------------------------------------------
// Section & variant configuration
// ---------------------------------------------------------------------------

const AUGMENTATION_SECTIONS = [
  { key: "cyber" as const, label: "Cyberware" },
  { key: "bio" as const, label: "Bioware" },
  { key: "cyberlimbs" as const, label: "Cyberlimbs" },
];

// ---------------------------------------------------------------------------
// Location label helper
// ---------------------------------------------------------------------------

const LOCATION_LABELS: Record<string, string> = {
  "left-arm": "L. Arm",
  "right-arm": "R. Arm",
  "left-leg": "L. Leg",
  "right-leg": "R. Leg",
  "left-hand": "L. Hand",
  "right-hand": "R. Hand",
  "left-foot": "L. Foot",
  "right-foot": "R. Foot",
  "left-lower-arm": "L. Forearm",
  "right-lower-arm": "R. Forearm",
  "left-lower-leg": "L. Shin",
  "right-lower-leg": "R. Shin",
  torso: "Torso",
  skull: "Skull",
};

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
  catalogWirelessBonus?: string;
  onRemove?: (item: CyberwareItem | BiowareItem, type: "cyberware" | "bioware") => void;
}

function AugmentationRow({
  item,
  character,
  isCyberware,
  onCharacterUpdate,
  editable,
  catalogWirelessBonus,
  onRemove,
}: AugmentationRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasWireless = !!(
    item.wirelessBonus ||
    (item.wirelessEffects && item.wirelessEffects.length > 0) ||
    catalogWirelessBonus
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
                bonusDescription={item.wirelessBonus || catalogWirelessBonus}
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
              {item.wirelessBonus || catalogWirelessBonus}
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

          {/* Remove button */}
          {editable && onRemove && (
            <button
              data-testid="remove-augmentation-btn"
              onClick={() => onRemove(item, isCyberware ? "cyberware" : "bioware")}
              className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-red-500 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30"
            >
              <Trash2 className="h-3 w-3" />
              Remove
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// CyberlimbRow
// ---------------------------------------------------------------------------

interface CyberlimbRowProps {
  limb: CyberlimbItem;
  character: Character;
  editable?: boolean;
  onToggleWireless?: (limbId: string, enabled: boolean) => void;
  onAddEnhancement?: (limb: CyberlimbItem) => void;
  onAddAccessory?: (limb: CyberlimbItem) => void;
  onRemoveEnhancement?: (limbId: string, enhancementId: string) => void;
  onRemoveAccessory?: (limbId: string, accessoryId: string) => void;
}

function CyberlimbRow({
  limb,
  character,
  editable,
  onToggleWireless,
  onAddEnhancement,
  onAddAccessory,
  onRemoveEnhancement,
  onRemoveAccessory,
}: CyberlimbRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const globalWireless = isGlobalWirelessEnabled(character);
  const wirelessEnabled = limb.wirelessEnabled;
  const isWirelessActive = globalWireless && wirelessEnabled;

  const str = getCyberlimbStrength(limb);
  const agi = getCyberlimbAgility(limb);
  const available = getCyberlimbAvailableCapacity(limb);
  const capacityPercent = limb.baseCapacity > 0 ? (limb.capacityUsed / limb.baseCapacity) * 100 : 0;

  const limbId = limb.id || limb.catalogId;
  const locationLabel = LOCATION_LABELS[limb.location] || limb.location;

  // STR/AGI breakdown helpers
  const strEnhancement = limb.enhancements.find((e) => e.enhancementType === "strength");
  const agiEnhancement = limb.enhancements.find((e) => e.enhancementType === "agility");

  return (
    <div
      data-testid="cyberlimb-row"
      onClick={() => setIsExpanded(!isExpanded)}
      className="cursor-pointer px-3 py-1.5 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-700/30 [&+&]:border-t [&+&]:border-zinc-200 dark:[&+&]:border-zinc-800/50"
    >
      {/* Collapsed row */}
      <div className="flex min-w-0 items-center gap-1.5">
        <span data-testid="expand-button" className="shrink-0 text-zinc-400">
          {isExpanded ? (
            <ChevronDown className="h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5" />
          )}
        </span>
        <span className="truncate text-[13px] font-medium text-zinc-800 dark:text-zinc-200">
          {limb.name}
        </span>
        <span
          data-testid="location-pill"
          className="rounded-full bg-zinc-200 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300"
        >
          {locationLabel}
        </span>

        <span className="ml-auto" />

        <span
          data-testid="str-agi-display"
          className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400"
        >
          S{str} A{agi}
        </span>
        <span
          data-testid="capacity-display"
          className="font-mono text-[11px] text-cyan-600 dark:text-cyan-400"
        >
          [{limb.capacityUsed}/{limb.baseCapacity}]
        </span>

        {isWirelessActive ? (
          <Wifi
            data-testid="wireless-icon"
            className="h-3 w-3 shrink-0 text-cyan-500 dark:text-cyan-400"
          />
        ) : (
          <WifiOff
            data-testid="wireless-icon-off"
            className="h-3 w-3 shrink-0 text-zinc-400 dark:text-zinc-500"
          />
        )}
      </div>

      {/* Expanded section */}
      {isExpanded && (
        <div
          data-testid="cyberlimb-expanded"
          onClick={(e) => e.stopPropagation()}
          className="ml-5 mt-2 space-y-2 border-l-2 border-zinc-200 pl-3 dark:border-zinc-700"
        >
          {/* Capacity bar */}
          <div data-testid="capacity-bar">
            <div className="mb-0.5 flex items-center justify-between text-[10px] text-zinc-500">
              <span>Capacity</span>
              <span className="font-mono">
                {limb.capacityUsed}/{limb.baseCapacity} ({available} free)
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
              <div
                className={`h-full rounded-full transition-all ${
                  capacityPercent > 90
                    ? "bg-red-500"
                    : capacityPercent > 70
                      ? "bg-amber-500"
                      : "bg-cyan-500"
                }`}
                style={{ width: `${Math.min(capacityPercent, 100)}%` }}
              />
            </div>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
            <span data-testid="stat-essence">
              Essence{" "}
              <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                {(limb.essenceCost ?? 0).toFixed(2)}
              </span>
            </span>
            <span data-testid="stat-grade">
              Grade{" "}
              <span className="font-mono font-semibold capitalize text-zinc-700 dark:text-zinc-300">
                {limb.grade}
              </span>
            </span>
            <span data-testid="stat-appearance">
              Appearance{" "}
              <span className="font-medium capitalize text-zinc-700 dark:text-zinc-300">
                {limb.appearance}
              </span>
            </span>
          </div>

          {/* STR/AGI breakdown */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
            <span data-testid="str-breakdown">
              STR{" "}
              <span className="font-mono text-zinc-700 dark:text-zinc-300">
                {limb.baseStrength} + {limb.customStrength}
                {strEnhancement ? ` + ${strEnhancement.rating}` : ""} = {str}
              </span>
            </span>
            <span data-testid="agi-breakdown">
              AGI{" "}
              <span className="font-mono text-zinc-700 dark:text-zinc-300">
                {limb.baseAgility} + {limb.customAgility}
                {agiEnhancement ? ` + ${agiEnhancement.rating}` : ""} = {agi}
              </span>
            </span>
          </div>

          {/* Enhancements */}
          {limb.enhancements.length > 0 && (
            <div data-testid="enhancements-list">
              <div className="mb-0.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                Enhancements
              </div>
              <div className="space-y-0.5">
                {limb.enhancements.map((enh) => (
                  <div
                    key={enh.id}
                    className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400"
                  >
                    <span className="flex-1">
                      {enh.name} <span className="font-mono text-zinc-500">R{enh.rating}</span>
                      <span className="ml-1 font-mono text-cyan-600 dark:text-cyan-400">
                        [{enh.capacityUsed}]
                      </span>
                    </span>
                    {editable && onRemoveEnhancement && (
                      <button
                        data-testid={`remove-enhancement-${enh.id}`}
                        onClick={() => onRemoveEnhancement(limbId, enh.id)}
                        className="rounded p-0.5 text-zinc-400 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/30"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Accessories */}
          {limb.accessories.length > 0 && (
            <div data-testid="accessories-list">
              <div className="mb-0.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                Accessories
              </div>
              <div className="space-y-0.5">
                {limb.accessories.map((acc) => (
                  <div
                    key={acc.id}
                    className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400"
                  >
                    <span className="flex-1">
                      {acc.name}
                      {acc.rating != null && (
                        <span className="ml-1 font-mono text-zinc-500">R{acc.rating}</span>
                      )}
                      <span className="ml-1 font-mono text-cyan-600 dark:text-cyan-400">
                        [{acc.capacityUsed}]
                      </span>
                    </span>
                    {editable && onRemoveAccessory && (
                      <button
                        data-testid={`remove-accessory-${acc.id}`}
                        onClick={() => onRemoveAccessory(limbId, acc.id)}
                        className="rounded p-0.5 text-zinc-400 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/30"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Weapons (read-only) */}
          {limb.weapons.length > 0 && (
            <div data-testid="weapons-list">
              <div className="mb-0.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                Weapons
              </div>
              <div className="space-y-0.5">
                {limb.weapons.map((wpn) => (
                  <div key={wpn.id} className="text-xs text-zinc-600 dark:text-zinc-400">
                    {wpn.name}{" "}
                    <span className="font-mono text-zinc-500">
                      {wpn.damage} AP{wpn.ap}
                    </span>
                    <span className="ml-1 font-mono text-cyan-600 dark:text-cyan-400">
                      [{wpn.capacityUsed}]
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          {editable && (
            <div className="flex gap-2 pt-1">
              {onAddEnhancement && (
                <button
                  data-testid="add-enhancement-btn"
                  onClick={() => onAddEnhancement(limb)}
                  className="flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-1 text-[11px] font-medium text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                >
                  <Plus className="h-3 w-3" />
                  Enhancement
                </button>
              )}
              {onAddAccessory && (
                <button
                  data-testid="add-accessory-btn"
                  onClick={() => onAddAccessory(limb)}
                  className="flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-1 text-[11px] font-medium text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                >
                  <Plus className="h-3 w-3" />
                  Accessory
                </button>
              )}
            </div>
          )}

          {/* Wireless toggle */}
          {editable && onToggleWireless && (
            <div data-testid="cyberlimb-wireless-toggle" className="flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                Wireless
              </span>
              <WirelessIndicator
                enabled={wirelessEnabled}
                globalEnabled={globalWireless}
                onToggle={(enabled) => onToggleWireless(limbId, enabled)}
                size="sm"
              />
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
  const cyberwareCatalog = useCyberwareCatalog();
  const biowareCatalog = useBiowareCatalog();

  // Install/remove modal state
  const [installModalOpen, setInstallModalOpen] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<{
    item: CyberwareItem | BiowareItem;
    type: "cyberware" | "bioware";
  } | null>(null);

  // Cyberlimb modal state
  const [selectedCyberlimb, setSelectedCyberlimb] = useState<CyberlimbItem | null>(null);
  const [enhancementModalOpen, setEnhancementModalOpen] = useState(false);
  const [accessoryModalOpen, setAccessoryModalOpen] = useState(false);

  // Mutation hooks
  const characterId = character.id ?? null;
  const { install, loading: installLoading } = useInstallAugmentation(characterId);
  const { remove: removeAug, loading: removeLoading } = useRemoveAugmentation(characterId);
  const { add: addEnhancement } = useAddCyberlimbEnhancement(characterId);
  const { remove: removeEnhancement } = useRemoveCyberlimbEnhancement(characterId);
  const { add: addAccessory } = useAddCyberlimbAccessory(characterId);
  const { remove: removeAccessory } = useRemoveCyberlimbAccessory(characterId);
  const { toggle: toggleWireless } = useToggleCyberlimbWireless(characterId);

  const hasCyber = (character.cyberware?.length || 0) > 0;
  const hasBio = (character.bioware?.length || 0) > 0;
  const hasCyberlimbs = (character.cyberlimbs?.length || 0) > 0;

  // Character metadata for modal
  const isAwakened = !!(
    character.specialAttributes?.magic != null && character.specialAttributes.magic > 0
  );
  const isTechnomancer = !!(
    character.specialAttributes?.resonance != null && character.specialAttributes.resonance > 0
  );
  const remainingEssence = getCurrentEssence(character.cyberware ?? [], character.bioware ?? []);

  // Install augmentation handler
  const handleInstall = useCallback(
    async (selection: AugmentationSelection) => {
      if (!onCharacterUpdate) return;
      const result = await install({
        type: selection.type === "cyberware" ? "cyberware" : "bioware",
        catalogId: selection.catalogId,
        grade: selection.grade,
        rating: selection.rating,
      });
      if (result.success && result.installedItem) {
        const item = result.installedItem;
        if (selection.type === "cyberware") {
          onCharacterUpdate({
            ...character,
            cyberware: [...(character.cyberware ?? []), item as CyberwareItem],
          });
        } else {
          onCharacterUpdate({
            ...character,
            bioware: [...(character.bioware ?? []), item as BiowareItem],
          });
        }
      }
    },
    [character, onCharacterUpdate, install]
  );

  // Remove augmentation handler
  const handleRemoveConfirm = useCallback(async () => {
    if (!removeTarget || !onCharacterUpdate) return;
    const itemId = removeTarget.item.id || removeTarget.item.catalogId;
    const result = await removeAug(itemId);
    if (result.success) {
      if (removeTarget.type === "cyberware") {
        onCharacterUpdate({
          ...character,
          cyberware: character.cyberware?.filter((c) => (c.id || c.catalogId) !== itemId),
        });
      } else {
        onCharacterUpdate({
          ...character,
          bioware: character.bioware?.filter((b) => (b.id || b.catalogId) !== itemId),
        });
      }
      setRemoveTarget(null);
    }
  }, [removeTarget, character, onCharacterUpdate, removeAug]);

  // Cyberlimb mutation handlers
  const handleAddEnhancement = useCallback(
    async (selection: CyberlimbEnhancementSelection) => {
      if (!selectedCyberlimb || !onCharacterUpdate) return;
      const limbId = selectedCyberlimb.id || selectedCyberlimb.catalogId;
      const result = await addEnhancement(limbId, {
        catalogId: `enhancement-${selection.enhancementType}`,
        rating: selection.rating,
      });
      if (result.success && result.enhancement) {
        const updatedCyberlimbs = character.cyberlimbs?.map((cl) => {
          if ((cl.id || cl.catalogId) !== limbId) return cl;
          return {
            ...cl,
            enhancements: [
              ...cl.enhancements,
              {
                id: result.enhancement!.id,
                catalogId: result.enhancement!.catalogId,
                name: result.enhancement!.name,
                enhancementType: result.enhancement!.enhancementType as
                  | "agility"
                  | "strength"
                  | "armor",
                rating: result.enhancement!.rating,
                capacityUsed: result.enhancement!.capacityUsed,
                cost: result.enhancement!.cost,
                availability: 0,
              },
            ],
            capacityUsed: cl.capacityUsed + result.enhancement!.capacityUsed,
          };
        });
        onCharacterUpdate({ ...character, cyberlimbs: updatedCyberlimbs });
      }
    },
    [selectedCyberlimb, character, onCharacterUpdate, addEnhancement]
  );

  const handleRemoveEnhancement = useCallback(
    async (limbId: string, enhancementId: string) => {
      if (!onCharacterUpdate) return;
      const result = await removeEnhancement(limbId, enhancementId);
      if (result.success) {
        const updatedCyberlimbs = character.cyberlimbs?.map((cl) => {
          if ((cl.id || cl.catalogId) !== limbId) return cl;
          const removed = cl.enhancements.find((e) => e.id === enhancementId);
          return {
            ...cl,
            enhancements: cl.enhancements.filter((e) => e.id !== enhancementId),
            capacityUsed: cl.capacityUsed - (removed?.capacityUsed ?? 0),
          };
        });
        onCharacterUpdate({ ...character, cyberlimbs: updatedCyberlimbs });
      }
    },
    [character, onCharacterUpdate, removeEnhancement]
  );

  const handleAddAccessory = useCallback(
    async (selection: CyberlimbAccessorySelection) => {
      if (!selectedCyberlimb || !onCharacterUpdate) return;
      const limbId = selectedCyberlimb.id || selectedCyberlimb.catalogId;
      const result = await addAccessory(limbId, {
        catalogId: selection.catalogId,
        rating: selection.rating,
      });
      if (result.success && result.accessory) {
        const updatedCyberlimbs = character.cyberlimbs?.map((cl) => {
          if ((cl.id || cl.catalogId) !== limbId) return cl;
          return {
            ...cl,
            accessories: [
              ...cl.accessories,
              {
                id: result.accessory!.id,
                catalogId: result.accessory!.catalogId,
                name: result.accessory!.name,
                rating: result.accessory!.rating,
                capacityUsed: result.accessory!.capacityUsed,
                cost: result.accessory!.cost,
                availability: 0,
              },
            ],
            capacityUsed: cl.capacityUsed + result.accessory!.capacityUsed,
          };
        });
        onCharacterUpdate({ ...character, cyberlimbs: updatedCyberlimbs });
      }
    },
    [selectedCyberlimb, character, onCharacterUpdate, addAccessory]
  );

  const handleRemoveAccessory = useCallback(
    async (limbId: string, accessoryId: string) => {
      if (!onCharacterUpdate) return;
      const result = await removeAccessory(limbId, accessoryId);
      if (result.success) {
        const updatedCyberlimbs = character.cyberlimbs?.map((cl) => {
          if ((cl.id || cl.catalogId) !== limbId) return cl;
          const removed = cl.accessories.find((a) => a.id === accessoryId);
          return {
            ...cl,
            accessories: cl.accessories.filter((a) => a.id !== accessoryId),
            capacityUsed: cl.capacityUsed - (removed?.capacityUsed ?? 0),
          };
        });
        onCharacterUpdate({ ...character, cyberlimbs: updatedCyberlimbs });
      }
    },
    [character, onCharacterUpdate, removeAccessory]
  );

  const handleToggleCyberlimbWireless = useCallback(
    async (limbId: string, enabled: boolean) => {
      if (!onCharacterUpdate) return;
      const result = await toggleWireless(limbId, enabled);
      if (result.success) {
        const updatedCyberlimbs = character.cyberlimbs?.map((cl) =>
          (cl.id || cl.catalogId) === limbId ? { ...cl, wirelessEnabled: enabled } : cl
        );
        onCharacterUpdate({ ...character, cyberlimbs: updatedCyberlimbs });
      }
    },
    [character, onCharacterUpdate, toggleWireless]
  );

  if (!hasCyber && !hasBio && !hasCyberlimbs && !editable) return null;

  const items: Record<"cyber" | "bio", (CyberwareItem | BiowareItem)[]> = {
    cyber: hasCyber
      ? [...character.cyberware!].sort((a, b) => (b.essenceCost ?? 0) - (a.essenceCost ?? 0))
      : [],
    bio: hasBio
      ? [...character.bioware!].sort((a, b) => (b.essenceCost ?? 0) - (a.essenceCost ?? 0))
      : [],
  };

  const cyberlimbs = hasCyberlimbs
    ? [...character.cyberlimbs!].sort((a, b) => a.location.localeCompare(b.location))
    : [];

  /** Resolve catalog wireless bonus for an augmentation item. */
  function getCatalogWirelessBonus(
    item: CyberwareItem | BiowareItem,
    isCyberware: boolean
  ): string | undefined {
    if (!item.catalogId) return undefined;
    if (isCyberware) {
      const catalogItem = cyberwareCatalog.find((c) => c.id === item.catalogId);
      return catalogItem?.wirelessBonus || getWirelessFromEffects(catalogItem?.effects);
    } else {
      const catalogItem = biowareCatalog.find((b) => b.id === item.catalogId);
      return getWirelessFromEffects(catalogItem?.effects);
    }
  }

  return (
    <DisplayCard
      id="sheet-augmentations"
      title="Augmentations"
      icon={<Cpu className="h-4 w-4 text-zinc-400" />}
      collapsible
      headerAction={
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
            {remainingEssence.toFixed(2)} ESS
          </span>
          {editable && onCharacterUpdate && (
            <button
              data-testid="install-augmentation-btn"
              onClick={() => setInstallModalOpen(true)}
              className="flex items-center gap-1 rounded-md bg-cyan-500/10 px-2 py-0.5 text-[11px] font-medium text-cyan-600 hover:bg-cyan-500/20 dark:text-cyan-400"
            >
              <Plus className="h-3 w-3" />
              Install
            </button>
          )}
        </div>
      }
    >
      <div className="space-y-3">
        {!hasCyber && !hasBio && !hasCyberlimbs && (
          <p className="text-sm text-zinc-500 italic">No augmentations installed</p>
        )}
        {AUGMENTATION_SECTIONS.map(({ key, label }) => {
          if (key === "cyberlimbs") {
            if (cyberlimbs.length === 0) return null;
            return (
              <div key={key}>
                <div className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                  <CircuitBoard className="h-3 w-3" />
                  {label}
                </div>
                <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
                  {cyberlimbs.map((limb, idx) => (
                    <CyberlimbRow
                      key={`cyberlimb-${idx}`}
                      limb={limb}
                      character={character}
                      editable={editable}
                      onToggleWireless={handleToggleCyberlimbWireless}
                      onAddEnhancement={(l) => {
                        setSelectedCyberlimb(l);
                        setEnhancementModalOpen(true);
                      }}
                      onAddAccessory={(l) => {
                        setSelectedCyberlimb(l);
                        setAccessoryModalOpen(true);
                      }}
                      onRemoveEnhancement={handleRemoveEnhancement}
                      onRemoveAccessory={handleRemoveAccessory}
                    />
                  ))}
                </div>
              </div>
            );
          }

          if (items[key].length === 0) return null;
          const isCyberware = key === "cyber";
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
                    isCyberware={isCyberware}
                    onCharacterUpdate={onCharacterUpdate}
                    editable={editable}
                    catalogWirelessBonus={getCatalogWirelessBonus(item, isCyberware)}
                    onRemove={
                      editable && onCharacterUpdate
                        ? (i, t) => setRemoveTarget({ item: i, type: t })
                        : undefined
                    }
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Cyberlimb Enhancement Modal */}
      {selectedCyberlimb && (
        <CyberlimbEnhancementModal
          isOpen={enhancementModalOpen}
          onClose={() => {
            setEnhancementModalOpen(false);
            setSelectedCyberlimb(null);
          }}
          onAdd={handleAddEnhancement}
          limb={selectedCyberlimb}
          availableNuyen={Infinity}
        />
      )}

      {/* Cyberlimb Accessory Modal */}
      {selectedCyberlimb && (
        <CyberlimbAccessoryModal
          isOpen={accessoryModalOpen}
          onClose={() => {
            setAccessoryModalOpen(false);
            setSelectedCyberlimb(null);
          }}
          onAdd={handleAddAccessory}
          limb={selectedCyberlimb}
          availableNuyen={Infinity}
        />
      )}

      {/* Install Augmentation Modal */}
      <AugmentationModal
        isOpen={installModalOpen}
        onClose={() => setInstallModalOpen(false)}
        onAdd={handleInstall}
        augmentationType="cyberware"
        mode="management"
        remainingEssence={remainingEssence}
        remainingNuyen={Infinity}
        isAwakened={isAwakened}
        isTechnomancer={isTechnomancer}
        currentMagic={character.specialAttributes?.magic ?? 0}
        currentResonance={character.specialAttributes?.resonance ?? 0}
      />

      {/* Remove Augmentation Confirmation */}
      {removeTarget && (
        <RemoveAugmentationDialog
          item={removeTarget.item}
          type={removeTarget.type}
          isAwakened={isAwakened}
          isTechnomancer={isTechnomancer}
          onConfirm={handleRemoveConfirm}
          onCancel={() => setRemoveTarget(null)}
          loading={removeLoading}
        />
      )}
    </DisplayCard>
  );
}
