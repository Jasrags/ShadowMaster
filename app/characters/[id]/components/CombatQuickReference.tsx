"use client";

/**
 * CombatQuickReference Component
 *
 * Pre-calculated combat pools for quick reference during gameplay.
 * Shows attack pools, defense pools, initiative, and armor values.
 *
 * Satisfies:
 * - Requirement: "CombatQuickReference with pre-calculated pools"
 * - Requirement: "integrated tools for rapid gameplay actions"
 */

import { useMemo } from "react";
import { THEMES, DEFAULT_THEME, type Theme } from "@/lib/themes";
import type { Character, Weapon, ArmorItem } from "@/lib/types";
import { DicePoolDisplay, type PoolModifier } from "./DicePoolDisplay";

// =============================================================================
// TYPES
// =============================================================================

export interface CombatQuickReferenceProps {
  character: Character;
  woundModifier: number;
  physicalLimit: number;
  onPoolSelect?: (pool: number, context: string) => void;
  theme?: Theme;
}

interface CombatPool {
  label: string;
  pool: number;
  modifiers: PoolModifier[];
  limit?: { value: number; type: "physical" | "mental" | "social" | "weapon" | "other" };
  context: string;
}

// =============================================================================
// HELPERS
// =============================================================================

function getAttributeValue(character: Character, attr: string): number {
  return character.attributes?.[attr] || 0;
}

function getSkillRating(character: Character, skillId: string): number {
  return character.skills?.[skillId] || 0;
}

function calculateDefensePool(character: Character): number {
  const reaction = getAttributeValue(character, "reaction");
  const intuition = getAttributeValue(character, "intuition");
  return reaction + intuition;
}

function calculateDodgePool(character: Character): number {
  const defensePool = calculateDefensePool(character);
  const gymnastics = getSkillRating(character, "gymnastics");
  return defensePool + gymnastics;
}

function calculateInitiative(character: Character): { base: number; dice: number } {
  const reaction = getAttributeValue(character, "reaction");
  const intuition = getAttributeValue(character, "intuition");
  return { base: reaction + intuition, dice: 1 };
}

function getTotalArmor(character: Character): number {
  const armor = character.gear?.filter((g): g is ArmorItem => 
    g.category === "armor"
  ) || [];
  
  // Get highest base armor value (typically worn armor)
  const wornArmor = armor.reduce((max, item) => {
    const rating = item.armorRating || 0;
    return rating > max ? rating : max;
  }, 0);
  
  return wornArmor;
}

function getWeaponPools(character: Character, physicalLimit: number): CombatPool[] {
  const weapons = (character.gear?.filter((g): g is Weapon => 
    g.category === "weapons"
  ) || []).slice(0, 3); // Limit to top 3 weapons

  return weapons.map((weapon) => {
    // Determine relevant skill based on weapon subcategory
    let skillId = "automatics";
    const attrId = "agility";
    const subcategory = weapon.subcategory?.toLowerCase() || "";
    
    if (subcategory.includes("melee") || subcategory.includes("blade")) {
      skillId = "blades";
    } else if (subcategory.includes("pistol")) {
      skillId = "pistols";
    } else if (subcategory.includes("rifle") || subcategory.includes("longarm")) {
      skillId = "longarms";
    }

    const attr = getAttributeValue(character, attrId);
    const skill = getSkillRating(character, skillId);
    const pool = attr + skill;

    const modifiers: PoolModifier[] = [
      { label: "Agility", value: attr, type: "attribute" },
      { label: skillId.charAt(0).toUpperCase() + skillId.slice(1), value: skill, type: "skill" },
    ];

    // Weapon accuracy as limit
    const accuracy = weapon.accuracy || physicalLimit;

    return {
      label: weapon.name,
      pool,
      modifiers,
      limit: { value: accuracy, type: "weapon" as const },
      context: `${weapon.name} Attack`,
    };
  });
}

// =============================================================================
// COMPONENT
// =============================================================================

