"use client";

import { useState, useMemo, useCallback } from "react";
import type { CreationState, GearItem, Weapon, ArmorItem, InstalledWeaponMod, InstalledArmorMod, CyberwareItem, BiowareItem, WeaponMount } from "@/lib/types";
import type { FocusItem } from "@/lib/types/character";
import type { FocusType } from "@/lib/types/edition";
import {
  useGear,
  useFoci,
  useCyberware,
  useBioware,
  useModifications,
  useAugmentationRules,
  useCyberwareGrades,
  useBiowareGrades,
  calculateCyberwareEssenceCost,
  calculateCyberwareCost,
  calculateCyberwareAvailability,
  calculateBiowareEssenceCost,
  calculateBiowareCost,
  calculateBiowareAvailability,
  calculateMagicLoss,
  type GearItemData,
  type WeaponData,
  type ArmorData,
  type FocusCatalogItemData,
  type CyberwareCatalogItemData,
  type BiowareCatalogItemData,
} from "@/lib/rules/RulesetContext";
import { ModificationModal } from "../ModificationModal";

interface StepProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
  budgetValues: Record<string, number>;
}

type GearCategory =
  | "all"
  | "weapons"
  | "armor"
  | "augmentations"
  | "commlinks"
  | "cyberdecks"
  | "electronics"
  | "tools"
  | "survival"
  | "medical"
  | "security"
  | "miscellaneous"
  | "ammunition"
  | "foci";

type AugmentationSubcategory = "cyberware" | "bioware";

type CyberwareCategory =
  | "all"
  | "headware"
  | "eyeware"
  | "earware"
  | "bodyware"
  | "cyberlimb"
  | "cyberlimb-enhancement"
  | "cyberlimb-accessory";

type BiowareCategory = "all" | "basic" | "cultured";

const CYBERWARE_CATEGORIES: Array<{ id: CyberwareCategory; label: string }> = [
  { id: "all", label: "All" },
  { id: "headware", label: "Headware" },
  { id: "eyeware", label: "Eyeware" },
  { id: "earware", label: "Earware" },
  { id: "bodyware", label: "Bodyware" },
  { id: "cyberlimb", label: "Cyberlimbs" },
  { id: "cyberlimb-enhancement", label: "Enhancements" },
  { id: "cyberlimb-accessory", label: "Accessories" },
];

const BIOWARE_CATEGORIES: Array<{ id: BiowareCategory; label: string }> = [
  { id: "all", label: "All" },
  { id: "basic", label: "Basic" },
  { id: "cultured", label: "Cultured" },
];

type WeaponSubcategory =
  | "all"
  | "melee"
  | "pistols"
  | "smgs"
  | "rifles"
  | "shotguns"
  | "sniperRifles"
  | "throwingWeapons"
  | "grenades";

const MAX_AVAILABILITY = 12;
const MAX_NUYEN_CARRYOVER = 5000;
const KARMA_TO_NUYEN_RATE = 2000; // 1 Karma = 2,000 nuyen
const MAX_KARMA_CONVERSION = 10;

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

function getAvailabilityDisplay(item: GearItemData): string {
  let display = String(item.availability);
  if (item.restricted) display += "R";
  if (item.forbidden) display += "F";
  return display;
}

function getAugmentationAvailabilityDisplay(
  availability: number,
  restricted?: boolean,
  forbidden?: boolean
): string {
  let display = String(availability);
  if (restricted) display += "R";
  if (forbidden) display += "F";
  return display;
}

function isItemAvailable(item: GearItemData): boolean {
  return item.availability <= MAX_AVAILABILITY && !item.forbidden;
}

