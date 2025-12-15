"use client";

import { useMemo, useCallback, useState, useEffect, useRef } from "react";
import { Button } from "react-aria-components";
import type { CreationState, Identity, License, SinnerQuality, GearItem, Lifestyle } from "@/lib/types";
import { SinnerQuality as SinnerQualityEnum } from "@/lib/types/character";
import { useLifestyles, useLifestyleModifiers, useQualities } from "@/lib/rules/RulesetContext";
import { IdentityEditor } from "../IdentityEditor";
import { LicenseEditor } from "../LicenseEditor";
import { LifestyleEditor } from "../LifestyleEditor";

// Helper function to get lifestyle display name with proper casing
function getLifestyleDisplayName(lifestyle: Lifestyle, availableLifestyles: Array<{ id: string; name: string }>): string {
  const found = availableLifestyles.find((l) => l.id === lifestyle.type || l.name.toLowerCase() === lifestyle.type.toLowerCase());
  return found?.name || lifestyle.type.charAt(0).toUpperCase() + lifestyle.type.slice(1);
}

// Helper function to check if lifestyle is permanent (has permanent modification)
function isLifestylePermanent(lifestyle: Lifestyle): boolean {
  return lifestyle.modifications?.some((mod) => mod.catalogId === "permanent-lifestyle" || mod.name.toLowerCase() === "permanent lifestyle") || false;
}

interface StepProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
  budgetValues: Record<string, number>;
}

