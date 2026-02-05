"use client";

/**
 * AugmentationsCard
 *
 * Compact card for augmentation selection in sheet-driven creation.
 * Uses unified category-grouped pattern with single Add button.
 *
 * Features:
 * - Single Add button opens unified modal with Cyberware/Bioware toggle
 * - Installed items grouped by subcategory (Cyberlimbs, Headware, etc.)
 * - Essence bar with magic/resonance loss warnings
 * - Items with capacity show capacity usage and enhancement button
 * - Category tabs in modal show item counts
 */

import { useMemo, useCallback, useState } from "react";
import { useAugmentationRules, calculateMagicLoss } from "@/lib/rules/RulesetContext";
import type { CreationState, CyberwareItem, BiowareItem } from "@/lib/types";
import { useCreationBudgets } from "@/lib/contexts";
import {
  CreationCard,
  SummaryFooter,
  KarmaConversionModal,
  useKarmaConversionPrompt,
  LegalityWarnings,
  type LegalityWarningItem,
} from "./shared";
import {
  AugmentationModal,
  AugmentationItem,
  CyberlimbAugmentationItem,
  CyberwareEnhancementModal,
  CyberlimbAccessoryModal,
  CyberlimbWeaponModal,
  formatCurrency,
  formatEssence,
  DISPLAY_CATEGORIES,
  type AugmentationSelection,
  type CyberwareEnhancementSelection,
  type CyberlimbAccessorySelection,
  type CyberlimbWeaponSelection,
  type InstalledCyberlimb,
  type InstalledSkillLinkedBioware,
} from "./augmentations";
import { applyGradeToAvailability } from "@/lib/rules/augmentations/grades";
import {
  type CyberlimbLocation,
  type CyberlimbType,
  type CyberlimbItem,
  LOCATION_SIDE,
  wouldReplaceExisting,
  isCyberlimb,
} from "@/lib/types/cyberlimb";
import { Lock, AlertTriangle, Cpu, Heart, Plus } from "lucide-react";
import { InfoTooltip } from "@/components/ui";

// =============================================================================
// TYPES
// =============================================================================

interface AugmentationsCardProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function AugmentationsCard({ state, updateState }: AugmentationsCardProps) {
  const augmentationRules = useAugmentationRules();
  const { getBudget } = useCreationBudgets();
  const nuyenBudget = getBudget("nuyen");
  const karmaBudget = getBudget("karma");

  // Single unified modal for adding augmentations (cyberware or bioware)
  const [isAugModalOpen, setIsAugModalOpen] = useState(false);
  const [enhancementModalCyberware, setEnhancementModalCyberware] = useState<CyberwareItem | null>(
    null
  );
  const [accessoryModalCyberlimb, setAccessoryModalCyberlimb] = useState<CyberlimbItem | null>(
    null
  );
  const [weaponModalCyberlimb, setWeaponModalCyberlimb] = useState<CyberlimbItem | null>(null);

  // Get selections from state
  const selectedCyberware = useMemo(
    () => (state.selections?.cyberware || []) as CyberwareItem[],
    [state.selections?.cyberware]
  );
  const selectedBioware = useMemo(
    () => (state.selections?.bioware || []) as BiowareItem[],
    [state.selections?.bioware]
  );

  // Extract installed cyberlimbs for conflict checking
  const installedCyberlimbs = useMemo((): InstalledCyberlimb[] => {
    return selectedCyberware
      .filter((item) => item.category === "cyberlimb" && "location" in item && "limbType" in item)
      .map((item) => ({
        id: item.id || item.catalogId,
        name: item.name,
        location: (item as CyberwareItem & { location: CyberlimbLocation }).location,
        limbType: (item as CyberwareItem & { limbType: CyberlimbType }).limbType,
      }));
  }, [selectedCyberware]);

  // Get installed skill-linked bioware for duplicate checking
  const installedSkillLinkedBioware = useMemo((): InstalledSkillLinkedBioware[] => {
    return selectedBioware
      .filter((item) => "targetSkill" in item && item.targetSkill)
      .map((item) => ({
        catalogId: item.catalogId,
        targetSkill: item.targetSkill!,
      }));
  }, [selectedBioware]);

  // Check if character is magical or technomancer
  const magicPath = (state.selections?.["magical-path"] as string) || "mundane";
  const isAwakened = ["magician", "mystic-adept", "aspected-mage", "adept"].includes(magicPath);
  const isTechnomancer = magicPath === "technomancer";

