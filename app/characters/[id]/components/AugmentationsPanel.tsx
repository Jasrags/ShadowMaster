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
import type { CyberlimbItem } from "@/lib/types/cyberlimb";
import { Theme, THEMES, DEFAULT_THEME } from "@/lib/themes";
import { Section } from "./Section";
import { AugmentationCard } from "@/components/AugmentationCard";
import { EssenceDisplay } from "@/components/EssenceDisplay";
import {
  CyberlimbList,
  CyberlimbInstallModal,
  CyberlimbEnhancementModal,
  CyberlimbAccessoryModal,
  CyberlimbDetailPanel,
} from "@/components/cyberlimbs";
import type { CyberlimbInstallSelection } from "@/components/cyberlimbs";
import { Cpu, Heart, Wifi, WifiOff, Plus, Settings, CircuitBoard } from "lucide-react";
import {
  useRemoveAugmentation,
  useUpgradeAugmentation,
} from "@/lib/rules/augmentations/hooks";
import {
  useInstallCyberlimb,
  useRemoveCyberlimb,
  useToggleCyberlimbWireless,
  useAddCyberlimbEnhancement,
  useRemoveCyberlimbEnhancement,
  useAddCyberlimbAccessory,
  useRemoveCyberlimbAccessory,
} from "@/lib/rules/augmentations/cyberlimb-hooks";

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
  const [activeTab, setActiveTab] = useState<"cyberware" | "bioware" | "cyberlimbs">("cyberware");
  const [wirelessEnabled, setWirelessEnabled] = useState(
    character.wirelessBonusesEnabled ?? true
  );

  // Modal state
  const [installModalOpen, setInstallModalOpen] = useState(false);
  const [selectedLimbId, setSelectedLimbId] = useState<string | null>(null);
  const [enhancementModalOpen, setEnhancementModalOpen] = useState(false);
  const [accessoryModalOpen, setAccessoryModalOpen] = useState(false);
  const [detailPanelOpen, setDetailPanelOpen] = useState(false);

  // Mutations - Augmentations
  const { remove: removeAugmentation, loading: removeLoading } = useRemoveAugmentation(character.id || null);
  const { upgrade: upgradeAugmentation, loading: upgradeLoading } = useUpgradeAugmentation(character.id || null);

  // Mutations - Cyberlimbs
  const { install: installCyberlimb, loading: installLoading } = useInstallCyberlimb(character.id || null);
  const { remove: removeCyberlimb, loading: removeLimbLoading } = useRemoveCyberlimb(character.id || null);
  const { toggle: toggleWireless, loading: wirelessLoading } = useToggleCyberlimbWireless(character.id || null);
  const { add: addEnhancement, loading: enhancementLoading } = useAddCyberlimbEnhancement(character.id || null);
  const { remove: removeEnhancement, loading: removeEnhancementLoading } = useRemoveCyberlimbEnhancement(character.id || null);
  const { add: addAccessory, loading: accessoryLoading } = useAddCyberlimbAccessory(character.id || null);
  const { remove: removeAccessory, loading: removeAccessoryLoading } = useRemoveCyberlimbAccessory(character.id || null);

  // Get augmentation data
  const cyberware = useMemo(() => character.cyberware || [], [character.cyberware]);
  const bioware = useMemo(() => character.bioware || [], [character.bioware]);
  const cyberlimbs = useMemo(() => (character.cyberlimbs || []) as CyberlimbItem[], [character.cyberlimbs]);

  // Calculate essence values
  const maxEssence = 6;
  const cyberwareEssence = cyberware.reduce((sum, item) => sum + item.essenceCost, 0);
  const biowareEssence = bioware.reduce((sum, item) => sum + item.essenceCost, 0);
  const cyberlimbEssence = cyberlimbs.reduce((sum, limb) => sum + limb.essenceCost, 0);
  const totalEssenceLoss = Math.round((cyberwareEssence + biowareEssence + cyberlimbEssence) * 100) / 100;
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

  // Get selected limb for modals
  const selectedLimb = useMemo(() => {
    if (!selectedLimbId) return null;
    return cyberlimbs.find((l) => l.id === selectedLimbId) || null;
  }, [selectedLimbId, cyberlimbs]);

  // Cyberlimb handlers
  const handleAddCyberlimb = useCallback(() => {
    setInstallModalOpen(true);
  }, []);

  const handleInstallCyberlimb = useCallback(
    async (selection: CyberlimbInstallSelection) => {
      // Generate catalog ID from limb type and appearance
      // Format: cyberlimb-{type}-{appearance} e.g., "cyberlimb-full-arm-obvious"
      const catalogId = `cyberlimb-${selection.limbType}-${selection.appearance}`;

      const result = await installCyberlimb({
        catalogId,
        location: selection.location,
        grade: selection.grade,
        customization: {
          strengthCustomization: selection.customStrength,
          agilityCustomization: selection.customAgility,
        },
        confirmReplacement: true,
      });
      if (result.success && onUpdate) {
        // Optimistically update - refetch would be better in production
        const newLimb = {
          ...result.installedLimb,
          enhancements: [],
          accessories: [],
          weapons: [],
          modificationHistory: [],
        } as unknown as CyberlimbItem;
        onUpdate({
          ...character,
          cyberlimbs: [...cyberlimbs, newLimb],
        });
      }
      setInstallModalOpen(false);
    },
    [installCyberlimb, character, cyberlimbs, onUpdate]
  );

  const handleToggleCyberlimbWireless = useCallback(
    async (limbId: string, enabled: boolean) => {
      const result = await toggleWireless(limbId, enabled);
      if (result.success && onUpdate) {
        const updatedLimbs = cyberlimbs.map((limb) =>
          limb.id === limbId ? { ...limb, wirelessEnabled: enabled } : limb
        );
        onUpdate({
          ...character,
          cyberlimbs: updatedLimbs,
        });
      }
    },
    [toggleWireless, character, cyberlimbs, onUpdate]
  );

  const handleRemoveCyberlimb = useCallback(
    async (limbId: string) => {
      const result = await removeCyberlimb(limbId);
      if (result.success && onUpdate) {
        const updatedLimbs = cyberlimbs.filter((limb) => limb.id !== limbId);
        onUpdate({
          ...character,
          cyberlimbs: updatedLimbs,
        });
      }
    },
    [removeCyberlimb, character, cyberlimbs, onUpdate]
  );

  const handleOpenEnhancementModal = useCallback((limbId: string) => {
    setSelectedLimbId(limbId);
    setEnhancementModalOpen(true);
  }, []);

  const handleAddEnhancement = useCallback(
    async (selection: { enhancementType: string; rating: number; capacityCost: number; cost: number }) => {
      if (!selectedLimbId) return;
      // Map enhancement type to catalog ID (simplified - would need proper catalog lookup)
      const catalogIdMap: Record<string, string> = {
        strength: "cyberlimb-enhanced-strength",
        agility: "cyberlimb-enhanced-agility",
        armor: "cyberlimb-armor",
      };
      const catalogId = catalogIdMap[selection.enhancementType] || selection.enhancementType;

      const result = await addEnhancement(selectedLimbId, {
        catalogId,
        rating: selection.rating,
      });
      if (result.success && result.enhancement && onUpdate) {
        const updatedLimbs = cyberlimbs.map((limb) => {
          if (limb.id !== selectedLimbId) return limb;
          return {
            ...limb,
            enhancements: [
              ...limb.enhancements,
              {
                id: result.enhancement!.id,
                catalogId: result.enhancement!.catalogId,
                name: result.enhancement!.name,
                enhancementType: result.enhancement!.enhancementType as "strength" | "agility" | "armor",
                rating: result.enhancement!.rating,
                capacityUsed: result.enhancement!.capacityUsed,
                cost: result.enhancement!.cost,
                availability: 0,
              },
            ],
            capacityUsed: limb.capacityUsed + result.enhancement!.capacityUsed,
          };
        });
        onUpdate({
          ...character,
          cyberlimbs: updatedLimbs,
        });
      }
      setEnhancementModalOpen(false);
      setSelectedLimbId(null);
    },
    [selectedLimbId, addEnhancement, character, cyberlimbs, onUpdate]
  );

  const handleOpenAccessoryModal = useCallback((limbId: string) => {
    setSelectedLimbId(limbId);
    setAccessoryModalOpen(true);
  }, []);

  const handleAddAccessory = useCallback(
    async (selection: { catalogId: string; name: string; rating?: number; capacityCost: number; cost: number }) => {
      if (!selectedLimbId) return;

      const result = await addAccessory(selectedLimbId, {
        catalogId: selection.catalogId,
        rating: selection.rating,
      });
      if (result.success && result.accessory && onUpdate) {
        const updatedLimbs = cyberlimbs.map((limb) => {
          if (limb.id !== selectedLimbId) return limb;
          return {
            ...limb,
            accessories: [
              ...limb.accessories,
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
            capacityUsed: limb.capacityUsed + result.accessory!.capacityUsed,
          };
        });
        onUpdate({
          ...character,
          cyberlimbs: updatedLimbs,
        });
      }
      setAccessoryModalOpen(false);
      setSelectedLimbId(null);
    },
    [selectedLimbId, addAccessory, character, cyberlimbs, onUpdate]
  );

  const handleViewDetails = useCallback((limbId: string) => {
    setSelectedLimbId(limbId);
    setDetailPanelOpen(true);
  }, []);

  const handleCloseModals = useCallback(() => {
    setInstallModalOpen(false);
    setEnhancementModalOpen(false);
    setAccessoryModalOpen(false);
    setDetailPanelOpen(false);
    setSelectedLimbId(null);
  }, []);

  const hasAugmentations = cyberware.length > 0 || bioware.length > 0 || cyberlimbs.length > 0;
  const isActive = character.status === "active";

  if (!hasAugmentations) {
    return (
      <Section
        theme={t}
        title="Augmentations"
        icon={<Cpu className="w-4 h-4 text-cyan-500" />}
      >
        <div className={`p-4 rounded border text-center ${t.colors.card} ${t.colors.border}`}>
          <p className="text-sm text-muted-foreground">No augmentations installed.</p>
          <p className="text-xs text-muted-foreground/70 mt-1">
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
        <div className={`p-3 rounded-lg border ${t.colors.card} ${t.colors.border}`}>
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
            <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-border">
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
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
            <div className="flex items-center gap-2 text-xs">
              {wirelessEnabled ? (
                <Wifi className="w-4 h-4 text-cyan-400" />
              ) : (
                <WifiOff className="w-4 h-4 text-muted-foreground" />
              )}
              <span className={wirelessEnabled ? "text-cyan-400" : "text-muted-foreground"}>
                Wireless Bonuses
              </span>
            </div>
            <button
              onClick={handleWirelessToggle}
              className={`relative w-10 h-5 rounded-full transition-colors ${
                wirelessEnabled ? "bg-cyan-500" : "bg-muted"
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
        <div className="flex gap-2 border-b border-border">
          <button
            onClick={() => setActiveTab("cyberware")}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm transition-colors border-b-2 -mb-px ${
              activeTab === "cyberware"
                ? "border-cyan-500 text-cyan-400"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Cpu className="w-4 h-4" />
            Cyberware
            <span className="text-xs text-muted-foreground/70">({cyberware.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("bioware")}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm transition-colors border-b-2 -mb-px ${
              activeTab === "bioware"
                ? "border-emerald-500 text-emerald-400"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Heart className="w-4 h-4" />
            Bioware
            <span className="text-xs text-muted-foreground/70">({bioware.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("cyberlimbs")}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm transition-colors border-b-2 -mb-px ${
              activeTab === "cyberlimbs"
                ? "border-orange-500 text-orange-400"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <CircuitBoard className="w-4 h-4" />
            Cyberlimbs
            <span className="text-xs text-muted-foreground/70">({cyberlimbs.length})</span>
          </button>
        </div>

        {/* Augmentation Lists */}
        <div className="space-y-3">
          {activeTab === "cyberware" ? (
            cyberware.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No cyberware installed</p>
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
          ) : activeTab === "bioware" ? (
            bioware.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No bioware installed</p>
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
            )
          ) : (
            /* Cyberlimbs Tab */
            <CyberlimbList
              cyberlimbs={cyberlimbs}
              showActions={showActions}
              isActive={isActive}
              onAddCyberlimb={showActions && isActive ? handleAddCyberlimb : undefined}
              onToggleWireless={showActions && isActive ? handleToggleCyberlimbWireless : undefined}
              onRemoveLimb={showActions && isActive ? handleRemoveCyberlimb : undefined}
              onAddEnhancement={showActions && isActive ? handleOpenEnhancementModal : undefined}
              onAddAccessory={showActions && isActive ? handleOpenAccessoryModal : undefined}
              onViewDetails={handleViewDetails}
            />
          )}
        </div>

        {/* Summary Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>
              <span className="text-cyan-400">{cyberware.length}</span> cyberware
            </span>
            <span>
              <span className="text-emerald-400">{bioware.length}</span> bioware
            </span>
            <span>
              <span className="text-orange-400">{cyberlimbs.length}</span> cyberlimbs
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-red-400">{formatEssence(totalEssenceLoss)}</span>
            <span>essence lost</span>
          </div>
        </div>

        {/* Cyberlimb Modals */}
        <CyberlimbInstallModal
          isOpen={installModalOpen}
          onClose={handleCloseModals}
          onInstall={handleInstallCyberlimb}
          existingCyberlimbs={cyberlimbs}
          naturalMaxStrength={character.attributes?.strength ?? 6}
          naturalMaxAgility={character.attributes?.agility ?? 6}
          availableEssence={currentEssence}
          availableNuyen={character.nuyen ?? 0}
          maxAvailability={character.status === "draft" ? 12 : undefined}
        />

        {selectedLimb && (
          <>
            <CyberlimbEnhancementModal
              isOpen={enhancementModalOpen}
              onClose={handleCloseModals}
              onAdd={handleAddEnhancement}
              limb={selectedLimb}
              naturalMaxStrength={character.attributes?.strength ?? 6}
              naturalMaxAgility={character.attributes?.agility ?? 6}
              availableNuyen={character.nuyen ?? 0}
              maxAvailability={character.status === "draft" ? 12 : undefined}
            />

            <CyberlimbAccessoryModal
              isOpen={accessoryModalOpen}
              onClose={handleCloseModals}
              onAdd={handleAddAccessory}
              limb={selectedLimb}
              availableNuyen={character.nuyen ?? 0}
              maxAvailability={character.status === "draft" ? 12 : undefined}
            />
          </>
        )}
      </div>
    </Section>
  );
}
