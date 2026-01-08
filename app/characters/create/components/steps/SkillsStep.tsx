"use client";

import { useMemo, useCallback, useState, useEffect } from "react";
import { useSkills, usePriorityTable } from "@/lib/rules";
import type { CreationState, KnowledgeSkill, LanguageSkill, FreeSkillAllocation, AdeptPower } from "@/lib/types";

interface StepProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
  budgetValues: Record<string, number>;
}

type SkillCategory = "combat" | "physical" | "social" | "technical" | "vehicle" | "magical" | "resonance";
type KnowledgeCategory = "academic" | "interests" | "professional" | "street";
type TabType = "active" | "knowledge" | "language";

const CATEGORY_LABELS: Record<SkillCategory, string> = {
  combat: "Combat",
  physical: "Physical",
  social: "Social",
  technical: "Technical",
  vehicle: "Vehicle",
  magical: "Magical",
  resonance: "Resonance",
};

const KNOWLEDGE_CATEGORY_LABELS: Record<KnowledgeCategory, string> = {
  academic: "Academic",
  interests: "Interests",
  professional: "Professional",
  street: "Street",
};

const MAX_SKILL_RATING = 6; // At character creation

// Magical skill groups that require magic
const MAGICAL_SKILL_GROUPS = ["sorcery", "conjuring", "enchanting"];
// Resonance skill groups that require resonance
const RESONANCE_SKILL_GROUPS = ["tasking"];