  // Get special attribute values
  const specialAttributes = (state.selections?.specialAttributes || {}) as Record<string, number>;
  const magicRating = specialAttributes.magic || 0;
  const resonanceRating = specialAttributes.resonance || 0;

  // Calculate nuyen budget
  const baseNuyen = nuyenBudget?.total || 0;
  const karmaConversion = (state.budgets?.["karma-spent-gear"] as number) || 0;
  const convertedNuyen = karmaConversion * 2000;
  const totalNuyen = baseNuyen + convertedNuyen;

  // Local category costs (for card-specific footer display)
  const cyberwareSpent = selectedCyberware.reduce((sum, item) => sum + item.cost, 0);
  const biowareSpent = selectedBioware.reduce((sum, item) => sum + item.cost, 0);

  // Use centralized nuyen spent from budget context for global budget tracker
  const totalSpent = nuyenBudget?.spent || 0;
  const remainingNuyen = totalNuyen - totalSpent;

  // Karma conversion hook for purchase prompts
  const karmaRemaining = karmaBudget?.remaining ?? 0;

  const handleKarmaConvert = useCallback(
    (newTotalConversion: number) => {
      updateState({
        budgets: {
          ...state.budgets,
          "karma-spent-gear": newTotalConversion,
        },
      });
    },
    [state.budgets, updateState]
  );

  const karmaConversionPrompt = useKarmaConversionPrompt({
    remaining: remainingNuyen,
    karmaRemaining,
    currentConversion: karmaConversion,
    onConvert: handleKarmaConvert,
  });

  // Calculate essence
  const maxEssence = augmentationRules.maxEssence;
  const cyberwareEssence = selectedCyberware.reduce((sum, item) => sum + item.essenceCost, 0);
  const biowareEssence = selectedBioware.reduce((sum, item) => sum + item.essenceCost, 0);
  const totalEssenceLoss = Math.round((cyberwareEssence + biowareEssence) * 100) / 100;
  const remainingEssence = Math.round((maxEssence - totalEssenceLoss) * 100) / 100;

  // Calculate magic/resonance loss
  const magicLoss = isAwakened
    ? calculateMagicLoss(totalEssenceLoss, augmentationRules.magicReductionFormula)
    : 0;
  const resonanceLoss = isTechnomancer
    ? calculateMagicLoss(totalEssenceLoss, augmentationRules.magicReductionFormula)
    : 0;

  // Calculate attribute bonuses
  const attributeBonuses = useMemo(() => {
    const bonuses: Record<string, number> = {};
    for (const item of selectedCyberware) {
      if (item.attributeBonuses) {
        for (const [attr, bonus] of Object.entries(item.attributeBonuses)) {
          bonuses[attr] = (bonuses[attr] || 0) + bonus;
        }
      }
    }
    for (const item of selectedBioware) {
      if (item.attributeBonuses) {
        for (const [attr, bonus] of Object.entries(item.attributeBonuses)) {
          bonuses[attr] = (bonuses[attr] || 0) + bonus;
        }
      }
    }
    return bonuses;
  }, [selectedCyberware, selectedBioware]);

  // Combined and grouped augmentations for display
  const allAugmentations = useMemo(() => {
    const items: Array<{
      item: CyberwareItem | BiowareItem;
      type: "cyberware" | "bioware";
      displayCategory: string;
    }> = [];

    selectedCyberware.forEach((item) => {
      items.push({ item, type: "cyberware", displayCategory: item.category });
    });

    selectedBioware.forEach((item) => {
      items.push({ item, type: "bioware", displayCategory: item.category });
    });

    return items;
  }, [selectedCyberware, selectedBioware]);

  // Group items by category for display
  const itemsByCategory = useMemo(() => {
    const grouped: Record<string, typeof allAugmentations> = {};

    for (const aug of allAugmentations) {
      const cat = aug.displayCategory;
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(aug);
    }

    return grouped;
  }, [allAugmentations]);

