"use client";

/**
 * AugmentationDetailsPane
 *
 * Right-pane detail preview for the augmentation modal.
 * Shows item info, rating/location/skill selectors, stats grid,
 * bonuses, wireless bonus, magic/resonance warning, and validation errors.
 */

import { AlertTriangle, Zap, Cpu, Heart, Ban } from "lucide-react";
import type { CyberwareCatalogItemData, BiowareCatalogItemData } from "@/lib/rules/RulesetContext";
import type { CyberlimbLocation, CyberlimbType } from "@/lib/types/cyberlimb";
import type { SkillData } from "@/lib/rules/RulesetContext";
import { hasUnifiedRatings } from "@/lib/types/ratings";
import { RatingSelector } from "../shared";
import {
  formatCurrency,
  formatEssence,
  getAvailabilityDisplay,
  getLocationConflict,
  LOCATION_LABELS,
  type AugmentationType,
  type InstalledCyberlimb,
} from "./augmentationModalHelpers";

// =============================================================================
// TYPES
// =============================================================================

export interface AugmentationDetailsPaneProps {
  /** Active augmentation type */
  activeType: AugmentationType;
  /** Calculated selected item with grade-adjusted values (null if none selected) */
  selectedItem:
    | ((CyberwareCatalogItemData | BiowareCatalogItemData) & {
        essenceCost: number;
        cost: number;
        availability: number;
        capacity?: number;
        baseEssenceCost: number;
        attributeBonuses?: Record<string, number>;
        initiativeDiceBonus?: number;
      })
    | null;
  /** Raw catalog item (for rating checks) */
  rawSelectedItem: CyberwareCatalogItemData | BiowareCatalogItemData | null;
  /** Whether cost is within budget */
  canAfford: boolean;
  /** Whether essence cost is within remaining essence */
  hasEssence: boolean;
  /** Whether availability is within limit */
  meetsAvailability: boolean;
  /** Maximum availability limit */
  maxAvailability: number;
  /** Current autosoft rating selection */
  selectedRating: number;
  /** Rating change handler */
  onRatingChange: (rating: number) => void;
  /** Whether selected item is a cyberlimb */
  isCyberlimb: boolean;
  /** Valid locations for the selected cyberlimb */
  validLocations: CyberlimbLocation[];
  /** Currently selected location */
  selectedLocation: CyberlimbLocation | null;
  /** Location change handler */
  onLocationChange: (location: CyberlimbLocation) => void;
  /** The limb type of the selected cyberlimb */
  selectedLimbType: CyberlimbType | null;
  /** Location conflict status */
  locationConflict: {
    type: "blocked" | "replaces" | "none";
    by?: InstalledCyberlimb;
    replaces?: InstalledCyberlimb[];
  };
  /** Installed cyberlimbs for conflict checking */
  installedCyberlimbs: InstalledCyberlimb[];
  /** Whether this bioware requires a skill selection */
  requiresSkillSelection: boolean;
  /** Filtered skills available for selection */
  filteredSkills: SkillData[];
  /** Currently selected skill */
  selectedSkill: string | null;
  /** Skill change handler */
  onSkillChange: (skillId: string | null) => void;
  /** Whether the character is awakened */
  isAwakened?: boolean;
  /** Whether the character is a technomancer */
  isTechnomancer?: boolean;
  /** Projected magic/resonance loss */
  projectedMagicLoss: number;
  /** Current magic rating */
  currentMagic: number;
  /** Current resonance rating */
  currentResonance: number;
  /** Remaining nuyen budget */
  remainingNuyen: number;
  /** Remaining essence */
  remainingEssence: number;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function AugmentationDetailsPane({
  activeType,
  selectedItem,
  rawSelectedItem,
  canAfford,
  hasEssence,
  meetsAvailability,
  maxAvailability,
  selectedRating,
  onRatingChange,
  isCyberlimb,
  validLocations,
  selectedLocation,
  onLocationChange,
  selectedLimbType,
  locationConflict,
  installedCyberlimbs,
  requiresSkillSelection,
  filteredSkills,
  selectedSkill,
  onSkillChange,
  isAwakened,
  isTechnomancer,
  projectedMagicLoss,
  currentMagic,
  currentResonance,
  remainingNuyen,
  remainingEssence,
}: AugmentationDetailsPaneProps) {
  const isCyberware = activeType === "cyberware";
  const TypeIcon = isCyberware ? Cpu : Heart;

  if (!selectedItem) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-zinc-400">
        <TypeIcon className="h-12 w-12" />
        <p className="mt-4 text-sm">Select {isCyberware ? "cyberware" : "bioware"} from the list</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Item Info */}
      <div>
        <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          {selectedItem.name}
        </h3>
        {selectedItem.description && (
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            {selectedItem.description}
          </p>
        )}
      </div>