export function IdentitiesStep({ state, updateState, budgetValues }: StepProps) {
  const availableLifestyles = useLifestyles();
  const lifestyleModifiers = useLifestyleModifiers();
  const { negative: negativeQualities } = useQualities();
  const [editingIdentityIndex, setEditingIdentityIndex] = useState<number | null>(null);
  const [editingLicenseIndex, setEditingLicenseIndex] = useState<{ identityIndex: number; licenseIndex: number } | null>(null);
  const [editingLifestyleIndex, setEditingLifestyleIndex] = useState<{ identityIndex: number } | null>(null);

  // Get identities from state
  const identities = useMemo(() => {
    return (state.selections.identities || []) as Identity[];
  }, [state.selections.identities]);

  // Get lifestyles from state for identity association
  const lifestyles = useMemo(() => {
    return (state.selections.lifestyles || []) as Lifestyle[];
  }, [state.selections.lifestyles]);

  // Get metatype for lifestyle modifier
  const metatype = useMemo(() => {
    return (state.selections.metatype as string) || "human";
  }, [state.selections.metatype]);

  // Calculate lifestyle cost for a given lifestyle (including modifications and permanent purchase)
  const calculateLifestyleCost = useCallback((lifestyle: Lifestyle): number => {
    if (!lifestyle.type) return 0;
    
    // Find base lifestyle cost
    const baseLifestyle = availableLifestyles.find((l) => l.id === lifestyle.type || l.name.toLowerCase() === lifestyle.type.toLowerCase());
    if (!baseLifestyle) return 0;
    
    const modifier = lifestyleModifiers[metatype] || 1;
    let cost = baseLifestyle.monthlyCost * modifier;
    
    // Apply modifications (excluding permanent lifestyle modification)
    lifestyle.modifications?.forEach((mod) => {
      if (mod.catalogId !== "permanent-lifestyle" && mod.name.toLowerCase() !== "permanent lifestyle") {
        if (mod.modifierType === "percentage") {
          cost = cost * (1 + (mod.type === "positive" ? 1 : -1) * (mod.modifier / 100));
        } else {
          cost = cost + (mod.type === "positive" ? 1 : -1) * mod.modifier;
        }
      }
    });
    
    // Add subscriptions
    const subscriptionCost = lifestyle.subscriptions?.reduce((sum, sub) => sum + sub.monthlyCost, 0) || 0;
    cost = cost + subscriptionCost;
    
    // Add custom expenses, subtract custom income
    cost = cost + (lifestyle.customExpenses || 0) - (lifestyle.customIncome || 0);
    
    const finalMonthlyCost = Math.max(0, Math.floor(cost));
    
    // Check if permanent
    const isPermanent = isLifestylePermanent(lifestyle);
    if (isPermanent) {
      return finalMonthlyCost * 100; // Permanent: 100 × monthly cost
    }
    
    return finalMonthlyCost; // Monthly: 1 month prepaid
  }, [availableLifestyles, lifestyleModifiers, metatype]);

  // Calculate identity costs (fake SINs, licenses, and associated lifestyles)
  const identityCosts = useMemo(() => {
    let total = 0;
    
    identities.forEach((identity) => {
      // Fake SIN cost: Rating × 625¥ (Rating 4 = 2,500¥)
      if (identity.sin?.type === "fake" && identity.sin.rating) {
        total += identity.sin.rating * 625;
      }
      
      // Fake License costs: Rating × 50¥ (Rating 4 = 200¥)
      identity.licenses?.forEach((license) => {
        if (license.type === "fake" && license.rating) {
          total += license.rating * 50;
        }
      });
      
      // Lifestyle cost (if associated)
      if (identity.associatedLifestyleId) {
        const lifestyle = lifestyles.find((l) => l.id === identity.associatedLifestyleId);
        if (lifestyle) {
          total += calculateLifestyleCost(lifestyle);
        }
      }
    });
    
    return total;
  }, [identities, lifestyles, calculateLifestyleCost]);

  // Format currency helper
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Get gear items to find fake SINs
  const gearItems = useMemo(() => {
    return (state.selections.gear || []) as GearItem[];
  }, [state.selections.gear]);

  // Get fake SINs from gear (items with name containing "Fake SIN" or category "sin")
  const fakeSINsFromGear = useMemo(() => {
    return gearItems.filter((item) => {
      const name = item.name.toLowerCase();
      return name.includes("fake sin") || item.category?.toLowerCase() === "sin";
    });
  }, [gearItems]);

  // Check if character has SINner quality
  const hasSINnerQuality = useMemo(() => {
    const negativeQualitiesList = (state.selections.negativeQualities || []) as string[];
    return negativeQualitiesList.includes("sinner");
  }, [state.selections.negativeQualities]);

  // Map between qualityLevels (1-4) and SinnerQuality enum values
  const levelToSinnerQuality: Record<number, SinnerQuality> = {
    1: SinnerQualityEnum.National,
    2: SinnerQualityEnum.Criminal,
    3: SinnerQualityEnum.CorporateLimited,
    4: SinnerQualityEnum.CorporateBorn,
  };
  
  const sinnerQualityToLevel: Record<SinnerQuality, number> = {
    [SinnerQualityEnum.National]: 1,
    [SinnerQualityEnum.Criminal]: 2,
    [SinnerQualityEnum.CorporateLimited]: 3,
    [SinnerQualityEnum.CorporateBorn]: 4,
  };

  // Get SINner quality level if present (from qualityLevels, the source of truth for karma costs)
  const sinnerQualityLevel = useMemo(() => {
    if (!hasSINnerQuality) return null;
    const qualityLevels = (state.selections.qualityLevels || {}) as Record<string, number>;
    const sinnerLevel = qualityLevels["sinner"] || 1; // Default to level 1 (National)
    return levelToSinnerQuality[sinnerLevel] || SinnerQualityEnum.National;
  }, [hasSINnerQuality, state.selections.qualityLevels]);

  // Track previous sinnerQualityLevel to detect changes from Qualities step
  const prevSinnerQualityLevelRef = useRef<SinnerQuality | null>(sinnerQualityLevel);
  
  // Sync Quality → Identity: When SINner quality level changes (from Qualities step), update all real SIN identities
  useEffect(() => {
    const prevLevel = prevSinnerQualityLevelRef.current;
    prevSinnerQualityLevelRef.current = sinnerQualityLevel;
    
    // Only sync if the level actually changed and we have a valid level
    if (!sinnerQualityLevel || prevLevel === sinnerQualityLevel) return;
    
    // Check if any identities have real SINs that need updating
    const hasRealSINsToUpdate = identities.some(
      (identity) => identity.sin?.type === "real" && identity.sin.sinnerQuality !== sinnerQualityLevel
    );
    
    if (!hasRealSINsToUpdate) return;
    
    // Update all real SIN identities to match the new SINner quality level
    const updatedIdentities = identities.map((identity) => {
      if (identity.sin?.type === "real" && identity.sin.sinnerQuality !== sinnerQualityLevel) {
        return {
          ...identity,
          sin: {
            ...identity.sin,
            sinnerQuality: sinnerQualityLevel,
          },
        };
      }
      return identity;
    });
    
    updateState({
      selections: {
        ...state.selections,
        identities: updatedIdentities,
      },
    });
  }, [sinnerQualityLevel, identities, state.selections, updateState]);

  // Add new identity
  const handleAddIdentity = useCallback(() => {
    setEditingIdentityIndex(identities.length);
  }, [identities.length]);

  // Helper to calculate karma gained from negative qualities
  const calculateNegativeKarmaGained = useCallback((
    selectedNegativeIds: string[],
    qualityLevelsMap: Record<string, number>
  ): number => {
    return selectedNegativeIds.reduce((sum, id) => {
      const quality = negativeQualities.find((q) => q.id === id);
      if (!quality) return sum;
      
      // Check if it has levels
      if (quality.levels && quality.levels.length > 0) {
        const levelIdx = qualityLevelsMap[id] || 1;
        const levelData = quality.levels.find((l) => l.level === levelIdx);
        return sum + (levelData ? Math.abs(levelData.karma) : (quality.karmaCost || quality.karmaBonus || 0));
      }
      return sum + (quality.karmaCost || quality.karmaBonus || 0);
    }, 0);
  }, [negativeQualities]);

  // Update identity
  const handleUpdateIdentity = useCallback((index: number, identity: Identity) => {
    const updated = [...identities];
    updated[index] = identity;
    
    const updates: Partial<CreationState> = {
      selections: {
        ...state.selections,
        identities: updated,
      },
    };
    
    // If identity has a real SIN, sync the SINner quality and level
    if (identity.sin?.type === "real") {
      const newSinnerLevel = sinnerQualityToLevel[identity.sin.sinnerQuality] || 1;
      
      // Add SINner quality to negative qualities if not present
      const currentNegativeQualities = [...((state.selections.negativeQualities || []) as string[])];
      if (!currentNegativeQualities.includes("sinner")) {
        currentNegativeQualities.push("sinner");
      }
      
      // Update qualityLevels with the correct level (this controls karma cost)
      const newQualityLevels = { ...((state.selections.qualityLevels || {}) as Record<string, number>) };
      newQualityLevels["sinner"] = newSinnerLevel;
      
      updates.selections = {
        ...updates.selections,
        negativeQualities: currentNegativeQualities,
        qualityLevels: newQualityLevels,
      };
      
      // Recalculate karma-gained-negative budget to reflect the new sinner level
      const newKarmaGained = calculateNegativeKarmaGained(currentNegativeQualities, newQualityLevels);
      updates.budgets = {
        ...state.budgets,
        "karma-gained-negative": newKarmaGained,
      };
    }
    
    updateState(updates);
    setEditingIdentityIndex(null);
  }, [identities, state.selections, state.budgets, updateState, sinnerQualityToLevel, calculateNegativeKarmaGained]);

  // Remove identity
  const handleRemoveIdentity = useCallback((index: number) => {
    const updated = identities.filter((_, i) => i !== index);
    updateState({
      selections: {
        ...state.selections,
        identities: updated,
      },
    });
  }, [identities, state.selections, updateState]);

  // Cancel editing
  const handleCancelEdit = useCallback(() => {
    setEditingIdentityIndex(null);
    setEditingLicenseIndex(null);
    setEditingLifestyleIndex(null);
  }, []);

  // Add license to identity
  const handleAddLicense = useCallback((identityIndex: number) => {
    setEditingLicenseIndex({ identityIndex, licenseIndex: -1 });
  }, []);

  // Update license
  const handleUpdateLicense = useCallback((identityIndex: number, licenseIndex: number, license: License) => {
    const updated = [...identities];
    const identity = { ...updated[identityIndex] };
    
    if (licenseIndex === -1) {
      // Adding new license
      identity.licenses = [...(identity.licenses || []), license];
    } else {
      // Updating existing license
      identity.licenses = [...(identity.licenses || [])];
      identity.licenses[licenseIndex] = license;
    }
    
    updated[identityIndex] = identity;
    updateState({
      selections: {
        ...state.selections,
        identities: updated,
      },
    });
    setEditingLicenseIndex(null);
  }, [identities, state.selections, updateState]);

  // Remove license
  const handleRemoveLicense = useCallback((identityIndex: number, licenseIndex: number) => {
    const updated = [...identities];
    const identity = { ...updated[identityIndex] };
    identity.licenses = identity.licenses.filter((_, i) => i !== licenseIndex);
    updated[identityIndex] = identity;
    updateState({
      selections: {
        ...state.selections,
        identities: updated,
      },
    });
  }, [identities, state.selections, updateState]);


  // Save lifestyle inline (from identity card)
  const handleSaveLifestyleInline = useCallback((identityIndex: number, lifestyle: Lifestyle) => {
    const updated = [...lifestyles];
    const identity = identities[identityIndex];
    const existingLifestyleId = identity.associatedLifestyleId;
    
    let lifestyleWithId: Lifestyle;
    const existingIndex = existingLifestyleId
      ? updated.findIndex((l) => l.id === existingLifestyleId)
      : -1;
    
    if (existingIndex >= 0) {
      // Update existing lifestyle
      lifestyleWithId = lifestyle;
      updated[existingIndex] = lifestyleWithId;
    } else {
      // Add new lifestyle
      lifestyleWithId = lifestyle.id 
        ? lifestyle 
        : { ...lifestyle, id: `lifestyle-${crypto.randomUUID()}` };
      updated.push(lifestyleWithId);
      
      // If this is the first lifestyle, set it as primary
      const primaryLifestyleId = (state.selections.primaryLifestyleId as string) || undefined;
      const newPrimaryId = updated.length === 1 ? lifestyleWithId.id : primaryLifestyleId;
      
      // Update identity to associate with new lifestyle
      const updatedIdentities = [...identities];
      updatedIdentities[identityIndex] = {
        ...identity,
        associatedLifestyleId: lifestyleWithId.id,
      };
      
      updateState({
        selections: {
          ...state.selections,
          lifestyles: updated,
          identities: updatedIdentities,
          primaryLifestyleId: newPrimaryId,
        },
      });
      setEditingLifestyleIndex(null);
      return;
    }
    
    // Update identity association if needed
    const updatedIdentities = [...identities];
    if (!identity.associatedLifestyleId || identity.associatedLifestyleId !== lifestyleWithId.id) {
      updatedIdentities[identityIndex] = {
        ...identity,
        associatedLifestyleId: lifestyleWithId.id,
      };
    }
    
    updateState({
      selections: {
        ...state.selections,
        lifestyles: updated,
        identities: updatedIdentities,
      },
    });
    setEditingLifestyleIndex(null);
  }, [lifestyles, identities, state.selections, updateState]);

  // Remove lifestyle association from identity
  const handleRemoveLifestyleAssociation = useCallback((identityIndex: number) => {
    const updatedIdentities = [...identities];
    updatedIdentities[identityIndex] = {
      ...identities[identityIndex],
      associatedLifestyleId: undefined,
    };
    
    updateState({
      selections: {
        ...state.selections,
        identities: updatedIdentities,
      },
    });
  }, [identities, state.selections, updateState]);

  // Validation errors
  const validationErrors = useMemo(() => {
    const errors: string[] = [];
    
    // Must have at least one identity
    if (identities.length === 0) {
      errors.push("Character must have at least one identity");
    }
    
    // If character has SINner quality, MUST have at least one real SIN identity
    if (hasSINnerQuality) {
      const hasRealSIN = identities.some((identity) => identity.sin?.type === "real");
      if (!hasRealSIN) {
        errors.push("Character has SINner quality and must have at least one identity with a real SIN");
      }
    }
    
    // Each identity must have exactly one SIN
    identities.forEach((identity, index) => {
      if (!identity.sin) {
        errors.push(`Identity "${identity.name || `Identity ${index + 1}`}" must have a SIN`);
      } else if (identity.sin.type === "fake") {
        // Fake SIN must have rating 1-4
        if (identity.sin.type === "fake" && (identity.sin.rating < 1 || identity.sin.rating > 4)) {
          errors.push(`Identity "${identity.name || `Identity ${index + 1}`}" fake SIN must have rating 1-4`);
        }
      } else if (identity.sin.type === "real") {
        // Real SIN syncs with SINner quality - no validation needed here
        // The SINner quality is automatically added/updated when identity is saved
      }
      
      // Licenses must match SIN type
      identity.licenses?.forEach((license) => {
        if (identity.sin.type === "fake" && license.type !== "fake") {
          errors.push(`Identity "${identity.name || `Identity ${index + 1}`}" license "${license.name}" must be fake (identity uses fake SIN)`);
        }
        if (identity.sin.type === "real" && license.type !== "real") {
          errors.push(`Identity "${identity.name || `Identity ${index + 1}`}" license "${license.name}" must be real (identity uses real SIN)`);
        }
        if (license.type === "fake" && (!license.rating || license.rating < 1 || license.rating > 4)) {
          errors.push(`Identity "${identity.name || `Identity ${index + 1}`}" fake license "${license.name}" must have rating 1-4`);
        }
      });
    });
    
    return errors;
  }, [identities, hasSINnerQuality, sinnerQualityLevel]);

  // If editing identity, show editor
  if (editingIdentityIndex !== null) {
    return (
      <IdentityEditor
        identity={identities[editingIdentityIndex] || { name: "", sin: { type: "fake", rating: 1 }, licenses: [] }}
        fakeSINsFromGear={fakeSINsFromGear}
        hasSINnerQuality={hasSINnerQuality}
        sinnerQualityLevel={sinnerQualityLevel}
        onSave={(identity) => handleUpdateIdentity(editingIdentityIndex, identity)}
        onCancel={handleCancelEdit}
      />
    );
  }

  // If editing license, show license editor
  if (editingLicenseIndex !== null) {
    const identity = identities[editingLicenseIndex.identityIndex];
    const license = editingLicenseIndex.licenseIndex >= 0 
      ? identity.licenses?.[editingLicenseIndex.licenseIndex]
      : undefined;
    
    return (
      <LicenseEditor
        license={license}
        sinType={identity.sin.type}
        onSave={(license) => handleUpdateLicense(
          editingLicenseIndex.identityIndex,
          editingLicenseIndex.licenseIndex,
          license
        )}
        onCancel={handleCancelEdit}
      />
    );
  }

  // If editing lifestyle inline, show lifestyle editor
  if (editingLifestyleIndex !== null) {
    const identity = identities[editingLifestyleIndex.identityIndex];
    const associatedLifestyle = identity.associatedLifestyleId
      ? lifestyles.find((l) => l.id === identity.associatedLifestyleId)
      : undefined;
    
    return (
      <LifestyleEditor
        lifestyle={associatedLifestyle || { type: "", monthlyCost: 0, modifications: [], subscriptions: [] }}
        availableLifestyles={availableLifestyles.map((l) => ({
          id: l.id,
          name: l.name,
          monthlyCost: l.monthlyCost,
        }))}
        lifestyleModifier={lifestyleModifiers[metatype] || 1}
        onSave={(lifestyle) => handleSaveLifestyleInline(editingLifestyleIndex.identityIndex, lifestyle)}
        onCancel={handleCancelEdit}
      />
    );
  }

  // Get budget info
  const baseNuyen = budgetValues["nuyen"] || 0;
  const karmaConversion = (state.budgets?.["karma-spent-gear"] as number) || 0;
  const convertedNuyen = karmaConversion * 2000; // 1 Karma = 2,000 nuyen
  const totalNuyen = baseNuyen + convertedNuyen;
  const gearSpent = (state.budgets?.["nuyen-spent-gear"] as number) || 0;
  const augmentationSpent = (state.budgets?.["nuyen-spent-augmentations"] as number) || 0;
  const lifestyleSpent = (state.budgets?.["nuyen-spent-lifestyle"] as number) || 0;
  const otherSpent = gearSpent + augmentationSpent + lifestyleSpent;
  const remaining = totalNuyen - otherSpent - identityCosts;

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
              ¥{formatCurrency(otherSpent + identityCosts)}
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Remaining</p>
            <p
              className={`text-lg font-semibold ${
                remaining < 0
                  ? "text-red-600 dark:text-red-400"
                  : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              ¥{formatCurrency(remaining)}
            </p>
          </div>
        </div>
      </div>

      {/* Shopping Cart Summary */}
      {identityCosts > 0 && (
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
          <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            Identities & SINs Shopping Cart
          </h3>
          <div className="space-y-2">
            {identities.map((identity, index) => {
              const sinCost = identity.sin?.type === "fake" && identity.sin.rating
                ? identity.sin.rating * 625
                : 0;
              const licenseCosts = identity.licenses?.reduce((sum, license) => {
                if (license.type === "fake" && license.rating) {
                  return sum + license.rating * 50;
                }
                return sum;
              }, 0) || 0;
              
              // Calculate lifestyle cost for this identity
              const associatedLifestyle = identity.associatedLifestyleId
                ? lifestyles.find((l) => l.id === identity.associatedLifestyleId)
                : undefined;
              const lifestyleCost = associatedLifestyle ? calculateLifestyleCost(associatedLifestyle) : 0;
              
              const identityTotal = sinCost + licenseCosts + lifestyleCost;
              
              if (identityTotal === 0) return null;
              
              return (
                <div
                  key={index}
                  className="rounded-md border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800/50"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                        {identity.name || `Identity ${index + 1}`}
                      </h4>
                      <div className="mt-1 space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
                        {sinCost > 0 && identity.sin.type === "fake" && (
                          <div>
                            Fake SIN (Rating {identity.sin.rating}): ¥{formatCurrency(sinCost)}
                          </div>
                        )}
                        {licenseCosts > 0 && (
                          <div>
                            {identity.licenses?.filter((l) => l.type === "fake").length || 0} Fake License(s): ¥{formatCurrency(licenseCosts)}
                          </div>
                        )}
                        {lifestyleCost > 0 && associatedLifestyle && (
                          <div>
                            {(() => {
                              const isPermanent = isLifestylePermanent(associatedLifestyle);
                              const displayName = getLifestyleDisplayName(associatedLifestyle, availableLifestyles);
                              return isPermanent
                                ? `${displayName} (Permanent): ¥${formatCurrency(lifestyleCost)}`
                                : `${displayName} (1 month): ¥${formatCurrency(lifestyleCost)}`;
                            })()}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                      ¥{formatCurrency(identityTotal)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-3 border-t border-zinc-200 pt-3 dark:border-zinc-700">
            <div className="flex justify-between text-sm font-semibold">
              <span className="text-zinc-900 dark:text-zinc-50">Total:</span>
              <span className="text-zinc-900 dark:text-zinc-50">
                ¥{formatCurrency(identityCosts)}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="mb-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          Identities & SINs
        </h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Each character needs at least one identity with a SIN (System Identification Number). 
          You can use fake SINs (purchased as gear) or real SINs (from the SINner quality).
        </p>
        {hasSINnerQuality && (
          <div className="mt-2 rounded-md border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-800 dark:bg-emerald-900/20">
            <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
              ⚠ Required: Character has SINner quality
            </p>
            <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-400">
              You must create at least one identity with a real SIN. The real SIN level ({sinnerQualityLevel || "not set"}) must match your SINner quality level.
            </p>
          </div>
        )}
        {fakeSINsFromGear.length > 0 && (
          <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">
            ✓ {fakeSINsFromGear.length} fake SIN(s) available from gear purchases
          </p>
        )}
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/30">
          <h4 className="mb-2 text-sm font-semibold text-red-700 dark:text-red-300">
            Validation Errors
          </h4>
          <ul className="list-disc space-y-1 pl-5 text-sm text-red-600 dark:text-red-400">
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Identities List */}
      <div className="space-y-4">
        {identities.map((identity, index) => (
          <div
            key={index}
            className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                  {identity.name || `Identity ${index + 1}`}
                </h4>
                
                {/* SIN Display */}
                <div className="mt-2">
                  {identity.sin.type === "fake" ? (
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      Fake SIN (Rating {identity.sin.rating})
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                      Real SIN ({identity.sin.sinnerQuality})
                    </span>
                  )}
                </div>

                {/* Licenses */}
                <div className="mt-3">
                  <div className="flex items-center justify-between">
                    <h5 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Licenses {identity.licenses && identity.licenses.length > 0 && `(${identity.licenses.length})`}
                    </h5>
                    <Button
                      onPress={() => handleAddLicense(index)}
                      className="rounded-md bg-blue-600 px-2 py-1 text-xs font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                      + Add License
                    </Button>
                  </div>
                  {identity.licenses && identity.licenses.length > 0 ? (
                    <ul className="mt-2 space-y-1">
                      {identity.licenses.map((license, licenseIndex) => (
                        <li
                          key={licenseIndex}
                          className="flex items-center justify-between rounded-md border border-zinc-200 bg-zinc-50 p-2 dark:border-zinc-700 dark:bg-zinc-800/50"
                        >
                          <span className="text-sm text-zinc-900 dark:text-zinc-50">
                            {license.name}
                            {license.type === "fake" && license.rating && ` (Rating ${license.rating})`}
                          </span>
                          <div className="flex gap-2">
                            <Button
                              onPress={() => setEditingLicenseIndex({ identityIndex: index, licenseIndex })}
                              className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              Edit
                            </Button>
                            <Button
                              onPress={() => handleRemoveLicense(index, licenseIndex)}
                              className="text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                            >
                              Remove
                            </Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                      No licenses added yet. Click &quot;Add License&quot; to add a license to this identity.
                    </p>
                  )}
                </div>

                {/* Lifestyle Association */}
                <div className="mt-3">
                  <div className="flex items-center justify-between">
                    <h5 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Associated Lifestyle
                    </h5>
                    <Button
                      onPress={() => setEditingLifestyleIndex({ identityIndex: index })}
                      className="rounded-md bg-blue-600 px-2 py-1 text-xs font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                      {identity.associatedLifestyleId ? "Edit Lifestyle" : "+ Add Lifestyle"}
                    </Button>
                  </div>
                  {identity.associatedLifestyleId ? (
                    <div className="mt-2">
                      {(() => {
                        const lifestyle = lifestyles.find((l) => l.id === identity.associatedLifestyleId);
                        if (!lifestyle) {
                          return (
                            <p className="text-xs text-amber-600 dark:text-amber-400">
                              Lifestyle not found
                            </p>
                          );
                        }
                        const isPermanent = isLifestylePermanent(lifestyle);
                        const displayName = getLifestyleDisplayName(lifestyle, availableLifestyles);
                        return (
                          <div className="flex items-center justify-between rounded-md border border-zinc-200 bg-zinc-50 p-2 dark:border-zinc-700 dark:bg-zinc-800/50">
                            <div className="flex-1">
                              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                                {displayName}
                              </span>
                              <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                                {isPermanent
                                  ? `One-time: ¥${(lifestyle.monthlyCost * 100).toLocaleString()}`
                                  : `Monthly: ¥${lifestyle.monthlyCost.toLocaleString()}`}
                                {lifestyle.location && ` • ${lifestyle.location}`}
                              </div>
                              {(lifestyle.modifications?.length || 0) > 0 && (
                                <div className="mt-2">
                                  <div className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                                    Modifications ({lifestyle.modifications?.length}):
                                  </div>
                                  <div className="mt-1 flex flex-wrap gap-1">
                                    {lifestyle.modifications?.map((mod, modIndex) => (
                                      <span
                                        key={modIndex}
                                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${
                                          mod.type === "positive"
                                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
                                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                        }`}
                                      >
                                        {mod.name}
                                        {mod.modifierType === "percentage" && mod.modifier !== 0 && (
                                          <span className="ml-1">
                                            ({mod.type === "positive" ? "+" : "-"}
                                            {mod.modifier}%)
                                          </span>
                                        )}
                                        {mod.modifierType === "fixed" && mod.modifier !== 0 && (
                                          <span className="ml-1">
                                            ({mod.type === "positive" ? "+" : "-"}
                                            {mod.modifier.toLocaleString()}¥)
                                          </span>
                                        )}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                            <Button
                              onPress={() => handleRemoveLifestyleAssociation(index)}
                              className="text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                            >
                              Remove
                            </Button>
                          </div>
                        );
                      })()}
                    </div>
                  ) : (
                    <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                      No lifestyle associated yet. Click &quot;Add Lifestyle&quot; to create or select a lifestyle for this identity.
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onPress={() => setEditingIdentityIndex(index)}
                  className="rounded-md bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                >
                  Edit
                </Button>
                <Button
                  onPress={() => handleRemoveIdentity(index)}
                  className="rounded-md bg-red-100 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800"
                >
                  Remove
                </Button>
              </div>
            </div>
          </div>
        ))}

        {/* Add Identity Button */}
        <Button
          onPress={handleAddIdentity}
          className="w-full rounded-lg border-2 border-dashed border-zinc-300 bg-white px-4 py-3 text-sm font-medium text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
        >
          + Add Identity
        </Button>
      </div>
    </div>
  );
}