  // Build legality warning items with grade-adjusted availability
  const legalityWarningItems = useMemo((): LegalityWarningItem[] => {
    const items: LegalityWarningItem[] = [];

    for (const item of selectedCyberware) {
      const finalAvail = applyGradeToAvailability(item.availability ?? 0, item.grade, true);
      items.push({ name: item.name, legality: item.legality, availability: finalAvail });
    }

    for (const item of selectedBioware) {
      const finalAvail = applyGradeToAvailability(item.availability ?? 0, item.grade, false);
      items.push({ name: item.name, legality: item.legality, availability: finalAvail });
    }

    return items;
  }, [selectedCyberware, selectedBioware]);

  // Add augmentation (actual implementation)
  const actuallyAddAugmentation = useCallback(
    (selection: AugmentationSelection) => {
      // Build the base item
      const baseItem = {
        id: `${selection.catalogId}-${Date.now()}`,
        catalogId: selection.catalogId,
        name: selection.name,
        category: selection.category,
        grade: selection.grade,
        baseEssenceCost: selection.baseEssenceCost,
        essenceCost: selection.essenceCost,
        cost: selection.cost,
        availability: selection.availability,
        legality: selection.legality,
        attributeBonuses: selection.attributeBonuses,
        armorBonus: selection.armorBonus,
      };

      const newItem =
        selection.type === "cyberware"
          ? ({
              ...baseItem,
              capacity: selection.capacity,
              capacityUsed: 0,
              enhancements: [],
              initiativeDiceBonus: selection.initiativeDiceBonus,
              wirelessBonus: selection.wirelessBonus,
              // Add cyberlimb-specific fields if present
              ...(selection.location && { location: selection.location }),
              ...(selection.limbType && { limbType: selection.limbType }),
              ...(selection.appearance && { appearance: selection.appearance }),
              ...(selection.baseStrength && {
                baseStrength: selection.baseStrength,
              }),
              ...(selection.baseAgility && {
                baseAgility: selection.baseAgility,
              }),
            } as CyberwareItem)
          : ({
              ...baseItem,
              // Add initiative dice bonus if present (e.g., Synaptic Booster)
              ...(selection.initiativeDiceBonus && {
                initiativeDiceBonus: selection.initiativeDiceBonus,
              }),
              // Add skill-linked bioware fields if present
              ...(selection.targetSkill && {
                targetSkill: selection.targetSkill,
              }),
            } as BiowareItem);

      if (selection.type === "cyberware") {
        // For cyberlimbs, remove any limbs that would be replaced
        let updatedCyberware = [...selectedCyberware];

        if (selection.location && selection.limbType) {
          const newSide = LOCATION_SIDE[selection.location];

          // Filter out any cyberlimbs that would be replaced
          updatedCyberware = updatedCyberware.filter((item) => {
            // Skip non-cyberlimbs
            if (item.category !== "cyberlimb" || !("location" in item) || !("limbType" in item)) {
              return true;
            }

            const existingItem = item as CyberwareItem & {
              location: CyberlimbLocation;
              limbType: CyberlimbType;
            };
            const existingSide = LOCATION_SIDE[existingItem.location];

            // Only check items on the same side
            if (existingSide !== newSide) {
              return true;
            }

            // Check if the new limb would replace this one
            // Same location = direct replacement
            if (existingItem.location === selection.location) {
              return false;
            }

            // Hierarchy replacement (e.g., full-arm replaces lower-arm and hand)
            if (
              selection.limbType &&
              wouldReplaceExisting(selection.limbType, existingItem.limbType)
            ) {
              return false;
            }

            return true;
          });
        }

        updateState({
          selections: {
            ...state.selections,
            cyberware: [...updatedCyberware, newItem as CyberwareItem],
          },
        });
      } else {
        updateState({
          selections: {
            ...state.selections,
            bioware: [...selectedBioware, newItem as BiowareItem],
          },
        });
      }
    },
    [selectedCyberware, selectedBioware, state.selections, updateState]
  );

  // Add augmentation (with karma conversion prompt if needed)
  const handleAddAugmentation = useCallback(
    (selection: AugmentationSelection) => {
      // Check if already affordable
      if (selection.cost <= remainingNuyen) {
        actuallyAddAugmentation(selection);
        return;
      }

      // Check if karma conversion could help
      const conversionInfo = karmaConversionPrompt.checkPurchase(selection.cost);
      if (conversionInfo?.canConvert) {
        karmaConversionPrompt.promptConversion(selection.name, selection.cost, () => {
          actuallyAddAugmentation(selection);
        });
        return;
      }

      // Can't afford even with max karma conversion - do nothing
    },
    [remainingNuyen, actuallyAddAugmentation, karmaConversionPrompt]
  );

