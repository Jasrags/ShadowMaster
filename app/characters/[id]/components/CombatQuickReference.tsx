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
import { Wifi, AlertTriangle } from "lucide-react";
import { calculateWirelessBonuses, isGlobalWirelessEnabled } from "@/lib/rules/wireless";
import { calculateArmorTotal, type ArmorCalculationResult } from "@/lib/rules/gameplay";
import { calculateEncumbrance } from "@/lib/rules/encumbrance/calculator";
import type { EffectResolutionContext, EffectResolutionResult } from "@/lib/types/effects";
import { EffectContextBuilder } from "@/lib/rules/effects";
import { effectsToPoolModifiers } from "./effect-utils";

// =============================================================================
// TYPES
// =============================================================================

export interface CombatQuickReferenceProps {
  character: Character;
  woundModifier: number;
  physicalLimit: number;
  onPoolSelect?: (pool: number, context: string) => void;
  theme?: Theme;
  resolveEffects?: (ctx: EffectResolutionContext) => EffectResolutionResult;
}

interface CombatPool {
  label: string;
  pool: number;
  modifiers: PoolModifier[];
  limit?: { value: number; type: "physical" | "mental" | "social" | "weapon" | "other" };
  context: string;
  /** Whether this pool has an active wireless bonus */
  hasWirelessBonus?: boolean;
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

function calculateInitiative(character: Character): {
  base: number;
  dice: number;
  wirelessBonus: number;
  wirelessDice: number;
} {
  const reaction = getAttributeValue(character, "reaction");
  const intuition = getAttributeValue(character, "intuition");

  // Get wireless bonuses if enabled
  const globalWireless = isGlobalWirelessEnabled(character);
  let wirelessBonus = 0;
  let wirelessDice = 0;

  if (globalWireless) {
    const bonuses = calculateWirelessBonuses(character);
    wirelessBonus = bonuses.initiative;
    wirelessDice = bonuses.initiativeDice;
  }

  return {
    base: reaction + intuition,
    dice: 1,
    wirelessBonus,
    wirelessDice,
  };
}

/**
 * Get all armor items from character (both gear array and armor array)
 */
function getArmorItems(character: Character): ArmorItem[] {
  const gearArmor = character.gear?.filter((g): g is ArmorItem => g.category === "armor") || [];
  const separateArmor = character.armor || [];
  return [...gearArmor, ...separateArmor];
}

/**
 * Calculate armor with SR5 stacking rules
 * - Highest base armor applies
 * - Accessories (armorModifier: true) add to base
 * - Accessory bonus capped at Strength
 * - Encumbrance penalty if accessory bonus exceeds Strength
 */
function getArmorCalculation(character: Character): ArmorCalculationResult {
  const armorItems = getArmorItems(character);
  const strength = character.attributes?.strength || 1;
  return calculateArmorTotal(armorItems, strength);
}

/**
 * Check if a weapon has a smartgun system installed
 */
function hasSmartgunMod(weapon: Weapon): boolean {
  if (!weapon.modifications) return false;
  return weapon.modifications.some((mod) => {
    // Support both catalogId (correct) and legacy modificationId field
    const modId = mod.catalogId || (mod as { modificationId?: string }).modificationId;
    return modId === "smartgun-internal" || modId === "smartgun-external";
  });
}

/**
 * Check if smartgun wireless bonus applies to this weapon
 * - Global wireless must be enabled
 * - Weapon must not be stored
 * - Weapon's wireless must be enabled
 * - Weapon must have smartgun mod installed
 * - Weapon must be ranged (not melee)
 */
function hasSmartgunWirelessBonus(character: Character, weapon: Weapon): boolean {
  // Global wireless must be on
  if (!isGlobalWirelessEnabled(character)) return false;

  // Weapon must be available (not stored)
  if (weapon.state?.readiness === "stored" || weapon.state?.readiness === "stashed") return false;

  // Per-weapon wireless must be on (default true if not set)
  if (weapon.state?.wirelessEnabled === false) return false;

  // Must have smartgun mod
  if (!hasSmartgunMod(weapon)) return false;

  // Must be a ranged weapon (smartgun doesn't help melee)
  const subcategory = weapon.subcategory?.toLowerCase() || "";
  if (
    subcategory.includes("melee") ||
    subcategory.includes("blade") ||
    subcategory.includes("club")
  ) {
    return false;
  }

  return true;
}

function getWeaponPools(
  character: Character,
  physicalLimit: number,
  armorAgilityPenalty: number,
  weightEncumbrancePenalty: number
): CombatPool[] {
  const weapons = (
    character.gear?.filter((g): g is Weapon => g.category === "weapons") || []
  ).slice(0, 3); // Limit to top 3 weapons

  return weapons.map((weapon) => {
    // Determine relevant skill based on weapon subcategory
    let skillId = "automatics";
    const attrId = "agility";
    const subcategory = weapon.subcategory?.toLowerCase() || "";
    const isMelee =
      subcategory.includes("melee") ||
      subcategory.includes("blade") ||
      subcategory.includes("club");

    if (isMelee) {
      skillId = "blades";
    } else if (subcategory.includes("pistol")) {
      skillId = "pistols";
    } else if (subcategory.includes("rifle") || subcategory.includes("longarm")) {
      skillId = "longarms";
    }

    const attr = getAttributeValue(character, attrId);
    const skill = getSkillRating(character, skillId);

    // Check for smartgun wireless bonus (+2 dice pool for ranged attacks)
    const smartgunBonus = hasSmartgunWirelessBonus(character, weapon) ? 2 : 0;
    let pool = attr + skill + smartgunBonus;

    const modifiers: PoolModifier[] = [
      { label: "Agility", value: attr, type: "attribute" },
      { label: skillId.charAt(0).toUpperCase() + skillId.slice(1), value: skill, type: "skill" },
    ];

    // Add smartgun bonus to modifiers if active
    if (smartgunBonus > 0) {
      modifiers.push({ label: "Smartgun", value: smartgunBonus, type: "gear" });
    }

    // Armor encumbrance (agility penalty)
    if (armorAgilityPenalty < 0) {
      modifiers.push({
        label: "Armor Encumbrance",
        value: armorAgilityPenalty,
        type: "encumbrance",
      });
      pool += armorAgilityPenalty;
    }

    // Weight encumbrance
    if (weightEncumbrancePenalty < 0) {
      modifiers.push({
        label: "Weight Encumbrance",
        value: weightEncumbrancePenalty,
        type: "encumbrance",
      });
      pool += weightEncumbrancePenalty;
    }

    // Weapon accuracy as limit
    const accuracy = weapon.accuracy || physicalLimit;

    return {
      label: weapon.name,
      pool,
      modifiers,
      limit: { value: accuracy, type: "weapon" as const },
      context: `${weapon.name} Attack`,
      hasWirelessBonus: smartgunBonus > 0,
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
  resolveEffects,
}: CombatQuickReferenceProps) {
  const t = theme || THEMES[DEFAULT_THEME];

  // Calculate all combat pools
  const combatData = useMemo(() => {
    const reaction = getAttributeValue(character, "reaction");
    const intuition = getAttributeValue(character, "intuition");
    const body = getAttributeValue(character, "body");
    const armorCalc = getArmorCalculation(character);
    const armor = armorCalc.totalArmor;
    const initiative = calculateInitiative(character);

    // Calculate wireless bonuses and encumbrance once
    const globalWireless = isGlobalWirelessEnabled(character);
    const wirelessBonuses = globalWireless ? calculateWirelessBonuses(character) : null;
    const encumbrance = calculateEncumbrance(character);

    // Resolve unified effects for combat contexts
    const initEffects = resolveEffects
      ? resolveEffects(EffectContextBuilder.forInitiative().build())
      : null;
    const defenseEffects = resolveEffects
      ? resolveEffects(EffectContextBuilder.forDefense().build())
      : null;

    // Defense pool
    const defenseBase = calculateDefensePool(character);
    let defenseTotal = defenseBase;
    const defenseModifiers: PoolModifier[] = [
      { label: "Reaction", value: reaction, type: "attribute" },
      { label: "Intuition", value: intuition, type: "attribute" },
    ];
    let defenseHasWireless = false;

    if (wirelessBonuses && wirelessBonuses.defensePool > 0) {
      defenseModifiers.push({
        label: "Wireless Defense",
        value: wirelessBonuses.defensePool,
        type: "wireless",
      });
      defenseTotal += wirelessBonuses.defensePool;
      defenseHasWireless = true;
    }

    // Add unified effect modifiers for defense
    if (
      defenseEffects &&
      defenseEffects.totalDicePoolModifier &&
      isFinite(defenseEffects.totalDicePoolModifier)
    ) {
      const effectMods = effectsToPoolModifiers(defenseEffects.dicePoolModifiers);
      defenseModifiers.push(...effectMods);
      defenseTotal += defenseEffects.totalDicePoolModifier;
      if (effectMods.some((m) => m.type === "wireless")) defenseHasWireless = true;
    }

    if (armorCalc.reactionPenalty < 0) {
      defenseModifiers.push({
        label: "Armor Encumbrance",
        value: armorCalc.reactionPenalty,
        type: "encumbrance",
      });
      defenseTotal += armorCalc.reactionPenalty;
    }
    if (encumbrance.overweightPenalty < 0) {
      defenseModifiers.push({
        label: "Weight Encumbrance",
        value: encumbrance.overweightPenalty,
        type: "encumbrance",
      });
      defenseTotal += encumbrance.overweightPenalty;
    }

    const defensePool: CombatPool = {
      label: "Defense",
      pool: defenseTotal,
      modifiers: defenseModifiers,
      context: "Defense Test",
      hasWirelessBonus: defenseHasWireless,
    };

    // Full Defense (with dodge)
    const gymnastics = getSkillRating(character, "gymnastics");
    let fullDefenseTotal = calculateDodgePool(character);
    const fullDefenseModifiers: PoolModifier[] = [
      { label: "Reaction", value: reaction, type: "attribute" },
      { label: "Intuition", value: intuition, type: "attribute" },
      { label: "Gymnastics", value: gymnastics, type: "skill" },
    ];
    let fullDefenseHasWireless = false;

    if (wirelessBonuses && wirelessBonuses.defensePool > 0) {
      fullDefenseModifiers.push({
        label: "Wireless Defense",
        value: wirelessBonuses.defensePool,
        type: "wireless",
      });
      fullDefenseTotal += wirelessBonuses.defensePool;
      fullDefenseHasWireless = true;
    }

    // Add unified effect modifiers for full defense
    if (
      defenseEffects &&
      defenseEffects.totalDicePoolModifier &&
      isFinite(defenseEffects.totalDicePoolModifier)
    ) {
      const effectMods = effectsToPoolModifiers(defenseEffects.dicePoolModifiers);
      fullDefenseModifiers.push(...effectMods);
      fullDefenseTotal += defenseEffects.totalDicePoolModifier;
      if (effectMods.some((m) => m.type === "wireless")) fullDefenseHasWireless = true;
    }

    if (armorCalc.reactionPenalty < 0) {
      fullDefenseModifiers.push({
        label: "Armor Encumbrance",
        value: armorCalc.reactionPenalty,
        type: "encumbrance",
      });
      fullDefenseTotal += armorCalc.reactionPenalty;
    }
    if (encumbrance.overweightPenalty < 0) {
      fullDefenseModifiers.push({
        label: "Weight Encumbrance",
        value: encumbrance.overweightPenalty,
        type: "encumbrance",
      });
      fullDefenseTotal += encumbrance.overweightPenalty;
    }

    const fullDefensePool: CombatPool = {
      label: "Full Defense",
      pool: fullDefenseTotal,
      modifiers: fullDefenseModifiers,
      context: "Full Defense Test",
      hasWirelessBonus: fullDefenseHasWireless,
    };

    // Soak (Body + Armor)
    let soakTotal = body + armor;
    const soakModifiers: PoolModifier[] = [
      { label: "Body", value: body, type: "attribute" },
      { label: "Armor", value: armor, type: "gear" },
    ];
    let soakHasWireless = false;

    if (wirelessBonuses && wirelessBonuses.damageResist > 0) {
      soakModifiers.push({
        label: "Wireless Soak",
        value: wirelessBonuses.damageResist,
        type: "wireless",
      });
      soakTotal += wirelessBonuses.damageResist;
      soakHasWireless = true;
    }
    if (wirelessBonuses && wirelessBonuses.armor > 0) {
      soakModifiers.push({
        label: "Wireless Armor",
        value: wirelessBonuses.armor,
        type: "wireless",
      });
      soakTotal += wirelessBonuses.armor;
      soakHasWireless = true;
    }

    const soakPool: CombatPool = {
      label: "Soak",
      pool: soakTotal,
      modifiers: soakModifiers,
      context: "Damage Resistance Test",
      hasWirelessBonus: soakHasWireless,
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
    const weaponPools = getWeaponPools(
      character,
      physicalLimit,
      armorCalc.agilityPenalty < 0 ? armorCalc.agilityPenalty : 0,
      encumbrance.overweightPenalty
    );

    return {
      initiative,
      initEffects,
      armor,
      armorCalc,
      defensePool,
      fullDefensePool,
      soakPool,
      composurePool,
      judgeIntentionsPool,
      memoryPool,
      weaponPools,
    };
  }, [character, physicalLimit, resolveEffects]);

  const rawInitBonus = combatData.initEffects?.totalInitiativeModifier ?? 0;
  const unifiedInitBonus = isFinite(rawInitBonus) ? rawInitBonus : 0;
  const effectiveInit =
    combatData.initiative.base +
    combatData.initiative.wirelessBonus +
    unifiedInitBonus +
    woundModifier;
  const totalInitDice = combatData.initiative.dice + combatData.initiative.wirelessDice;
  const hasWirelessBonus =
    combatData.initiative.wirelessBonus > 0 ||
    combatData.initiative.wirelessDice > 0 ||
    (combatData.initEffects?.initiativeModifiers ?? []).some(
      (e) => e.appliedVariant === "wireless"
    );

  return (
    <div className="space-y-4">
      {/* Initiative & Armor Row */}
      <div className="grid grid-cols-2 gap-3">
        <div className={`p-3 rounded border text-center ${t.colors.card} ${t.colors.border}`}>
          <span
            className={`flex items-center justify-center gap-1 text-xs ${t.fonts.mono} text-muted-foreground uppercase mb-1`}
          >
            Initiative
            {hasWirelessBonus && (
              <span title="Wireless bonus active">
                <Wifi className="w-3 h-3 text-cyan-400" />
              </span>
            )}
          </span>
          <span
            className={`text-xl font-bold ${t.fonts.mono} ${
              woundModifier < 0
                ? "text-amber-400"
                : hasWirelessBonus
                  ? "text-cyan-400"
                  : t.colors.accent
            }`}
          >
            {effectiveInit}+{totalInitDice}d6
          </span>
          {(woundModifier < 0 || hasWirelessBonus || unifiedInitBonus !== 0) && (
            <div className="flex items-center justify-center gap-2 mt-1">
              {woundModifier < 0 && (
                <span className="text-[10px] text-red-400">({woundModifier} wound)</span>
              )}
              {combatData.initiative.wirelessBonus > 0 && (
                <span className="text-[10px] text-cyan-400">
                  (+{combatData.initiative.wirelessBonus} wireless)
                </span>
              )}
              {combatData.initiative.wirelessDice > 0 && (
                <span className="text-[10px] text-cyan-400">
                  (+{combatData.initiative.wirelessDice}d6)
                </span>
              )}
              {unifiedInitBonus !== 0 && (
                <span
                  className={`text-[10px] ${unifiedInitBonus > 0 ? "text-violet-400" : "text-red-400"}`}
                >
                  ({unifiedInitBonus > 0 ? "+" : ""}
                  {unifiedInitBonus} effects)
                </span>
              )}
            </div>
          )}
        </div>

        <div className={`p-3 rounded border text-center ${t.colors.card} ${t.colors.border}`}>
          <span
            className={`flex items-center justify-center gap-1 text-xs ${t.fonts.mono} text-muted-foreground uppercase mb-1`}
          >
            Armor
            {combatData.armorCalc.isEncumbered && (
              <span title="Encumbrance penalty active">
                <AlertTriangle className="w-3 h-3 text-amber-400" />
              </span>
            )}
          </span>
          <span
            className={`text-xl font-bold ${t.fonts.mono} ${
              combatData.armorCalc.isEncumbered ? "text-amber-400" : t.colors.heading
            }`}
          >
            {combatData.armor}
          </span>
          {/* Show armor breakdown if accessories are worn */}
          {combatData.armorCalc.effectiveAccessoryBonus > 0 && (
            <div className="text-[10px] text-muted-foreground mt-1">
              {combatData.armorCalc.baseArmor} + {combatData.armorCalc.effectiveAccessoryBonus}
            </div>
          )}
          {/* Show encumbrance warning */}
          {combatData.armorCalc.isEncumbered && (
            <div className="text-[10px] text-amber-400 mt-1">
              {combatData.armorCalc.agilityPenalty} AGI/REA
            </div>
          )}
        </div>
      </div>

      {/* Defense Pools */}
      <div className="grid grid-cols-2 gap-3">
        <DicePoolDisplay
          label={combatData.defensePool.label}
          basePool={combatData.defensePool.pool}
          modifiers={combatData.defensePool.modifiers}
          woundModifier={woundModifier}
          hasWirelessBonus={combatData.defensePool.hasWirelessBonus}
          theme={theme}
          onClick={() =>
            onPoolSelect?.(
              combatData.defensePool.pool + woundModifier,
              combatData.defensePool.context
            )
          }
        />
        <DicePoolDisplay
          label={combatData.fullDefensePool.label}
          basePool={combatData.fullDefensePool.pool}
          modifiers={combatData.fullDefensePool.modifiers}
          woundModifier={woundModifier}
          hasWirelessBonus={combatData.fullDefensePool.hasWirelessBonus}
          theme={theme}
          onClick={() =>
            onPoolSelect?.(
              combatData.fullDefensePool.pool + woundModifier,
              combatData.fullDefensePool.context
            )
          }
        />
      </div>

      {/* Soak */}
      <DicePoolDisplay
        label={combatData.soakPool.label}
        basePool={combatData.soakPool.pool}
        modifiers={combatData.soakPool.modifiers}
        woundModifier={0} // Soak is typically not affected by wounds
        hasWirelessBonus={combatData.soakPool.hasWirelessBonus}
        theme={theme}
        onClick={() => onPoolSelect?.(combatData.soakPool.pool, combatData.soakPool.context)}
      />

      {/* Weapon Attacks */}
      {combatData.weaponPools.length > 0 && (
        <div className="space-y-2">
          <span className={`text-xs ${t.fonts.mono} text-muted-foreground uppercase`}>Weapons</span>
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
                hasWirelessBonus={weapon.hasWirelessBonus}
                onClick={() =>
                  onPoolSelect?.(Math.max(0, weapon.pool + woundModifier), weapon.context)
                }
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
          {[combatData.composurePool, combatData.judgeIntentionsPool, combatData.memoryPool].map(
            (pool, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onPoolSelect?.(pool.pool + woundModifier, pool.context)}
                className={`p-2 rounded border text-center transition-colors hover:border-emerald-500/50 ${t.colors.card} ${t.colors.border}`}
              >
                <span
                  className={`block text-[10px] ${t.fonts.mono} text-muted-foreground uppercase mb-0.5 truncate`}
                >
                  {pool.label}
                </span>
                <span
                  className={`text-sm font-bold ${t.fonts.mono} ${
                    woundModifier < 0 ? "text-amber-400" : t.colors.accent
                  }`}
                >
                  {pool.pool + woundModifier}
                </span>
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
