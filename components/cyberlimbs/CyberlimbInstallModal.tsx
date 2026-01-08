"use client";

/**
 * CyberlimbInstallModal - Modal for installing a new cyberlimb
 *
 * Features:
 * - Select limb type (full-arm, lower-leg, hand, etc.)
 * - Select body location (left/right side)
 * - Select appearance (obvious vs synthetic)
 * - Select grade (standard, alpha, beta, delta)
 * - Optional STR/AGI customization
 * - Hierarchical replacement warnings
 * - Essence/cost/availability preview
 */

import { useMemo, useState, useCallback } from "react";
import type { CyberwareGrade } from "@/lib/types";
import type {
  CyberlimbType,
  CyberlimbLocation,
  CyberlimbAppearance,
  CyberlimbItem,
} from "@/lib/types/cyberlimb";
import {
  LIMB_TYPE_LOCATIONS,
  LIMB_HIERARCHY,
  LOCATION_LIMB_TYPE,
  LOCATION_SIDE,
  getAffectedLocations,
} from "@/lib/types/cyberlimb";
import { X, AlertTriangle, Cpu, Plus, Minus, Target, Zap } from "lucide-react";

// =============================================================================
// CONSTANTS
// =============================================================================

const LIMB_TYPES: { value: CyberlimbType; label: string; capacity: number; essence: number }[] = [
  { value: "full-arm", label: "Full Arm", capacity: 15, essence: 1.0 },
  { value: "lower-arm", label: "Lower Arm", capacity: 10, essence: 0.45 },
  { value: "hand", label: "Hand", capacity: 4, essence: 0.25 },
  { value: "full-leg", label: "Full Leg", capacity: 20, essence: 1.0 },
  { value: "lower-leg", label: "Lower Leg", capacity: 12, essence: 0.45 },
  { value: "foot", label: "Foot", capacity: 4, essence: 0.25 },
  { value: "torso", label: "Torso", capacity: 10, essence: 1.5 },
  { value: "skull", label: "Skull", capacity: 4, essence: 0.75 },
];

const APPEARANCES: { value: CyberlimbAppearance; label: string; capacityMod: number; costMod: number }[] = [
  { value: "obvious", label: "Obvious", capacityMod: 0, costMod: 1 },
  { value: "synthetic", label: "Synthetic", capacityMod: -5, costMod: 1.5 },
];

const GRADES: { value: CyberwareGrade; label: string; essenceMod: number; costMod: number; availMod: number }[] = [
  { value: "standard", label: "Standard", essenceMod: 1.0, costMod: 1.0, availMod: 0 },
  { value: "alpha", label: "Alphaware", essenceMod: 0.8, costMod: 1.2, availMod: 2 },
  { value: "beta", label: "Betaware", essenceMod: 0.7, costMod: 1.5, availMod: 4 },
  { value: "delta", label: "Deltaware", essenceMod: 0.5, costMod: 2.5, availMod: 8 },
];

// Base costs per limb type
const BASE_COSTS: Record<CyberlimbType, number> = {
  "full-arm": 15000,
  "lower-arm": 10000,
  hand: 5000,
  "full-leg": 18000,
  "lower-leg": 12000,
  foot: 6000,
  torso: 20000,
  skull: 10000,
};

// Availability per limb type
const BASE_AVAILABILITY: Record<CyberlimbType, number> = {
  "full-arm": 4,
  "lower-arm": 4,
  hand: 4,
  "full-leg": 4,
  "lower-leg": 4,
  foot: 4,
  torso: 8,
  skull: 8,
};

// Customization costs (per point above base 3)
const CUSTOMIZATION_COST_PER_POINT = 5000;
const CUSTOMIZATION_AVAIL_PER_POINT = 2;

// =============================================================================
// TYPES
// =============================================================================

export interface CyberlimbInstallSelection {
  limbType: CyberlimbType;
  location: CyberlimbLocation;
  appearance: CyberlimbAppearance;
  grade: CyberwareGrade;
  customStrength: number;
  customAgility: number;
  essenceCost: number;
  cost: number;
  availability: number;
  capacity: number;
}

interface CyberlimbInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInstall: (selection: CyberlimbInstallSelection) => void;
  /** Existing cyberlimbs (for conflict detection) */
  existingCyberlimbs: CyberlimbItem[];
  /** Character's natural attribute maximums */
  naturalMaxStrength?: number;
  naturalMaxAgility?: number;
  /** Available essence */
  availableEssence: number;
  /** Available nuyen */
  availableNuyen: number;
  /** Max availability allowed */
  maxAvailability?: number;
}