  // Remove cyberware
  const removeCyberware = useCallback(
    (id: string) => {
      updateState({
        selections: {
          ...state.selections,
          cyberware: selectedCyberware.filter((item) => item.id !== id),
        },
      });
    },
    [selectedCyberware, state.selections, updateState]
  );

  // Remove bioware
  const removeBioware = useCallback(
    (id: string) => {
      updateState({
        selections: {
          ...state.selections,
          bioware: selectedBioware.filter((item) => item.id !== id),
        },
      });
    },
    [selectedBioware, state.selections, updateState]
  );

  // Remove enhancement from cyberware
  const removeEnhancement = useCallback(
    (cyberwareId: string, enhancementIndex: number) => {
      const updatedCyberware = selectedCyberware.map((item) => {
        if (item.id !== cyberwareId) return item;

        const enhancements = item.enhancements || [];
        const removedEnhancement = enhancements[enhancementIndex] as CyberwareItem & {
          capacityCost?: number;
        };
        if (!removedEnhancement) return item;

        // Get the capacity cost that was used by this enhancement
        // Use stored capacityCost, fall back to rating for legacy data
        const capacityToRestore = removedEnhancement.capacityCost ?? removedEnhancement.rating ?? 1;

        return {
          ...item,
          capacityUsed: Math.max(0, (item.capacityUsed || 0) - capacityToRestore),
          enhancements: enhancements.filter((_, idx) => idx !== enhancementIndex),
        };
      });

      updateState({
        selections: {
          ...state.selections,
          cyberware: updatedCyberware,
        },
      });
    },
    [selectedCyberware, state.selections, updateState]
  );

  // Add enhancements to cyberware (actual implementation - handles batch)
  const actuallyAddEnhancements = useCallback(
    (enhancements: CyberwareEnhancementSelection[]) => {
      if (!enhancementModalCyberware || enhancements.length === 0) return;

      const updatedCyberware = selectedCyberware.map((item) => {
        if (item.id !== enhancementModalCyberware.id) return item;

        // Build all new enhancements
        const newEnhancements = enhancements.map(
          (enhancement) =>
            ({
              catalogId: enhancement.catalogId,
              name: enhancement.name,
              category: enhancement.category as CyberwareItem["category"],
              grade: item.grade, // Inherit parent grade
              baseEssenceCost: 0,
              essenceCost: 0,
              cost: enhancement.cost,
              availability: enhancement.availability,
              legality: enhancement.legality,
              rating: enhancement.rating,
              capacityCost: enhancement.capacityCost, // Store for removal
            }) as CyberwareItem
        );

        // Calculate total capacity used
        const totalCapacityCost = enhancements.reduce((sum, e) => sum + e.capacityCost, 0);

        return {
          ...item,
          capacityUsed: (item.capacityUsed || 0) + totalCapacityCost,
          enhancements: [...(item.enhancements || []), ...newEnhancements],
        };
      });

      updateState({
        selections: {
          ...state.selections,
          cyberware: updatedCyberware,
        },
      });

      setEnhancementModalCyberware(null);
    },
    [enhancementModalCyberware, selectedCyberware, state.selections, updateState]
  );

  // Add enhancements to cyberware (with karma conversion prompt if needed)
  const handleAddEnhancements = useCallback(
    (enhancements: CyberwareEnhancementSelection[]) => {
      if (!enhancementModalCyberware || enhancements.length === 0) return;

      // Calculate total cost
      const totalCost = enhancements.reduce((sum, e) => sum + e.cost, 0);

      // Check if already affordable
      if (totalCost <= remainingNuyen) {
        actuallyAddEnhancements(enhancements);
        return;
      }

      // Check if karma conversion could help
      const conversionInfo = karmaConversionPrompt.checkPurchase(totalCost);
      if (conversionInfo?.canConvert) {
        const itemNames = enhancements.map((e) => e.name).join(", ");
        karmaConversionPrompt.promptConversion(itemNames, totalCost, () => {
          actuallyAddEnhancements(enhancements);
        });
        return;
      }

      // Can't afford even with max karma conversion - do nothing
    },
    [enhancementModalCyberware, remainingNuyen, actuallyAddEnhancements, karmaConversionPrompt]
  );