export function GearStep({ state, updateState, budgetValues }: StepProps) {
  const gearCatalog = useGear();
  const fociCatalog = useFoci();
  const cyberwareCatalog = useCyberware({ excludeForbidden: false });
  const biowareCatalog = useBioware({ excludeForbidden: false });
  const augmentationRules = useAugmentationRules();
  const cyberwareGrades = useCyberwareGrades();
  const biowareGrades = useBiowareGrades();
  const modificationsCatalog = useModifications();

  const [selectedCategory, setSelectedCategory] = useState<GearCategory>("all");
  const [weaponSubcategory, setWeaponSubcategory] = useState<WeaponSubcategory>("all");
  const [augmentationSubcategory, setAugmentationSubcategory] = useState<AugmentationSubcategory>("cyberware");
  const [cyberwareCategory, setCyberwareCategory] = useState<CyberwareCategory>("all");
  const [biowareCategory, setBiowareCategory] = useState<BiowareCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showUnavailable, setShowUnavailable] = useState(false);
  const [selectedGrades, setSelectedGrades] = useState<Record<string, string>>({});
  const [configuringGear, setConfiguringGear] = useState<{ item: GearItemData; index?: number } | null>(null);
  const [gearConfigRating, setGearConfigRating] = useState<number>(1);

  // Modification modal state
  const [modModalOpen, setModModalOpen] = useState(false);
  const [modifyingItem, setModifyingItem] = useState<{ item: Weapon | ArmorItem; type: "weapon" | "armor"; index: number } | null>(null);

  // Get selections from state
  const selectedGear: GearItem[] = (state.selections?.gear as GearItem[]) || [];
  const selectedWeapons: Weapon[] = (state.selections?.weapons as Weapon[]) || [];
  const selectedArmor: ArmorItem[] = (state.selections?.armor as ArmorItem[]) || [];
  const selectedFoci: FocusItem[] = (state.selections?.foci as FocusItem[]) || [];
  // Get selected cyberware and bioware
  const selectedCyberware = useMemo(() => (state.selections.cyberware || []) as CyberwareItem[], [state.selections.cyberware]);
  const selectedBioware = useMemo(() => (state.selections.bioware || []) as BiowareItem[], [state.selections.bioware]);

  // Check if character is magical
  const magicPath = (state.selections?.["magical-path"] as string) || "mundane";
  const isMagical = ["magician", "mystic-adept", "aspected-mage"].includes(magicPath);
  const isTechnomancer = magicPath === "technomancer";
  const hasSpecialAttribute = isMagical || isTechnomancer;

  // Karma-to-nuyen conversion is tracked globally in CreationState budgets
  const karmaConversion = (state.budgets?.["karma-spent-gear"] as number) || 0;

  const karmaAvailableForConversion = useMemo(() => {
    const karmaBase = budgetValues["karma"] || 0;
    const karmaGainedNegative = (state.budgets?.["karma-gained-negative"] as number) || 0;

    // Total spent excluding the conversion itself (so we can clamp correctly)
    const karmaSpentPositive = (state.budgets?.["karma-spent-positive"] as number) || 0;
    const karmaSpentSpells = (state.budgets?.["karma-spent-spells"] as number) || 0;
    const karmaSpentComplexForms = (state.budgets?.["karma-spent-complex-forms"] as number) || 0;
    const karmaSpentPowerPoints = (state.budgets?.["karma-spent-power-points"] as number) || 0;
    const karmaSpentFociBonding = (state.budgets?.["karma-spent-foci-bonding"] as number) || 0;
    const karmaSpentContacts = (state.budgets?.["karma-spent-contacts"] as number) || 0;

    const available =
      karmaBase +
      karmaGainedNegative -
      (karmaSpentPositive + karmaSpentSpells + karmaSpentComplexForms + karmaSpentPowerPoints + karmaSpentFociBonding + karmaSpentContacts);

    // Allow reducing conversion back down even if available is low/negative
    return Math.max(0, available + karmaConversion);
  }, [
    budgetValues,
    state.budgets,
    karmaConversion,
  ]);

  // Calculate budget
  const baseNuyen = budgetValues["nuyen"] || 0;
  const convertedNuyen = karmaConversion * KARMA_TO_NUYEN_RATE;
  const totalNuyen = baseNuyen + convertedNuyen;

  // Calculate spent - include weapons, armor with their modifications
  const gearSpent = selectedGear.reduce((sum, item) => sum + item.cost * item.quantity, 0);
  const weaponsSpent = selectedWeapons.reduce((sum, weapon) => {
    const baseCost = weapon.cost * weapon.quantity;
    const modsCost = (weapon.modifications || []).reduce((modSum, mod) => modSum + mod.cost, 0);
    return sum + baseCost + modsCost;
  }, 0);
  const armorSpent = selectedArmor.reduce((sum, armor) => {
    const baseCost = armor.cost * armor.quantity;
    const modsCost = (armor.modifications || []).reduce((modSum, mod) => modSum + mod.cost, 0);
    return sum + baseCost + modsCost;
  }, 0);
  const fociSpent = selectedFoci.reduce((sum, focus) => sum + focus.cost, 0);
  const cyberwareSpent = selectedCyberware.reduce((sum, item) => sum + item.cost, 0);
  const biowareSpent = selectedBioware.reduce((sum, item) => sum + item.cost, 0);
  const augmentationSpent = cyberwareSpent + biowareSpent;
  const lifestyleSpent = (state.budgets["nuyen-spent-lifestyle"] as number) || 0;
  const identitySpent = (state.budgets["nuyen-spent-identities"] as number) || 0;
  const totalSpent = gearSpent + weaponsSpent + armorSpent + fociSpent + augmentationSpent + lifestyleSpent + identitySpent;
  const remaining = totalNuyen - totalSpent;

  // Calculate essence values
  const maxEssence = augmentationRules.maxEssence;
  const cyberwareEssence = selectedCyberware.reduce((sum, item) => sum + item.essenceCost, 0);
  const biowareEssence = selectedBioware.reduce((sum, item) => sum + item.essenceCost, 0);
  const totalEssenceLoss = Math.round((cyberwareEssence + biowareEssence) * 100) / 100;
  const remainingEssence = Math.round((maxEssence - totalEssenceLoss) * 100) / 100;
  const magicLoss = calculateMagicLoss(totalEssenceLoss, augmentationRules.magicReductionFormula);

  // Calculate attribute bonuses from all augmentations
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

  // Get selected grade for an item
  const getItemGrade = useCallback(
    (itemId: string, defaultGrade: string = "standard"): string => {
      return selectedGrades[itemId] || defaultGrade;
    },
    [selectedGrades]
  );

  // Check if gear item needs rating configuration
  const needsRatingConfig = (item: GearItemData): boolean => {
    // Check if description mentions rating range (e.g., "Rating 1-6")
    if (item.description && /rating\s+\d+\s*-\s*\d+/i.test(item.description)) {
      return true;
    }
    // Check if item has a rating field that represents max rating
    if (item.rating && item.rating > 1) {
      return true;
    }
    return false;
  };

  // Helper to add gear item - routes weapons and armor to separate lists
  const addGearItem = (item: GearItemData) => {
    // Handle weapons separately
    if (item.category === "weapons" && "damage" in item) {
      const weaponItem = item as WeaponData;

      // Auto-install built-in modifications
      const builtinMods: InstalledWeaponMod[] = [];
      const builtinMounts: WeaponMount[] = [];

      if (weaponItem.builtInModifications && modificationsCatalog?.weaponMods) {
        weaponItem.builtInModifications.forEach(builtIn => {
          const modData = modificationsCatalog.weaponMods.find(m => m.id === builtIn.modificationId);
          if (modData) {
            builtinMods.push({
              catalogId: modData.id,
              name: modData.name,
              mount: builtIn.mount || modData.mount,
              cost: 0,
              availability: modData.availability,
              restricted: modData.restricted,
              forbidden: modData.forbidden,
              isBuiltIn: true
            });
            if (builtIn.mount || modData.mount) {
              builtinMounts.push(builtIn.mount || modData.mount!);
            }
          }
        });
      }

      const newWeapon: Weapon = {
        catalogId: weaponItem.id,
        name: weaponItem.name,
        category: "weapons",
        subcategory: weaponItem.subcategory || "pistols", // Default fallback
        quantity: 1,
        cost: weaponItem.cost,
        availability: weaponItem.availability,
        damage: weaponItem.damage,
        ap: weaponItem.ap,
        mode: weaponItem.mode || [],
        recoil: weaponItem.rc,
        accuracy: weaponItem.accuracy,
        modifications: builtinMods,
        occupiedMounts: builtinMounts,
      };
      updateState({
        selections: {
          ...state.selections,
          weapons: [...selectedWeapons, newWeapon],
        },
      });
      return;
    }

    // Handle armor separately
    if (item.category === "armor" && "armorRating" in item) {
      const armorItem = item as ArmorData;
      const newArmor: ArmorItem = {
        catalogId: armorItem.id,
        name: armorItem.name,
        category: "armor",
        quantity: 1,
        cost: armorItem.cost,
        availability: armorItem.availability,
        armorRating: armorItem.armorRating,
        equipped: false,
        capacity: armorItem.armorRating, // Capacity equals armor rating
        capacityUsed: 0,
        modifications: [],
      };
      updateState({
        selections: {
          ...state.selections,
          armor: [...selectedArmor, newArmor],
        },
      });
      return;
    }

    // If gear item needs rating configuration, open modal
    if (needsRatingConfig(item)) {
      setGearConfigRating(1);
      setConfiguringGear({ item });
      return;
    }

    // Handle other gear as before
    const existingIndex = selectedGear.findIndex((g) => g.name === item.name && (!g.rating || g.rating === item.rating));
    let updatedGear: GearItem[];

    if (existingIndex >= 0) {
      updatedGear = selectedGear.map((g, i) =>
        i === existingIndex ? { ...g, quantity: g.quantity + 1 } : g
      );
    } else {
      const newItem: GearItem = {
        name: item.name,
        category: item.category,
        quantity: 1,
        cost: item.cost,
        availability: item.availability,
        rating: item.rating,
      };
      updatedGear = [...selectedGear, newItem];
    }

    updateState({
      selections: {
        ...state.selections,
        gear: updatedGear,
      },
    });
  };

  // Handle gear configuration confirmation
  const confirmGearConfig = () => {
    if (!configuringGear) return;

    const item = configuringGear.item;
    const maxRating = item.rating || 6; // Default to 6 if not specified
    const selectedRating = gearConfigRating;

    // Calculate cost based on rating (if costPerRating, otherwise use base cost)
    // For now, assume base cost is per rating level (common pattern)
    const costPerRating = item.cost / maxRating;
    const finalCost = costPerRating * selectedRating;

    const newItem: GearItem = {
      name: item.name,
      category: item.category,
      quantity: 1,
      cost: finalCost,
      availability: item.availability,
      rating: selectedRating,
    };

    // If editing existing item
    if (configuringGear.index !== undefined) {
      const updatedGear = selectedGear.map((g, i) =>
        i === configuringGear.index ? newItem : g
      );
      updateState({
        selections: {
          ...state.selections,
          gear: updatedGear,
        },
      });
    } else {
      // Adding new item
      updateState({
        selections: {
          ...state.selections,
          gear: [...selectedGear, newItem],
        },
      });
    }

    setConfiguringGear(null);
    setGearConfigRating(1);
  };

  // Open gear configuration for existing item
  const configureGearItem = (index: number) => {
    const item = selectedGear[index];
    const catalogItem = gearCatalog?.categories
      .flatMap((cat) => {
        const catData = gearCatalog[cat.id as keyof typeof gearCatalog] as GearItemData[] | undefined;
        return catData || [];
      })
      .find((g) => g.name === item.name);

    if (catalogItem && needsRatingConfig(catalogItem)) {
      setGearConfigRating(item.rating || 1);
      setConfiguringGear({ item: catalogItem, index });
    }
  };

  // Helper to remove weapon
  const removeWeapon = (index: number) => {
    const updatedWeapons = selectedWeapons.filter((_, i) => i !== index);
    updateState({
      selections: {
        ...state.selections,
        weapons: updatedWeapons,
      },
    });
  };

  // Helper to remove armor
  const removeArmor = (index: number) => {
    const updatedArmor = selectedArmor.filter((_, i) => i !== index);
    updateState({
      selections: {
        ...state.selections,
        armor: updatedArmor,
      },
    });
  };

  // Helper to open modification modal
  const openModificationModal = (item: Weapon | ArmorItem, type: "weapon" | "armor", index: number) => {
    setModifyingItem({ item, type, index });
    setModModalOpen(true);
  };

  // Helper to install weapon mod
  const handleInstallWeaponMod = (mod: InstalledWeaponMod) => {
    if (!modifyingItem || modifyingItem.type !== "weapon") return;

    const updatedWeapons = selectedWeapons.map((weapon, i) => {
      if (i !== modifyingItem.index) return weapon;

      const updatedMods = [...(weapon.modifications || []), mod];
      const updatedMounts = mod.mount
        ? [...(weapon.occupiedMounts || []), mod.mount]
        : weapon.occupiedMounts;

      return {
        ...weapon,
        modifications: updatedMods,
        occupiedMounts: updatedMounts,
      };
    });

    updateState({
      selections: {
        ...state.selections,
        weapons: updatedWeapons,
      },
    });
  };

  // Helper to install armor mod
  const handleInstallArmorMod = (mod: InstalledArmorMod) => {
    if (!modifyingItem || modifyingItem.type !== "armor") return;

    const updatedArmor = selectedArmor.map((armor, i) => {
      if (i !== modifyingItem.index) return armor;

      const updatedMods = [...(armor.modifications || []), mod];
      const updatedCapacityUsed = (armor.capacityUsed || 0) + mod.capacityUsed;

      return {
        ...armor,
        modifications: updatedMods,
        capacityUsed: updatedCapacityUsed,
      };
    });

    updateState({
      selections: {
        ...state.selections,
        armor: updatedArmor,
      },
    });
  };

  // Helper to remove weapon mod
  const removeWeaponMod = (weaponIndex: number, modIndex: number) => {
    const updatedWeapons = selectedWeapons.map((weapon, i) => {
      if (i !== weaponIndex) return weapon;

      const modToRemove = weapon.modifications?.[modIndex];
      const updatedMods = (weapon.modifications || []).filter((_, mi) => mi !== modIndex);
      const updatedMounts = modToRemove?.mount
        ? (weapon.occupiedMounts || []).filter((m) => m !== modToRemove.mount)
        : weapon.occupiedMounts;

      return {
        ...weapon,
        modifications: updatedMods,
        occupiedMounts: updatedMounts,
      };
    });

    updateState({
      selections: {
        ...state.selections,
        weapons: updatedWeapons,
      },
    });
  };

  // Helper to remove armor mod
  const removeArmorMod = (armorIndex: number, modIndex: number) => {
    const updatedArmor = selectedArmor.map((armor, i) => {
      if (i !== armorIndex) return armor;

      const modToRemove = armor.modifications?.[modIndex];
      const updatedMods = (armor.modifications || []).filter((_, mi) => mi !== modIndex);
      const updatedCapacityUsed = (armor.capacityUsed || 0) - (modToRemove?.capacityUsed || 0);

      return {
        ...armor,
        modifications: updatedMods,
        capacityUsed: Math.max(0, updatedCapacityUsed),
      };
    });

    updateState({
      selections: {
        ...state.selections,
        armor: updatedArmor,
      },
    });
  };

  // Check if augmentation can be added
  const canAddAugmentation = useCallback(
    (
      itemCost: number,
      essenceCost: number,
      availability: number,
      newBonuses?: Record<string, number>,
      forbidden?: boolean
    ): { allowed: boolean; reason?: string } => {
      if (forbidden) {
        return { allowed: false, reason: "Forbidden items not allowed at creation" };
      }
      if (availability > augmentationRules.maxAvailabilityAtCreation) {
        return {
          allowed: false,
          reason: `Availability ${availability} exceeds ${augmentationRules.maxAvailabilityAtCreation}`,
        };
      }
      if (itemCost > remaining) {
        return { allowed: false, reason: "Insufficient nuyen" };
      }
      if (essenceCost > remainingEssence) {
        return { allowed: false, reason: "Insufficient essence" };
      }
      if (newBonuses) {
        for (const [attr, bonus] of Object.entries(newBonuses)) {
          const currentBonus = attributeBonuses[attr] || 0;
          if (currentBonus + bonus > augmentationRules.maxAttributeBonus) {
            return {
              allowed: false,
              reason: `${attr} bonus would exceed +${augmentationRules.maxAttributeBonus}`,
            };
          }
        }
      }
      return { allowed: true };
    },
    [augmentationRules, remaining, remainingEssence, attributeBonuses]
  );

  // Add cyberware
  const addCyberware = useCallback(
    (item: CyberwareCatalogItemData, grade: string, rating?: number) => {
      const essenceCost = calculateCyberwareEssenceCost(
        item.essenceCost,
        grade,
        cyberwareGrades,
        rating,
        item.essencePerRating
      );
      const cost = calculateCyberwareCost(
        item.cost,
        grade,
        cyberwareGrades,
        rating,
        item.costPerRating
      );
      const availability = calculateCyberwareAvailability(item.availability, grade, cyberwareGrades);

      let itemBonuses: Record<string, number> | undefined;
      if (item.attributeBonuses || item.attributeBonusesPerRating) {
        itemBonuses = {};
        if (item.attributeBonuses) {
          for (const [attr, bonus] of Object.entries(item.attributeBonuses)) {
            itemBonuses[attr] = bonus;
          }
        }
        if (item.attributeBonusesPerRating && rating) {
          for (const [attr, bonus] of Object.entries(item.attributeBonusesPerRating)) {
            itemBonuses[attr] = (itemBonuses[attr] || 0) + bonus * rating;
          }
        }
      }

      const check = canAddAugmentation(cost, essenceCost, availability, itemBonuses, item.forbidden);
      if (!check.allowed) return;

      const newItem: CyberwareItem = {
        id: crypto.randomUUID(),
        catalogId: item.id,
        name: item.name,
        category: item.category as CyberwareItem["category"],
        grade: grade as CyberwareItem["grade"],
        baseEssenceCost: item.essenceCost,
        essenceCost,
        rating,
        cost,
        availability,
        restricted: item.restricted,
        forbidden: item.forbidden,
        attributeBonuses: itemBonuses,
        initiativeDiceBonus: item.initiativeDiceBonus,
        capacity: item.capacity,
        capacityUsed: 0,
        wirelessBonus: item.wirelessBonus,
      };

      updateState({
        selections: {
          ...state.selections,
          cyberware: [...selectedCyberware, newItem],
        },
      });
    },
    [cyberwareGrades, canAddAugmentation, selectedCyberware, state.selections, updateState]
  );

  // Add bioware
  const addBioware = useCallback(
    (item: BiowareCatalogItemData, grade: string, rating?: number) => {
      const essenceCost = calculateBiowareEssenceCost(
        item.essenceCost,
        grade,
        biowareGrades,
        rating,
        item.essencePerRating
      );
      const cost = calculateBiowareCost(
        item.cost,
        grade,
        biowareGrades,
        rating,
        item.costPerRating
      );
      const availability = calculateBiowareAvailability(item.availability, grade, biowareGrades);

      let itemBonuses: Record<string, number> | undefined;
      if (item.attributeBonuses || item.attributeBonusesPerRating) {
        itemBonuses = {};
        if (item.attributeBonuses) {
          for (const [attr, bonus] of Object.entries(item.attributeBonuses)) {
            itemBonuses[attr] = bonus;
          }
        }
        if (item.attributeBonusesPerRating && rating) {
          for (const [attr, bonus] of Object.entries(item.attributeBonusesPerRating)) {
            itemBonuses[attr] = (itemBonuses[attr] || 0) + bonus * rating;
          }
        }
      }

      const check = canAddAugmentation(cost, essenceCost, availability, itemBonuses, item.forbidden);
      if (!check.allowed) return;

      const newItem: BiowareItem = {
        id: crypto.randomUUID(),
        catalogId: item.id,
        name: item.name,
        category: item.category as BiowareItem["category"],
        grade: grade as BiowareItem["grade"],
        baseEssenceCost: item.essenceCost,
        essenceCost,
        rating,
        cost,
        availability,
        restricted: item.restricted,
        forbidden: item.forbidden,
        attributeBonuses: itemBonuses,
      };

      updateState({
        selections: {
          ...state.selections,
          bioware: [...selectedBioware, newItem],
        },
      });
    },
    [biowareGrades, canAddAugmentation, selectedBioware, state.selections, updateState]
  );

  // Remove cyberware
  const removeCyberware = (index: number) => {
    const updatedCyberware = selectedCyberware.filter((_, i) => i !== index);
    updateState({
      selections: {
        ...state.selections,
        cyberware: updatedCyberware,
      },
    });
  };

  // Remove bioware
  const removeBioware = (index: number) => {
    const updatedBioware = selectedBioware.filter((_, i) => i !== index);
    updateState({
      selections: {
        ...state.selections,
        bioware: updatedBioware,
      },
    });
  };

  // Get available enhancements for a specific cyberware item
  const getAvailableEnhancements = useCallback(
    (parentItem: CyberwareItem) => {
      if (!cyberwareCatalog) return [];

      // Filter enhancements based on parent item category
      return cyberwareCatalog.catalog.filter((item) => {
        // Must have capacity cost (indicating it's an enhancement)
        // Note: capacityCost of 0 is valid (e.g., Image Link)
        if (item.capacityCost === undefined) return false;

        // For cyberlimbs, look for items with parentType: "cyberlimb"
        if (parentItem.category === "cyberlimb" || parentItem.category.startsWith("cyberlimb")) {
          return item.parentType === "cyberlimb";
        }

        // For eyeware, match items in eyeware category that have capacityCost but no capacity (they're mods, not base items)
        if (parentItem.category === "eyeware") {
          return item.category === "eyeware" && item.capacityCost !== undefined && !item.capacity;
        }

        // For earware, match items in earware category that have capacityCost but no capacity
        if (parentItem.category === "earware") {
          return item.category === "earware" && item.capacityCost !== undefined && !item.capacity;
        }

        return false;
      });
    },
    [cyberwareCatalog]
  );

  // Add enhancement to cyberware
  const addCyberwareEnhancement = useCallback(
    (parentIndex: number, enhancement: CyberwareCatalogItemData, rating?: number) => {
      const parent = selectedCyberware[parentIndex];
      if (!parent || !parent.capacity) return;

      // Calculate capacity cost
      const capacityCost = enhancement.capacityPerRating && rating
        ? enhancement.capacityCost! * rating
        : enhancement.capacityCost || 0;

      // Check if there's enough capacity
      const currentUsed = parent.capacityUsed || 0;
      if (currentUsed + capacityCost > parent.capacity) return;

      // Calculate cost
      const enhancementCost = enhancement.costPerRating && rating
        ? enhancement.cost * rating
        : enhancement.cost;

      // Check if we can afford it
      if (enhancementCost > remaining) return;

      // Calculate availability with grade modifier
      const availability = calculateCyberwareAvailability(
        enhancement.availability,
        parent.grade,
        cyberwareGrades
      );

      // Check availability
      if (availability > augmentationRules.maxAvailabilityAtCreation) return;

      // Create the enhancement item
      const enhancementItem: CyberwareItem = {
        id: crypto.randomUUID(),
        catalogId: enhancement.id,
        name: enhancement.name + (rating ? ` R${rating}` : ""),
        category: enhancement.category as CyberwareItem["category"],
        grade: parent.grade, // Inherit parent grade
        baseEssenceCost: 0,
        essenceCost: 0, // Enhancements don't cost essence
        rating,
        cost: enhancementCost,
        availability,
        restricted: enhancement.restricted,
        forbidden: enhancement.forbidden,
        attributeBonuses: enhancement.attributeBonusesPerRating && rating
          ? Object.fromEntries(
            Object.entries(enhancement.attributeBonusesPerRating).map(([attr, bonus]) => [
              attr,
              bonus * rating,
            ])
          )
          : enhancement.attributeBonuses,
      };

      // Update the parent with the new enhancement
      const updatedCyberware = selectedCyberware.map((item, i) => {
        if (i !== parentIndex) return item;
        return {
          ...item,
          capacityUsed: currentUsed + capacityCost,
          cost: item.cost + enhancementCost,
          enhancements: [...(item.enhancements || []), enhancementItem],
          // Merge attribute bonuses
          attributeBonuses: {
            ...(item.attributeBonuses || {}),
            ...(enhancementItem.attributeBonuses
              ? Object.fromEntries(
                Object.entries(enhancementItem.attributeBonuses).map(([attr, bonus]) => [
                  attr,
                  (item.attributeBonuses?.[attr] || 0) + bonus,
                ])
              )
              : {}),
          },
        };
      });

      updateState({
        selections: {
          ...state.selections,
          cyberware: updatedCyberware,
        },
      });
    },
    [selectedCyberware, remaining, cyberwareGrades, augmentationRules.maxAvailabilityAtCreation, state.selections, updateState]
  );

  // Remove enhancement from cyberware
  const removeCyberwareEnhancement = useCallback(
    (parentIndex: number, enhancementIndex: number) => {
      const parent = selectedCyberware[parentIndex];
      if (!parent || !parent.enhancements) return;

      const enhancement = parent.enhancements[enhancementIndex];
      if (!enhancement) return;

      // Calculate capacity to restore
      const catalogItem = cyberwareCatalog?.catalog.find((c) => c.id === enhancement.catalogId);
      const capacityCost = catalogItem?.capacityPerRating && enhancement.rating
        ? (catalogItem.capacityCost || 0) * enhancement.rating
        : catalogItem?.capacityCost || 0;

      // Update parent
      const updatedCyberware = selectedCyberware.map((item, i) => {
        if (i !== parentIndex) return item;

        // Remove attribute bonuses from enhancement
        const newBonuses = { ...(item.attributeBonuses || {}) };
        if (enhancement.attributeBonuses) {
          for (const [attr, bonus] of Object.entries(enhancement.attributeBonuses)) {
            newBonuses[attr] = (newBonuses[attr] || 0) - bonus;
            if (newBonuses[attr] <= 0) delete newBonuses[attr];
          }
        }

        return {
          ...item,
          capacityUsed: Math.max(0, (item.capacityUsed || 0) - capacityCost),
          cost: item.cost - enhancement.cost,
          enhancements: item.enhancements?.filter((_, ei) => ei !== enhancementIndex),
          attributeBonuses: Object.keys(newBonuses).length > 0 ? newBonuses : undefined,
        };
      });

      updateState({
        selections: {
          ...state.selections,
          cyberware: updatedCyberware,
        },
      });
    },
    [selectedCyberware, cyberwareCatalog, state.selections, updateState]
  );

  // State for enhancement modal
  const [enhancementModalOpen, setEnhancementModalOpen] = useState(false);
  const [enhancingCyberwareIndex, setEnhancingCyberwareIndex] = useState<number | null>(null);

  // Helper to add focus
  const addFocus = (focusCatalogItem: FocusCatalogItemData, force: number, bonded: boolean) => {
    const cost = force * focusCatalogItem.costMultiplier;
    const karmaToBond = bonded ? force * focusCatalogItem.bondingKarmaMultiplier : 0;
    const availability = force * 4; // Availability is Force × 4R for foci

    const newFocus: FocusItem = {
      catalogId: focusCatalogItem.id,
      name: `${focusCatalogItem.name} (Force ${force})`,
      type: focusCatalogItem.type as FocusType,
      force,
      bonded,
      karmaToBond,
      cost,
      availability,
      restricted: focusCatalogItem.restricted,
    };

    const updatedFoci = [...selectedFoci, newFocus];

    // Update karma budget for bonding
    const newFociBondingKarma = updatedFoci.reduce((sum, f) => sum + (f.bonded ? f.karmaToBond : 0), 0);

    updateState({
      selections: {
        ...state.selections,
        foci: updatedFoci,
      },
      budgets: {
        ...state.budgets,
        "karma-spent-foci-bonding": newFociBondingKarma,
      },
    });
  };

  // Helper to remove focus
  const removeFocus = (index: number) => {
    const updatedFoci = selectedFoci.filter((_, i) => i !== index);
    const newFociBondingKarma = updatedFoci.reduce((sum, f) => sum + (f.bonded ? f.karmaToBond : 0), 0);

    updateState({
      selections: {
        ...state.selections,
        foci: updatedFoci,
      },
      budgets: {
        ...state.budgets,
        "karma-spent-foci-bonding": newFociBondingKarma,
      },
    });
  };

  // Handle karma conversion
  const handleKarmaConversion = (value: number) => {
    const maxAllowed = Math.min(MAX_KARMA_CONVERSION, karmaAvailableForConversion);
    const clampedValue = Math.max(0, Math.min(value, maxAllowed));
    updateState({
      budgets: {
        ...state.budgets,
        "karma-spent-gear": clampedValue,
      },
    });
  };

  // Flatten gear catalog for searching
  const allGearItems = useMemo(() => {
    if (!gearCatalog) return [];

    const items: (GearItemData | WeaponData | ArmorData)[] = [];

    // Add weapons
    if (gearCatalog.weapons) {
      Object.entries(gearCatalog.weapons).forEach(([subcategory, weapons]) => {
        (weapons as WeaponData[]).forEach((weapon) => {
          items.push({ ...weapon, category: "weapons", subcategory });
        });
      });
    }

    // Add armor
    if (gearCatalog.armor) {
      gearCatalog.armor.forEach((item) => {
        items.push({ ...item, category: "armor" });
      });
    }

    // Add commlinks
    if (gearCatalog.commlinks) {
      gearCatalog.commlinks.forEach((item) => {
        items.push({ ...item, category: "commlinks" });
      });
    }

    // Add cyberdecks
    if (gearCatalog.cyberdecks) {
      gearCatalog.cyberdecks.forEach((item) => {
        items.push({ ...item, category: "cyberdecks" });
      });
    }

    // Add electronics
    if (gearCatalog.electronics) {
      gearCatalog.electronics.forEach((item) => {
        items.push({ ...item, category: "electronics" });
      });
    }

    // Add tools
    if (gearCatalog.tools) {
      gearCatalog.tools.forEach((item) => {
        items.push({ ...item, category: "tools" });
      });
    }

    // Add survival
    if (gearCatalog.survival) {
      gearCatalog.survival.forEach((item) => {
        items.push({ ...item, category: "survival" });
      });
    }

    // Add medical
    if (gearCatalog.medical) {
      gearCatalog.medical.forEach((item) => {
        items.push({ ...item, category: "medical" });
      });
    }

    // Add security
    if (gearCatalog.security) {
      gearCatalog.security.forEach((item) => {
        items.push({ ...item, category: "security" });
      });
    }

    // Add miscellaneous
    if (gearCatalog.miscellaneous) {
      gearCatalog.miscellaneous.forEach((item) => {
        items.push({ ...item, category: "miscellaneous" });
      });
    }

    // Add ammunition
    if (gearCatalog.ammunition) {
      gearCatalog.ammunition.forEach((item) => {
        items.push({ ...item, category: "ammunition" });
      });
    }

    return items;
  }, [gearCatalog]);

  // Filter gear items
  const filteredGearItems = useMemo(() => {
    let items = allGearItems;

    // Filter by category
    if (selectedCategory !== "all") {
      items = items.filter((item) => item.category === selectedCategory);
    }

    // Filter weapons by subcategory
    if (selectedCategory === "weapons" && weaponSubcategory !== "all") {
      items = items.filter((item) => item.subcategory === weaponSubcategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query)
      );
    }

    // Filter by availability
    if (!showUnavailable) {
      items = items.filter(isItemAvailable);
    }

    // Sort by name
    items.sort((a, b) => a.name.localeCompare(b.name));

    return items;
  }, [allGearItems, selectedCategory, weaponSubcategory, searchQuery, showUnavailable]);

  // Filter cyberware catalog
  const filteredCyberware = useMemo(() => {
    if (!cyberwareCatalog) return [];

    let items = [...cyberwareCatalog.catalog];

    // Filter by category
    if (cyberwareCategory !== "all") {
      items = items.filter((item) => item.category === cyberwareCategory);
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query)
      );
    }

    // Filter by availability
    if (!showUnavailable) {
      items = items.filter((item) => {
        const grade = getItemGrade(item.id);
        const adjustedAvail = calculateCyberwareAvailability(
          item.availability,
          grade,
          cyberwareGrades
        );
        return (
          adjustedAvail <= augmentationRules.maxAvailabilityAtCreation &&
          !item.forbidden
        );
      });
    }

    // Sort by name
    items.sort((a, b) => a.name.localeCompare(b.name));

    return items;
  }, [
    cyberwareCatalog,
    cyberwareCategory,
    searchQuery,
    showUnavailable,
    getItemGrade,
    cyberwareGrades,
    augmentationRules.maxAvailabilityAtCreation,
  ]);

  // Filter bioware catalog
  const filteredBioware = useMemo(() => {
    if (!biowareCatalog) return [];

    let items = [...biowareCatalog.catalog];

    // Filter by category
    if (biowareCategory !== "all") {
      items = items.filter((item) => item.category === biowareCategory);
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query)
      );
    }

    // Filter by availability
    if (!showUnavailable) {
      items = items.filter((item) => {
        const grade = getItemGrade(item.id);
        const adjustedAvail = calculateBiowareAvailability(
          item.availability,
          grade,
          biowareGrades
        );
        return (
          adjustedAvail <= augmentationRules.maxAvailabilityAtCreation &&
          !item.forbidden
        );
      });
    }

    // Sort by name
    items.sort((a, b) => a.name.localeCompare(b.name));

    return items;
  }, [
    biowareCatalog,
    biowareCategory,
    searchQuery,
    showUnavailable,
    getItemGrade,
    biowareGrades,
    augmentationRules.maxAvailabilityAtCreation,
  ]);

  if (!gearCatalog) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
        <p className="text-amber-800 dark:text-amber-200">Loading gear catalog...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Budget Summary */}
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Base Nuyen</p>
            <p className="text-lg font-semibold">¥{formatCurrency(baseNuyen)}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Converted</p>
            <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
              +¥{formatCurrency(convertedNuyen)}
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Spent</p>
            <p className="text-lg font-semibold text-red-600 dark:text-red-400">
              ¥{formatCurrency(totalSpent)}
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Remaining</p>
            <p
              className={`text-lg font-semibold ${remaining < 0
                ? "text-red-600 dark:text-red-400"
                : remaining > MAX_NUYEN_CARRYOVER
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-emerald-600 dark:text-emerald-400"
                }`}
            >
              ¥{formatCurrency(remaining)}
            </p>
          </div>
        </div>
        {remaining > MAX_NUYEN_CARRYOVER && (
          <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
            Warning: Maximum ¥{formatCurrency(MAX_NUYEN_CARRYOVER)} can be carried over after
            creation.
          </p>
        )}
      </div>

      {/* Karma to Nuyen Conversion */}
      <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
        <h3 className="mb-2 text-sm font-medium">Karma to Nuyen Conversion</h3>
        <p className="mb-3 text-xs text-zinc-500 dark:text-zinc-400">
          Convert up to {MAX_KARMA_CONVERSION} Karma to Nuyen at {formatCurrency(KARMA_TO_NUYEN_RATE)}{" "}
          nuyen per Karma. Available Karma: {karmaAvailableForConversion}
        </p>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="0"
            max={Math.min(MAX_KARMA_CONVERSION, karmaAvailableForConversion)}
            value={karmaConversion}
            onChange={(e) => handleKarmaConversion(parseInt(e.target.value))}
            className="flex-1"
          />
          <span className="w-20 text-sm">
            {karmaConversion} Karma = ¥{formatCurrency(convertedNuyen)}
          </span>
        </div>
      </div>


      {/* Gear Catalog */}
      <div className="space-y-4">
        {/* Search and Filters */}
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Search gear..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 min-w-48 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800"
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showUnavailable}
              onChange={(e) => setShowUnavailable(e.target.checked)}
              className="rounded"
            />
            Show unavailable
          </label>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-1 border-b border-zinc-200 dark:border-zinc-700">
          {[
            { id: "all", label: "All" },
            { id: "weapons", label: "Weapons" },
            { id: "armor", label: "Armor" },
            { id: "augmentations", label: "Augmentations" },
            { id: "commlinks", label: "Commlinks" },
            { id: "cyberdecks", label: "Cyberdecks" },
            { id: "electronics", label: "Electronics" },
            { id: "tools", label: "Tools" },
            { id: "survival", label: "Survival" },
            { id: "medical", label: "Medical" },
            { id: "miscellaneous", label: "Misc" },
            { id: "ammunition", label: "Ammo" },
            ...(isMagical ? [{ id: "foci", label: "Foci" }] : []),
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id as GearCategory);
                if (cat.id !== "weapons") setWeaponSubcategory("all");
                if (cat.id !== "augmentations") {
                  setCyberwareCategory("all");
                  setBiowareCategory("all");
                }
              }}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${selectedCategory === cat.id
                ? "border-b-2 border-emerald-500 text-emerald-600 dark:text-emerald-400"
                : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
                }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Weapon Subcategory Tabs */}
        {selectedCategory === "weapons" && (
          <div className="flex flex-wrap gap-1">
            {[
              { id: "all", label: "All" },
              { id: "melee", label: "Melee" },
              { id: "pistols", label: "Pistols" },
              { id: "smgs", label: "SMGs" },
              { id: "rifles", label: "Rifles" },
              { id: "shotguns", label: "Shotguns" },
              { id: "sniperRifles", label: "Sniper" },
              { id: "throwingWeapons", label: "Throwing" },
              { id: "grenades", label: "Grenades" },
            ].map((sub) => (
              <button
                key={sub.id}
                onClick={() => setWeaponSubcategory(sub.id as WeaponSubcategory)}
                className={`rounded-full px-2 py-1 text-xs transition-colors ${weaponSubcategory === sub.id
                  ? "bg-zinc-200 text-zinc-800 dark:bg-zinc-600 dark:text-zinc-100"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-400"
                  }`}
              >
                {sub.label}
              </button>
            ))}
          </div>
        )}

        {/* Augmentations Section */}
        {selectedCategory === "augmentations" && (
          <div className="space-y-4">
            {/* Essence Summary */}
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800/50">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Essence</p>
                  <p
                    className={`text-lg font-semibold ${remainingEssence < 1
                      ? "text-red-600 dark:text-red-400"
                      : remainingEssence < 3
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-emerald-600 dark:text-emerald-400"
                      }`}
                  >
                    {formatEssence(remainingEssence)} / {maxEssence}
                  </p>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                    <div
                      className={`h-full transition-all ${remainingEssence < 1
                        ? "bg-red-500"
                        : remainingEssence < 3
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                        }`}
                      style={{ width: `${(remainingEssence / maxEssence) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Aug. Cost</p>
                  <p className="text-lg font-semibold text-zinc-700 dark:text-zinc-300">
                    ¥{formatCurrency(augmentationSpent)}
                  </p>
                </div>
                {hasSpecialAttribute && (
                  <div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {isTechnomancer ? "Resonance" : "Magic"} Loss
                    </p>
                    <p
                      className={`text-lg font-semibold ${magicLoss > 0 ? "text-red-600 dark:text-red-400" : "text-zinc-700 dark:text-zinc-300"
                        }`}
                    >
                      -{magicLoss}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Attribute Bonuses */}
            {Object.keys(attributeBonuses).length > 0 && (
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-2 dark:border-blue-800 dark:bg-blue-900/20">
                <p className="text-xs font-medium text-blue-800 dark:text-blue-200">
                  Attribute Bonuses:
                </p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {Object.entries(attributeBonuses).map(([attr, bonus]) => (
                    <span
                      key={attr}
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${bonus >= augmentationRules.maxAttributeBonus
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200"
                        }`}
                    >
                      +{bonus} {attr.charAt(0).toUpperCase() + attr.slice(1)}
                      {bonus >= augmentationRules.maxAttributeBonus && " (max)"}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Cyberware/Bioware Tabs */}
            <div className="flex gap-2 border-b border-zinc-200 dark:border-zinc-700">
              <button
                onClick={() => setAugmentationSubcategory("cyberware")}
                className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${augmentationSubcategory === "cyberware"
                  ? "border-cyan-500 text-cyan-600 dark:text-cyan-400"
                  : "border-transparent text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                  }`}
              >
                Cyberware ({filteredCyberware.length})
                {selectedCyberware.length > 0 && (
                  <span className="ml-2 rounded-full bg-cyan-100 px-2 py-0.5 text-xs text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300">
                    {selectedCyberware.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setAugmentationSubcategory("bioware")}
                className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${augmentationSubcategory === "bioware"
                  ? "border-green-500 text-green-600 dark:text-green-400"
                  : "border-transparent text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                  }`}
              >
                Bioware ({filteredBioware.length})
                {selectedBioware.length > 0 && (
                  <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700 dark:bg-green-900/50 dark:text-green-300">
                    {selectedBioware.length}
                  </span>
                )}
              </button>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-1">
              {augmentationSubcategory === "cyberware"
                ? CYBERWARE_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCyberwareCategory(cat.id)}
                    className={`rounded-full px-2 py-1 text-xs transition-colors ${cyberwareCategory === cat.id
                      ? "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-100"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-400"
                      }`}
                  >
                    {cat.label}
                  </button>
                ))
                : BIOWARE_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setBiowareCategory(cat.id)}
                    className={`rounded-full px-2 py-1 text-xs transition-colors ${biowareCategory === cat.id
                      ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-100"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-400"
                      }`}
                  >
                    {cat.label}
                  </button>
                ))}
            </div>

            {/* Augmentation Table */}
            <div className="max-h-96 overflow-y-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-zinc-100 dark:bg-zinc-800">
                  <tr>
                    <th className="px-3 py-2 text-left">Item</th>
                    <th className="px-3 py-2 text-center">Essence</th>
                    <th className="px-3 py-2 text-right">Cost</th>
                    <th className="px-3 py-2 text-center">Avail</th>
                    <th className="px-3 py-2 text-center w-24">Grade</th>
                    <th className="px-3 py-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-700">
                  {augmentationSubcategory === "cyberware"
                    ? filteredCyberware.map((item) => {
                      const grade = getItemGrade(item.id);
                      const essenceCost = calculateCyberwareEssenceCost(
                        item.essenceCost,
                        grade,
                        cyberwareGrades,
                        item.hasRating ? 1 : undefined,
                        item.essencePerRating
                      );
                      const cost = calculateCyberwareCost(
                        item.cost,
                        grade,
                        cyberwareGrades,
                        item.hasRating ? 1 : undefined,
                        item.costPerRating
                      );
                      const availability = calculateCyberwareAvailability(item.availability, grade, cyberwareGrades);
                      const check = canAddAugmentation(cost, essenceCost, availability, item.attributeBonuses, item.forbidden);

                      return (
                        <tr
                          key={item.id}
                          className={`${!check.allowed ? "opacity-50" : ""} hover:bg-zinc-50 dark:hover:bg-zinc-800/50`}
                        >
                          <td className="px-3 py-2">
                            <p className="font-medium">{item.name}</p>
                            {item.description && (
                              <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate max-w-xs">
                                {item.description}
                              </p>
                            )}
                            {item.attributeBonuses && (
                              <p className="text-xs text-emerald-600 dark:text-emerald-400">
                                {Object.entries(item.attributeBonuses)
                                  .map(([attr, bonus]) => `+${bonus} ${attr.toUpperCase()}`)
                                  .join(", ")}
                              </p>
                            )}
                            {item.capacity && item.capacity > 0 && (
                              <p className="text-xs text-blue-600 dark:text-blue-400">
                                Capacity: {item.capacity}
                              </p>
                            )}
                          </td>
                          <td className="px-3 py-2 text-center">
                            <span className="text-amber-600 dark:text-amber-400">{formatEssence(essenceCost)}</span>
                          </td>
                          <td className="px-3 py-2 text-right">¥{formatCurrency(cost)}</td>
                          <td className="px-3 py-2 text-center">
                            <span className={item.restricted ? "text-amber-600 dark:text-amber-400" : item.forbidden ? "text-red-600 dark:text-red-400" : ""}>
                              {getAugmentationAvailabilityDisplay(availability, item.restricted, item.forbidden)}
                            </span>
                          </td>
                          <td className="px-3 py-2">
                            <select
                              value={grade}
                              onChange={(e) => setSelectedGrades((prev) => ({ ...prev, [item.id]: e.target.value }))}
                              className="w-full rounded border border-zinc-300 bg-white px-2 py-1 text-xs dark:border-zinc-600 dark:bg-zinc-800"
                            >
                              {cyberwareGrades.map((g) => (
                                <option key={g.id} value={g.id}>{g.name}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-3 py-2 text-center">
                            <button
                              onClick={() => addCyberware(item, grade, item.hasRating ? 1 : undefined)}
                              disabled={!check.allowed}
                              title={check.reason}
                              className={`rounded px-2 py-1 text-xs font-medium transition-colors ${check.allowed
                                ? "bg-emerald-500 text-white hover:bg-emerald-600"
                                : "cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-700"
                                }`}
                            >
                              Add
                            </button>
                          </td>
                        </tr>
                      );
                    })
                    : filteredBioware.map((item) => {
                      const grade = getItemGrade(item.id);
                      const essenceCost = calculateBiowareEssenceCost(
                        item.essenceCost,
                        grade,
                        biowareGrades,
                        item.hasRating ? 1 : undefined,
                        item.essencePerRating
                      );
                      const cost = calculateBiowareCost(
                        item.cost,
                        grade,
                        biowareGrades,
                        item.hasRating ? 1 : undefined,
                        item.costPerRating
                      );
                      const availability = calculateBiowareAvailability(item.availability, grade, biowareGrades);
                      const check = canAddAugmentation(cost, essenceCost, availability, item.attributeBonuses, item.forbidden);

                      return (
                        <tr
                          key={item.id}
                          className={`${!check.allowed ? "opacity-50" : ""} hover:bg-zinc-50 dark:hover:bg-zinc-800/50`}
                        >
                          <td className="px-3 py-2">
                            <p className="font-medium">{item.name}</p>
                            {item.description && (
                              <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate max-w-xs">
                                {item.description}
                              </p>
                            )}
                            {item.attributeBonuses && (
                              <p className="text-xs text-emerald-600 dark:text-emerald-400">
                                {Object.entries(item.attributeBonuses)
                                  .map(([attr, bonus]) => `+${bonus} ${attr.toUpperCase()}`)
                                  .join(", ")}
                              </p>
                            )}
                          </td>
                          <td className="px-3 py-2 text-center">
                            <span className="text-amber-600 dark:text-amber-400">{formatEssence(essenceCost)}</span>
                          </td>
                          <td className="px-3 py-2 text-right">¥{formatCurrency(cost)}</td>
                          <td className="px-3 py-2 text-center">
                            <span className={item.restricted ? "text-amber-600 dark:text-amber-400" : item.forbidden ? "text-red-600 dark:text-red-400" : ""}>
                              {getAugmentationAvailabilityDisplay(availability, item.restricted, item.forbidden)}
                            </span>
                          </td>
                          <td className="px-3 py-2">
                            <select
                              value={grade}
                              onChange={(e) => setSelectedGrades((prev) => ({ ...prev, [item.id]: e.target.value }))}
                              className="w-full rounded border border-zinc-300 bg-white px-2 py-1 text-xs dark:border-zinc-600 dark:bg-zinc-800"
                            >
                              {biowareGrades.map((g) => (
                                <option key={g.id} value={g.id}>{g.name}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-3 py-2 text-center">
                            <button
                              onClick={() => addBioware(item, grade, item.hasRating ? 1 : undefined)}
                              disabled={!check.allowed}
                              title={check.reason}
                              className={`rounded px-2 py-1 text-xs font-medium transition-colors ${check.allowed
                                ? "bg-emerald-500 text-white hover:bg-emerald-600"
                                : "cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-700"
                                }`}
                            >
                              Add
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  {((augmentationSubcategory === "cyberware" && filteredCyberware.length === 0) ||
                    (augmentationSubcategory === "bioware" && filteredBioware.length === 0)) && (
                      <tr>
                        <td colSpan={6} className="px-3 py-8 text-center text-zinc-500">
                          No items found matching your criteria.
                        </td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>

            {/* Selected Augmentations */}
            {(selectedCyberware.length > 0 || selectedBioware.length > 0) && (
              <div className="space-y-3">
                {selectedCyberware.length > 0 && (
                  <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800/50">
                    <h4 className="text-sm font-semibold text-cyan-700 dark:text-cyan-300">Cyberware</h4>
                    <div className="mt-2 space-y-2">
                      {selectedCyberware.map((item, index) => (
                        <div key={item.id || index} className="rounded border border-zinc-200 bg-white p-2 dark:border-zinc-600 dark:bg-zinc-800">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex-1">
                              <span className="font-medium">{item.name}</span>
                              <span className="ml-2 text-zinc-500 dark:text-zinc-400">
                                ({item.grade}) | ESS: {formatEssence(item.essenceCost)} | ¥{formatCurrency(item.cost)}
                              </span>
                              {/* Capacity indicator */}
                              {item.capacity && item.capacity > 0 && (
                                <span className="ml-2 text-blue-600 dark:text-blue-400">
                                  Cap: {item.capacityUsed || 0}/{item.capacity}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              {/* Add mod button for items with capacity */}
                              {item.capacity && item.capacity > 0 && (item.capacityUsed || 0) < item.capacity && (
                                <button
                                  onClick={() => {
                                    setEnhancingCyberwareIndex(index);
                                    setEnhancementModalOpen(true);
                                  }}
                                  className="rounded bg-blue-500 px-2 py-0.5 text-xs text-white hover:bg-blue-600"
                                >
                                  +Mod
                                </button>
                              )}
                              <button
                                onClick={() => removeCyberware(index)}
                                className="text-red-500 hover:text-red-600"
                              >
                                ×
                              </button>
                            </div>
                          </div>
                          {/* Show installed enhancements */}
                          {item.enhancements && item.enhancements.length > 0 && (
                            <div className="mt-1 ml-3 space-y-0.5">
                              {item.enhancements.map((enh, enhIndex) => (
                                <div key={enh.id || enhIndex} className="flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400">
                                  <span>
                                    └ {enh.name} (¥{formatCurrency(enh.cost)})
                                    {enh.attributeBonuses && (
                                      <span className="ml-1 text-emerald-600 dark:text-emerald-400">
                                        {Object.entries(enh.attributeBonuses)
                                          .map(([attr, bonus]) => `+${bonus} ${attr.toUpperCase()}`)
                                          .join(", ")}
                                      </span>
                                    )}
                                  </span>
                                  <button
                                    onClick={() => removeCyberwareEnhancement(index, enhIndex)}
                                    className="text-red-400 hover:text-red-500"
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {selectedBioware.length > 0 && (
                  <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800/50">
                    <h4 className="text-sm font-semibold text-green-700 dark:text-green-300">Bioware</h4>
                    <div className="mt-2 space-y-1">
                      {selectedBioware.map((item, index) => (
                        <div key={item.id || index} className="flex items-center justify-between text-xs">
                          <div className="flex-1">
                            <span className="font-medium">{item.name}</span>
                            <span className="ml-2 text-zinc-500 dark:text-zinc-400">
                              ({item.grade}) | ESS: {formatEssence(item.essenceCost)} | ¥{formatCurrency(item.cost)}
                            </span>
                          </div>
                          <button
                            onClick={() => removeBioware(index)}
                            className="text-red-500 hover:text-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Cyberware Enhancement Modal */}
            {enhancementModalOpen && enhancingCyberwareIndex !== null && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="max-h-[80vh] w-full max-w-lg overflow-hidden rounded-lg bg-white shadow-xl dark:bg-zinc-900">
                  <div className="flex items-center justify-between border-b border-zinc-200 p-4 dark:border-zinc-700">
                    <div>
                      <h3 className="text-lg font-semibold">Add Enhancement</h3>
                      <p className="text-sm text-zinc-500">
                        {selectedCyberware[enhancingCyberwareIndex]?.name} - Capacity:{" "}
                        {selectedCyberware[enhancingCyberwareIndex]?.capacityUsed || 0}/
                        {selectedCyberware[enhancingCyberwareIndex]?.capacity}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setEnhancementModalOpen(false);
                        setEnhancingCyberwareIndex(null);
                      }}
                      className="text-zinc-500 hover:text-zinc-700"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="max-h-96 overflow-y-auto p-4">
                    <table className="w-full text-sm">
                      <thead className="sticky top-0 bg-zinc-100 dark:bg-zinc-800">
                        <tr>
                          <th className="px-2 py-1 text-left">Enhancement</th>
                          <th className="px-2 py-1 text-center">Cap</th>
                          <th className="px-2 py-1 text-right">Cost</th>
                          <th className="px-2 py-1 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 dark:divide-zinc-700">
                        {getAvailableEnhancements(selectedCyberware[enhancingCyberwareIndex]).map((enh) => {
                          const parent = selectedCyberware[enhancingCyberwareIndex];
                          const remainingCapacity = (parent.capacity || 0) - (parent.capacityUsed || 0);

                          // For rated enhancements, show multiple rows
                          if (enh.hasRating && enh.maxRating) {
                            return Array.from({ length: enh.maxRating }, (_, i) => i + 1).map((rating) => {
                              const capacityCost = enh.capacityPerRating ? (enh.capacityCost || 0) * rating : enh.capacityCost || 0;
                              const cost = enh.costPerRating ? enh.cost * rating : enh.cost;
                              const canAdd = capacityCost <= remainingCapacity && cost <= remaining;

                              return (
                                <tr key={`${enh.id}-${rating}`} className={!canAdd ? "opacity-50" : ""}>
                                  <td className="px-2 py-1">
                                    <span className="font-medium">{enh.name}</span>
                                    <span className="ml-1 text-zinc-500">R{rating}</span>
                                    {enh.attributeBonusesPerRating && (
                                      <span className="ml-1 text-xs text-emerald-600 dark:text-emerald-400">
                                        {Object.entries(enh.attributeBonusesPerRating)
                                          .map(([attr, bonus]) => `+${bonus * rating} ${attr.toUpperCase()}`)
                                          .join(", ")}
                                      </span>
                                    )}
                                  </td>
                                  <td className="px-2 py-1 text-center">{capacityCost}</td>
                                  <td className="px-2 py-1 text-right">¥{formatCurrency(cost)}</td>
                                  <td className="px-2 py-1 text-center">
                                    <button
                                      onClick={() => {
                                        addCyberwareEnhancement(enhancingCyberwareIndex, enh, rating);
                                        setEnhancementModalOpen(false);
                                        setEnhancingCyberwareIndex(null);
                                      }}
                                      disabled={!canAdd}
                                      className={`rounded px-2 py-0.5 text-xs font-medium ${canAdd
                                        ? "bg-emerald-500 text-white hover:bg-emerald-600"
                                        : "cursor-not-allowed bg-zinc-200 text-zinc-400"
                                        }`}
                                    >
                                      Add
                                    </button>
                                  </td>
                                </tr>
                              );
                            });
                          }

                          // Non-rated enhancement
                          const capacityCost = enh.capacityCost || 0;
                          const canAdd = capacityCost <= remainingCapacity && enh.cost <= remaining;

                          return (
                            <tr key={enh.id} className={!canAdd ? "opacity-50" : ""}>
                              <td className="px-2 py-1">
                                <span className="font-medium">{enh.name}</span>
                                {enh.description && (
                                  <p className="text-xs text-zinc-500 truncate max-w-xs">{enh.description}</p>
                                )}
                              </td>
                              <td className="px-2 py-1 text-center">{capacityCost}</td>
                              <td className="px-2 py-1 text-right">¥{formatCurrency(enh.cost)}</td>
                              <td className="px-2 py-1 text-center">
                                <button
                                  onClick={() => {
                                    addCyberwareEnhancement(enhancingCyberwareIndex, enh);
                                    setEnhancementModalOpen(false);
                                    setEnhancingCyberwareIndex(null);
                                  }}
                                  disabled={!canAdd}
                                  className={`rounded px-2 py-0.5 text-xs font-medium ${canAdd
                                    ? "bg-emerald-500 text-white hover:bg-emerald-600"
                                    : "cursor-not-allowed bg-zinc-200 text-zinc-400"
                                    }`}
                                >
                                  Add
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                        {getAvailableEnhancements(selectedCyberware[enhancingCyberwareIndex]).length === 0 && (
                          <tr>
                            <td colSpan={4} className="px-2 py-4 text-center text-zinc-500">
                              No enhancements available for this item.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Foci Selection */}
        {selectedCategory === "foci" && (
          <div className="space-y-4">
            {/* Selected Foci */}
            {selectedFoci.length > 0 && (
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
                <h3 className="mb-2 text-sm font-semibold">Selected Foci</h3>
                <div className="space-y-2">
                  {selectedFoci.map((focus, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded border border-zinc-200 bg-white p-2 dark:border-zinc-600 dark:bg-zinc-800"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium">{focus.name}</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          ¥{formatCurrency(focus.cost)}
                          {focus.bonded && ` | Bonded (${focus.karmaToBond} Karma)`}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFocus(index)}
                        className="rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Foci Catalog */}
            <div className="max-h-96 overflow-y-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-zinc-100 dark:bg-zinc-800">
                  <tr>
                    <th className="px-3 py-2 text-left">Focus</th>
                    <th className="px-3 py-2 text-center">Force</th>
                    <th className="px-3 py-2 text-center">Bond</th>
                    <th className="px-3 py-2 text-right">Cost</th>
                    <th className="px-3 py-2 text-center">Karma</th>
                    <th className="px-3 py-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-700">
                  {fociCatalog.map((focus) => {
                    return [1, 2, 3, 4, 5, 6].map((force) => {
                      const cost = force * focus.costMultiplier;
                      const bondingKarma = force * focus.bondingKarmaMultiplier;
                      const canAfford = cost <= remaining;

                      return (
                        <tr
                          key={`${focus.id}-${force}`}
                          className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                        >
                          <td className="px-3 py-2">
                            <p className="font-medium">{focus.name}</p>
                            {focus.description && (
                              <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate max-w-xs">
                                {focus.description}
                              </p>
                            )}
                          </td>
                          <td className="px-3 py-2 text-center">{force}</td>
                          <td className="px-3 py-2 text-center">
                            <label className="flex items-center justify-center">
                              <input
                                type="checkbox"
                                checked={false}
                                readOnly
                                className="rounded"
                              />
                            </label>
                          </td>
                          <td className="px-3 py-2 text-right">¥{formatCurrency(cost)}</td>
                          <td className="px-3 py-2 text-center text-xs text-zinc-500 dark:text-zinc-400">
                            {bondingKarma}
                          </td>
                          <td className="px-3 py-2 text-center">
                            <div className="flex gap-1">
                              <button
                                onClick={() => addFocus(focus, force, false)}
                                disabled={!canAfford}
                                className={`rounded px-2 py-1 text-xs font-medium transition-colors ${canAfford
                                  ? "bg-emerald-500 text-white hover:bg-emerald-600"
                                  : "cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-700"
                                  }`}
                              >
                                Add
                              </button>
                              <button
                                onClick={() => addFocus(focus, force, true)}
                                disabled={!canAfford}
                                className={`rounded px-2 py-1 text-xs font-medium transition-colors ${canAfford
                                  ? "bg-blue-500 text-white hover:bg-blue-600"
                                  : "cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-700"
                                  }`}
                                title={`Add and bond (costs ${bondingKarma} Karma)`}
                              >
                                +Bond
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    });
                  })}
                  {fociCatalog.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-3 py-8 text-center text-zinc-500">
                        No foci available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Item List */}
        {selectedCategory !== "foci" && selectedCategory !== "augmentations" && (
          <div className="max-h-96 overflow-y-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-zinc-100 dark:bg-zinc-800">
                <tr>
                  <th className="px-3 py-2 text-left">Item</th>
                  <th className="px-3 py-2 text-right">Cost</th>
                  <th className="px-3 py-2 text-center">Avail</th>
                  <th className="px-3 py-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-700">
                {filteredGearItems.map((item, index) => {
                  const available = isItemAvailable(item);
                  const canAfford = item.cost <= remaining;

                  return (
                    <tr
                      key={`${item.id}-${index}`}
                      className={`${!available ? "opacity-50" : ""} hover:bg-zinc-50 dark:hover:bg-zinc-800/50`}
                    >
                      <td className="px-3 py-2">
                        <p className="font-medium">{item.name}</p>
                        {item.description && (
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate max-w-xs">
                            {item.description}
                          </p>
                        )}
                        {(item as WeaponData).damage && (
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            DMG: {(item as WeaponData).damage} | AP: {(item as WeaponData).ap}
                          </p>
                        )}
                        {(item as ArmorData).armorRating && (
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            Armor: {(item as ArmorData).armorRating}
                          </p>
                        )}
                      </td>
                      <td className="px-3 py-2 text-right">¥{formatCurrency(item.cost)}</td>
                      <td className="px-3 py-2 text-center">
                        <span
                          className={`${item.restricted
                            ? "text-amber-600 dark:text-amber-400"
                            : item.forbidden
                              ? "text-red-600 dark:text-red-400"
                              : ""
                            }`}
                        >
                          {getAvailabilityDisplay(item)}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-center">
                        <button
                          onClick={() => addGearItem(item)}
                          disabled={!available || !canAfford}
                          className={`rounded px-2 py-1 text-xs font-medium transition-colors ${available && canAfford
                            ? "bg-emerald-500 text-white hover:bg-emerald-600"
                            : "cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-700"
                            }`}
                        >
                          Add
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filteredGearItems.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-3 py-8 text-center text-zinc-500">
                      No items found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Selected Gear Items */}
      {selectedGear.length > 0 && (
        <div className="space-y-4">
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
            <h3 className="mb-2 text-sm font-semibold">Gear</h3>
            <div className="space-y-3">
              {selectedGear.map((gear, gIndex) => {
                const catalogItem = gearCatalog?.categories
                  .flatMap((cat) => {
                    const catData = gearCatalog[cat.id as keyof typeof gearCatalog] as GearItemData[] | undefined;
                    return catData || [];
                  })
                  .find((g) => g.name === gear.name);
                const needsConfig = catalogItem ? needsRatingConfig(catalogItem) : false;
                return (
                  <div
                    key={gIndex}
                    className="rounded border border-zinc-200 bg-white p-3 dark:border-zinc-600 dark:bg-zinc-800"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium">{gear.name}</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          {gear.rating && `Rating: ${gear.rating} | `}
                          Base: ¥{formatCurrency(gear.cost)}
                          {gear.quantity > 1 && ` | Qty: ${gear.quantity}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">¥{formatCurrency(gear.cost * gear.quantity)}</span>
                        {needsConfig && (
                          <button
                            onClick={() => configureGearItem(gIndex)}
                            className="rounded bg-blue-500 px-2 py-1 text-xs font-medium text-white hover:bg-blue-600"
                          >
                            Config
                          </button>
                        )}
                        <button
                          onClick={() => {
                            const updatedGear = selectedGear.filter((_, i) => i !== gIndex);
                            updateState({
                              selections: {
                                ...state.selections,
                                gear: updatedGear,
                              },
                            });
                          }}
                          className="rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Selected Weapons & Armor with Modifications */}
      {(selectedWeapons.length > 0 || selectedArmor.length > 0) && (
        <div className="space-y-4">
          {/* Selected Weapons */}
          {selectedWeapons.length > 0 && (
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
              <h3 className="mb-2 text-sm font-semibold">Weapons</h3>
              <div className="space-y-3">
                {selectedWeapons.map((weapon, wIndex) => {
                  const weaponTotalCost = weapon.cost + (weapon.modifications || []).reduce((sum, mod) => sum + mod.cost, 0);
                  return (
                    <div
                      key={wIndex}
                      className="rounded border border-zinc-200 bg-white p-3 dark:border-zinc-600 dark:bg-zinc-800"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium">{weapon.name}</p>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            DMG: {weapon.damage} | AP: {weapon.ap} | Base: ¥{formatCurrency(weapon.cost)}
                          </p>
                          {weapon.occupiedMounts && weapon.occupiedMounts.length > 0 && (
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                              Mounts: {weapon.occupiedMounts.join(", ")}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">¥{formatCurrency(weaponTotalCost)}</span>
                          <button
                            onClick={() => openModificationModal(weapon, "weapon", wIndex)}
                            className="rounded bg-blue-500 px-2 py-1 text-xs font-medium text-white hover:bg-blue-600"
                          >
                            +Mod
                          </button>
                          <button
                            onClick={() => removeWeapon(wIndex)}
                            className="rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      {/* Installed mods */}
                      {weapon.modifications && weapon.modifications.length > 0 && (
                        <div className="mt-2 space-y-1 border-t border-zinc-200 pt-2 dark:border-zinc-600">
                          {weapon.modifications.map((mod, mIndex) => (
                            <div key={mIndex} className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2">
                                <span className="text-zinc-700 dark:text-zinc-300">{mod.name}</span>
                                {mod.mount && (
                                  <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400">
                                    {mod.mount}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-zinc-500 dark:text-zinc-400">¥{formatCurrency(mod.cost)}</span>
                                {!mod.isBuiltIn ? (
                                  <button
                                    onClick={() => removeWeaponMod(wIndex, mIndex)}
                                    className="text-red-500 hover:text-red-600"
                                  >
                                    ×
                                  </button>
                                ) : (
                                  <span className="text-[10px] font-bold uppercase text-blue-500 dark:text-blue-400">
                                    Built-in
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Selected Armor */}
          {selectedArmor.length > 0 && (
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
              <h3 className="mb-2 text-sm font-semibold">Armor</h3>
              <div className="space-y-3">
                {selectedArmor.map((armor, aIndex) => {
                  const armorTotalCost = armor.cost + (armor.modifications || []).reduce((sum, mod) => sum + mod.cost, 0);
                  return (
                    <div
                      key={aIndex}
                      className="rounded border border-zinc-200 bg-white p-3 dark:border-zinc-600 dark:bg-zinc-800"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium">{armor.name}</p>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            Armor: {armor.armorRating} | Capacity: {armor.capacityUsed || 0}/{armor.capacity || armor.armorRating} | Base: ¥{formatCurrency(armor.cost)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">¥{formatCurrency(armorTotalCost)}</span>
                          <button
                            onClick={() => openModificationModal(armor, "armor", aIndex)}
                            className="rounded bg-blue-500 px-2 py-1 text-xs font-medium text-white hover:bg-blue-600"
                          >
                            +Mod
                          </button>
                          <button
                            onClick={() => removeArmor(aIndex)}
                            className="rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      {/* Installed mods */}
                      {armor.modifications && armor.modifications.length > 0 && (
                        <div className="mt-2 space-y-1 border-t border-zinc-200 pt-2 dark:border-zinc-600">
                          {armor.modifications.map((mod, mIndex) => (
                            <div key={mIndex} className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2">
                                <span className="text-zinc-700 dark:text-zinc-300">{mod.name}</span>
                                <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] text-blue-600 dark:bg-blue-900/50 dark:text-blue-300">
                                  {mod.capacityUsed} cap
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-zinc-500 dark:text-zinc-400">¥{formatCurrency(mod.cost)}</span>
                                <button
                                  onClick={() => removeArmorMod(aIndex, mIndex)}
                                  className="text-red-500 hover:text-red-600"
                                >
                                  ×
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Help Text */}
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        Maximum availability at creation: {MAX_AVAILABILITY}. Restricted (R) items require a
        license. Forbidden (F) items are not available at creation.
      </p>

      {/* Modification Modal */}
      {modifyingItem && (
        <ModificationModal
          isOpen={modModalOpen}
          onClose={() => {
            setModModalOpen(false);
            setModifyingItem(null);
          }}
          item={modifyingItem.item}
          itemType={modifyingItem.type}
          remainingNuyen={remaining}
          onInstallWeaponMod={handleInstallWeaponMod}
          onInstallArmorMod={handleInstallArmorMod}
        />
      )}

      {/* Gear Configuration Modal */}
      {configuringGear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-700 dark:bg-zinc-800">
            <h3 className="mb-4 text-lg font-semibold">Configure {configuringGear.item.name}</h3>
            {configuringGear.item.description && (
              <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">{configuringGear.item.description}</p>
            )}
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">Rating</label>
                <select
                  value={gearConfigRating}
                  onChange={(e) => setGearConfigRating(Number(e.target.value))}
                  className="w-full rounded border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-700"
                >
                  {Array.from({ length: configuringGear.item.rating || 6 }, (_, i) => i + 1).map((rating) => (
                    <option key={rating} value={rating}>
                      {rating}
                    </option>
                  ))}
                </select>
              </div>
              <div className="rounded bg-zinc-50 p-3 dark:bg-zinc-900">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Cost: ¥{formatCurrency((configuringGear.item.cost / (configuringGear.item.rating || 6)) * gearConfigRating)}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={confirmGearConfig}
                  className="flex-1 rounded bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600"
                >
                  {configuringGear.index !== undefined ? "Update" : "Add"}
                </button>
                <button
                  onClick={() => {
                    setConfiguringGear(null);
                    setGearConfigRating(1);
                  }}
                  className="flex-1 rounded border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