// =============================================================================
// HELPERS
// =============================================================================

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatEssence(value: number): string {
  return value.toFixed(2);
}

function getLocationLabel(location: CyberlimbLocation): string {
  const labels: Record<CyberlimbLocation, string> = {
    "left-arm": "Left Arm",
    "right-arm": "Right Arm",
    "left-leg": "Left Leg",
    "right-leg": "Right Leg",
    "left-hand": "Left Hand",
    "right-hand": "Right Hand",
    "left-foot": "Left Foot",
    "right-foot": "Right Foot",
    "left-lower-arm": "Left Lower Arm",
    "right-lower-arm": "Right Lower Arm",
    "left-lower-leg": "Left Lower Leg",
    "right-lower-leg": "Right Lower Leg",
    torso: "Torso",
    skull: "Skull",
  };
  return labels[location];
}

function getGradeColor(grade: CyberwareGrade): string {
  const colors: Record<string, string> = {
    used: "text-stone-500 bg-stone-500/10 border-stone-500/20",
    standard: "text-zinc-400 bg-zinc-500/10 border-zinc-500/20",
    alpha: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    beta: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    delta: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  };
  return colors[grade] || colors.standard;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function CyberlimbInstallModal({
  isOpen,
  onClose,
  onInstall,
  existingCyberlimbs,
  naturalMaxStrength = 6,
  naturalMaxAgility = 6,
  availableEssence,
  availableNuyen,
  maxAvailability = 12,
}: CyberlimbInstallModalProps) {
  // Selection state
  const [limbType, setLimbType] = useState<CyberlimbType>("full-arm");
  const [location, setLocation] = useState<CyberlimbLocation>("left-arm");
  const [appearance, setAppearance] = useState<CyberlimbAppearance>("obvious");
  const [grade, setGrade] = useState<CyberwareGrade>("standard");
  const [customStrength, setCustomStrength] = useState(0);
  const [customAgility, setCustomAgility] = useState(0);

  // Get valid locations for selected limb type
  const validLocations = useMemo(() => {
    return LIMB_TYPE_LOCATIONS[limbType] || [];
  }, [limbType]);

  // Reset location when limb type changes
  const handleLimbTypeChange = useCallback((newType: CyberlimbType) => {
    setLimbType(newType);
    const newValidLocations = LIMB_TYPE_LOCATIONS[newType] || [];
    if (newValidLocations.length > 0 && !newValidLocations.includes(location)) {
      setLocation(newValidLocations[0]);
    }
    // Reset customization when type changes
    setCustomStrength(0);
    setCustomAgility(0);
  }, [location]);

  // Check for conflicts with existing cyberlimbs
  const conflicts = useMemo(() => {
    const result: {
      blocked: boolean;
      blockedBy?: CyberlimbItem;
      replacing: CyberlimbItem[];
    } = { blocked: false, replacing: [] };

    const side = LOCATION_SIDE[location];
    const affectedLocations = getAffectedLocations(location, limbType);

    for (const existing of existingCyberlimbs) {
      const existingSide = LOCATION_SIDE[existing.location];
      if (existingSide !== side) continue;

      // Check if existing limb blocks this installation
      const existingReplacesNew = LIMB_HIERARCHY[existing.limbType]?.includes(limbType);
      if (existingReplacesNew) {
        result.blocked = true;
        result.blockedBy = existing;
        break;
      }

      // Check if this installation would replace existing
      if (affectedLocations.includes(existing.location)) {
        result.replacing.push(existing);
      }

      // Also check same-location replacement
      if (existing.location === location) {
        if (!result.replacing.includes(existing)) {
          result.replacing.push(existing);
        }
      }
    }

    return result;
  }, [location, limbType, existingCyberlimbs]);

  // Calculate costs
  const calculations = useMemo(() => {
    const limbTypeData = LIMB_TYPES.find((t) => t.value === limbType);
    const appearanceData = APPEARANCES.find((a) => a.value === appearance);
    const gradeData = GRADES.find((g) => g.value === grade);

    if (!limbTypeData || !appearanceData || !gradeData) {
      return null;
    }

    // Base values
    const baseEssence = limbTypeData.essence;
    const baseCost = BASE_COSTS[limbType];
    const baseAvail = BASE_AVAILABILITY[limbType];
    const baseCapacity = limbTypeData.capacity;

    // Apply modifiers
    const essenceCost = Math.round(baseEssence * gradeData.essenceMod * 100) / 100;
    const capacity = Math.max(0, baseCapacity + appearanceData.capacityMod);

    // Cost includes: base + appearance modifier + grade modifier + customization
    const customizationCost = (customStrength + customAgility) * CUSTOMIZATION_COST_PER_POINT;
    const cost = Math.round((baseCost * appearanceData.costMod * gradeData.costMod) + customizationCost);

    // Availability includes: base + grade modifier + customization
    const customizationAvail = Math.max(customStrength, customAgility) * CUSTOMIZATION_AVAIL_PER_POINT;
    const availability = baseAvail + gradeData.availMod + customizationAvail;

    return {
      essenceCost,
      cost,
      availability,
      capacity,
    };
  }, [limbType, appearance, grade, customStrength, customAgility]);

  // Validation
  const validation = useMemo(() => {
    if (!calculations) return { valid: false, errors: ["Invalid selection"] };

    const errors: string[] = [];

    if (conflicts.blocked) {
      errors.push(`Cannot install: blocked by existing ${conflicts.blockedBy?.name}`);
    }
    if (calculations.essenceCost > availableEssence) {
      errors.push(`Not enough Essence (need ${formatEssence(calculations.essenceCost)}, have ${formatEssence(availableEssence)})`);
    }
    if (calculations.cost > availableNuyen) {
      errors.push(`Not enough nuyen (need ${formatCurrency(calculations.cost)}¥)`);
    }
    if (calculations.availability > maxAvailability) {
      errors.push(`Exceeds availability limit (${calculations.availability} > ${maxAvailability})`);
    }

    return { valid: errors.length === 0, errors };
  }, [calculations, conflicts, availableEssence, availableNuyen, maxAvailability]);

  // Max customization (natural max - 3)
  const maxCustomization = Math.max(0, Math.min(naturalMaxStrength, naturalMaxAgility) - 3);

  // Handle install
  const handleInstall = useCallback(() => {
    if (!validation.valid || !calculations) return;

    onInstall({
      limbType,
      location,
      appearance,
      grade,
      customStrength,
      customAgility,
      essenceCost: calculations.essenceCost,
      cost: calculations.cost,
      availability: calculations.availability,
      capacity: calculations.capacity,
    });
    onClose();
  }, [validation.valid, calculations, limbType, location, appearance, grade, customStrength, customAgility, onInstall, onClose]);

  // Reset state on close
  const handleClose = useCallback(() => {
    setLimbType("full-arm");
    setLocation("left-arm");
    setAppearance("obvious");
    setGrade("standard");
    setCustomStrength(0);
    setCustomAgility(0);
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex flex-col w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-xl bg-zinc-900 shadow-2xl border border-zinc-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10">
              <Cpu className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-zinc-100">Install Cyberlimb</h2>
              <p className="text-xs text-zinc-500">Configure and install a new cybernetic limb</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Limb Type Selection */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Limb Type</label>
            <div className="grid grid-cols-4 gap-2">
              {LIMB_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => handleLimbTypeChange(type.value)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors border ${
                    limbType === type.value
                      ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/50"
                      : "bg-zinc-800/50 text-zinc-400 border-zinc-700 hover:border-zinc-600"
                  }`}
                >
                  <div>{type.label}</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">
                    [{type.capacity}] / {type.essence} ESS
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Location Selection */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Location</label>
            <div className="flex flex-wrap gap-2">
              {validLocations.map((loc) => {
                const isOccupied = existingCyberlimbs.some((l) => l.location === loc);
                return (
                  <button
                    key={loc}
                    onClick={() => setLocation(loc)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                      location === loc
                        ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/50"
                        : isOccupied
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                          : "bg-zinc-800/50 text-zinc-400 border-zinc-700 hover:border-zinc-600"
                    }`}
                  >
                    {getLocationLabel(loc)}
                    {isOccupied && " (occupied)"}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Appearance & Grade Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Appearance */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Appearance</label>
              <div className="flex gap-2">
                {APPEARANCES.map((app) => (
                  <button
                    key={app.value}
                    onClick={() => setAppearance(app.value)}
                    className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors border ${
                      appearance === app.value
                        ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/50"
                        : "bg-zinc-800/50 text-zinc-400 border-zinc-700 hover:border-zinc-600"
                    }`}
                  >
                    <div>{app.label}</div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">
                      {app.capacityMod !== 0 && `${app.capacityMod} cap`}
                      {app.costMod !== 1 && ` / ${app.costMod}x cost`}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Grade */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Grade</label>
              <div className="grid grid-cols-2 gap-2">
                {GRADES.map((g) => (
                  <button
                    key={g.value}
                    onClick={() => setGrade(g.value)}
                    className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                      grade === g.value
                        ? getGradeColor(g.value)
                        : "bg-zinc-800/50 text-zinc-400 border-zinc-700 hover:border-zinc-600"
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Attribute Customization */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Attribute Customization
              <span className="text-[10px] text-zinc-500 ml-2">
                (Base 3, max {3 + maxCustomization})
              </span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              {/* Strength */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800/50 border border-zinc-700">
                <Target className="w-4 h-4 text-orange-400" />
                <span className="text-xs text-zinc-400">STR</span>
                <div className="flex items-center gap-2 ml-auto">
                  <button
                    onClick={() => setCustomStrength(Math.max(0, customStrength - 1))}
                    disabled={customStrength <= 0}
                    className={`p-1 rounded ${
                      customStrength > 0
                        ? "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
                        : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                    }`}
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center font-mono text-orange-400">
                    {3 + customStrength}
                  </span>
                  <button
                    onClick={() => setCustomStrength(Math.min(maxCustomization, customStrength + 1))}
                    disabled={customStrength >= maxCustomization}
                    className={`p-1 rounded ${
                      customStrength < maxCustomization
                        ? "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30"
                        : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                    }`}
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Agility */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800/50 border border-zinc-700">
                <Zap className="w-4 h-4 text-green-400" />
                <span className="text-xs text-zinc-400">AGI</span>
                <div className="flex items-center gap-2 ml-auto">
                  <button
                    onClick={() => setCustomAgility(Math.max(0, customAgility - 1))}
                    disabled={customAgility <= 0}
                    className={`p-1 rounded ${
                      customAgility > 0
                        ? "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
                        : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                    }`}
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center font-mono text-green-400">
                    {3 + customAgility}
                  </span>
                  <button
                    onClick={() => setCustomAgility(Math.min(maxCustomization, customAgility + 1))}
                    disabled={customAgility >= maxCustomization}
                    className={`p-1 rounded ${
                      customAgility < maxCustomization
                        ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                        : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                    }`}
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
            {(customStrength > 0 || customAgility > 0) && (
              <p className="text-[10px] text-zinc-500 mt-2">
                Customization: +{formatCurrency((customStrength + customAgility) * CUSTOMIZATION_COST_PER_POINT)}¥,
                +{Math.max(customStrength, customAgility) * CUSTOMIZATION_AVAIL_PER_POINT} Avail
              </p>
            )}
          </div>

          {/* Warnings */}
          {conflicts.replacing.length > 0 && !conflicts.blocked && (
            <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-400">Will Replace Existing Limbs</p>
                <ul className="mt-1 text-xs text-amber-300/80">
                  {conflicts.replacing.map((limb) => (
                    <li key={limb.id || limb.catalogId}>
                      • {limb.name} ({getLocationLabel(limb.location)})
                    </li>
                  ))}
                </ul>
                <p className="mt-1 text-[10px] text-zinc-500">
                  Essence from replaced limbs will be freed up.
                </p>
              </div>
            </div>
          )}

          {/* Validation Errors */}
          {!validation.valid && (
            <div className="space-y-1">
              {validation.errors.map((error, idx) => (
                <div key={idx} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30">
                  <X className="w-4 h-4 text-red-400" />
                  <span className="text-xs text-red-400">{error}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with summary and actions */}
        <div className="border-t border-zinc-800 bg-zinc-900/80 px-6 py-4">
          {/* Summary */}
          {calculations && (
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-zinc-800">
              <div className="grid grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase">Essence</div>
                  <div className={`text-lg font-bold font-mono ${
                    calculations.essenceCost > availableEssence ? "text-red-400" : "text-red-400"
                  }`}>
                    {formatEssence(calculations.essenceCost)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase">Cost</div>
                  <div className={`text-lg font-bold font-mono ${
                    calculations.cost > availableNuyen ? "text-red-400" : "text-zinc-200"
                  }`}>
                    {formatCurrency(calculations.cost)}¥
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase">Availability</div>
                  <div className={`text-lg font-bold font-mono ${
                    calculations.availability > maxAvailability ? "text-red-400" : "text-zinc-200"
                  }`}>
                    {calculations.availability}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase">Capacity</div>
                  <div className="text-lg font-bold font-mono text-cyan-400">
                    [{calculations.capacity}]
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium
                bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleInstall}
              disabled={!validation.valid}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                validation.valid
                  ? "bg-cyan-500 text-white hover:bg-cyan-600"
                  : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
              }`}
            >
              <Cpu className="w-4 h-4" />
              Install Cyberlimb
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