  // Get remaining capacity for enhancement modal
  const enhancementRemainingCapacity = useMemo(() => {
    if (!enhancementModalCyberware) return 0;
    return (
      (enhancementModalCyberware.capacity || 0) - (enhancementModalCyberware.capacityUsed || 0)
    );
  }, [enhancementModalCyberware]);

  // Get remaining capacity for accessory modal
  const accessoryRemainingCapacity = useMemo(() => {
    if (!accessoryModalCyberlimb) return 0;
    return (accessoryModalCyberlimb.capacity || 0) - (accessoryModalCyberlimb.capacityUsed || 0);
  }, [accessoryModalCyberlimb]);

  // Get remaining capacity for weapon modal
  const weaponRemainingCapacity = useMemo(() => {
    if (!weaponModalCyberlimb) return 0;
    return (weaponModalCyberlimb.capacity || 0) - (weaponModalCyberlimb.capacityUsed || 0);
  }, [weaponModalCyberlimb]);

  // Add accessories to cyberlimb (actual implementation - handles batch)
  const actuallyAddAccessories = useCallback(
    (accessories: CyberlimbAccessorySelection[]) => {
      if (!accessoryModalCyberlimb || accessories.length === 0) return;

      const updatedCyberware = selectedCyberware.map((item) => {
        if (item.id !== accessoryModalCyberlimb.id || !isCyberlimb(item)) return item;

        // Build all new accessories
        const newAccessories = accessories.map((accessory) => ({
          id: `acc-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          catalogId: accessory.catalogId,
          name: accessory.name,
          capacityUsed: accessory.capacityCost,
          rating: accessory.rating,
        }));

        // Calculate total capacity used
        const totalCapacityCost = accessories.reduce((sum, a) => sum + a.capacityCost, 0);

        return {
          ...item,
          capacityUsed: (item.capacityUsed || 0) + totalCapacityCost,
          accessories: [...(item.accessories || []), ...newAccessories],
        };
      });

      updateState({
        selections: {
          ...state.selections,
          cyberware: updatedCyberware,
        },
      });

      setAccessoryModalCyberlimb(null);
    },
    [accessoryModalCyberlimb, selectedCyberware, state.selections, updateState]
  );

  // Add accessories to cyberlimb (with karma conversion prompt if needed)
  const handleAddAccessories = useCallback(
    (accessories: CyberlimbAccessorySelection[]) => {
      if (!accessoryModalCyberlimb || accessories.length === 0) return;

      // Calculate total cost
      const totalCost = accessories.reduce((sum, a) => sum + a.cost, 0);

      // Check if already affordable
      if (totalCost <= remainingNuyen) {
        actuallyAddAccessories(accessories);
        return;
      }

      // Check if karma conversion could help
      const conversionInfo = karmaConversionPrompt.checkPurchase(totalCost);
      if (conversionInfo?.canConvert) {
        const itemNames = accessories.map((a) => a.name).join(", ");
        karmaConversionPrompt.promptConversion(itemNames, totalCost, () => {
          actuallyAddAccessories(accessories);
        });
        return;
      }

      // Can't afford even with max karma conversion - do nothing
    },
    [accessoryModalCyberlimb, remainingNuyen, actuallyAddAccessories, karmaConversionPrompt]
  );

  // Add weapons to cyberlimb (actual implementation - handles batch)
  const actuallyAddWeapons = useCallback(
    (weapons: CyberlimbWeaponSelection[]) => {
      if (!weaponModalCyberlimb || weapons.length === 0) return;

      const updatedCyberware = selectedCyberware.map((item) => {
        if (item.id !== weaponModalCyberlimb.id || !isCyberlimb(item)) return item;

        // Build all new weapons
        const newWeapons = weapons.map((weapon) => ({
          id: `wpn-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          catalogId: weapon.catalogId,
          name: weapon.name,
          capacityUsed: weapon.capacityCost,
          essenceCost: 0,
          cost: weapon.cost,
          availability: weapon.availability,
          legality: weapon.legality,
          damage: weapon.damage || "",
          ap: weapon.ap || 0,
        }));

        // Calculate total capacity used
        const totalCapacityCost = weapons.reduce((sum, w) => sum + w.capacityCost, 0);

        return {
          ...item,
          capacityUsed: (item.capacityUsed || 0) + totalCapacityCost,
          weapons: [...(item.weapons || []), ...newWeapons],
        };
      });

      updateState({
        selections: {
          ...state.selections,
          cyberware: updatedCyberware,
        },
      });

      setWeaponModalCyberlimb(null);
    },
    [weaponModalCyberlimb, selectedCyberware, state.selections, updateState]
  );

