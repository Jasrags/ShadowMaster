"use client";

/**
 * AugmentationsPanel - Character sheet panel for augmentations
 *
 * Displays:
 * - Installed cyberware list with grades
 * - Installed bioware list with grades
 * - Cyberlimb detail view with capacity/enhancements
 * - Global wireless bonus toggle
 * - Essence summary with magic impact
 */

import { useState, useMemo, useCallback } from "react";
import type { Character, CyberwareItem, BiowareItem, CyberwareGrade, BiowareGrade } from "@/lib/types";
import { Theme, THEMES, DEFAULT_THEME } from "@/lib/themes";
import { Section } from "./Section";
import { AugmentationCard } from "@/components/AugmentationCard";
import { EssenceDisplay } from "@/components/EssenceDisplay";
import { Cpu, Heart, Wifi, WifiOff, Plus, Settings } from "lucide-react";
import {
  useRemoveAugmentation,
  useUpgradeAugmentation,
} from "@/lib/rules/augmentations/hooks";

// =============================================================================
// TYPES
// =============================================================================

interface AugmentationsPanelProps {
  character: Character;
  theme?: Theme;
  /** Callback when character is updated */
  onUpdate?: (updatedCharacter: Character) => void;
  /** Whether to show action buttons (for active characters) */
  showActions?: boolean;
}

// =============================================================================
// HELPERS
// =============================================================================

function formatEssence(value: number): string {
  return value.toFixed(2);
}

function calculateMagicLoss(essenceLoss: number): number {
  return Math.ceil(essenceLoss);
}

// =============================================================================
// COMPONENT
// =============================================================================