export function CombatQuickReference({
  character,
  woundModifier,
  physicalLimit,
  onPoolSelect,
  theme,
}: CombatQuickReferenceProps) {
  const t = theme || THEMES[DEFAULT_THEME];

  // Calculate all combat pools
  const combatData = useMemo(() => {
    const reaction = getAttributeValue(character, "reaction");
    const intuition = getAttributeValue(character, "intuition");
    const body = getAttributeValue(character, "body");
    const armor = getTotalArmor(character);
    const initiative = calculateInitiative(character);

    // Defense pool
    const defensePool: CombatPool = {
      label: "Defense",
      pool: calculateDefensePool(character),
      modifiers: [
        { label: "Reaction", value: reaction, type: "attribute" },
        { label: "Intuition", value: intuition, type: "attribute" },
      ],
      context: "Defense Test",
    };

    // Full Defense (with dodge)
    const gymnastics = getSkillRating(character, "gymnastics");
    const fullDefensePool: CombatPool = {
      label: "Full Defense",
      pool: calculateDodgePool(character),
      modifiers: [
        { label: "Reaction", value: reaction, type: "attribute" },
        { label: "Intuition", value: intuition, type: "attribute" },
        { label: "Gymnastics", value: gymnastics, type: "skill" },
      ],
      context: "Full Defense Test",
    };

    // Soak (Body + Armor)
    const soakPool: CombatPool = {
      label: "Soak",
      pool: body + armor,
      modifiers: [
        { label: "Body", value: body, type: "attribute" },
        { label: "Armor", value: armor, type: "gear" },
      ],
      context: "Damage Resistance Test",
    };

    // Composure (Charisma + Willpower)
    const charisma = getAttributeValue(character, "charisma");
    const willpower = getAttributeValue(character, "willpower");
    const composurePool: CombatPool = {
      label: "Composure",
      pool: charisma + willpower,
      modifiers: [
        { label: "Charisma", value: charisma, type: "attribute" },
        { label: "Willpower", value: willpower, type: "attribute" },
      ],
      context: "Composure Test",
    };

    // Judge Intentions (Charisma + Intuition)
    const judgeIntentionsPool: CombatPool = {
      label: "Judge Intentions",
      pool: charisma + intuition,
      modifiers: [
        { label: "Charisma", value: charisma, type: "attribute" },
        { label: "Intuition", value: intuition, type: "attribute" },
      ],
      context: "Judge Intentions Test",
    };

    // Memory (Logic + Willpower)
    const logic = getAttributeValue(character, "logic");
    const memoryPool: CombatPool = {
      label: "Memory",
      pool: logic + willpower,
      modifiers: [
        { label: "Logic", value: logic, type: "attribute" },
        { label: "Willpower", value: willpower, type: "attribute" },
      ],
      context: "Memory Test",
    };

    // Weapon pools
    const weaponPools = getWeaponPools(character, physicalLimit);

    return {
      initiative,
      armor,
      defensePool,
      fullDefensePool,
      soakPool,
      composurePool,
      judgeIntentionsPool,
      memoryPool,
      weaponPools,
    };
  }, [character, physicalLimit]);

  const effectiveInit = combatData.initiative.base + woundModifier;

  return (
    <div className="space-y-4">
      {/* Initiative & Armor Row */}
      <div className="grid grid-cols-2 gap-3">
        <div
          className={`p-3 rounded border text-center ${t.colors.card} ${t.colors.border}`}
        >
          <span className={`block text-xs ${t.fonts.mono} text-muted-foreground uppercase mb-1`}>
            Initiative
          </span>
          <span className={`text-xl font-bold ${t.fonts.mono} ${
            woundModifier < 0 ? "text-amber-400" : t.colors.accent
          }`}>
            {effectiveInit}+{combatData.initiative.dice}d6
          </span>
          {woundModifier < 0 && (
            <span className="block text-[10px] text-red-400 mt-1">
              ({woundModifier} wound)
            </span>
          )}
        </div>

        <div
          className={`p-3 rounded border text-center ${t.colors.card} ${t.colors.border}`}
        >
          <span className={`block text-xs ${t.fonts.mono} text-muted-foreground uppercase mb-1`}>
            Armor
          </span>
          <span className={`text-xl font-bold ${t.fonts.mono} ${t.colors.heading}`}>
            {combatData.armor}
          </span>
        </div>
      </div>

      {/* Defense Pools */}
      <div className="grid grid-cols-2 gap-3">
        <DicePoolDisplay
          label={combatData.defensePool.label}
          basePool={combatData.defensePool.pool}
          modifiers={combatData.defensePool.modifiers}
          woundModifier={woundModifier}
          theme={theme}
          onClick={() => onPoolSelect?.(
            combatData.defensePool.pool + woundModifier,
            combatData.defensePool.context
          )}
        />
        <DicePoolDisplay
          label={combatData.fullDefensePool.label}
          basePool={combatData.fullDefensePool.pool}
          modifiers={combatData.fullDefensePool.modifiers}
          woundModifier={woundModifier}
          theme={theme}
          onClick={() => onPoolSelect?.(
            combatData.fullDefensePool.pool + woundModifier,
            combatData.fullDefensePool.context
          )}
        />
      </div>

      {/* Soak */}
      <DicePoolDisplay
        label={combatData.soakPool.label}
        basePool={combatData.soakPool.pool}
        modifiers={combatData.soakPool.modifiers}
        woundModifier={0} // Soak is typically not affected by wounds
        theme={theme}
        onClick={() => onPoolSelect?.(
          combatData.soakPool.pool,
          combatData.soakPool.context
        )}
      />

      {/* Weapon Attacks */}
      {combatData.weaponPools.length > 0 && (
        <div className="space-y-2">
          <span className={`text-xs ${t.fonts.mono} text-muted-foreground uppercase`}>
            Weapons
          </span>
          <div className="space-y-2">
            {combatData.weaponPools.map((weapon, idx) => (
              <DicePoolDisplay
                key={idx}
                label={weapon.label}
                basePool={weapon.pool}
                modifiers={weapon.modifiers}
                woundModifier={woundModifier}
                limit={weapon.limit}
                theme={theme}
                onClick={() => onPoolSelect?.(
                  Math.max(0, weapon.pool + woundModifier),
                  weapon.context
                )}
              />
            ))}
          </div>
        </div>
      )}

      {/* Secondary Pools */}
      <div className="space-y-2">
        <span className={`text-xs ${t.fonts.mono} text-muted-foreground uppercase`}>
          Common Tests
        </span>
        <div className="grid grid-cols-3 gap-2">
          {[combatData.composurePool, combatData.judgeIntentionsPool, combatData.memoryPool].map((pool, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onPoolSelect?.(pool.pool + woundModifier, pool.context)}
              className={`p-2 rounded border text-center transition-colors hover:border-emerald-500/50 ${t.colors.card} ${t.colors.border}`}
            >
              <span className={`block text-[10px] ${t.fonts.mono} text-muted-foreground uppercase mb-0.5 truncate`}>
                {pool.label}
              </span>
              <span className={`text-sm font-bold ${t.fonts.mono} ${
                woundModifier < 0 ? "text-amber-400" : t.colors.accent
              }`}>
                {pool.pool + woundModifier}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