  // Add weapons to cyberlimb (with karma conversion prompt if needed)
  const handleAddWeapons = useCallback(
    (weapons: CyberlimbWeaponSelection[]) => {
      if (!weaponModalCyberlimb || weapons.length === 0) return;

      // Calculate total cost
      const totalCost = weapons.reduce((sum, w) => sum + w.cost, 0);

      // Check if already affordable
      if (totalCost <= remainingNuyen) {
        actuallyAddWeapons(weapons);
        return;
      }

      // Check if karma conversion could help
      const conversionInfo = karmaConversionPrompt.checkPurchase(totalCost);
      if (conversionInfo?.canConvert) {
        const itemNames = weapons.map((w) => w.name).join(", ");
        karmaConversionPrompt.promptConversion(itemNames, totalCost, () => {
          actuallyAddWeapons(weapons);
        });
        return;
      }

      // Can't afford even with max karma conversion - do nothing
    },
    [weaponModalCyberlimb, remainingNuyen, actuallyAddWeapons, karmaConversionPrompt]
  );

  // Remove accessory from cyberlimb
  const removeAccessory = useCallback(
    (cyberlimbId: string, accessoryIndex: number) => {
      const updatedCyberware = selectedCyberware.map((item) => {
        if (item.id !== cyberlimbId || !isCyberlimb(item)) return item;
        if (!item.accessories || item.accessories.length <= accessoryIndex) return item;

        const removedAccessory = item.accessories[accessoryIndex];
        const capacityToRestore = removedAccessory.capacityUsed || 0;

        return {
          ...item,
          capacityUsed: Math.max(0, (item.capacityUsed || 0) - capacityToRestore),
          accessories: item.accessories.filter((_, i) => i !== accessoryIndex),
        };
      });

      updateState({
        selections: {
          ...state.selections,
          cyberware: updatedCyberware,
        },
      });
    },
    [selectedCyberware, state.selections, updateState]
  );

  // Remove weapon from cyberlimb
  const removeWeapon = useCallback(
    (cyberlimbId: string, weaponIndex: number) => {
      const updatedCyberware = selectedCyberware.map((item) => {
        if (item.id !== cyberlimbId || !isCyberlimb(item)) return item;
        if (!item.weapons || item.weapons.length <= weaponIndex) return item;

        const removedWeapon = item.weapons[weaponIndex];
        const capacityToRestore = removedWeapon.capacityUsed || 0;

        return {
          ...item,
          capacityUsed: Math.max(0, (item.capacityUsed || 0) - capacityToRestore),
          weapons: item.weapons.filter((_, i) => i !== weaponIndex),
        };
      });

      updateState({
        selections: {
          ...state.selections,
          cyberware: updatedCyberware,
        },
      });
    },
    [selectedCyberware, state.selections, updateState]
  );

  // Validation status
  const validationStatus = useMemo(() => {
    if (remainingEssence < 0) return "error";
    if (remainingNuyen < 0) return "error";
    if ((isAwakened && magicLoss > 0) || (isTechnomancer && resonanceLoss > 0)) return "warning";
    if (selectedCyberware.length > 0 || selectedBioware.length > 0) return "valid";
    return "pending";
  }, [
    remainingEssence,
    remainingNuyen,
    isAwakened,
    isTechnomancer,
    magicLoss,
    resonanceLoss,
    selectedCyberware.length,
    selectedBioware.length,
  ]);

  // Check prerequisites
  const hasPriorities = state.priorities?.metatype && state.priorities?.resources;
  if (!hasPriorities) {
    return (
      <CreationCard
        title="Augmentations"
        description="Install cyberware and bioware"
        status="pending"
      >
        <div className="flex items-center gap-2 rounded-lg border-2 border-dashed border-zinc-200 p-4 text-center dark:border-zinc-700">
          <Lock className="h-5 w-5 text-zinc-400" />
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Set priorities first</p>
        </div>
      </CreationCard>
    );
  }

  const totalAugmentations = selectedCyberware.length + selectedBioware.length;