export function SkillsStep({ state, updateState, budgetValues }: StepProps) {
  const { activeSkills, skillGroups, knowledgeCategories, creationLimits, exampleKnowledgeSkills, exampleLanguages } = useSkills();
  const priorityTable = usePriorityTable();
  const skillPoints = budgetValues["skill-points"] || 0;
  const skillGroupPoints = budgetValues["skill-group-points"] || 0;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | "all">("all");
  const [activeTab, setActiveTab] = useState<TabType>("active");
  const [newKnowledgeSkill, setNewKnowledgeSkill] = useState({ name: "", category: "academic" as KnowledgeCategory });
  const [newLanguage, setNewLanguage] = useState("");

  // Determine if character has magic or resonance based on their magical path
  // Note: The key is "magical-path" as set by MagicStep
  const magicPath = state.selections["magical-path"] as string | undefined;

  // Different magic types have different skill group access:
  // - Magician (full-mage): All magical skill groups (Sorcery, Conjuring, Enchanting)
  // - Mystic Adept: Sorcery and Conjuring (per SR5 rules, can use both)
  // - Aspected Mage: Only ONE chosen skill group (stored in state)
  // - Adept: NO magical skill groups (channels magic internally for powers only)
  // - Technomancer: Tasking skill group only
  const isFullMage = magicPath === "magician";
  const isMysticAdept = magicPath === "mystic-adept";
  const isAspectedMage = magicPath === "aspected-mage";
  const isAdept = magicPath === "adept";
  const hasResonance = magicPath === "technomancer";

  // Get aspected mage's chosen skill group (if applicable)
  const aspectedMageGroup = state.selections["aspected-mage-group"] as string | undefined;

  // Determine which magical skill groups this character can access
  const canUseMagicSkillGroups = isFullMage || isMysticAdept || (isAspectedMage && aspectedMageGroup);

  // For individual skill filtering (requiresMagic flag)
  const hasMagic = magicPath && ["magician", "aspected-mage", "mystic-adept", "adept"].includes(magicPath);

  // Check if character has Astral Perception (required for Assensing skill)
  // Note: Technomancers don't see magical skills at all (filtered out), so we only need to check for adepts/mystic adepts
  const hasAstralPerception = useMemo(() => {
    // Magicians and Aspected Mages have astral perception by default
    if (isFullMage || isAspectedMage) {
      return true;
    }

    // For adepts and mystic adepts, check if they have the Astral Perception power
    if (isAdept || isMysticAdept) {
      const adeptPowers = (state.selections.adeptPowers || []) as AdeptPower[];
      return adeptPowers.some(power => power.catalogId === "astral-perception");
    }

    // Technomancers and mundane don't have astral perception (but technomancers don't see magical skills anyway)
    return false;
  }, [state.selections.adeptPowers, isFullMage, isAspectedMage, isAdept, isMysticAdept]);

  // Get tooltip message for disabled Assensing (only for adepts/mystic adepts without Astral Perception)
  const getAssensingDisabledReason = useCallback(() => {
    if ((isAdept || isMysticAdept) && !hasAstralPerception) {
      return "Requires Astral Perception adept power";
    }
    return "";
  }, [isAdept, isMysticAdept, hasAstralPerception]);

  // Get current skill values from state
  const skills = useMemo(() => {
    return (state.selections.skills || {}) as Record<string, number>;
  }, [state.selections.skills]);

  // Get current skill group values from state
  const groups = useMemo(() => {
    return (state.selections.skillGroups || {}) as Record<string, number>;
  }, [state.selections.skillGroups]);

  // Get current knowledge skills from state
  const knowledgeSkills = useMemo(() => {
    return (state.selections.knowledgeSkills || []) as KnowledgeSkill[];
  }, [state.selections.knowledgeSkills]);

  // Get current languages from state
  const languages = useMemo(() => {
    return (state.selections.languages || []) as LanguageSkill[];
  }, [state.selections.languages]);

  // Check if character has Bilingual quality
  const hasBilingual = useMemo(() => {
    const positiveQualities = (state.selections.positiveQualities || []) as string[];
    return positiveQualities.includes("bilingual");
  }, [state.selections.positiveQualities]);

  // Count native languages
  const nativeLanguageCount = useMemo(() => {
    return languages.filter(l => l.isNative).length;
  }, [languages]);

  // Get current skill specializations from state
  const specializations = useMemo(() => {
    return (state.selections.skillSpecializations || {}) as Record<string, string>;
  }, [state.selections.skillSpecializations]);

  // Calculate attribute values for free knowledge points
  const intuition = useMemo(() => {
    const attrs = (state.selections.attributes || {}) as Record<string, number>;
    return (attrs.intuition || 0) + 1; // Add 1 for metatype minimum
  }, [state.selections.attributes]);

  const logic = useMemo(() => {
    const attrs = (state.selections.attributes || {}) as Record<string, number>;
    return (attrs.logic || 0) + 1; // Add 1 for metatype minimum
  }, [state.selections.attributes]);

  // Calculate free knowledge/language points: (LOG + INT) × 2
  const freeKnowledgePoints = useMemo(() => {
    return (logic + intuition) * 2;
  }, [logic, intuition]);

  // Get current free skill allocations from state
  const freeSkillAllocations = useMemo(() => {
    return (state.selections.freeSkillAllocations || []) as FreeSkillAllocation[];
  }, [state.selections.freeSkillAllocations]);

  // Calculate available free skills from priority table
  const availableFreeSkills = useMemo(() => {
    if (!priorityTable || !state.priorities?.magic || !magicPath) {
      return [];
    }

    const magicPriority = state.priorities.magic;
    const priorityData = priorityTable.table[magicPriority];
    if (!priorityData?.magic) {
      return [];
    }

    const magicData = priorityData.magic as {
      options: Array<{
        path: string;
        freeSkills?: Array<{
          type: "magical" | "resonance" | "active" | "magicalGroup";
          rating: number;
          count: number;
        }>;
      }>;
    };

    const selectedOption = magicData.options?.find((opt) => opt.path === magicPath);
    if (!selectedOption?.freeSkills) {
      return [];
    }

    return selectedOption.freeSkills;
  }, [priorityTable, state.priorities, magicPath]);

  // Calculate free skill ratings allocated per skill/group
  const freeSkillRatings = useMemo(() => {
    const ratings: Record<string, number> = {};
    freeSkillAllocations.forEach((allocation) => {
      allocation.allocated.forEach((alloc) => {
        if (alloc.skillId) {
          ratings[alloc.skillId] = (ratings[alloc.skillId] || 0) + alloc.rating;
        }
        if (alloc.groupId) {
          ratings[alloc.groupId] = (ratings[alloc.groupId] || 0) + alloc.rating;
        }
      });
    });
    return ratings;
  }, [freeSkillAllocations]);

  // Reconciliation: Clear allocations if available free skills change (e.g. priority change)
  useEffect(() => {
    // Check if current allocations match available free skills structure
    const isMismatch = availableFreeSkills.length !== freeSkillAllocations.length ||
      availableFreeSkills.some((freeSkill, index) => {
        const allocation = freeSkillAllocations[index];
        if (!allocation) return true;
        return allocation.type !== freeSkill.type ||
          allocation.rating !== freeSkill.rating ||
          allocation.count !== freeSkill.count;
      });

    if (isMismatch) {
      // Reset allocations to match available structure
      const newAllocations = availableFreeSkills.map(freeSkill => ({
        type: freeSkill.type,
        rating: freeSkill.rating,
        count: freeSkill.count,
        allocated: []
      }));

      // Cleanup stale skills/groups (remove the free rating portion)
      const newSkills = { ...skills };
      const newGroups = { ...groups };

      freeSkillAllocations.forEach(allocation => {
        allocation.allocated.forEach(alloc => {
          if (alloc.skillId) {
            const currentRating = newSkills[alloc.skillId] || 0;
            const freeR = alloc.rating;
            // Determine if there was any purchased rating underneath
            const purchased = Math.max(0, currentRating - freeR);
            if (purchased > 0) {
              newSkills[alloc.skillId] = purchased;
            } else {
              delete newSkills[alloc.skillId];
            }
          }
          if (alloc.groupId) {
            const currentRating = newGroups[alloc.groupId] || 0;
            const freeR = alloc.rating;
            const purchased = Math.max(0, currentRating - freeR);
            if (purchased > 0) {
              newGroups[alloc.groupId] = purchased;
            } else {
              delete newGroups[alloc.groupId];
            }
          }
        });
      });

      updateState({
        selections: {
          ...state.selections,
          freeSkillAllocations: newAllocations,
          skills: newSkills,
          skillGroups: newGroups,
        }
      });
    }
  }, [availableFreeSkills, freeSkillAllocations, skills, groups, state.selections, updateState]);

  // Calculate points spent (skills + specializations at 1 point each)
  // Exclude free skill ratings from the calculation
  const skillPointsSpent = useMemo(() => {
    let skillsTotal = 0;
    Object.entries(skills).forEach(([skillId, rating]) => {
      const freeRating = freeSkillRatings[skillId] || 0;
      const purchasedRating = Math.max(0, rating - freeRating);
      skillsTotal += purchasedRating;
    });
    const specializationsTotal = Object.keys(specializations).length;
    return skillsTotal + specializationsTotal;
  }, [skills, specializations, freeSkillRatings]);

  const groupPointsSpent = useMemo(() => {
    let total = 0;
    Object.entries(groups).forEach(([groupId, rating]) => {
      const freeRating = freeSkillRatings[groupId] || 0;
      const purchasedRating = Math.max(0, rating - freeRating);
      total += purchasedRating;
    });
    return total;
  }, [groups, freeSkillRatings]);

  const knowledgePointsSpent = useMemo(() => {
    return knowledgeSkills.reduce((sum, skill) => sum + skill.rating, 0) +
      languages.filter(lang => !lang.isNative).reduce((sum, lang) => sum + lang.rating, 0);
  }, [knowledgeSkills, languages]);

  const skillPointsRemaining = skillPoints - skillPointsSpent;
  const groupPointsRemaining = skillGroupPoints - groupPointsSpent;
  const knowledgePointsRemaining = freeKnowledgePoints - knowledgePointsSpent;

  // Filter skills by category, search, and magic/resonance requirements
  const filteredSkills = useMemo(() => {
    return activeSkills.filter((skill) => {
      // Filter out resonance skills if character doesn't have resonance
      if (skill.requiresResonance && !hasResonance) {
        return false;
      }

      // Check if skill belongs to a magical skill group
      const skillGroup = skill.group;
      const isInMagicalGroup = skillGroup && MAGICAL_SKILL_GROUPS.includes(skillGroup);
      const isInResonanceGroup = skillGroup && RESONANCE_SKILL_GROUPS.includes(skillGroup);

      // Filter out resonance group skills if character doesn't have resonance
      if (isInResonanceGroup && !hasResonance) {
        return false;
      }

      // Filter out magical group skills based on character type
      if (isInMagicalGroup) {
        // Adepts cannot use ANY skills from magical skill groups
        if (isAdept) {
          return false;
        }
        // Characters without magic skill group access don't see them
        if (!canUseMagicSkillGroups) {
          return false;
        }
        // Aspected mages can only use skills from their chosen group
        if (isAspectedMage && aspectedMageGroup) {
          if (skillGroup !== aspectedMageGroup) {
            return false;
          }
        }
        // Mystic adepts can use Sorcery and Conjuring skills (not Enchanting)
        if (isMysticAdept) {
          if (skillGroup !== "sorcery" && skillGroup !== "conjuring") {
            return false;
          }
        }
      }

      // Filter out other magical skills (requiresMagic) if character doesn't have magic
      // Note: This is for skills that require Magic attribute but aren't in a magic skill group
      if (skill.requiresMagic && !hasMagic) {
        return false;
      }

      // Check search query
      if (searchQuery && !skill.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      // Check category
      if (selectedCategory !== "all" && skill.category !== selectedCategory) {
        return false;
      }
      return true;
    });
  }, [activeSkills, searchQuery, selectedCategory, hasMagic, hasResonance, isAdept, canUseMagicSkillGroups, isAspectedMage, aspectedMageGroup, isMysticAdept]);

  // Group filtered skills by category for visual organization
  const skillsByCategory = useMemo(() => {
    const grouped: Record<string, typeof filteredSkills> = {};

    filteredSkills.forEach((skill) => {
      const category = skill.category || "other";
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(skill);
    });

    // Sort skills within each category by name
    Object.keys(grouped).forEach((key) => {
      grouped[key].sort((a, b) => a.name.localeCompare(b.name));
    });

    // Create ordered array based on CATEGORY_LABELS order
    const orderedCategories: Array<{ categoryId: string; categoryName: string; skills: typeof filteredSkills }> = [];

    (Object.keys(CATEGORY_LABELS) as SkillCategory[]).forEach((cat) => {
      if (grouped[cat] && grouped[cat].length > 0) {
        orderedCategories.push({
          categoryId: cat,
          categoryName: CATEGORY_LABELS[cat],
          skills: grouped[cat],
        });
      }
    });

    // Add any "other" category skills at the end
    if (grouped["other"] && grouped["other"].length > 0) {
      orderedCategories.push({
        categoryId: "other",
        categoryName: "Other",
        skills: grouped["other"],
      });
    }

    return orderedCategories;
  }, [filteredSkills]);

  // Filter skill groups based on magic/resonance and character type
  const filteredSkillGroups = useMemo(() => {
    return skillGroups.filter((group) => {
      const isMagicalGroup = MAGICAL_SKILL_GROUPS.includes(group.id);
      const isResonanceGroup = RESONANCE_SKILL_GROUPS.includes(group.id);

      // Filter out resonance skill groups if character doesn't have resonance
      if (isResonanceGroup && !hasResonance) {
        return false;
      }

      // Filter out magical skill groups based on character type
      if (isMagicalGroup) {
        // Adepts cannot use ANY magical skill groups
        if (isAdept) {
          return false;
        }
        // Characters without magic skill group access don't see them
        if (!canUseMagicSkillGroups) {
          return false;
        }
        // Aspected mages can only use their chosen group
        if (isAspectedMage && aspectedMageGroup) {
          return group.id === aspectedMageGroup;
        }
        // Mystic adepts can use Sorcery and Conjuring (not Enchanting per core rules)
        if (isMysticAdept) {
          return group.id === "sorcery" || group.id === "conjuring";
        }
      }

      return true;
    });
  }, [skillGroups, hasResonance, isAdept, canUseMagicSkillGroups, isAspectedMage, aspectedMageGroup, isMysticAdept]);

  // Get all applicable skills for free skill allocation (not filtered by search/category)
  const allApplicableSkills = useMemo(() => {
    return activeSkills.filter((skill) => {
      // Filter out resonance skills if character doesn't have resonance
      if (skill.requiresResonance && !hasResonance) {
        return false;
      }

      // Check if skill belongs to a magical skill group
      const skillGroup = skill.group;
      const isInMagicalGroup = skillGroup && MAGICAL_SKILL_GROUPS.includes(skillGroup);
      const isInResonanceGroup = skillGroup && RESONANCE_SKILL_GROUPS.includes(skillGroup);

      // Filter out resonance group skills if character doesn't have resonance
      if (isInResonanceGroup && !hasResonance) {
        return false;
      }

      // Filter out magical group skills based on character type
      if (isInMagicalGroup) {
        // Adepts cannot use ANY skills from magical skill groups
        if (isAdept) {
          return false;
        }
        // Characters without magic skill group access don't see them
        if (!canUseMagicSkillGroups) {
          return false;
        }
        // Aspected mages can only use skills from their chosen group
        if (isAspectedMage && aspectedMageGroup) {
          if (skillGroup !== aspectedMageGroup) {
            return false;
          }
        }
        // Mystic adepts can use Sorcery and Conjuring skills (not Enchanting)
        if (isMysticAdept) {
          if (skillGroup !== "sorcery" && skillGroup !== "conjuring") {
            return false;
          }
        }
      }

      // Filter out other magical skills (requiresMagic) if character doesn't have magic
      if (skill.requiresMagic && !hasMagic) {
        return false;
      }

      return true;
    });
  }, [activeSkills, hasMagic, hasResonance, isAdept, canUseMagicSkillGroups, isAspectedMage, aspectedMageGroup, isMysticAdept]);

  // Get available categories (exclude magical/resonance if not applicable)
  const availableCategories = useMemo(() => {
    const categories = new Set<SkillCategory>();
    filteredSkills.forEach((skill) => {
      if (skill.category) {
        categories.add(skill.category as SkillCategory);
      }
    });
    return Array.from(categories).sort();
  }, [filteredSkills]);

  // Handle allocating a free skill
  const handleAllocateFreeSkill = useCallback(
    (freeSkillIndex: number, skillId: string) => {
      const freeSkill = availableFreeSkills[freeSkillIndex];
      if (!freeSkill) return;

      const currentAllocation = freeSkillAllocations[freeSkillIndex] || {
        type: freeSkill.type,
        rating: freeSkill.rating,
        count: freeSkill.count,
        allocated: [],
      };

      // Check if we've already allocated all free skills of this type
      if (currentAllocation.allocated.length >= freeSkill.count) {
        return;
      }

      // Check if this skill already has a free allocation
      const existingAlloc = currentAllocation.allocated.find((a) => a.skillId === skillId);
      if (existingAlloc) {
        return; // Already allocated
      }

      // Add the allocation
      const newAllocated = [
        ...currentAllocation.allocated,
        { skillId, rating: freeSkill.rating },
      ];

      const newAllocations = [...freeSkillAllocations];
      newAllocations[freeSkillIndex] = {
        ...currentAllocation,
        allocated: newAllocated,
      };

      // Update the skill rating to include the free rating
      const currentSkillRating = skills[skillId] || 0;
      const newSkills = { ...skills };
      newSkills[skillId] = Math.max(currentSkillRating, freeSkill.rating);

      updateState({
        selections: {
          ...state.selections,
          freeSkillAllocations: newAllocations,
          skills: newSkills,
        },
      });
    },
    [availableFreeSkills, freeSkillAllocations, skills, state.selections, updateState]
  );

  // Handle allocating a free skill group
  const handleAllocateFreeSkillGroup = useCallback(
    (freeSkillIndex: number, groupId: string) => {
      const freeSkill = availableFreeSkills[freeSkillIndex];
      if (!freeSkill || freeSkill.type !== "magicalGroup") return;

      const currentAllocation = freeSkillAllocations[freeSkillIndex] || {
        type: freeSkill.type,
        rating: freeSkill.rating,
        count: freeSkill.count,
        allocated: [],
      };

      // Check if we've already allocated all free groups
      if (currentAllocation.allocated.length >= freeSkill.count) {
        return;
      }

      // Check if this group already has a free allocation
      const existingAlloc = currentAllocation.allocated.find((a) => a.groupId === groupId);
      if (existingAlloc) {
        return; // Already allocated
      }

      // Add the allocation
      const newAllocated = [
        ...currentAllocation.allocated,
        { groupId, rating: freeSkill.rating },
      ];

      const newAllocations = [...freeSkillAllocations];
      newAllocations[freeSkillIndex] = {
        ...currentAllocation,
        allocated: newAllocated,
      };

      // Update the group rating to include the free rating
      const currentGroupRating = groups[groupId] || 0;
      const newGroups = { ...groups };
      newGroups[groupId] = Math.max(currentGroupRating, freeSkill.rating);

      updateState({
        selections: {
          ...state.selections,
          freeSkillAllocations: newAllocations,
          skillGroups: newGroups,
        },
      });
    },
    [availableFreeSkills, freeSkillAllocations, groups, state.selections, updateState]
  );

  // Handle removing a free skill allocation
  const handleRemoveFreeSkillAllocation = useCallback(
    (freeSkillIndex: number, skillId?: string, groupId?: string) => {
      const currentAllocation = freeSkillAllocations[freeSkillIndex];
      if (!currentAllocation) return;

      const newAllocated = currentAllocation.allocated.filter(
        (a) => a.skillId !== skillId && a.groupId !== groupId
      );

      const newAllocations = [...freeSkillAllocations];
      newAllocations[freeSkillIndex] = {
        ...currentAllocation,
        allocated: newAllocated,
      };

      // If removing a skill allocation, reduce the skill rating (but keep purchased rating)
      const newSkills = { ...skills };
      if (skillId) {
        const freeRating = freeSkillRatings[skillId] || 0;
        const currentRating = skills[skillId] || 0;
        // Keep the purchased rating (current - free)
        const purchasedRating = Math.max(0, currentRating - freeRating);
        if (purchasedRating > 0) {
          newSkills[skillId] = purchasedRating;
        } else {
          delete newSkills[skillId];
        }
      }

      // If removing a group allocation, reduce the group rating
      const newGroups = { ...groups };
      if (groupId) {
        const freeRating = freeSkillRatings[groupId] || 0;
        const currentRating = groups[groupId] || 0;
        const purchasedRating = Math.max(0, currentRating - freeRating);
        if (purchasedRating > 0) {
          newGroups[groupId] = purchasedRating;
        } else {
          delete newGroups[groupId];
        }
      }

      updateState({
        selections: {
          ...state.selections,
          freeSkillAllocations: newAllocations,
          skills: newSkills,
          skillGroups: newGroups,
        },
      });
    },
    [freeSkillAllocations, skills, groups, freeSkillRatings, state.selections, updateState]
  );

  // Handle individual skill change
  const handleSkillChange = useCallback(
    (skillId: string, newValue: number) => {
      // Prevent changes to Assensing if it's disabled (only for adepts/mystic adepts without Astral Perception)
      if (skillId === "assensing") {
        const isDisabled = (isAdept || isMysticAdept) && !hasAstralPerception;
        if (isDisabled) {
          return;
        }
      }

      const currentValue = skills[skillId] || 0;
      const freeRating = freeSkillRatings[skillId] || 0;
      const purchasedRating = Math.max(0, currentValue - freeRating);
      const newPurchasedRating = Math.max(0, newValue - freeRating);
      const valueDiff = newPurchasedRating - purchasedRating;

      // Check if we have enough points for increase
      if (valueDiff > 0 && valueDiff > skillPointsRemaining) {
        return;
      }

      // Clamp to limits
      const clampedValue = Math.max(0, Math.min(MAX_SKILL_RATING, newValue));

      const newSkills = { ...skills };
      const newSpecializations = { ...specializations };

      if (clampedValue === 0 && freeRating === 0) {
        delete newSkills[skillId];
        // Also remove any specialization when skill is reduced to 0
        delete newSpecializations[skillId];
      } else {
        newSkills[skillId] = clampedValue;
      }

      // Recalculate spent points (excluding free ratings)
      let newSpent = 0;
      Object.entries(newSkills).forEach(([sid, rating]) => {
        const free = freeSkillRatings[sid] || 0;
        newSpent += Math.max(0, rating - free);
      });
      newSpent += Object.keys(newSpecializations).length;

      updateState({
        selections: {
          ...state.selections,
          skills: newSkills,
          skillSpecializations: newSpecializations,
        },
        budgets: {
          ...state.budgets,
          "skill-points-spent": newSpent,
          "skill-points-total": skillPoints,
        },
      });
    },
    [skills, specializations, skillPointsRemaining, freeSkillRatings, state.selections, state.budgets, updateState, skillPoints, isAdept, isMysticAdept, hasAstralPerception]
  );

  // Handle skill group change
  const handleGroupChange = useCallback(
    (groupId: string, newValue: number) => {
      const currentValue = groups[groupId] || 0;
      const freeRating = freeSkillRatings[groupId] || 0;
      const purchasedRating = Math.max(0, currentValue - freeRating);
      const newPurchasedRating = Math.max(0, newValue - freeRating);
      const valueDiff = newPurchasedRating - purchasedRating;

      // Check if we have enough points for increase
      if (valueDiff > 0 && valueDiff > groupPointsRemaining) {
        return;
      }

      // Clamp to limits
      const clampedValue = Math.max(0, Math.min(MAX_SKILL_RATING, newValue));

      const newGroups = { ...groups };
      if (clampedValue === 0 && freeRating === 0) {
        delete newGroups[groupId];
      } else {
        newGroups[groupId] = clampedValue;
      }

      // Recalculate spent points (excluding free ratings)
      let newSpent = 0;
      Object.entries(newGroups).forEach(([gid, rating]) => {
        const free = freeSkillRatings[gid] || 0;
        newSpent += Math.max(0, rating - free);
      });

      updateState({
        selections: {
          ...state.selections,
          skillGroups: newGroups,
        },
        budgets: {
          ...state.budgets,
          "skill-group-points-spent": newSpent,
          "skill-group-points-total": skillGroupPoints,
        },
      });
    },
    [groups, groupPointsRemaining, freeSkillRatings, state.selections, state.budgets, updateState, skillGroupPoints]
  );

  // Handle adding/updating a skill specialization
  const handleSpecializationChange = useCallback(
    (skillId: string, specialization: string) => {
      const newSpecializations = { ...specializations };
      const hadSpecialization = !!specializations[skillId];

      if (specialization.trim()) {
        // Adding or updating specialization
        if (!hadSpecialization && skillPointsRemaining <= 0) {
          // Can't add new specialization without points
          return;
        }
        newSpecializations[skillId] = specialization.trim();
      } else {
        // Removing specialization
        delete newSpecializations[skillId];
      }

      updateState({
        selections: {
          ...state.selections,
          skillSpecializations: newSpecializations,
        },
      });
    },
    [specializations, skillPointsRemaining, state.selections, updateState]
  );

  // Handle removing a skill specialization
  const handleRemoveSpecialization = useCallback(
    (skillId: string) => {
      const newSpecializations = { ...specializations };
      delete newSpecializations[skillId];

      updateState({
        selections: {
          ...state.selections,
          skillSpecializations: newSpecializations,
        },
      });
    },
    [specializations, state.selections, updateState]
  );

  // Handle adding a knowledge skill
  const handleAddKnowledgeSkill = useCallback(() => {
    if (!newKnowledgeSkill.name.trim()) return;
    if (knowledgePointsRemaining <= 0) return;

    const newSkill: KnowledgeSkill = {
      name: newKnowledgeSkill.name.trim(),
      category: newKnowledgeSkill.category,
      rating: 1,
    };

    const updatedKnowledgeSkills = [...knowledgeSkills, newSkill];

    updateState({
      selections: {
        ...state.selections,
        knowledgeSkills: updatedKnowledgeSkills,
      },
      budgets: {
        ...state.budgets,
        "knowledge-points-spent": knowledgePointsSpent + 1,
        "knowledge-points-total": freeKnowledgePoints,
      },
    });

    setNewKnowledgeSkill({ name: "", category: "academic" });
  }, [newKnowledgeSkill, knowledgeSkills, knowledgePointsRemaining, knowledgePointsSpent, freeKnowledgePoints, state.selections, state.budgets, updateState]);

  // Handle changing knowledge skill rating
  const handleKnowledgeSkillChange = useCallback(
    (index: number, newRating: number) => {
      const skill = knowledgeSkills[index];
      const currentRating = skill.rating;
      const ratingDiff = newRating - currentRating;

      // Check if we have enough points
      if (ratingDiff > 0 && ratingDiff > knowledgePointsRemaining) {
        return;
      }

      const clampedRating = Math.max(1, Math.min(MAX_SKILL_RATING, newRating));
      const updatedSkills = [...knowledgeSkills];
      updatedSkills[index] = { ...skill, rating: clampedRating };

      const newSpent = updatedSkills.reduce((sum, s) => sum + s.rating, 0) +
        languages.filter(l => !l.isNative).reduce((sum, l) => sum + l.rating, 0);

      updateState({
        selections: {
          ...state.selections,
          knowledgeSkills: updatedSkills,
        },
        budgets: {
          ...state.budgets,
          "knowledge-points-spent": newSpent,
          "knowledge-points-total": freeKnowledgePoints,
        },
      });
    },
    [knowledgeSkills, languages, knowledgePointsRemaining, freeKnowledgePoints, state.selections, state.budgets, updateState]
  );

  // Handle removing a knowledge skill
  const handleRemoveKnowledgeSkill = useCallback(
    (index: number) => {
      const updatedSkills = knowledgeSkills.filter((_, i) => i !== index);
      const newSpent = updatedSkills.reduce((sum, s) => sum + s.rating, 0) +
        languages.filter(l => !l.isNative).reduce((sum, l) => sum + l.rating, 0);

      updateState({
        selections: {
          ...state.selections,
          knowledgeSkills: updatedSkills,
        },
        budgets: {
          ...state.budgets,
          "knowledge-points-spent": newSpent,
          "knowledge-points-total": freeKnowledgePoints,
        },
      });
    },
    [knowledgeSkills, languages, freeKnowledgePoints, state.selections, state.budgets, updateState]
  );

  // Handle adding a language
  const handleAddLanguage = useCallback(
    (isNative: boolean) => {
      if (!newLanguage.trim()) return;

      // Check if adding a native language (free) or regular language
      if (!isNative && knowledgePointsRemaining <= 0) return;

      // Check native language limits
      // - Everyone gets 1 free native language
      // - Bilingual quality grants a second free native language
      if (isNative) {
        const maxNativeLanguages = hasBilingual ? 2 : 1;
        if (nativeLanguageCount >= maxNativeLanguages) return;
      }

      const lang: LanguageSkill = {
        name: newLanguage.trim(),
        rating: isNative ? creationLimits.nativeLanguageRating : 1,
        isNative,
      };

      const updatedLanguages = [...languages, lang];

      const newSpent = knowledgeSkills.reduce((sum, s) => sum + s.rating, 0) +
        updatedLanguages.filter(l => !l.isNative).reduce((sum, l) => sum + l.rating, 0);

      updateState({
        selections: {
          ...state.selections,
          languages: updatedLanguages,
        },
        budgets: {
          ...state.budgets,
          "knowledge-points-spent": newSpent,
          "knowledge-points-total": freeKnowledgePoints,
        },
      });

      setNewLanguage("");
    },
    [newLanguage, languages, knowledgeSkills, knowledgePointsRemaining, creationLimits.nativeLanguageRating, freeKnowledgePoints, hasBilingual, nativeLanguageCount, state.selections, state.budgets, updateState]
  );

  // Handle changing language rating
  const handleLanguageChange = useCallback(
    (index: number, newRating: number) => {
      const lang = languages[index];
      if (lang.isNative) return; // Can't change native language rating

      const currentRating = lang.rating;
      const ratingDiff = newRating - currentRating;

      if (ratingDiff > 0 && ratingDiff > knowledgePointsRemaining) {
        return;
      }

      const clampedRating = Math.max(1, Math.min(MAX_SKILL_RATING, newRating));
      const updatedLanguages = [...languages];
      updatedLanguages[index] = { ...lang, rating: clampedRating };

      const newSpent = knowledgeSkills.reduce((sum, s) => sum + s.rating, 0) +
        updatedLanguages.filter(l => !l.isNative).reduce((sum, l) => sum + l.rating, 0);

      updateState({
        selections: {
          ...state.selections,
          languages: updatedLanguages,
        },
        budgets: {
          ...state.budgets,
          "knowledge-points-spent": newSpent,
          "knowledge-points-total": freeKnowledgePoints,
        },
      });
    },
    [languages, knowledgeSkills, knowledgePointsRemaining, freeKnowledgePoints, state.selections, state.budgets, updateState]
  );

  // Handle removing a language
  const handleRemoveLanguage = useCallback(
    (index: number) => {
      const updatedLanguages = languages.filter((_, i) => i !== index);
      const newSpent = knowledgeSkills.reduce((sum, s) => sum + s.rating, 0) +
        updatedLanguages.filter(l => !l.isNative).reduce((sum, l) => sum + l.rating, 0);

      updateState({
        selections: {
          ...state.selections,
          languages: updatedLanguages,
        },
        budgets: {
          ...state.budgets,
          "knowledge-points-spent": newSpent,
          "knowledge-points-total": freeKnowledgePoints,
        },
      });
    },
    [languages, knowledgeSkills, freeKnowledgePoints, state.selections, state.budgets, updateState]
  );

  // Check if we've reached max native languages (1 normally, 2 with Bilingual quality)
  const hasMaxNativeLanguages = useMemo(() => {
    const maxNativeLanguages = hasBilingual ? 2 : 1;
    return nativeLanguageCount >= maxNativeLanguages;
  }, [hasBilingual, nativeLanguageCount]);

  // Render skill row
  const renderSkill = (skill: { id: string; name: string; linkedAttribute: string; group?: string | null; suggestedSpecializations?: string[] }) => {
    const value = skills[skill.id] || 0;
    const freeRating = freeSkillRatings[skill.id] || 0;
    const purchasedRating = Math.max(0, value - freeRating);

    // Check if Assensing should be disabled (only for adepts/mystic adepts without Astral Perception)
    // Note: Technomancers don't see magical skills at all, so they're already filtered out
    const isAssensingDisabled = skill.id === "assensing" && (isAdept || isMysticAdept) && !hasAstralPerception;
    const assensingDisabledReason = isAssensingDisabled ? getAssensingDisabledReason() : "";

    const canIncrease = !isAssensingDisabled && value < MAX_SKILL_RATING && (skillPointsRemaining > 0 || freeRating > 0);
    const canDecrease = purchasedRating > 0; // Can decrease if there's purchased rating (free rating stays)

    // Check if this skill is covered by a group
    const groupRating = skill.group ? (groups[skill.group] || 0) : 0;
    const effectiveRating = Math.max(value, groupRating);

    // Specialization: can only add if skill has individual points (not just group rating)
    // Adding a specialization to a grouped skill would break the group
    const hasSpecialization = !!specializations[skill.id];
    const canAddSpecialization = !isAssensingDisabled && value > 0 && !hasSpecialization && skillPointsRemaining > 0;
    const usingGroupOnly = groupRating > 0 && value === 0;

    return (
      <div
        key={skill.id}
        className={`rounded-lg border p-3 transition-colors ${isAssensingDisabled
          ? "border-zinc-300 bg-zinc-100 opacity-60 dark:border-zinc-600 dark:bg-zinc-800/30"
          : value > 0
            ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20"
            : "border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800/50"
          }`}
        title={isAssensingDisabled ? assensingDisabledReason : undefined}
      >
        <div className="flex items-center gap-3">
          {/* Skill info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className={`font-medium truncate ${isAssensingDisabled ? "text-zinc-500 dark:text-zinc-400" : "text-zinc-900 dark:text-zinc-50"}`}>
                {skill.name}
                {isAssensingDisabled && assensingDisabledReason && (
                  <span className="ml-2 text-xs text-amber-600 dark:text-amber-400" title={assensingDisabledReason}>
                    ({assensingDisabledReason})
                  </span>
                )}
              </span>
              <span className="flex-shrink-0 rounded bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400">
                {skill.linkedAttribute?.toUpperCase().slice(0, 3)}
              </span>
              {freeRating > 0 && (
                <span className="flex-shrink-0 rounded bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/50 dark:text-blue-300" title="Free from priority">
                  Free {freeRating}
                </span>
              )}
              {hasSpecialization && (
                <span className="flex-shrink-0 rounded bg-amber-100 px-1.5 py-0.5 text-xs text-amber-700 dark:bg-amber-800 dark:text-amber-300">
                  +2 dice
                </span>
              )}
            </div>
            {skill.group && (
              <div className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                Group: {skillGroups.find((g) => g.id === skill.group)?.name || skill.group}
                {groupRating > 0 && (
                  <span className="ml-1 text-emerald-600 dark:text-emerald-400">(+{groupRating} from group)</span>
                )}
              </div>
            )}
          </div>

          {/* Value controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleSkillChange(skill.id, value - 1)}
              disabled={!canDecrease || isAssensingDisabled}
              title={isAssensingDisabled ? assensingDisabledReason : undefined}
              className={`flex h-7 w-7 items-center justify-center rounded transition-colors ${canDecrease && !isAssensingDisabled
                ? "bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600"
                : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
                }`}
            >
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>

            <div
              className={`flex h-8 w-10 items-center justify-center rounded text-sm font-bold ${effectiveRating > 0
                ? "bg-emerald-500 text-white"
                : "bg-zinc-200 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400"
                }`}
            >
              {effectiveRating}
            </div>

            <button
              onClick={() => handleSkillChange(skill.id, value + 1)}
              disabled={!canIncrease || isAssensingDisabled}
              title={isAssensingDisabled ? assensingDisabledReason : undefined}
              className={`flex h-7 w-7 items-center justify-center rounded transition-colors ${canIncrease && !isAssensingDisabled
                ? "bg-emerald-500 text-white hover:bg-emerald-600"
                : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
                }`}
            >
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>

        {/* Specialization section - only show if skill has individual rating */}
        {value > 0 && (
          <div className="mt-2 pt-2 border-t border-zinc-200 dark:border-zinc-700">
            {hasSpecialization ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500 dark:text-zinc-400">Specialization:</span>
                <span className="rounded bg-amber-100 px-2 py-0.5 text-sm font-medium text-amber-800 dark:bg-amber-800 dark:text-amber-200">
                  {specializations[skill.id]}
                </span>
                <button
                  onClick={() => handleRemoveSpecialization(skill.id)}
                  disabled={isAssensingDisabled}
                  title={isAssensingDisabled ? assensingDisabledReason : "Remove specialization (refunds 1 skill point)"}
                  className={`ml-auto flex h-5 w-5 items-center justify-center rounded transition-colors ${isAssensingDisabled
                    ? "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
                    : "bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {skill.suggestedSpecializations && skill.suggestedSpecializations.length > 0 ? (
                  <div className="flex flex-1 gap-2">
                    <select
                      className="flex-1 rounded border border-zinc-300 bg-white px-2 py-1 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={!canAddSpecialization || isAssensingDisabled}
                      title={isAssensingDisabled ? assensingDisabledReason : undefined}
                      defaultValue=""
                      onChange={(e) => {
                        if (e.target.value && canAddSpecialization) {
                          handleSpecializationChange(skill.id, e.target.value);
                          e.target.value = "";
                        }
                      }}
                    >
                      <option value="" disabled>Select or type custom...</option>
                      {skill.suggestedSpecializations.map((spec) => (
                        <option key={spec} value={spec}>{spec}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Or custom..."
                      className="w-28 rounded border border-zinc-300 bg-white px-2 py-1 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={!canAddSpecialization || isAssensingDisabled}
                      title={isAssensingDisabled ? assensingDisabledReason : undefined}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          const input = e.currentTarget;
                          if (input.value.trim()) {
                            handleSpecializationChange(skill.id, input.value);
                            input.value = "";
                          }
                        }
                      }}
                      onBlur={(e) => {
                        if (e.currentTarget.value.trim() && canAddSpecialization) {
                          handleSpecializationChange(skill.id, e.currentTarget.value);
                          e.currentTarget.value = "";
                        }
                      }}
                    />
                  </div>
                ) : (
                  <input
                    type="text"
                    placeholder="Add specialization (1 point, +2 dice)..."
                    className="flex-1 rounded border border-zinc-300 bg-white px-2 py-1 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={!canAddSpecialization}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const input = e.currentTarget;
                        if (input.value.trim()) {
                          handleSpecializationChange(skill.id, input.value);
                          input.value = "";
                        }
                      }
                    }}
                    onBlur={(e) => {
                      if (e.currentTarget.value.trim() && canAddSpecialization) {
                        handleSpecializationChange(skill.id, e.currentTarget.value);
                        e.currentTarget.value = "";
                      }
                    }}
                  />
                )}
                {!canAddSpecialization && skillPointsRemaining <= 0 && (
                  <span className="text-xs text-zinc-400">No points</span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Warning for group-only skills that can't have specializations */}
        {usingGroupOnly && (
          <div className="mt-2 pt-2 border-t border-zinc-200 dark:border-zinc-700">
            <span className="text-xs text-zinc-400 italic">
              Add individual skill points to enable specialization
            </span>
          </div>
        )}
      </div>
    );
  };

  // Render skill group
  const renderGroup = (group: { id: string; name: string; skills: string[] }) => {
    const value = groups[group.id] || 0;
    const freeRating = freeSkillRatings[group.id] || 0;
    const purchasedRating = Math.max(0, value - freeRating);
    const canIncrease = value < MAX_SKILL_RATING && (groupPointsRemaining > 0 || freeRating > 0);
    const canDecrease = purchasedRating > 0; // Can decrease if there's purchased rating (free rating stays)

    return (
      <div
        key={group.id}
        className={`flex items-center gap-3 rounded-lg border p-3 ${value > 0
          ? "border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-900/20"
          : "border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800/50"
          }`}
      >
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="font-medium text-zinc-900 dark:text-zinc-50">{group.name}</div>
            {freeRating > 0 && (
              <span className="flex-shrink-0 rounded bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/50 dark:text-blue-300" title="Free from priority">
                Free {freeRating}
              </span>
            )}
          </div>
          <div className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
            Includes: {group.skills.map((s) => activeSkills.find((as) => as.id === s)?.name || s).join(", ")}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => handleGroupChange(group.id, value - 1)}
            disabled={!canDecrease}
            className={`flex h-7 w-7 items-center justify-center rounded transition-colors ${canDecrease
              ? "bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200"
              : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
              }`}
          >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>

          <div
            className={`flex h-8 w-10 items-center justify-center rounded text-sm font-bold ${value > 0
              ? "bg-purple-500 text-white"
              : "bg-zinc-200 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400"
              }`}
          >
            {value}
          </div>

          <button
            onClick={() => handleGroupChange(group.id, value + 1)}
            disabled={!canIncrease}
            className={`flex h-7 w-7 items-center justify-center rounded transition-colors ${canIncrease
              ? "bg-purple-500 text-white hover:bg-purple-600"
              : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
              }`}
          >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  // Render Active Skills tab content
  const renderActiveSkillsTab = () => (
    <>
      {/* Free Skills from Priority */}
      {availableFreeSkills.length > 0 && (
        <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
          <h3 className="mb-3 text-sm font-semibold text-blue-900 dark:text-blue-100">
            Free Skills from Priority
          </h3>
          <div className="space-y-3">
            {availableFreeSkills.map((freeSkill, index) => {
              const currentAllocation = freeSkillAllocations[index] || {
                type: freeSkill.type,
                rating: freeSkill.rating,
                count: freeSkill.count,
                allocated: [],
              };
              const allocatedCount = currentAllocation.allocated.length;
              const remainingCount = freeSkill.count - allocatedCount;

              // Get applicable skills/groups based on type
              let applicableItems: Array<{ id: string; name: string }> = [];
              if (freeSkill.type === "magical") {
                applicableItems = allApplicableSkills
                  .filter((s) => {
                    const skillGroup = s.group;
                    // Filter out Assensing if character doesn't have Astral Perception
                    if (s.id === "assensing" && !hasAstralPerception) {
                      return false;
                    }
                    return skillGroup && MAGICAL_SKILL_GROUPS.includes(skillGroup);
                  })
                  .map((s) => ({ id: s.id, name: s.name }));
              } else if (freeSkill.type === "resonance") {
                applicableItems = allApplicableSkills
                  .filter((s) => {
                    const skillGroup = s.group;
                    return skillGroup && RESONANCE_SKILL_GROUPS.includes(skillGroup);
                  })
                  .map((s) => ({ id: s.id, name: s.name }));
              } else if (freeSkill.type === "active") {
                applicableItems = allApplicableSkills
                  .filter((s) => {
                    // Filter out Assensing if character doesn't have Astral Perception
                    if (s.id === "assensing" && !hasAstralPerception) {
                      return false;
                    }
                    return true;
                  })
                  .map((s) => ({ id: s.id, name: s.name }));
              } else if (freeSkill.type === "magicalGroup") {
                applicableItems = filteredSkillGroups
                  .filter((g) => MAGICAL_SKILL_GROUPS.includes(g.id))
                  .map((g) => ({ id: g.id, name: g.name }));
              }

              return (
                <div key={index} className="rounded border border-blue-200 bg-white p-3 dark:border-blue-800 dark:bg-zinc-800/50">
                  <div className="mb-2 flex items-center justify-between">
                    <div>
                      <span className="font-medium text-blue-900 dark:text-blue-100">
                        {freeSkill.count} {freeSkill.type === "magicalGroup" ? "magical skill group" : freeSkill.type === "active" ? "active skill" : freeSkill.type === "resonance" ? "resonance skill" : "magical skill"}
                        {freeSkill.count > 1 ? "s" : ""} at rating {freeSkill.rating}
                      </span>
                      <span className="ml-2 text-sm text-blue-600 dark:text-blue-400">
                        ({allocatedCount} allocated, {remainingCount} remaining)
                      </span>
                    </div>
                  </div>
                  {remainingCount > 0 && (
                    <div className="space-y-2">
                      <select
                        className="w-full rounded border border-blue-300 bg-white px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-blue-600 dark:bg-zinc-800 dark:text-zinc-100"
                        defaultValue=""
                        onChange={(e) => {
                          if (e.target.value) {
                            if (freeSkill.type === "magicalGroup") {
                              handleAllocateFreeSkillGroup(index, e.target.value);
                            } else {
                              handleAllocateFreeSkill(index, e.target.value);
                            }
                            e.target.value = "";
                          }
                        }}
                      >
                        <option value="" disabled>
                          Select {freeSkill.type === "magicalGroup" ? "skill group" : "skill"}...
                        </option>
                        {applicableItems
                          .filter((item) => {
                            // Filter out already allocated items
                            return !currentAllocation.allocated.some(
                              (a) => a.skillId === item.id || a.groupId === item.id
                            );
                          })
                          .map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          ))}
                      </select>
                    </div>
                  )}
                  {currentAllocation.allocated.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {currentAllocation.allocated.map((alloc, allocIndex) => {
                        const itemName =
                          alloc.skillId
                            ? applicableItems.find((i) => i.id === alloc.skillId)?.name || alloc.skillId
                            : alloc.groupId
                              ? applicableItems.find((i) => i.id === alloc.groupId)?.name || alloc.groupId
                              : "Unknown";
                        return (
                          <div
                            key={allocIndex}
                            className="flex items-center justify-between rounded bg-blue-100 px-2 py-1 text-sm dark:bg-blue-900/30"
                          >
                            <span className="text-blue-900 dark:text-blue-100">{itemName} (rating {alloc.rating})</span>
                            <button
                              onClick={() =>
                                handleRemoveFreeSkillAllocation(index, alloc.skillId, alloc.groupId)
                              }
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                            >
                              Remove
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Points remaining indicators */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg bg-emerald-50 p-4 dark:bg-emerald-900/20">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-emerald-800 dark:text-emerald-200">Skill Points</div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400">For individual skills</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{skillPointsRemaining}</div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400">of {skillPoints}</div>
            </div>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-emerald-200 dark:bg-emerald-800">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${skillPoints > 0 ? (skillPointsSpent / skillPoints) * 100 : 0}%` }}
            />
          </div>
        </div>

        <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-purple-800 dark:text-purple-200">Skill Group Points</div>
              <div className="text-xs text-purple-600 dark:text-purple-400">For skill groups</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">{groupPointsRemaining}</div>
              <div className="text-xs text-purple-600 dark:text-purple-400">of {skillGroupPoints}</div>
            </div>
          </div>
          {skillGroupPoints > 0 && (
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-purple-200 dark:bg-purple-800">
              <div
                className="h-full rounded-full bg-purple-500 transition-all duration-300"
                style={{ width: `${(groupPointsSpent / skillGroupPoints) * 100}%` }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Skill Groups */}
      {skillGroupPoints > 0 && filteredSkillGroups.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Skill Groups
          </h3>
          <div className="space-y-2">
            {filteredSkillGroups.map(renderGroup)}
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value as SkillCategory | "all")}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
        >
          <option value="all">All Categories</option>
          {availableCategories.map((cat) => (
            <option key={cat} value={cat}>
              {CATEGORY_LABELS[cat] || cat}
            </option>
          ))}
        </select>
      </div>

      {/* Individual Skills - Grouped by Category */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Active Skills ({filteredSkills.length})
        </h3>

        {skillsByCategory.length === 0 ? (
          <p className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
            No skills match your search.
          </p>
        ) : (
          <div className="space-y-6">
            {skillsByCategory.map(({ categoryId, categoryName, skills: categorySkills }) => (
              <div key={categoryId}>
                {/* Category Header */}
                <div className="mb-2 flex items-center gap-2">
                  <div className="h-px flex-1 bg-emerald-300 dark:bg-emerald-700" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    {categoryName}
                  </span>
                  <div className="h-px flex-1 bg-emerald-300 dark:bg-emerald-700" />
                </div>

                {/* Skills in this category */}
                <div className="space-y-2">
                  {categorySkills.map(renderSkill)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );

  // Render Knowledge Skills tab content
  const renderKnowledgeSkillsTab = () => (
    <>
      {/* Points indicator */}
      <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-900/20">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-amber-800 dark:text-amber-200">Knowledge Points</div>
            <div className="text-xs text-amber-600 dark:text-amber-400">
              (Logic {logic} + Intuition {intuition}) × 2 = {freeKnowledgePoints}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">{knowledgePointsRemaining}</div>
            <div className="text-xs text-amber-600 dark:text-amber-400">remaining</div>
          </div>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-amber-200 dark:bg-amber-800">
          <div
            className="h-full rounded-full bg-amber-500 transition-all duration-300"
            style={{ width: `${freeKnowledgePoints > 0 ? (knowledgePointsSpent / freeKnowledgePoints) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Add new knowledge skill */}
      <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
        <h4 className="mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">Add Knowledge Skill</h4>
        <div className="flex flex-col gap-3">
          {/* Example skills dropdown */}
          {exampleKnowledgeSkills && exampleKnowledgeSkills.length > 0 && (
            <div className="flex items-center gap-2">
              <select
                className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                defaultValue=""
                disabled={knowledgePointsRemaining <= 0}
                onChange={(e) => {
                  const selected = exampleKnowledgeSkills.find(s => s.name === e.target.value);
                  if (selected) {
                    setNewKnowledgeSkill({ name: selected.name, category: selected.category as KnowledgeCategory });
                  }
                  e.target.value = "";
                }}
              >
                <option value="" disabled>Quick add from examples...</option>
                <optgroup label="Academic">
                  {exampleKnowledgeSkills.filter(s => s.category === "academic").map((skill) => (
                    <option key={skill.name} value={skill.name}>{skill.name}</option>
                  ))}
                </optgroup>
                <optgroup label="Interests">
                  {exampleKnowledgeSkills.filter(s => s.category === "interests").map((skill) => (
                    <option key={skill.name} value={skill.name}>{skill.name}</option>
                  ))}
                </optgroup>
                <optgroup label="Professional">
                  {exampleKnowledgeSkills.filter(s => s.category === "professional").map((skill) => (
                    <option key={skill.name} value={skill.name}>{skill.name}</option>
                  ))}
                </optgroup>
                <optgroup label="Street">
                  {exampleKnowledgeSkills.filter(s => s.category === "street").map((skill) => (
                    <option key={skill.name} value={skill.name}>{skill.name}</option>
                  ))}
                </optgroup>
              </select>
            </div>
          )}
          {/* Custom skill input */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              placeholder="Or type custom skill name..."
              value={newKnowledgeSkill.name}
              onChange={(e) => setNewKnowledgeSkill({ ...newKnowledgeSkill, name: e.target.value })}
              className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
            />
            <select
              value={newKnowledgeSkill.category}
              onChange={(e) => setNewKnowledgeSkill({ ...newKnowledgeSkill, category: e.target.value as KnowledgeCategory })}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
            >
              {(knowledgeCategories.length > 0 ? knowledgeCategories : [
                { id: "academic", name: "Academic" },
                { id: "interests", name: "Interests" },
                { id: "professional", name: "Professional" },
                { id: "street", name: "Street" },
              ]).map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleAddKnowledgeSkill}
              disabled={!newKnowledgeSkill.name.trim() || knowledgePointsRemaining <= 0}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${newKnowledgeSkill.name.trim() && knowledgePointsRemaining > 0
                ? "bg-amber-500 text-white hover:bg-amber-600"
                : "cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-700"
                }`}
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Knowledge skills list */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Knowledge Skills ({knowledgeSkills.length})
        </h3>

        {knowledgeSkills.length === 0 ? (
          <p className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
            No knowledge skills added yet. Add skills that represent your character&apos;s background and interests.
          </p>
        ) : (
          <div className="space-y-2">
            {knowledgeSkills.map((skill, index) => (
              <div
                key={`${skill.name}-${index}`}
                className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/20"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-zinc-900 dark:text-zinc-50 truncate">{skill.name}</span>
                    <span className="flex-shrink-0 rounded bg-amber-100 px-1.5 py-0.5 text-xs text-amber-700 dark:bg-amber-800 dark:text-amber-300">
                      {KNOWLEDGE_CATEGORY_LABELS[skill.category] || skill.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleKnowledgeSkillChange(index, skill.rating - 1)}
                    disabled={skill.rating <= 1}
                    className={`flex h-7 w-7 items-center justify-center rounded transition-colors ${skill.rating > 1
                      ? "bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200"
                      : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
                      }`}
                  >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>

                  <div className="flex h-8 w-10 items-center justify-center rounded bg-amber-500 text-sm font-bold text-white">
                    {skill.rating}
                  </div>

                  <button
                    onClick={() => handleKnowledgeSkillChange(index, skill.rating + 1)}
                    disabled={skill.rating >= MAX_SKILL_RATING || knowledgePointsRemaining <= 0}
                    className={`flex h-7 w-7 items-center justify-center rounded transition-colors ${skill.rating < MAX_SKILL_RATING && knowledgePointsRemaining > 0
                      ? "bg-amber-500 text-white hover:bg-amber-600"
                      : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
                      }`}
                  >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>

                  <button
                    onClick={() => handleRemoveKnowledgeSkill(index)}
                    className="ml-2 flex h-7 w-7 items-center justify-center rounded bg-red-100 text-red-600 transition-colors hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );

  // Render Language Skills tab content
  const renderLanguageSkillsTab = () => (
    <>
      {/* Points indicator */}
      <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-900/20">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-amber-800 dark:text-amber-200">Knowledge Points</div>
            <div className="text-xs text-amber-600 dark:text-amber-400">
              Shared with Knowledge Skills
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">{knowledgePointsRemaining}</div>
            <div className="text-xs text-amber-600 dark:text-amber-400">of {freeKnowledgePoints} remaining</div>
          </div>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-amber-200 dark:bg-amber-800">
          <div
            className="h-full rounded-full bg-amber-500 transition-all duration-300"
            style={{ width: `${freeKnowledgePoints > 0 ? (knowledgePointsSpent / freeKnowledgePoints) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Native language note */}
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
        <div className="flex items-start gap-3">
          <svg className="h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-amber-800 dark:text-amber-200">
            <p className="font-medium">Native Language</p>
            <p className="mt-1 text-amber-600 dark:text-amber-400">
              Every character gets one native language at rating {creationLimits.nativeLanguageRating} for free.
              {hasBilingual && (
                <> Characters with the <strong>Bilingual</strong> quality can have a second native language for free.</>
              )}
              Additional languages cost points from your Knowledge pool.
            </p>
          </div>
        </div>
      </div>

      {/* Add new language */}
      <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
        <h4 className="mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">Add Language</h4>
        <div className="flex flex-col gap-3">
          {/* Example languages dropdown */}
          {exampleLanguages && exampleLanguages.length > 0 && (
            <div className="flex items-center gap-2">
              <select
                className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                defaultValue=""
                onChange={(e) => {
                  if (e.target.value) {
                    setNewLanguage(e.target.value);
                  }
                  e.target.value = "";
                }}
              >
                <option value="" disabled>Quick select from examples...</option>
                {exampleLanguages.map((lang) => (
                  <option key={lang.name} value={lang.name}>
                    {lang.name}{lang.region ? ` (${lang.region})` : ""}
                  </option>
                ))}
              </select>
            </div>
          )}
          {/* Custom language input */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              placeholder="Or type custom language..."
              value={newLanguage}
              onChange={(e) => setNewLanguage(e.target.value)}
              className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
            />
            <button
              onClick={() => handleAddLanguage(true)}
              disabled={!newLanguage.trim() || hasMaxNativeLanguages}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${newLanguage.trim() && !hasMaxNativeLanguages
                ? "bg-zinc-600 text-white hover:bg-zinc-700"
                : "cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-700"
                }`}
            >
              Add as Native
            </button>
            <button
              onClick={() => handleAddLanguage(false)}
              disabled={!newLanguage.trim() || knowledgePointsRemaining <= 0}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${newLanguage.trim() && knowledgePointsRemaining > 0
                ? "bg-amber-500 text-white hover:bg-amber-600"
                : "cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-700"
                }`}
            >
              Add
            </button>
          </div>
        </div>
        {hasMaxNativeLanguages && (
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            {hasBilingual
              ? "You already have two native languages (one free + one from Bilingual quality). Additional languages will start at rating 1."
              : "You already have a native language. Additional languages will start at rating 1."}
          </p>
        )}
      </div>

      {/* Languages list */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Languages ({languages.length})
        </h3>

        {languages.length === 0 ? (
          <p className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
            No languages added yet. Add your native language first, then any additional languages you know.
          </p>
        ) : (
          <div className="space-y-2">
            {languages.map((lang, index) => (
              <div
                key={`${lang.name}-${index}`}
                className={`flex items-center gap-3 rounded-lg border p-3 ${lang.isNative
                  ? "border-amber-300 bg-amber-100 dark:border-amber-700 dark:bg-amber-900/30"
                  : "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20"
                  }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-zinc-900 dark:text-zinc-50 truncate">{lang.name}</span>
                    {lang.isNative && (
                      <span className="flex-shrink-0 rounded bg-amber-200 px-1.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-800 dark:text-amber-200">
                        Native
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {lang.isNative ? (
                    <div className="flex h-8 w-10 items-center justify-center rounded bg-amber-600 text-sm font-bold text-white">
                      N
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => handleLanguageChange(index, lang.rating - 1)}
                        disabled={lang.rating <= 1}
                        className={`flex h-7 w-7 items-center justify-center rounded transition-colors ${lang.rating > 1
                          ? "bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200"
                          : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
                          }`}
                      >
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>

                      <div className="flex h-8 w-10 items-center justify-center rounded bg-amber-500 text-sm font-bold text-white">
                        {lang.rating}
                      </div>

                      <button
                        onClick={() => handleLanguageChange(index, lang.rating + 1)}
                        disabled={lang.rating >= MAX_SKILL_RATING || knowledgePointsRemaining <= 0}
                        className={`flex h-7 w-7 items-center justify-center rounded transition-colors ${lang.rating < MAX_SKILL_RATING && knowledgePointsRemaining > 0
                          ? "bg-amber-500 text-white hover:bg-amber-600"
                          : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
                          }`}
                      >
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => handleRemoveLanguage(index)}
                    className="ml-2 flex h-7 w-7 items-center justify-center rounded bg-red-100 text-red-600 transition-colors hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-zinc-200 dark:border-zinc-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("active")}
            className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors ${activeTab === "active"
              ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
              : "border-transparent text-zinc-500 hover:border-zinc-300 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
              }`}
          >
            Active Skills
            <span className={`ml-2 rounded-full px-2 py-0.5 text-xs ${activeTab === "active"
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
              : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
              }`}>
              {skillPointsRemaining}/{skillPoints}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("knowledge")}
            className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors ${activeTab === "knowledge"
              ? "border-amber-500 text-amber-600 dark:text-amber-400"
              : "border-transparent text-zinc-500 hover:border-zinc-300 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
              }`}
          >
            Knowledge Skills
            <span className={`ml-2 rounded-full px-2 py-0.5 text-xs ${activeTab === "knowledge"
              ? "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300"
              : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
              }`}>
              {knowledgeSkills.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("language")}
            className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors ${activeTab === "language"
              ? "border-amber-500 text-amber-600 dark:text-amber-400"
              : "border-transparent text-zinc-500 hover:border-zinc-300 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
              }`}
          >
            Languages
            <span className={`ml-2 rounded-full px-2 py-0.5 text-xs ${activeTab === "language"
              ? "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300"
              : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
              }`}>
              {languages.length}
            </span>
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === "active" && renderActiveSkillsTab()}
        {activeTab === "knowledge" && renderKnowledgeSkillsTab()}
        {activeTab === "language" && renderLanguageSkillsTab()}
      </div>
    </div>
  );
}