export function AugmentationsPanel({
  character,
  theme,
  onUpdate,
  showActions = false,
}: AugmentationsPanelProps) {
  const t = theme || THEMES[DEFAULT_THEME];
  const [activeTab, setActiveTab] = useState<"cyberware" | "bioware">("cyberware");
  const [wirelessEnabled, setWirelessEnabled] = useState(
    character.wirelessBonusesEnabled ?? true
  );

  // Mutations
  const { remove: removeAugmentation, loading: removeLoading } = useRemoveAugmentation(character.id || null);
  const { upgrade: upgradeAugmentation, loading: upgradeLoading } = useUpgradeAugmentation(character.id || null);

  // Get augmentation data
  const cyberware = useMemo(() => character.cyberware || [], [character.cyberware]);
  const bioware = useMemo(() => character.bioware || [], [character.bioware]);

  // Calculate essence values
  const maxEssence = 6;
  const cyberwareEssence = cyberware.reduce((sum, item) => sum + item.essenceCost, 0);
  const biowareEssence = bioware.reduce((sum, item) => sum + item.essenceCost, 0);
  const totalEssenceLoss = Math.round((cyberwareEssence + biowareEssence) * 100) / 100;
  const currentEssence = Math.round((maxEssence - totalEssenceLoss) * 100) / 100;

  // Check for awakened/technomancer
  const magicalPath = character.magicalPath;
  const isAwakened = magicalPath && magicalPath !== "mundane" && magicalPath !== "technomancer";
  const isTechnomancer = magicalPath === "technomancer";
  const magicRating = character.specialAttributes?.magic;
  const resonanceRating = character.specialAttributes?.resonance;

  // Calculate magic/resonance loss
  const essenceHole = character.essenceHole?.essenceHole;
  const magicLoss = isAwakened ? calculateMagicLoss(essenceHole ?? totalEssenceLoss) : 0;
  const resonanceLoss = isTechnomancer ? calculateMagicLoss(essenceHole ?? totalEssenceLoss) : 0;

  // Calculate attribute bonuses
  const attributeBonuses = useMemo(() => {
    const bonuses: Record<string, number> = {};
    for (const item of cyberware) {
      if (item.attributeBonuses) {
        for (const [attr, bonus] of Object.entries(item.attributeBonuses)) {
          bonuses[attr] = (bonuses[attr] || 0) + bonus;
        }
      }
    }
    for (const item of bioware) {
      if (item.attributeBonuses) {
        for (const [attr, bonus] of Object.entries(item.attributeBonuses)) {
          bonuses[attr] = (bonuses[attr] || 0) + bonus;
        }
      }
    }
    return bonuses;
  }, [cyberware, bioware]);

  // Calculate initiative dice bonus
  const initiativeDiceBonus = useMemo(() => {
    return cyberware.reduce((sum, item) => sum + (item.initiativeDiceBonus || 0), 0);
  }, [cyberware]);

  // Handle wireless toggle
  const handleWirelessToggle = useCallback(async () => {
    const newValue = !wirelessEnabled;
    setWirelessEnabled(newValue);

    // Update character
    if (onUpdate) {
      onUpdate({
        ...character,
        wirelessBonusesEnabled: newValue,
      });
    }
  }, [wirelessEnabled, character, onUpdate]);

  // Handle remove
  const handleRemove = useCallback(
    async (itemId: string) => {
      const result = await removeAugmentation(itemId);
      if (result.success && onUpdate) {
        // Refresh character data would happen via parent
        // For now, optimistically update
        const updatedCyberware = cyberware.filter((item) => item.id !== itemId);
        const updatedBioware = bioware.filter((item) => item.id !== itemId);
        onUpdate({
          ...character,
          cyberware: updatedCyberware,
          bioware: updatedBioware,
        });
      }
    },
    [removeAugmentation, cyberware, bioware, character, onUpdate]
  );

  // Handle upgrade
  const handleUpgrade = useCallback(
    async (itemId: string, newGrade: CyberwareGrade | BiowareGrade) => {
      const result = await upgradeAugmentation(itemId, newGrade);
      if (result.success && result.augmentation && onUpdate) {
        // Update the specific item
        const isInCyberware = cyberware.some((item) => item.id === itemId);
        if (isInCyberware) {
          const updatedCyberware = cyberware.map((item) =>
            item.id === itemId ? (result.augmentation as CyberwareItem) : item
          );
          onUpdate({
            ...character,
            cyberware: updatedCyberware,
          });
        } else {
          const updatedBioware = bioware.map((item) =>
            item.id === itemId ? (result.augmentation as BiowareItem) : item
          );
          onUpdate({
            ...character,
            bioware: updatedBioware,
          });
        }
      }
    },
    [upgradeAugmentation, cyberware, bioware, character, onUpdate]
  );

  const hasAugmentations = cyberware.length > 0 || bioware.length > 0;
  const isActive = character.status === "active";

  if (!hasAugmentations) {
    return (
      <Section
        theme={t}
        title="Augmentations"
        icon={<Cpu className="w-4 h-4 text-cyan-500" />}
      >
        <div className="p-4 rounded border border-zinc-800 bg-zinc-900/30 text-center">
          <p className="text-sm text-zinc-500">No augmentations installed.</p>
          <p className="text-xs text-zinc-600 mt-1">
            Essence: {formatEssence(currentEssence)} / {maxEssence}
          </p>
        </div>
      </Section>
    );
  }

  return (
    <Section
      theme={t}
      title="Augmentations"
      icon={<Cpu className="w-4 h-4 text-cyan-500" />}
    >
      <div className="space-y-4">
        {/* Essence Summary */}
        <div className="p-3 rounded-lg border border-zinc-800 bg-zinc-900/50">
          <EssenceDisplay
            currentEssence={currentEssence}
            maxEssence={maxEssence}
            essenceLoss={totalEssenceLoss}
            essenceHole={essenceHole}
            magicRating={magicRating}
            magicLoss={magicLoss}
            resonanceRating={resonanceRating}
            resonanceLoss={resonanceLoss}
            compact
          />

          {/* Attribute Bonuses Summary */}
          {(Object.keys(attributeBonuses).length > 0 || initiativeDiceBonus > 0) && (
            <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-zinc-800">
              {Object.entries(attributeBonuses).map(([attr, bonus]) => (
                <span
                  key={attr}
                  className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono"
                >
                  {attr.toUpperCase()} +{bonus}
                </span>
              ))}
              {initiativeDiceBonus > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono">
                  INIT +{initiativeDiceBonus}D6
                </span>
              )}
            </div>
          )}

          {/* Wireless Toggle */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-800">
            <div className="flex items-center gap-2 text-xs">
              {wirelessEnabled ? (
                <Wifi className="w-4 h-4 text-cyan-400" />
              ) : (
                <WifiOff className="w-4 h-4 text-zinc-500" />
              )}
              <span className={wirelessEnabled ? "text-cyan-400" : "text-zinc-500"}>
                Wireless Bonuses
              </span>
            </div>
            <button
              onClick={handleWirelessToggle}
              className={`relative w-10 h-5 rounded-full transition-colors ${
                wirelessEnabled ? "bg-cyan-500" : "bg-zinc-700"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                  wirelessEnabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Type Tabs */}
        <div className="flex gap-2 border-b border-zinc-800">
          <button
            onClick={() => setActiveTab("cyberware")}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm transition-colors border-b-2 -mb-px ${
              activeTab === "cyberware"
                ? "border-cyan-500 text-cyan-400"
                : "border-transparent text-zinc-500 hover:text-zinc-400"
            }`}
          >
            <Cpu className="w-4 h-4" />
            Cyberware
            <span className="text-xs text-zinc-600">({cyberware.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("bioware")}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm transition-colors border-b-2 -mb-px ${
              activeTab === "bioware"
                ? "border-emerald-500 text-emerald-400"
                : "border-transparent text-zinc-500 hover:text-zinc-400"
            }`}
          >
            <Heart className="w-4 h-4" />
            Bioware
            <span className="text-xs text-zinc-600">({bioware.length})</span>
          </button>
        </div>

        {/* Augmentation Lists */}
        <div className="space-y-3">
          {activeTab === "cyberware" ? (
            cyberware.length === 0 ? (
              <p className="text-sm text-zinc-500 text-center py-4">No cyberware installed</p>
            ) : (
              cyberware.map((item) => (
                <AugmentationCard
                  key={item.id || item.catalogId}
                  item={item}
                  type="cyberware"
                  showActions={showActions}
                  isActive={isActive}
                  onRemove={
                    showActions && isActive && item.id
                      ? () => handleRemove(item.id!)
                      : undefined
                  }
                  onUpgrade={
                    showActions && isActive && item.id
                      ? (grade) => handleUpgrade(item.id!, grade)
                      : undefined
                  }
                />
              ))
            )
          ) : bioware.length === 0 ? (
            <p className="text-sm text-zinc-500 text-center py-4">No bioware installed</p>
          ) : (
            bioware.map((item) => (
              <AugmentationCard
                key={item.id || item.catalogId}
                item={item}
                type="bioware"
                showActions={showActions}
                isActive={isActive}
                onRemove={
                  showActions && isActive && item.id
                    ? () => handleRemove(item.id!)
                    : undefined
                }
                onUpgrade={
                  showActions && isActive && item.id
                    ? (grade) => handleUpgrade(item.id!, grade)
                    : undefined
                }
              />
            ))
          )}
        </div>

        {/* Summary Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-zinc-800 text-xs text-zinc-500">
          <div className="flex items-center gap-4">
            <span>
              <span className="text-cyan-400">{cyberware.length}</span> cyberware
            </span>
            <span>
              <span className="text-emerald-400">{bioware.length}</span> bioware
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-red-400">{formatEssence(totalEssenceLoss)}</span>
            <span>essence lost</span>
          </div>
        </div>
      </div>
    </Section>
  );
}