  return (
    <>
      <CreationCard
        title="Augmentations"
        status={validationStatus}
        headerAction={
          <button
            onClick={() => setIsAugModalOpen(true)}
            className="flex items-center gap-1 rounded-lg bg-amber-500 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-amber-600"
          >
            <Plus className="h-3 w-3" />
            Add
          </button>
        }
      >
        <div className="space-y-4">
          {/* Essence bar - compact style */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
                <span>Essence</span>
                <InfoTooltip content="Remaining essence after augmentations" label="Essence info" />
              </span>
              <span
                className={`font-medium ${
                  remainingEssence < 1
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-zinc-900 dark:text-zinc-100"
                }`}
              >
                {formatEssence(totalEssenceLoss)} / {maxEssence}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
              <div
                className={`h-full transition-all ${
                  remainingEssence < 1 ? "bg-amber-500" : "bg-emerald-500"
                }`}
                style={{
                  width: `${Math.min(100, (totalEssenceLoss / maxEssence) * 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Nuyen bar - compact style */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
                <span>Nuyen</span>
                <InfoTooltip
                  content="Total nuyen spent across all gear categories"
                  label="Nuyen budget info"
                />
                {karmaConversion > 0 && (
                  <span className="ml-1 text-[10px] text-emerald-600 dark:text-emerald-400">
                    (+{formatCurrency(convertedNuyen)}¥ karma)
                  </span>
                )}
              </span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                {formatCurrency(totalSpent)} / {formatCurrency(totalNuyen)}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
              <div
                className={`h-full transition-all ${
                  remainingNuyen < 0 ? "bg-red-500" : "bg-blue-500"
                }`}
                style={{
                  width: `${Math.min(100, (totalSpent / totalNuyen) * 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Magic/Resonance warning */}
          {isAwakened && magicLoss > 0 && (
            <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-2 text-xs dark:bg-amber-900/20">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
              <div className="text-amber-800 dark:text-amber-200">
                Magic reduced by {magicLoss} (now {Math.max(0, magicRating - magicLoss)})
              </div>
            </div>
          )}
          {isTechnomancer && resonanceLoss > 0 && (
            <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-2 text-xs dark:bg-amber-900/20">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
              <div className="text-amber-800 dark:text-amber-200">
                Resonance reduced by {resonanceLoss} (now{" "}
                {Math.max(0, resonanceRating - resonanceLoss)})
              </div>
            </div>
          )}

          {/* Total attribute bonuses */}
          {Object.keys(attributeBonuses).length > 0 && (
            <div className="flex flex-wrap gap-1">
              {Object.entries(attributeBonuses).map(([attr, bonus]) => (
                <span
                  key={attr}
                  className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
                >
                  {attr.toUpperCase()}: +{bonus}
                </span>
              ))}
            </div>
          )}

          {/* Legality warnings for augmentations */}
          <LegalityWarnings items={legalityWarningItems} />

          {/* Selected Augmentations - Grouped by Category */}
          {allAugmentations.length > 0 ? (
            <div className="space-y-4">
              {DISPLAY_CATEGORIES.map((cat) => {
                const items = itemsByCategory[cat.id];
                if (!items || items.length === 0) return null;

                return (
                  <div key={cat.id}>
                    {/* Category Header */}
                    <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2">
                      {cat.type === "cyberware" ? (
                        <Cpu className="h-3.5 w-3.5 text-cyan-500" />
                      ) : (
                        <Heart className="h-3.5 w-3.5 text-pink-500" />
                      )}
                      <span className="uppercase tracking-wider">{cat.label}</span>
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                          cat.type === "cyberware"
                            ? "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300"
                            : "bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300"
                        }`}
                      >
                        {items.length}
                      </span>
                    </div>

                    {/* Items Container */}
                    <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900 px-3 divide-y divide-zinc-100 dark:divide-zinc-800">
                      {items.map(({ item, type }) => {
                        // Type guard: when type is cyberware, item is CyberwareItem
                        if (type === "cyberware") {
                          const cyberItem = item as CyberwareItem;
                          if (isCyberlimb(cyberItem)) {
                            const limbItem = cyberItem as CyberlimbItem;
                            return (
                              <CyberlimbAugmentationItem
                                key={item.id}
                                item={limbItem}
                                onRemove={() => item.id && removeCyberware(item.id)}
                                onAddEnhancement={() => setEnhancementModalCyberware(cyberItem)}
                                onRemoveEnhancement={(idx) => removeEnhancement(item.id!, idx)}
                                onAddAccessory={() => setAccessoryModalCyberlimb(limbItem)}
                                onRemoveAccessory={(idx) => removeAccessory(item.id!, idx)}
                                onAddWeapon={() => setWeaponModalCyberlimb(limbItem)}
                                onRemoveWeapon={(idx) => removeWeapon(item.id!, idx)}
                              />
                            );
                          }
                          return (
                            <AugmentationItem
                              key={item.id}
                              item={cyberItem}
                              type="cyberware"
                              onRemove={() => item.id && removeCyberware(item.id)}
                              onAddEnhancement={
                                cyberItem.capacity && cyberItem.capacity > 0
                                  ? () => setEnhancementModalCyberware(cyberItem)
                                  : undefined
                              }
                              onRemoveEnhancement={
                                item.id && cyberItem.capacity && cyberItem.capacity > 0
                                  ? (idx) => removeEnhancement(item.id!, idx)
                                  : undefined
                              }
                            />
                          );
                        }
                        // Bioware
                        return (
                          <AugmentationItem
                            key={item.id}
                            item={item}
                            type="bioware"
                            onRemove={() => item.id && removeBioware(item.id)}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-lg border-2 border-dashed border-zinc-200 p-3 text-center dark:border-zinc-700">
              <p className="text-xs text-zinc-400 dark:text-zinc-500">No augmentations installed</p>
            </div>
          )}

          {/* Footer Summary */}
          <SummaryFooter
            count={totalAugmentations}
            total={cyberwareSpent + biowareSpent}
            format="currency"
            label="augmentation"
          />
        </div>
      </CreationCard>

      {/* Unified Augmentation Modal */}
      <AugmentationModal
        isOpen={isAugModalOpen}
        onClose={() => setIsAugModalOpen(false)}
        onAdd={handleAddAugmentation}
        augmentationType="cyberware"
        remainingEssence={remainingEssence}
        remainingNuyen={remainingNuyen}
        isAwakened={isAwakened}
        isTechnomancer={isTechnomancer}
        currentMagic={magicRating}
        currentResonance={resonanceRating}
        installedCyberlimbs={installedCyberlimbs}
        installedSkillLinkedBioware={installedSkillLinkedBioware}
      />

      {/* Enhancement Modal */}
      {enhancementModalCyberware && (
        <CyberwareEnhancementModal
          isOpen={!!enhancementModalCyberware}
          onClose={() => setEnhancementModalCyberware(null)}
          onAdd={handleAddEnhancements}
          parentCyberware={enhancementModalCyberware}
          remainingCapacity={enhancementRemainingCapacity}
          remainingNuyen={remainingNuyen}
        />
      )}

      {/* Cyberlimb Accessory Modal */}
      {accessoryModalCyberlimb && (
        <CyberlimbAccessoryModal
          isOpen={!!accessoryModalCyberlimb}
          onClose={() => setAccessoryModalCyberlimb(null)}
          onAdd={handleAddAccessories}
          parentCyberlimb={accessoryModalCyberlimb}
          remainingCapacity={accessoryRemainingCapacity}
          remainingNuyen={remainingNuyen}
        />
      )}

      {/* Cyberlimb Weapon Modal */}
      {weaponModalCyberlimb && (
        <CyberlimbWeaponModal
          isOpen={!!weaponModalCyberlimb}
          onClose={() => setWeaponModalCyberlimb(null)}
          onAdd={handleAddWeapons}
          parentCyberlimb={weaponModalCyberlimb}
          remainingCapacity={weaponRemainingCapacity}
          remainingNuyen={remainingNuyen}
        />
      )}

      {/* Karma Conversion Modal */}
      {karmaConversionPrompt.modalState && (
        <KarmaConversionModal
          isOpen={karmaConversionPrompt.modalState.isOpen}
          onClose={karmaConversionPrompt.closeModal}
          onConfirm={karmaConversionPrompt.confirmConversion}
          itemName={karmaConversionPrompt.modalState.itemName}
          itemCost={karmaConversionPrompt.modalState.itemCost}
          currentRemaining={remainingNuyen}
          karmaToConvert={karmaConversionPrompt.modalState.karmaToConvert}
          karmaAvailable={karmaRemaining}
          currentKarmaConversion={karmaConversion}
          maxKarmaConversion={10}
        />
      )}
    </>
  );
}
