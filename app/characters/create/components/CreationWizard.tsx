"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { Button } from "react-aria-components";
import {
  useRuleset,
  useCreationMethod,
  usePriorityTable,
  useMetatypes,
} from "@/lib/rules";
import { validateAllQualities } from "@/lib/rules/qualities/validation";
import { buildCharacterFromCreationState } from "@/lib/rules/qualities/creation-helper";
import {
  useLifestyleModifiers,
  useLifestyles,
  useSpells,
} from "@/lib/rules/RulesetContext";
import { StepperSidebar } from "./StepperSidebar";
import { ValidationPanel } from "./ValidationPanel";
import type {
  CreationState,
  ID,
  ValidationError,
  Character,
  GearItem,
  Weapon,
  ArmorItem,
  CyberwareItem,
  BiowareItem,
  Lifestyle,
  AdeptPower,
  Vehicle,
  CharacterDrone,
  CharacterRCC,
  CharacterAutosoft,
} from "@/lib/types";

// Step components
import { PriorityStep } from "./steps/PriorityStep";
import { MetatypeStep } from "./steps/MetatypeStep";
import { AttributesStep } from "./steps/AttributesStep";
import { MagicStep } from "./steps/MagicStep";
import { SkillsStep } from "./steps/SkillsStep";
import { QualitiesStep } from "./steps/QualitiesStep";
import { ContactsStep } from "./steps/ContactsStep";
import { GearStep } from "./steps/GearStep";
import { KarmaStep } from "./steps/KarmaStep";
import { SpellsStep } from "./steps/SpellsStep";
import { RitualsStep } from "./steps/RitualsStep";
import { AdeptPowersStep } from "./steps/AdeptPowersStep";
import { VehiclesStep } from "./steps/VehiclesStep";
import { ProgramsStep } from "./steps/ProgramsStep";
import { IdentitiesStep } from "./steps/IdentitiesStep";
import { ReviewStep } from "./steps/ReviewStep";

interface CreationWizardProps {
  characterId?: ID;
  initialState?: CreationState;
  campaignId?: string;
  onCancel: () => void;
  onComplete: (characterId: ID) => void;
}