      {/* Rating Selector for rated items */}
      {rawSelectedItem && hasUnifiedRatings(rawSelectedItem) && (
        <RatingSelector
          item={rawSelectedItem}
          selectedRating={selectedRating}
          onRatingChange={onRatingChange}
          maxAvailability={maxAvailability}
          showCostPreview={false}
          showEssencePreview={false}
          label="Rating"
        />
      )}

      {/* Location Selector for cyberlimbs */}
      {isCyberlimb && validLocations.length > 0 && (
        <LocationSelector
          validLocations={validLocations}
          selectedLocation={selectedLocation}
          onLocationChange={onLocationChange}
          selectedLimbType={selectedLimbType!}
          locationConflict={locationConflict}
          installedCyberlimbs={installedCyberlimbs}
        />
      )}

      {/* Skill Selector for skill-linked bioware */}
      {requiresSkillSelection && filteredSkills.length > 0 && (
        <SkillSelector
          filteredSkills={filteredSkills}
          selectedSkill={selectedSkill}
          onSkillChange={onSkillChange}
        />
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg bg-zinc-50 p-3 text-center dark:bg-zinc-800">
          <div className="text-xs text-zinc-500 dark:text-zinc-400">Essence</div>
          <div
            className={`mt-1 font-mono text-xl font-bold ${
              hasEssence
                ? isCyberware
                  ? "text-cyan-600 dark:text-cyan-400"
                  : "text-pink-600 dark:text-pink-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {formatEssence(selectedItem.essenceCost)}
          </div>
        </div>
        <div className="rounded-lg bg-zinc-50 p-3 text-center dark:bg-zinc-800">
          <div className="text-xs text-zinc-500 dark:text-zinc-400">Cost</div>
          <div
            className={`mt-1 font-mono text-xl font-bold ${
              canAfford ? "text-zinc-900 dark:text-zinc-100" : "text-red-600 dark:text-red-400"
            }`}
          >
            {formatCurrency(selectedItem.cost)}¥
          </div>
        </div>
        <div className="rounded-lg bg-zinc-50 p-3 text-center dark:bg-zinc-800">
          <div className="text-xs text-zinc-500 dark:text-zinc-400">Availability</div>
          <div
            className={`mt-1 font-mono text-xl font-bold ${
              meetsAvailability
                ? "text-zinc-900 dark:text-zinc-100"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {getAvailabilityDisplay(selectedItem.availability, selectedItem.legality)}
          </div>
        </div>
      </div>

      {/* Capacity info for cyberware */}
      {isCyberware && (selectedItem as CyberwareCatalogItemData).capacity && (
        <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 dark:bg-blue-900/20">
          <Zap className="h-4 w-4 text-blue-500" />
          <span className="text-xs text-blue-700 dark:text-blue-300">
            Capacity: {(selectedItem as CyberwareCatalogItemData).capacity} - Can install
            enhancements
          </span>
        </div>
      )}

      {/* Attribute bonuses and Initiative dice */}
      {((selectedItem.attributeBonuses && Object.keys(selectedItem.attributeBonuses).length > 0) ||
        selectedItem.initiativeDiceBonus) && (
        <div>
          <h4 className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Bonuses</h4>
          <div className="mt-1 flex flex-wrap gap-1">
            {selectedItem.attributeBonuses &&
              Object.entries(selectedItem.attributeBonuses).map(([attr, bonus]) => (
                <span
                  key={attr}
                  className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
                >
                  {attr}: +{bonus}
                </span>
              ))}
            {selectedItem.initiativeDiceBonus && (
              <span className="rounded bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
                +{selectedItem.initiativeDiceBonus}D6 Initiative
              </span>
            )}
          </div>
        </div>
      )}

      {/* Wireless bonus */}
      {isCyberware && (selectedItem as CyberwareCatalogItemData).wirelessBonus && (
        <div>
          <h4 className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Wireless Bonus</h4>
          <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
            {(selectedItem as CyberwareCatalogItemData).wirelessBonus}
          </p>
        </div>
      )}

      {/* Magic/Resonance warning */}
      {(isAwakened || isTechnomancer) && projectedMagicLoss > 0 && (
        <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 dark:bg-amber-900/20">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <div className="text-xs text-amber-800 dark:text-amber-200">
            <p className="font-medium">
              {isAwakened ? "Magic" : "Resonance"} will be reduced by {projectedMagicLoss}
            </p>
            <p className="mt-0.5">
              New rating:{" "}
              {Math.max(0, (isAwakened ? currentMagic : currentResonance) - projectedMagicLoss)}
            </p>
          </div>
        </div>
      )}

      {/* Validation errors */}
      {!canAfford && (
        <div className="rounded-lg bg-red-50 p-2 text-xs text-red-700 dark:bg-red-900/20 dark:text-red-300">
          Not enough nuyen ({formatCurrency(remainingNuyen)}¥ remaining)
        </div>
      )}
      {!hasEssence && (
        <div className="rounded-lg bg-red-50 p-2 text-xs text-red-700 dark:bg-red-900/20 dark:text-red-300">
          Not enough essence ({formatEssence(remainingEssence)} remaining)
        </div>
      )}
      {!meetsAvailability && (
        <div className="rounded-lg bg-red-50 p-2 text-xs text-red-700 dark:bg-red-900/20 dark:text-red-300">
          Exceeds availability limit ({maxAvailability})
        </div>
      )}
    </div>
  );
}

// =============================================================================
// LOCATION SELECTOR
// =============================================================================

function LocationSelector({
  validLocations,
  selectedLocation,
  onLocationChange,
  selectedLimbType,
  locationConflict,
  installedCyberlimbs,
}: {
  validLocations: CyberlimbLocation[];
  selectedLocation: CyberlimbLocation | null;
  onLocationChange: (location: CyberlimbLocation) => void;
  selectedLimbType: CyberlimbType;
  locationConflict: {
    type: "blocked" | "replaces" | "none";
    by?: InstalledCyberlimb;
    replaces?: InstalledCyberlimb[];
  };
  installedCyberlimbs: InstalledCyberlimb[];
}) {
  return (
    <div>
      <h4 className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
        Installation Location <span className="text-red-500">*</span>
      </h4>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {validLocations.map((location) => {
          const conflict = getLocationConflict(location, selectedLimbType, installedCyberlimbs);
          const isSelected = selectedLocation === location;
          const isBlocked = conflict.type === "blocked";
          const willReplace = conflict.type === "replaces";

          return (
            <button
              key={location}
              onClick={() => !isBlocked && onLocationChange(location)}
              disabled={isBlocked}
              className={`relative flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition-colors ${
                isSelected
                  ? "border-cyan-500 bg-cyan-50 text-cyan-700 dark:border-cyan-400 dark:bg-cyan-900/30 dark:text-cyan-300"
                  : isBlocked
                    ? "cursor-not-allowed border-zinc-200 bg-zinc-100 text-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-500"
                    : willReplace
                      ? "border-amber-300 bg-amber-50 text-amber-700 hover:border-amber-400 dark:border-amber-600 dark:bg-amber-900/20 dark:text-amber-300"
                      : "border-zinc-200 text-zinc-700 hover:border-cyan-400 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-cyan-500"
              }`}
            >
              <span>{LOCATION_LABELS[location]}</span>
              {isBlocked && <Ban className="h-4 w-4 text-zinc-400" />}
              {willReplace && !isSelected && <AlertTriangle className="h-4 w-4 text-amber-500" />}
            </button>
          );
        })}
      </div>

      {/* Conflict Messages */}
      {locationConflict.type === "blocked" && locationConflict.by && (
        <div className="mt-2 flex items-start gap-2 rounded-lg bg-red-50 p-2 text-xs dark:bg-red-900/20">
          <Ban className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-500" />
          <span className="text-red-700 dark:text-red-300">
            Blocked by existing {locationConflict.by.name}. Remove it first to install here.
          </span>
        </div>
      )}
      {locationConflict.type === "replaces" && locationConflict.replaces && (
        <div className="mt-2 flex items-start gap-2 rounded-lg bg-amber-50 p-2 text-xs dark:bg-amber-900/20">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
          <span className="text-amber-700 dark:text-amber-300">
            Will replace: {locationConflict.replaces.map((l) => l.name).join(", ")}
          </span>
        </div>
      )}
      {!selectedLocation && (
        <p className="mt-2 text-xs text-red-500">Please select where to install this cyberlimb</p>
      )}
    </div>
  );
}

// =============================================================================
// SKILL SELECTOR
// =============================================================================

function SkillSelector({
  filteredSkills,
  selectedSkill,
  onSkillChange,
}: {
  filteredSkills: SkillData[];
  selectedSkill: string | null;
  onSkillChange: (skillId: string | null) => void;
}) {
  return (
    <div>
      <h4 className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
        Target Skill <span className="text-red-500">*</span>
      </h4>
      <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
        Select the skill this bioware will enhance
      </p>
      <select
        value={selectedSkill ?? ""}
        onChange={(e) => onSkillChange(e.target.value || null)}
        className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
      >
        <option value="">Select a skill...</option>
        {filteredSkills.map((skill) => (
          <option key={skill.id} value={skill.id}>
            {skill.name} ({skill.linkedAttribute})
          </option>
        ))}
      </select>
      {!selectedSkill && (
        <p className="mt-2 text-xs text-red-500">Please select a target skill for this bioware</p>
      )}
    </div>
  );
}