export function CreationWizard({ onCancel, onComplete, characterId: initialCharacterId, initialState, campaignId }: CreationWizardProps) {
  const { ruleset, editionCode } = useRuleset();
  const creationMethod = useCreationMethod();
  const priorityTable = usePriorityTable();
  const metatypes = useMetatypes();
  const lifestyleModifiers = useLifestyleModifiers();
  const availableLifestyles = useLifestyles();
  const spellsCatalog = useSpells();

  // Initial creation state
  function createInitialState(): CreationState {
    return {
      characterId: crypto.randomUUID(),
      creationMethodId: "priority",
      currentStep: 0,
      completedSteps: [],
      budgets: {},
      selections: {},
      priorities: {},
      errors: [],
      warnings: [],
      updatedAt: new Date().toISOString(),
    };
  }

  // Creation state - load draft if available
  const [state, setState] = useState<CreationState>(() => {
    if (initialState) return initialState;
    return createInitialState();
  });

  // Track character ID (prop or created during auto-save)
  const [characterId, setCharacterId] = useState<string | undefined>(initialCharacterId);

  // Track saving state
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);



  // Auto-save effect
  useEffect(() => {
    // Debounce timer
    const timer = setTimeout(async () => {
      // Logic:
      // 1. If we have characterId -> PATCH
      // 2. If we DON'T have characterId -> POST (create) then PATCH?
      //    OR just save to localStorage until we have characterId?
      //    The spec says "Replace localStorage". So we should create server draft.

      if (Object.keys(state.priorities || {}).length > 0) {
        if (characterId) {
          // Save to server
          await fetch(`/api/characters/${characterId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              metadata: {
                creationState: {
                  ...state,
                  characterId
                }
              }
            })
          });
        } else if (!initialCharacterId) {
          // No ID yet? Create server draft!
          // We need editionId, creationMethodId, etc.
          // editionCode and creationMethodId are available.
          // editionId is technically 'sr5' based on our current hardcoding elsewhere or available in ruleset?
          // ruleset object itself should have it. 
          // But wait, `useRuleset` gives `ruleset`. `ruleset.id`?

          try {
            const response = await fetch("/api/characters", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                editionId: ruleset?.editionId || "sr5", // Fallback or assume sr5
                editionCode: editionCode || "sr5",
                creationMethodId: state.creationMethodId,
                name: (state.selections.characterName as string) || "Unnamed Runner",
                campaignId: campaignId, // Link to campaign if provided
              }),
            });

            const result = await response.json();
            if (result.success && result.character) {
              const newId = result.character.id;
              setCharacterId(newId);

              // Now save the state to this new character
              await fetch(`/api/characters/${newId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  metadata: {
                    creationState: {
                      ...state,
                      characterId: newId
                    }
                  }
                })
              });
            }
          } catch (e) {
            console.error("Failed to auto-create draft", e);
          }
        }
      }
    }, 1000); // 1s debounce

    return () => clearTimeout(timer);
  }, [state, characterId, initialCharacterId, editionCode, ruleset, campaignId]);

  // Get steps from creation method and filter based on character type
  const steps = useMemo(() => {
    const rawSteps = creationMethod?.steps || [];
    const magicPath = (state.selections["magical-path"] as string) || "mundane";

    // Check if character is magical (Magician, Mystic Adept, or Aspected Mage)
    const isMagical = ["magician", "mystic-adept", "aspected-mage"].includes(magicPath);

    // Check if character can use adept powers
    const isAdept = ["adept", "mystic-adept"].includes(magicPath);

    // Check if character can learn rituals (only Magician, Mystic Adept, or Aspected Mage)
    const canLearnRituals = isMagical;

    return rawSteps.filter((step) => {
      // Hide Spells step for mundane characters and technomancers
      // (Technomancers use Complex Forms which are currently in KarmaStep)
      if (step.id === "spells" && !isMagical) {
        return false;
      }
      // Hide Adept Powers step for non-adepts
      if (step.id === "adept-powers" && !isAdept) {
        return false;
      }
      // Hide Rituals step for mundane characters (and technomancers/adepts)
      if (step.id === "rituals" && !canLearnRituals) {
        return false;
      }
      return true;
    });
  }, [creationMethod, state.selections]);

  // Current step
  const currentStep = steps[state.currentStep];

  // Calculate budget values based on priorities (must be before validateCurrentStep)
  const budgetValues = useMemo(() => {
    if (!priorityTable || !state.priorities) return {};

    const values: Record<string, number> = {
      karma: 25, // Starting karma
    };

    // Get attribute points from priority
    const attrPriority = state.priorities.attributes;
    if (attrPriority && priorityTable.table[attrPriority]) {
      values["attribute-points"] = priorityTable.table[attrPriority].attributes as number;
    }

    // Get skill points from priority
    const skillPriority = state.priorities.skills;
    if (skillPriority && priorityTable.table[skillPriority]) {
      const skillData = priorityTable.table[skillPriority].skills as {
        skillPoints: number;
        skillGroupPoints: number;
      };
      values["skill-points"] = skillData?.skillPoints || 0;
      values["skill-group-points"] = skillData?.skillGroupPoints || 0;
    }

    // Get resources from priority
    const resourcePriority = state.priorities.resources;
    if (resourcePriority && priorityTable.table[resourcePriority]) {
      values["nuyen"] = priorityTable.table[resourcePriority].resources as number;
    }

    // Get special attribute points from metatype priority
    const metatypePriority = state.priorities.metatype;
    const selectedMetatype = state.selections.metatype as string;
    if (metatypePriority && selectedMetatype && priorityTable.table[metatypePriority]) {
      const metatypeData = priorityTable.table[metatypePriority].metatype as {
        specialAttributePoints: Record<string, number>;
      };
      values["special-attribute-points"] =
        metatypeData?.specialAttributePoints?.[selectedMetatype] || 0;
    }

    return values;
  }, [priorityTable, state.priorities, state.selections.metatype]);

  // Validate current step completion
  const validateCurrentStep = useCallback((): ValidationError[] => {
    const errors: ValidationError[] = [];
    const stepId = currentStep?.id;

    switch (stepId) {
      case "priorities":
        // All 5 priorities must be assigned
        if (Object.keys(state.priorities || {}).length < 5) {
          errors.push({
            constraintId: "priorities-complete",
            stepId,
            message: "All five priorities must be assigned before continuing.",
            severity: "error",
          });
        }
        break;

      case "metatype":
        // Metatype must be selected
        if (!state.selections.metatype) {
          errors.push({
            constraintId: "metatype-selected",
            stepId,
            message: "Please select a metatype.",
            severity: "error",
          });
        }
        break;

      case "attributes":
        // Check if all attribute points are spent (allow 0-2 unspent)
        const attrSpent = (state.budgets["attribute-points-spent"] as number) || 0;
        const attrTotal = (state.budgets["attribute-points-total"] as number) || 0;
        if (attrTotal > 0 && attrSpent < attrTotal - 2) {
          errors.push({
            constraintId: "attributes-spent",
            stepId,
            message: `You have ${attrTotal - attrSpent} attribute points remaining.`,
            severity: "warning",
          });
        }

        // Check if all special attribute points are spent
        const specialSpent = (state.budgets["special-attribute-points-spent"] as number) || 0;
        const specialTotal = budgetValues["special-attribute-points"] || 0;
        if (specialTotal > 0 && specialSpent < specialTotal) {
          errors.push({
            constraintId: "special-attributes-spent",
            stepId,
            message: `You have ${specialTotal - specialSpent} special attribute points remaining (Edge/Magic/Resonance).`,
            severity: "warning",
          });
        }
        break;

      case "magic": {
        // Magic path must be selected if available
        const magicPriority = state.priorities?.magic;
        if (magicPriority && magicPriority !== "E" && !state.selections["magical-path"]) {
          errors.push({
            constraintId: "magic-selected",
            stepId,
            message: "Please select a magical path or choose to be mundane.",
            severity: "warning",
          });
        }
        // Aspected mages must choose their skill group focus
        if (state.selections["magical-path"] === "aspected-mage" && !state.selections["aspected-mage-group"]) {
          errors.push({
            constraintId: "aspected-mage-group",
            stepId,
            message: "Aspected Magicians must choose a magical skill group (Sorcery, Conjuring, or Enchanting).",
            severity: "error",
          });
        }
        break;
      }

      // Skills, qualities, gear - show warnings but allow continuing
      case "skills": {
        const skillSpent = (state.budgets["skill-points-spent"] as number) || 0;
        const skillTotal = (state.budgets["skill-points-total"] as number) || 0;
        if (skillTotal > 0 && skillSpent < skillTotal * 0.5) {
          errors.push({
            constraintId: "skills-low",
            stepId,
            message: "You still have skill points to spend.",
            severity: "warning",
          });
        }

        // Validate free skill allocations
        const magicPriority = state.priorities?.magic;
        const magicPath = state.selections["magical-path"] as string | undefined;
        if (magicPriority && magicPath && priorityTable?.table[magicPriority]) {
          const priorityData = priorityTable.table[magicPriority];
          if (priorityData?.magic) {
            const magicData = priorityData.magic as {
              options: Array<{
                path: string;
                freeSkills?: Array<{
                  type: string;
                  rating: number;
                  count: number;
                }>;
              }>;
            };
            const selectedOption = magicData.options?.find((opt) => opt.path === magicPath);
            if (selectedOption?.freeSkills) {
              const freeSkillAllocations = (state.selections.freeSkillAllocations || []) as Array<{
                type: string;
                rating: number;
                count: number;
                allocated: Array<unknown>;
              }>;

              selectedOption.freeSkills.forEach((freeSkill, index) => {
                const allocation = freeSkillAllocations[index];
                const allocatedCount = allocation?.allocated?.length || 0;
                if (allocatedCount < freeSkill.count) {
                  errors.push({
                    constraintId: `free-skills-${index}`,
                    stepId,
                    message: `You must allocate ${freeSkill.count - allocatedCount} more ${freeSkill.type === "magicalGroup" ? "magical skill group" : freeSkill.type === "active" ? "active skill" : freeSkill.type === "resonance" ? "resonance skill" : "magical skill"}${freeSkill.count - allocatedCount > 1 ? "s" : ""} at rating ${freeSkill.rating} from your priority.`,
                    severity: "error",
                  });
                }
              });
            }
          }
        }
        break;
      }

      case "qualities": {
        // Validate karma limits
        const positiveKarmaSpent = (state.budgets["karma-spent-positive"] as number) || 0;
        const negativeKarmaGained = (state.budgets["karma-gained-negative"] as number) || 0;

        if (positiveKarmaSpent > 25) {
          errors.push({
            constraintId: "positive-karma-limit",
            stepId,
            message: `Positive qualities exceed 25 Karma limit (${positiveKarmaSpent} spent).`,
            severity: "error",
          });
        }

        if (negativeKarmaGained > 25) {
          errors.push({
            constraintId: "negative-karma-limit",
            stepId,
            message: `Negative qualities exceed 25 Karma limit (${negativeKarmaGained} gained).`,
            severity: "error",
          });
        }

        // Validate quality prerequisites and incompatibilities if we have ruleset
        if (ruleset && editionCode) {
          const validationCharacter = buildCharacterFromCreationState(state, editionCode);
          const qualityValidation = validateAllQualities(validationCharacter as Character, ruleset);

          if (!qualityValidation.valid) {
            for (const error of qualityValidation.errors) {
              errors.push({
                constraintId: `quality-${error.qualityId}`,
                stepId,
                message: `${error.qualityId}: ${error.message}`,
                severity: "error",
              });
            }
          }
        }
        break;
      }

      case "gear": {
        // Check nuyen carryover (max 5,000)
        const nuyenBudget = budgetValues["nuyen"] || 0;
        const nuyenSpent = (state.budgets["nuyen-spent"] as number) || 0;
        const nuyenRemaining = nuyenBudget - nuyenSpent;
        if (nuyenRemaining > 5000) {
          errors.push({
            constraintId: "nuyen-carryover",
            stepId,
            message: `You have ${nuyenRemaining.toLocaleString()} nuyen remaining. Maximum carryover is 5,000 nuyen.`,
            severity: "warning",
          });
        }
        break;
      }

      case "karma":
        // Check Karma carryover (max 7)
        const karmaBase = budgetValues["karma"] || 25;
        const karmaGained = (state.budgets["karma-gained-negative"] as number) || 0;
        const karmaSpentPos = (state.budgets["karma-spent-positive"] as number) || 0;
        const karmaSpentGear = (state.budgets["karma-spent-gear"] as number) || 0;
        const karmaSpentSpells = (state.budgets["karma-spent-spells"] as number) || 0;
        const karmaSpentForms = (state.budgets["karma-spent-complex-forms"] as number) || 0;
        const karmaSpentPowerPoints = (state.budgets["karma-spent-power-points"] as number) || 0;
        const karmaRemaining = karmaBase + karmaGained - karmaSpentPos - karmaSpentGear - karmaSpentSpells - karmaSpentForms - karmaSpentPowerPoints;
        if (karmaRemaining > 7) {
          errors.push({
            constraintId: "karma-carryover",
            stepId,
            message: `You have ${karmaRemaining} Karma remaining. Maximum carryover is 7 Karma. Spend ${karmaRemaining - 7} more.`,
            severity: "warning",
          });
        }
        break;

      case "identities": {
        // Import types for validation
        const identities = (state.selections.identities || []) as Array<{
          name: string;
          sin?: { type: "fake" | "real"; rating?: number; sinnerQuality?: string };
          licenses?: Array<{ type: "fake" | "real"; rating?: number; name: string }>;
        }>;
        const negativeQualities = (state.selections.negativeQualities || []) as string[];
        const hasSINnerQuality = negativeQualities.includes("sinner");

        // Must have at least one identity
        if (identities.length === 0) {
          errors.push({
            constraintId: "identities-required",
            stepId,
            message: "Character must have at least one identity.",
            severity: "error",
          });
        }

        // Each identity must have exactly one SIN
        identities.forEach((identity, index) => {
          if (!identity.sin) {
            errors.push({
              constraintId: `identity-${index}-sin-required`,
              stepId,
              message: `Identity "${identity.name || `Identity ${index + 1}`}" must have a SIN.`,
              severity: "error",
            });
          } else {
            // Fake SIN validation
            if (identity.sin.type === "fake") {
              if (!identity.sin.rating || identity.sin.rating < 1 || identity.sin.rating > 4) {
                errors.push({
                  constraintId: `identity-${index}-fake-sin-rating`,
                  stepId,
                  message: `Identity "${identity.name || `Identity ${index + 1}`}" fake SIN must have rating 1-4.`,
                  severity: "error",
                });
              }
            }
            // Real SIN validation
            if (identity.sin.type === "real") {
              if (!hasSINnerQuality) {
                errors.push({
                  constraintId: `identity-${index}-real-sin-requires-sinner`,
                  stepId,
                  message: `Identity "${identity.name || `Identity ${index + 1}`}" uses a real SIN but character does not have SINner quality.`,
                  severity: "error",
                });
              }
            }
          }

          // License validation
          identity.licenses?.forEach((license, licenseIndex) => {
            if (identity.sin?.type === "fake" && license.type !== "fake") {
              errors.push({
                constraintId: `identity-${index}-license-${licenseIndex}-type-mismatch`,
                stepId,
                message: `Identity "${identity.name || `Identity ${index + 1}`}" license "${license.name}" must be fake (identity uses fake SIN).`,
                severity: "error",
              });
            }
            if (identity.sin?.type === "real" && license.type !== "real") {
              errors.push({
                constraintId: `identity-${index}-license-${licenseIndex}-type-mismatch`,
                stepId,
                message: `Identity "${identity.name || `Identity ${index + 1}`}" license "${license.name}" must be real (identity uses real SIN).`,
                severity: "error",
              });
            }
            if (license.type === "fake" && (!license.rating || license.rating < 1 || license.rating > 4)) {
              errors.push({
                constraintId: `identity-${index}-license-${licenseIndex}-rating`,
                stepId,
                message: `Identity "${identity.name || `Identity ${index + 1}`}" fake license "${license.name}" must have rating 1-4.`,
                severity: "error",
              });
            }
          });
        });

        // Check lifestyle requirements
        const lifestyles = (state.selections.lifestyles || []) as Array<{
          id?: string;
          type: string;
          monthlyCost: number;
          modifications?: Array<{ catalogId?: string; name: string }>;
        }>;
        const primaryLifestyleId = state.selections.primaryLifestyleId as string | undefined;

        // Must have at least one lifestyle
        if (lifestyles.length === 0) {
          errors.push({
            constraintId: "lifestyle-required",
            stepId,
            message: "Character must have at least one lifestyle.",
            severity: "error",
          });
        }

        // Must have a primary lifestyle if multiple lifestyles exist
        if (lifestyles.length > 1 && !primaryLifestyleId) {
          errors.push({
            constraintId: "primary-lifestyle-required",
            stepId,
            message: "When multiple lifestyles are selected, one must be marked as primary.",
            severity: "error",
          });
        }

        // Validate permanent lifestyle costs

        break;
      }

      case "review":
        // Final validation checks - comprehensive validation for all prior steps

        // Check character name
        if (!state.selections.characterName || !(state.selections.characterName as string).trim()) {
          errors.push({
            constraintId: "character-name",
            stepId,
            message: "Please enter a character name.",
            severity: "warning",
          });
        }

        // Check priorities are complete
        if (Object.keys(state.priorities || {}).length < 5) {
          errors.push({
            constraintId: "priorities-incomplete",
            stepId,
            message: "Priorities are incomplete.",
            severity: "error",
          });
        }

        // Check metatype is selected
        if (!state.selections.metatype) {
          errors.push({
            constraintId: "metatype-not-selected",
            stepId,
            message: "Metatype not selected.",
            severity: "error",
          });
        }

        // Check attribute points spent
        const reviewAttrSpent = (state.budgets["attribute-points-spent"] as number) || 0;
        const reviewAttrTotal = (state.budgets["attribute-points-total"] as number) || 0;
        if (reviewAttrTotal > 0 && reviewAttrSpent < reviewAttrTotal - 5) {
          errors.push({
            constraintId: "attributes-unspent",
            stepId,
            message: `${reviewAttrTotal - reviewAttrSpent} attribute points unspent.`,
            severity: "warning",
          });
        }

        // Check skill points spent
        const reviewSkillSpent = (state.budgets["skill-points-spent"] as number) || 0;
        const reviewSkillTotal = (state.budgets["skill-points-total"] as number) || 0;
        if (reviewSkillTotal > 0 && reviewSkillSpent < reviewSkillTotal * 0.5) {
          errors.push({
            constraintId: "skills-unspent",
            stepId,
            message: "Many skill points remaining.",
            severity: "warning",
          });
        }

        // Final Karma carryover check
        const finalKarmaBase = budgetValues["karma"] || 25;
        const finalKarmaGained = (state.budgets["karma-gained-negative"] as number) || 0;
        const finalKarmaSpent =
          ((state.budgets["karma-spent-positive"] as number) || 0) +
          ((state.budgets["karma-spent-gear"] as number) || 0) +
          ((state.budgets["karma-spent-spells"] as number) || 0) +
          ((state.budgets["karma-spent-complex-forms"] as number) || 0) +
          ((state.budgets["karma-spent-power-points"] as number) || 0);
        const finalKarmaRemaining = finalKarmaBase + finalKarmaGained - finalKarmaSpent;
        if (finalKarmaRemaining > 7) {
          errors.push({
            constraintId: "final-karma-carryover",
            stepId,
            message: `${finalKarmaRemaining} Karma remaining exceeds the 7 Karma carryover limit.`,
            severity: "warning",
          });
        }

        // Final nuyen carryover check
        const finalNuyenBudget = budgetValues["nuyen"] || 0;
        const finalNuyenSpent = (state.budgets["nuyen-spent"] as number) || 0;
        const finalNuyenRemaining = finalNuyenBudget - finalNuyenSpent;
        if (finalNuyenRemaining > 5000) {
          errors.push({
            constraintId: "final-nuyen-carryover",
            stepId,
            message: `${finalNuyenRemaining.toLocaleString()} nuyen remaining exceeds the 5,000 nuyen carryover limit.`,
            severity: "warning",
          });
        }
        break;
    }

    return errors;
  }, [currentStep?.id, state, budgetValues, priorityTable, ruleset, editionCode]);

  // Current step validation errors
  const currentStepErrors = useMemo(() => {
    return validateCurrentStep();
  }, [validateCurrentStep]);

  // Sync validation results to state for ValidationPanel display
  useEffect(() => {
    const errors = currentStepErrors.filter((e) => e.severity === "error");
    const warnings = currentStepErrors.filter((e) => e.severity === "warning");

    // Only update if there's a change to avoid infinite loops
    const currentErrorMessages = state.errors.map((e) => e.message).sort().join(",");
    const currentWarningMessages = state.warnings.map((w) => w.message).sort().join(",");
    const newErrorMessages = errors.map((e) => e.message).sort().join(",");
    const newWarningMessages = warnings.map((w) => w.message).sort().join(",");

    if (currentErrorMessages !== newErrorMessages || currentWarningMessages !== newWarningMessages) {
      setState((prev) => ({
        ...prev,
        errors,
        warnings,
      }));
    }
  }, [currentStepErrors, state.errors, state.warnings]);

  // Check if current step can proceed
  const canProceed = useMemo(() => {
    return !currentStepErrors.some((e) => e.severity === "error");
  }, [currentStepErrors]);

  // Extract cart data from state
  const gearItems = useMemo(() => (state.selections?.gear as GearItem[]) || [], [state.selections?.gear]);
  const weapons = useMemo(() => (state.selections?.weapons as Weapon[]) || [], [state.selections?.weapons]);
  const armorItems = useMemo(() => (state.selections?.armor as ArmorItem[]) || [], [state.selections?.armor]);
  const cyberwareItems = useMemo(() => (state.selections?.cyberware as CyberwareItem[]) || [], [state.selections?.cyberware]);
  const biowareItems = useMemo(() => (state.selections?.bioware as BiowareItem[]) || [], [state.selections?.bioware]);
  const lifestyle = useMemo(() => (state.selections?.lifestyle as Lifestyle) || null, [state.selections?.lifestyle]);
  const selectedSpells = useMemo(() => (state.selections?.spells as string[]) || [], [state.selections?.spells]);
  const selectedAdeptPowers = useMemo(() => (state.selections?.adeptPowers as AdeptPower[]) || [], [state.selections?.adeptPowers]);

  // Calculate cart totals (including weapons and armor with their mods)
  const gearTotal = useMemo(() => {
    const basicGearTotal = gearItems.reduce((sum, item) => sum + item.cost * item.quantity, 0);
    const weaponsTotal = weapons.reduce((sum, weapon) => {
      const baseCost = weapon.cost * weapon.quantity;
      const modsCost = (weapon.modifications || []).reduce((modSum, mod) => modSum + mod.cost, 0);
      return sum + baseCost + modsCost;
    }, 0);
    const armorTotal = armorItems.reduce((sum, armor) => {
      const baseCost = armor.cost * armor.quantity;
      const modsCost = (armor.modifications || []).reduce((modSum, mod) => modSum + mod.cost, 0);
      return sum + baseCost + modsCost;
    }, 0);
    return basicGearTotal + weaponsTotal + armorTotal;
  }, [gearItems, weapons, armorItems]);

  const lifestyleCost = useMemo(() => {
    if (!lifestyle) return 0;
    const metatype = (state.selections?.metatype as string) || "human";
    const modifier = lifestyleModifiers[metatype] || 1;
    return Math.floor(lifestyle.monthlyCost * modifier);
  }, [lifestyle, state.selections?.metatype, lifestyleModifiers]);

  const augmentationTotal = useMemo(() => {
    return (
      cyberwareItems.reduce((sum, item) => sum + item.cost, 0) +
      biowareItems.reduce((sum, item) => sum + item.cost, 0)
    );
  }, [cyberwareItems, biowareItems]);

  // Helper to check if lifestyle is permanent
  const isLifestylePermanent = (lifestyle: Lifestyle): boolean => {
    return lifestyle.modifications?.some((mod) => mod.catalogId === "permanent-lifestyle" || mod.name.toLowerCase() === "permanent lifestyle") || false;
  };

  // Calculate lifestyle cost (including modifications and permanent purchase)
  const calculateLifestyleCost = useCallback((lifestyle: Lifestyle): number => {
    if (!lifestyle.type) return 0;

    // Find base lifestyle cost
    const baseLifestyle = availableLifestyles.find((l) => l.id === lifestyle.type || l.name.toLowerCase() === lifestyle.type.toLowerCase());
    if (!baseLifestyle) return 0;

    const metatype = (state.selections?.metatype as string) || "human";
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
    if (isLifestylePermanent(lifestyle)) {
      return finalMonthlyCost * 100; // Permanent: 100 × monthly cost
    }

    return finalMonthlyCost; // Monthly: 1 month prepaid
  }, [availableLifestyles, lifestyleModifiers, state.selections?.metatype]);

  // Calculate identity costs (fake SINs, licenses, and associated lifestyles)
  const identityTotal = useMemo(() => {
    const identities = (state.selections?.identities || []) as Array<{
      sin?: { type: "fake" | "real"; rating?: number };
      licenses?: Array<{ type: "fake" | "real"; rating?: number }>;
      associatedLifestyleId?: string;
    }>;
    const lifestyles = (state.selections?.lifestyles || []) as Lifestyle[];

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
  }, [state.selections?.identities, state.selections?.lifestyles, calculateLifestyleCost]);

  const essenceLoss = useMemo(() => {
    const cyberwareEssence = cyberwareItems.reduce(
      (sum, item) => sum + item.essenceCost,
      0
    );
    const biowareEssence = biowareItems.reduce(
      (sum, item) => sum + item.essenceCost,
      0
    );
    return Math.round((cyberwareEssence + biowareEssence) * 100) / 100;
  }, [cyberwareItems, biowareItems]);

  // Calculate spells data
  const spellsKarmaSpent = useMemo(() => {
    return (state.budgets["karma-spent-spells"] as number) || 0;
  }, [state.budgets]);

  const freeSpellsCount = useMemo(() => {
    const magicPriority = state.priorities?.magic;
    const magicalPath = (state.selections["magical-path"] as string) || "mundane";

    if (!magicPriority || !priorityTable?.table[magicPriority]) {
      return 0;
    }

    const magicData = priorityTable.table[magicPriority].magic as {
      options?: Array<{
        path: string;
        spells?: number;
        magicRating?: number;
      }>;
    };

    const option = magicData?.options?.find((o) => o.path === magicalPath);
    return option?.spells || 0;
  }, [state.priorities?.magic, priorityTable, state.selections]);

  // Calculate adept powers data
  const powerPointsSpent = useMemo(() => {
    return (state.budgets["power-points-spent"] as number) || 0;
  }, [state.budgets]);

  const powerPointsBudget = useMemo(() => {
    const magicPriority = state.priorities?.magic;
    const magicalPath = (state.selections["magical-path"] as string) || "mundane";
    const isMysticAdept = magicalPath === "mystic-adept";

    if (!magicPriority || !priorityTable?.table[magicPriority]) {
      return 0;
    }

    const magicData = priorityTable.table[magicPriority].magic as {
      options?: Array<{
        path: string;
        magicRating?: number;
      }>;
    };

    const option = magicData?.options?.find((o) => o.path === magicalPath);
    const magicRating = option?.magicRating || 0;

    // Base PP budget
    const basePP = isMysticAdept
      ? ((state.selections["power-points-allocation"] as number) || 0)
      : magicRating;

    // Add karma-purchased PP
    const karmaSpentPP = (state.budgets["karma-spent-power-points"] as number) || 0;
    const karmaPurchasedPP = Math.floor(karmaSpentPP / 5); // 5 Karma = 1 PP

    return basePP + karmaPurchasedPP;
  }, [state.priorities?.magic, priorityTable, state.selections, state.budgets]);

  // Get spell name helper (will be passed to ValidationPanel)
  const getSpellName = useCallback((spellId: string): string => {
    if (!spellsCatalog) return spellId;

    // Search through all spell categories
    const categories = ['combat', 'detection', 'health', 'illusion', 'manipulation'] as const;
    for (const category of categories) {
      if (spellsCatalog[category]) {
        const spell = spellsCatalog[category].find((s) => s.id === spellId);
        if (spell) return spell.name;
      }
    }

    return spellId;
  }, [spellsCatalog]);

  // Sync calculated budgets to state
  useEffect(() => {
    const totalNuyenSpent = gearTotal + lifestyleCost + augmentationTotal + identityTotal;

    // Check if values have changed to avoid loops
    const currentNuyenSpent = (state.budgets["nuyen-spent"] as number) || 0;
    const currentEssenceSpent = (state.budgets["essence-spent"] as number) || 0;
    const currentGearSpent = (state.budgets["nuyen-spent-gear"] as number) || 0;
    const currentAugSpent = (state.budgets["nuyen-spent-augmentations"] as number) || 0;
    const currentLifestyleSpent = (state.budgets["nuyen-spent-lifestyle"] as number) || 0;
    const currentIdentitySpent = (state.budgets["nuyen-spent-identities"] as number) || 0;

    if (
      totalNuyenSpent !== currentNuyenSpent ||
      essenceLoss !== currentEssenceSpent ||
      gearTotal !== currentGearSpent ||
      augmentationTotal !== currentAugSpent ||
      lifestyleCost !== currentLifestyleSpent ||
      identityTotal !== currentIdentitySpent
    ) {
      setState((prev) => ({
        ...prev,
        budgets: {
          ...prev.budgets,
          "nuyen-spent": totalNuyenSpent,
          "nuyen-spent-gear": gearTotal,
          "nuyen-spent-augmentations": augmentationTotal,
          "nuyen-spent-lifestyle": lifestyleCost,
          "nuyen-spent-identities": identityTotal,
          "essence-spent": essenceLoss,
        },
        updatedAt: new Date().toISOString(),
      }));
    }
  }, [gearTotal, lifestyleCost, augmentationTotal, identityTotal, essenceLoss, state.budgets]);

  // Navigation handlers
  const goToStep = useCallback((stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      setState((prev) => ({
        ...prev,
        currentStep: stepIndex,
        updatedAt: new Date().toISOString(),
      }));
    }
  }, [steps.length]);

  const goNext = useCallback(() => {
    if (state.currentStep < steps.length - 1 && canProceed) {
      setState((prev) => ({
        ...prev,
        currentStep: prev.currentStep + 1,
        completedSteps: prev.completedSteps.includes(currentStep?.id || "")
          ? prev.completedSteps
          : [...prev.completedSteps, currentStep?.id || ""],
        updatedAt: new Date().toISOString(),
      }));
    }
  }, [state.currentStep, steps.length, currentStep?.id, canProceed]);

  const goBack = useCallback(() => {
    if (state.currentStep > 0) {
      setState((prev) => ({
        ...prev,
        currentStep: prev.currentStep - 1,
        updatedAt: new Date().toISOString(),
      }));
    }
  }, [state.currentStep]);

  // Update state handler
  const updateState = useCallback((updates: Partial<CreationState>) => {
    setState((prev) => ({
      ...prev,
      ...updates,
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  // Cart removal callbacks
  const handleRemoveGear = useCallback(
    (index: number) => {
      const updatedGear = gearItems.filter((_, i) => i !== index);
      updateState({
        selections: {
          ...state.selections,
          gear: updatedGear,
        },
      });
    },
    [gearItems, state.selections, updateState]
  );

  const handleRemoveWeapon = useCallback(
    (index: number) => {
      const updatedWeapons = weapons.filter((_, i) => i !== index);
      updateState({
        selections: {
          ...state.selections,
          weapons: updatedWeapons,
        },
      });
    },
    [weapons, state.selections, updateState]
  );

  const handleRemoveArmor = useCallback(
    (index: number) => {
      const updatedArmor = armorItems.filter((_, i) => i !== index);
      updateState({
        selections: {
          ...state.selections,
          armor: updatedArmor,
        },
      });
    },
    [armorItems, state.selections, updateState]
  );

  const handleRemoveCyberware = useCallback(
    (index: number) => {
      const updatedCyberware = cyberwareItems.filter((_, i) => i !== index);
      updateState({
        selections: {
          ...state.selections,
          cyberware: updatedCyberware,
        },
      });
    },
    [cyberwareItems, state.selections, updateState]
  );

  const handleRemoveBioware = useCallback(
    (index: number) => {
      const updatedBioware = biowareItems.filter((_, i) => i !== index);
      updateState({
        selections: {
          ...state.selections,
          bioware: updatedBioware,
        },
      });
    },
    [biowareItems, state.selections, updateState]
  );

  const handleRemoveSpell = useCallback(
    (spellId: string) => {
      const updatedSpells = selectedSpells.filter((id) => id !== spellId);
      const spellsBeyondFree = Math.max(0, updatedSpells.length - freeSpellsCount);
      const newKarmaSpentOnSpells = spellsBeyondFree * 5; // 5 Karma per spell

      updateState({
        selections: {
          ...state.selections,
          spells: updatedSpells,
        },
        budgets: {
          ...state.budgets,
          "karma-spent-spells": newKarmaSpentOnSpells,
        },
      });
    },
    [selectedSpells, freeSpellsCount, state.selections, state.budgets, updateState]
  );

  const handleRemoveAdeptPower = useCallback(
    (powerId: string) => {
      const power = selectedAdeptPowers.find((p) => p.id === powerId);
      if (!power) return;

      const updatedPowers = selectedAdeptPowers.filter((p) => p.id !== powerId);
      const newPPSpent = powerPointsSpent - power.powerPointCost;

      updateState({
        selections: {
          ...state.selections,
          adeptPowers: updatedPowers,
        },
        budgets: {
          ...state.budgets,
          "power-points-spent": Math.max(0, newPPSpent),
        },
      });
    },
    [selectedAdeptPowers, powerPointsSpent, state.selections, state.budgets, updateState]
  );

  // Handle cancel with draft clearing option
  const handleCancel = useCallback(() => {
    if (Object.keys(state.priorities || {}).length > 0) {
      // Show confirmation? For now just exit
      // clearDraft(); // No local storage to clear
    }
    onCancel();
  }, [state.priorities, onCancel]);

  /*
  // Start fresh (clear draft)
  const startFresh = useCallback(() => {
    // clearDraft();
    setState(createInitialState());
    setHasDraft(false);
  }, []);
  */

  // Calculate derived stats using SR5 formulas
  const calculateDerivedStats = useCallback((
    attributes: Record<string, number>,
    specialAttributes: { edge: number; essence: number; magic?: number; resonance?: number }
  ): Record<string, number> => {
    const body = attributes.body || 1;
    const agility = attributes.agility || 1;
    const reaction = attributes.reaction || 1;
    const strength = attributes.strength || 1;
    const willpower = attributes.willpower || 1;
    const logic = attributes.logic || 1;
    const intuition = attributes.intuition || 1;
    const charisma = attributes.charisma || 1;
    const essence = specialAttributes.essence;

    return {
      // Initiative
      initiative: intuition + reaction,
      initiativeDice: 1,

      // Limits
      physicalLimit: Math.ceil(((strength * 2) + body + reaction) / 3),
      mentalLimit: Math.ceil(((logic * 2) + intuition + willpower) / 3),
      socialLimit: Math.ceil(((charisma * 2) + willpower + Math.ceil(essence)) / 3),

      // Condition Monitors
      physicalCM: Math.ceil(body / 2) + 8,
      stunCM: Math.ceil(willpower / 2) + 8,
      overflowCM: body,

      // Composure, Judge Intentions, Memory, Lift/Carry
      composure: charisma + willpower,
      judgeIntentions: charisma + intuition,
      memory: logic + willpower,
      liftCarry: body + strength,

      // Movement (meters per Combat Turn)
      walkSpeed: agility * 2,
      runSpeed: agility * 4,
    };
  }, []);

  // Save character to API
  const saveCharacter = useCallback(async (characterName: string) => {
    setIsSaving(true);
    setSaveError(null);

    try {
      // Get metatype data for attribute minimums
      const selectedMetatype = metatypes.find(
        (m) => m.id === state.selections.metatype
      );

      // Build character attributes with metatype minimums
      const baseAttributes: Record<string, number> = {};
      const attrKeys = ["body", "agility", "reaction", "strength", "willpower", "logic", "intuition", "charisma"];
      for (const attr of attrKeys) {
        const metatypeAttr = selectedMetatype?.attributes[attr];
        const minValue = metatypeAttr && "min" in metatypeAttr ? metatypeAttr.min : 1;
        const allocatedValue = (state.selections.attributes as Record<string, number>)?.[attr] || 0;
        baseAttributes[attr] = minValue + allocatedValue;
      }

      // Get magic path and priority info for calculating special attributes
      const selectedMagicPath = (state.selections["magical-path"] as string) || "mundane";
      const magicPriority = state.priorities?.magic;
      const allocatedSpecialAttrs = (state.selections.specialAttributes || {}) as Record<string, number>;

      // Calculate edge from metatype minimum + allocated points
      const edgeData = selectedMetatype?.attributes?.edge;
      const edgeMin = edgeData && "min" in edgeData ? edgeData.min : 1;
      const edgeValue = edgeMin + (allocatedSpecialAttrs.edge || 0);

      // Get magic/resonance base values from priority table
      let magicBase = 0;
      let resonanceBase = 0;
      if (magicPriority && selectedMagicPath !== "mundane" && priorityTable?.table[magicPriority]) {
        const magicData = priorityTable.table[magicPriority].magic as {
          options: Array<{ path: string; magicRating?: number; resonanceRating?: number }>;
        };
        const option = magicData?.options?.find((o) => o.path === selectedMagicPath);
        if (option) {
          magicBase = option.magicRating || 0;
          resonanceBase = option.resonanceRating || 0;
        }
      }

      // Calculate final magic/resonance values
      const hasMagic = magicBase > 0;
      const hasResonance = resonanceBase > 0;
      const magicValue = hasMagic ? magicBase + (allocatedSpecialAttrs.magic || 0) : undefined;
      const resonanceValue = hasResonance ? resonanceBase + (allocatedSpecialAttrs.resonance || 0) : undefined;

      // Build special attributes object
      const specialAttrs = {
        edge: edgeValue,
        essence: 6,
        magic: magicValue,
        resonance: resonanceValue,
      };

      // Calculate derived stats
      const derivedStats = calculateDerivedStats(baseAttributes, specialAttrs);

      // Calculate total Karma spent during creation
      const karmaSpentAtCreation =
        ((state.budgets["karma-spent-positive"] as number) || 0) +
        ((state.budgets["karma-spent-gear"] as number) || 0) +
        ((state.budgets["karma-spent-spells"] as number) || 0) +
        ((state.budgets["karma-spent-complex-forms"] as number) || 0) +
        ((state.budgets["karma-spent-power-points"] as number) || 0) +
        ((state.budgets["karma-spent-contacts"] as number) || 0);

      // Calculate remaining Karma (carryover into gameplay)
      const karmaRemaining =
        (budgetValues["karma"] || 25) +
        ((state.budgets["karma-gained-negative"] as number) || 0) -
        karmaSpentAtCreation;

      // Calculate nuyen remaining (after gear purchases)
      const nuyenBudget =
        (budgetValues["nuyen"] || 0) +
        (((state.budgets["karma-spent-gear"] as number) || 0) * 2000);
      const nuyenSpent = (state.budgets["nuyen-spent"] as number) || 0;
      const nuyenRemaining = Math.min(nuyenBudget - nuyenSpent, 5000); // Cap at 5,000 carryover

      // Build character data
      const characterData = {
        name: characterName || "Unnamed Runner",
        metatype: (state.selections.metatype as string) || "human",
        magicalPath: selectedMagicPath,
        tradition: (state.selections.tradition as string) || undefined,
        attributes: baseAttributes,
        specialAttributes: specialAttrs,
        skills: (state.selections.skills as Record<string, number>) || {},
        skillSpecializations: (state.selections.skillSpecializations as Record<string, string[]>) || {},
        knowledgeSkills: (state.selections.knowledgeSkills as Array<{ name: string; category: string; rating: number }>) || [],
        languages: (state.selections.languages as Array<{ name: string; rating: number; isNative?: boolean }>) || [],
        positiveQualities: ((state.selections.positiveQualities as string[]) || []).map(id => ({
          id,
          rating: (state.selections.qualityLevels as Record<string, number>)?.[id],
          specification: (state.selections.qualitySpecifications as Record<string, string>)?.[id]
        })),
        negativeQualities: ((state.selections.negativeQualities as string[]) || []).map(id => ({
          id,
          rating: (state.selections.qualityLevels as Record<string, number>)?.[id],
          specification: (state.selections.qualitySpecifications as Record<string, string>)?.[id]
        })),
        racialQualities: (state.selections.racialQualities as string[]) || [],
        spells: (state.selections.spells as string[]) || [],
        complexForms: (state.selections.complexForms as string[]) || [],
        adeptPowers: (state.selections.adeptPowers as AdeptPower[]) || [],
        weapons: (state.selections.weapons as Weapon[]) || [],
        armor: (state.selections.armor as ArmorItem[]) || [],
        cyberware: (state.selections.cyberware as CyberwareItem[]) || [],
        bioware: (state.selections.bioware as BiowareItem[]) || [],
        vehicles: (state.selections.vehicles as Vehicle[]) || [],
        drones: (state.selections.drones as CharacterDrone[]) || [],
        rccs: (state.selections.rccs as CharacterRCC[]) || [],
        autosofts: (state.selections.autosofts as CharacterAutosoft[]) || [],
        gear: (state.selections.gear as Array<{ id: string; name: string; quantity: number; cost: number }>) || [],
        identities: (state.selections.identities as Array<{
          id?: string;
          name: string;
          sin: { type: "fake"; rating: number } | { type: "real"; sinnerQuality: string };
          licenses?: Array<{
            id?: string;
            type: "fake" | "real";
            rating?: number;
            name: string;
            notes?: string;
          }>;
          associatedLifestyleId?: string;
          notes?: string;
        }>) || [],
        lifestyles: (state.selections.lifestyles as Array<{
          id?: string;
          type: string;
          monthlyCost: number;
          prepaidMonths?: number;
          location?: string;
          modifications?: Array<{
            id?: string;
            catalogId?: string;
            name: string;
            type: "positive" | "negative";
            modifierType: "percentage" | "fixed";
            modifier: number;
            effects?: string;
            notes?: string;
          }>;
          subscriptions?: Array<{
            id?: string;
            catalogId?: string;
            name: string;
            monthlyCost: number;
            category?: string;
            notes?: string;
          }>;
          customExpenses?: number;
          customIncome?: number;
          notes?: string;
        }>) || [],
        primaryLifestyleId: (state.selections.primaryLifestyleId as string) || undefined,
        sinnerQuality: (state.selections.sinnerQuality as string) || undefined,
        lifestyle: (state.selections.lifestyle as { id: string; name: string; months: number; cost: number }) || undefined, // Legacy support
        contacts: (state.selections.contacts as Array<{ name: string; connection: number; loyalty: number; type?: string; notes?: string }>) || [],
        nuyen: nuyenRemaining,
        startingNuyen: nuyenBudget,
        karmaCurrent: Math.min(karmaRemaining, 7), // Cap at 7 carryover
        karmaTotal: budgetValues["karma"] || 25,
        karmaSpentAtCreation,
        derivedStats,
        condition: {
          physicalDamage: 0,
          stunDamage: 0,
        },
      };

      let activeId = characterId;

      // If we don't have a server draft yet, create one
      if (!activeId) {
        // Create character draft via API
        const createResponse = await fetch("/api/characters", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            editionId: "sr5",
            editionCode: editionCode || "sr5",
            creationMethodId: state.creationMethodId,
            name: characterData.name,
          }),
        });

        const createResult = await createResponse.json();
        if (!createResult.success) {
          throw new Error(createResult.error || "Failed to create character");
        }
        activeId = createResult.character.id;
        // Update local ID
        setCharacterId(activeId);
      }

      // Assert activeId is string
      const finalId = activeId as string;

      // Update the character with full data AND creation state
      // We explicitly save creationState as well so it's consistent if we ever un-finalize or check history
      const updateResponse = await fetch(`/api/characters/${finalId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...characterData,
          metadata: {
            creationState: {
              ...state,
              characterId: finalId
            }
          }
        }),
      });

      const updateResult = await updateResponse.json();
      if (!updateResult.success) {
        throw new Error(updateResult.error || "Failed to update character");
      }

      // Finalize the character (change status from draft to active)
      const finalizeResponse = await fetch(`/api/characters/${finalId}/finalize`, {
        method: "POST",
      });

      const finalizeResult = await finalizeResponse.json();
      if (!finalizeResult.success) {
        throw new Error(finalizeResult.error || "Failed to finalize character");
      }

      // Clear draft and complete
      // clearDraft(); // No longer using local storage
      onComplete(finalId);
    } catch (error) {
      console.error("Failed to save character:", error);
      setSaveError(error instanceof Error ? error.message : "Failed to save character");
    } finally {
      setIsSaving(false);
    }
  }, [state, metatypes, editionCode, budgetValues, onComplete, priorityTable, calculateDerivedStats, characterId]);

  // Render step content
  const renderStepContent = () => {
    if (!currentStep) return null;

    const stepProps = {
      state,
      updateState,
      budgetValues,
    };

    switch (currentStep.id) {
      case "priorities":
        return <PriorityStep {...stepProps} />;
      case "metatype":
        return <MetatypeStep {...stepProps} />;
      case "attributes":
        return <AttributesStep {...stepProps} />;
      case "magic":
        return <MagicStep {...stepProps} />;
      case "skills":
        return <SkillsStep {...stepProps} />;
      case "qualities":
        return <QualitiesStep {...stepProps} />;
      case "contacts":
        return <ContactsStep {...stepProps} />;
      case "gear":
        return <GearStep {...stepProps} />;
      case "vehicles":
        return <VehiclesStep {...stepProps} />;
      case "programs":
        return <ProgramsStep {...stepProps} />;
      case "spells":
        return <SpellsStep {...stepProps} />;
      case "rituals":
        return <RitualsStep {...stepProps} />;
      case "adept-powers":
        return <AdeptPowersStep {...stepProps} />;
      case "karma":
        return <KarmaStep {...stepProps} />;
      case "identities":
        return <IdentitiesStep {...stepProps} />;
      case "review":
        return <ReviewStep {...stepProps} onComplete={onComplete} />;
      default:
        return (
          <div className="p-8 text-center text-zinc-500">
            Step not implemented: {currentStep.id}
          </div>
        );
    }
  };

  // Sidebar collapse state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Load sidebar state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("shadow-master-sidebar-collapsed");
    if (saved) {
      setIsSidebarCollapsed(JSON.parse(saved));
    }
  }, []);

  // Toggle sidebar and save
  const toggleSidebar = () => {
    const newState = !isSidebarCollapsed;
    setIsSidebarCollapsed(newState);
    localStorage.setItem("shadow-master-sidebar-collapsed", JSON.stringify(newState));
  };

  return (
    <div className="flex h-screen flex-row overflow-hidden bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <StepperSidebar
        steps={steps}
        currentStepIndex={state.currentStep}
        completedSteps={state.completedSteps}
        onStepClick={goToStep}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebar}
      />

      <div className="flex flex-1 flex-col overflow-hidden relative">
        {/* Header */}
        <div className="flex flex-shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-950/50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                {currentStep?.title || "Loading..."}
              </h2>
              {currentStep?.description && (
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {currentStep.description}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <span className="font-medium text-emerald-600 dark:text-emerald-400">
                {editionCode?.toUpperCase()}
              </span>
              <span>•</span>
              <span>
                Step {state.currentStep + 1} of {steps.length}
              </span>
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto p-6">{renderStepContent()}</div>

        {/* Footer Navigation */}
        <div className="border-t border-zinc-200 px-6 py-4 dark:border-zinc-800">
          {/* Save Error */}
          {saveError && (
            <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/30">
              <p className="text-sm text-red-700 dark:text-red-300">{saveError}</p>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              <Button
                onPress={handleCancel}
                className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Cancel
              </Button>
              {state.currentStep > 0 && (
                <Button
                  onPress={goBack}
                  className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  Back
                </Button>
              )}
            </div>
            <div className="flex items-center gap-3">
              {/* Validation indicator */}
              {!canProceed && (
                <span className="text-sm text-amber-600 dark:text-amber-400">
                  Complete required selections to continue
                </span>
              )}
              {state.currentStep < steps.length - 1 ? (
                <Button
                  onPress={goNext}
                  isDisabled={!canProceed}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${canProceed
                    ? "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500"
                    : "cursor-not-allowed bg-zinc-300 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400"
                    }`}
                >
                  Continue
                </Button>
              ) : (
                <Button
                  onPress={() => {
                    const characterName = (state.selections.characterName as string) || "";
                    saveCharacter(characterName);
                  }}
                  isDisabled={isSaving}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${isSaving
                    ? "bg-zinc-400 text-zinc-200 cursor-wait"
                    : "bg-emerald-600 text-white hover:bg-emerald-700"
                    }`}
                >
                  {isSaving ? "Creating..." : "Create Character"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Validation Panel */}
      <ValidationPanel
        state={state}
        budgetValues={budgetValues}
        currentStepId={currentStep?.id}
        gearItems={gearItems}
        weapons={weapons}
        armorItems={armorItems}
        lifestyle={lifestyle}
        gearTotal={gearTotal}
        lifestyleCost={lifestyleCost}
        onRemoveGear={handleRemoveGear}
        onRemoveWeapon={handleRemoveWeapon}
        onRemoveArmor={handleRemoveArmor}
        cyberwareItems={cyberwareItems}
        biowareItems={biowareItems}
        augmentationTotal={augmentationTotal}
        essenceLoss={essenceLoss}
        onRemoveCyberware={handleRemoveCyberware}
        onRemoveBioware={handleRemoveBioware}
        spells={selectedSpells}
        spellsKarmaSpent={spellsKarmaSpent}
        freeSpellsCount={freeSpellsCount}
        onRemoveSpell={handleRemoveSpell}
        getSpellName={getSpellName}
        adeptPowers={selectedAdeptPowers}
        powerPointsSpent={powerPointsSpent}
        powerPointsBudget={powerPointsBudget}
        onRemoveAdeptPower={handleRemoveAdeptPower}
      />
    </div >
  );
}

