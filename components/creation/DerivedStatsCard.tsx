"use client";

/**
 * DerivedStatsCard
 *
 * Card displaying all derived statistics calculated from character attributes.
 * Auto-updates as attributes change during character creation.
 *
 * Features:
 * - Limits: Physical, Mental, Social
 * - Initiative: REA + INT + Xd6
 * - Condition Monitors: Physical CM, Stun CM, Overflow
 * - Secondary Stats: Composure, Judge Intentions, Memory, Lift/Carry
 * - Movement: Walk, Run speeds
 * - Dice Pools: Defense pool + top selected skill pools
 */

import { useMemo, useState } from "react";
import { useSkills } from "@/lib/rules";
import type { CreationState } from "@/lib/types";
import type { SkillGroupValue } from "@/lib/types/creation-selections";
import { CreationCard } from "./shared";
import {
  Activity,
  Shield,
  Heart,
  Brain,
  Footprints,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Dice5,
} from "lucide-react";
import { useAugmentedAttributes } from "./hooks/useAugmentedAttributes";
import { getCoreAttributeName } from "@/lib/constants/attributes";
import { getGroupRating, isGroupBroken } from "@/lib/rules/skills/group-utils";

// =============================================================================
// TYPES
// =============================================================================

interface DerivedStatsCardProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
}

interface DerivedStats {
  // Limits
  physicalLimit: number;
  mentalLimit: number;
  socialLimit: number;
  // Initiative
  initiative: number;
  initiativeDice: number;
  // Condition Monitors
  physicalCM: number;
  stunCM: number;
  overflowCM: number;
  // Secondary Stats
  composure: number;
  judgeIntentions: number;
  memory: number;
  liftCarry: number;
  // Movement
  walkSpeed: number;
  runSpeed: number;
  // Essence
  essence: number;
}

interface PoolEntry {
  name: string;
  pool: number;
  formula: string;
}

// =============================================================================
// ATTRIBUTE DISPLAY NAME HELPER
// =============================================================================

const ATTRIBUTE_DISPLAY_NAMES: Record<string, string> = {
  body: "Body",
  agility: "Agility",
  reaction: "Reaction",
  strength: "Strength",
  willpower: "Willpower",
  logic: "Logic",
  intuition: "Intuition",
  charisma: "Charisma",
  magic: "Magic",
  resonance: "Resonance",
  edge: "Edge",
};

function getAttributeDisplayName(key: string): string {
  return ATTRIBUTE_DISPLAY_NAMES[key] || getCoreAttributeName(key);
}

// =============================================================================
// STAT DISPLAY COMPONENT
// =============================================================================

function StatBlock({
  label,
  value,
  tooltip,
  colorClass = "bg-zinc-100 dark:bg-zinc-700",
  textColorClass = "text-zinc-900 dark:text-zinc-100",
  labelColorClass = "text-zinc-500 dark:text-zinc-400",
}: {
  label: string;
  value: string | number;
  tooltip?: string;
  colorClass?: string;
  textColorClass?: string;
  labelColorClass?: string;
}) {
  return (
    <div
      className={`rounded p-2 text-center ${tooltip ? "cursor-help" : ""} ${colorClass}`}
      title={tooltip}
    >
      <div className={`text-[10px] font-medium ${labelColorClass}`}>{label}</div>
      <div className={`font-mono font-bold ${textColorClass}`}>{value}</div>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function DerivedStatsCard({ state }: DerivedStatsCardProps) {
  const selectedMetatype = state.selections.metatype as string;
  const [showEffects, setShowEffects] = useState(false);
  const [showPools, setShowPools] = useState(false);
  const { activeSkills, skillGroups } = useSkills();

  // Use shared augmented attributes hook
  const {
    attributes: augmentedAttributes,
    augmentationEffects,
    effectSources: sources,
    unifiedInitiativeBonus,
  } = useAugmentedAttributes(state);

  // Calculate derived stats from augmented attributes
  const derivedStats = useMemo((): DerivedStats => {
    const body = augmentedAttributes.body || 1;
    const agility = augmentedAttributes.agility || 1;
    const reaction = augmentedAttributes.reaction || 1;
    const strength = augmentedAttributes.strength || 1;
    const willpower = augmentedAttributes.willpower || 1;
    const logic = augmentedAttributes.logic || 1;
    const intuition = augmentedAttributes.intuition || 1;
    const charisma = augmentedAttributes.charisma || 1;

    const essence = augmentationEffects.remainingEssence;
    const initiativeDice = 1 + augmentationEffects.initiativeDiceBonus + unifiedInitiativeBonus;

    return {
      // Limits
      physicalLimit: Math.ceil((strength * 2 + body + reaction) / 3),
      mentalLimit: Math.ceil((logic * 2 + intuition + willpower) / 3),
      socialLimit: Math.ceil((charisma * 2 + willpower + Math.ceil(essence)) / 3),
      // Initiative
      initiative: intuition + reaction,
      initiativeDice,
      // Condition Monitors
      physicalCM: Math.ceil(body / 2) + 8,
      stunCM: Math.ceil(willpower / 2) + 8,
      overflowCM: body,
      // Secondary Stats
      composure: charisma + willpower,
      judgeIntentions: charisma + intuition,
      memory: logic + willpower,
      liftCarry: strength * 2,
      // Movement (meters per Combat Turn)
      walkSpeed: agility * 2,
      runSpeed: agility * 4,
      // Essence
      essence,
    };
  }, [augmentedAttributes, augmentationEffects, unifiedInitiativeBonus]);

  // Compute dice pools for selected skills
  const poolEntries = useMemo((): PoolEntry[] => {
    const skills = (state.selections.skills || {}) as Record<string, number>;
    const groups = (state.selections.skillGroups || {}) as Record<string, SkillGroupValue>;
    const entries: PoolEntry[] = [];

    // Individual skills
    for (const [skillId, rating] of Object.entries(skills)) {
      const skillData = activeSkills.find((s) => s.id === skillId);
      if (!skillData || rating <= 0) continue;

      const attrValue = augmentedAttributes[skillData.linkedAttribute] || 0;
      const pool = attrValue + rating;
      const attrName = getAttributeDisplayName(skillData.linkedAttribute);
      entries.push({
        name: skillData.name,
        pool,
        formula: `${attrName} (${attrValue}) + ${skillData.name} (${rating})`,
      });
    }

    // Group skills
    for (const [groupId, groupValue] of Object.entries(groups)) {
      if (isGroupBroken(groupValue)) continue;
      const groupData = skillGroups.find((g) => g.id === groupId);
      if (!groupData) continue;
      const rating = getGroupRating(groupValue);
      if (rating <= 0) continue;

      for (const skillId of groupData.skills) {
        const skillData = activeSkills.find((s) => s.id === skillId);
        if (!skillData) continue;

        const attrValue = augmentedAttributes[skillData.linkedAttribute] || 0;
        const pool = attrValue + rating;
        const attrName = getAttributeDisplayName(skillData.linkedAttribute);
        entries.push({
          name: skillData.name,
          pool,
          formula: `${attrName} (${attrValue}) + ${skillData.name} (${rating})`,
        });
      }
    }

    // Sort by pool descending, take top 8
    entries.sort((a, b) => b.pool - a.pool);
    return entries.slice(0, 8);
  }, [
    state.selections.skills,
    state.selections.skillGroups,
    activeSkills,
    skillGroups,
    augmentedAttributes,
  ]);

  // Defense pool (always available if attributes exist)
  const defensePool = useMemo(() => {
    const reaction = augmentedAttributes.reaction || 0;
    const intuition = augmentedAttributes.intuition || 0;
    if (reaction === 0 && intuition === 0) return null;
    return {
      pool: reaction + intuition,
      formula: `Reaction (${reaction}) + Intuition (${intuition})`,
    };
  }, [augmentedAttributes]);

  const hasSkillPools = poolEntries.length > 0;
  const hasPools = defensePool !== null || hasSkillPools;

  // Check if we have any attributes selected
  const coreAttributes = (state.selections.attributes || {}) as Record<string, number>;
  const hasAttributes = Object.keys(coreAttributes).length > 0 || !!selectedMetatype;

  return (
    <CreationCard
      title="Derived Stats"
      description={
        hasAttributes
          ? `Initiative ${derivedStats.initiative}+${derivedStats.initiativeDice}d6 • Limits ${derivedStats.physicalLimit}/${derivedStats.mentalLimit}/${derivedStats.socialLimit}`
          : "Select attributes to see stats"
      }
      status={hasAttributes ? "valid" : "pending"}
    >
      <div className="space-y-3">
        {/* Initiative */}
        <div>
          <div className="mb-1.5 flex items-center gap-1 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
            <Activity className="h-3.5 w-3.5" />
            Initiative
          </div>
          <div className="grid grid-cols-1 gap-2">
            <StatBlock
              label="Initiative"
              value={`${derivedStats.initiative} + ${derivedStats.initiativeDice}d6`}
              tooltip="Initiative: (Intuition + Reaction) + 1d6 (+ augmentation bonuses)"
              colorClass={
                augmentationEffects.initiativeDiceBonus > 0 || unifiedInitiativeBonus > 0
                  ? "bg-blue-100 ring-1 ring-blue-300 dark:bg-blue-900/30 dark:ring-blue-700"
                  : "bg-blue-50 dark:bg-blue-900/20"
              }
              textColorClass="text-blue-700 dark:text-blue-300"
              labelColorClass="text-blue-600 dark:text-blue-400"
            />
          </div>
        </div>

        {/* Limits */}
        <div>
          <div className="mb-1.5 flex items-center gap-1 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
            <Shield className="h-3.5 w-3.5" />
            Limits
          </div>
          <div className="grid grid-cols-3 gap-2">
            <StatBlock
              label="Physical"
              value={derivedStats.physicalLimit}
              tooltip="Physical Limit: ⌈((STR × 2) + BOD + REA) / 3⌉"
            />
            <StatBlock
              label="Mental"
              value={derivedStats.mentalLimit}
              tooltip="Mental Limit: ⌈((LOG × 2) + INT + WIL) / 3⌉"
            />
            <StatBlock
              label="Social"
              value={derivedStats.socialLimit}
              tooltip="Social Limit: ⌈((CHA × 2) + WIL + ⌈ESS⌉) / 3⌉"
              colorClass={
                augmentationEffects.essenceLoss > 0
                  ? "bg-zinc-100 ring-1 ring-amber-300 dark:bg-zinc-700 dark:ring-amber-700"
                  : "bg-zinc-100 dark:bg-zinc-700"
              }
            />
          </div>
        </div>

        {/* Condition Monitors */}
        <div>
          <div className="mb-1.5 flex items-center gap-1 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
            <Heart className="h-3.5 w-3.5" />
            Condition Monitors
          </div>
          <div className="grid grid-cols-3 gap-2">
            <StatBlock
              label="Physical"
              value={derivedStats.physicalCM}
              tooltip="Physical Condition Monitor: ⌈BOD / 2⌉ + 8"
              colorClass="bg-red-50 dark:bg-red-900/20"
              textColorClass="text-red-700 dark:text-red-300"
              labelColorClass="text-red-600 dark:text-red-400"
            />
            <StatBlock
              label="Stun"
              value={derivedStats.stunCM}
              tooltip="Stun Condition Monitor: ⌈WIL / 2⌉ + 8"
              colorClass="bg-amber-50 dark:bg-amber-900/20"
              textColorClass="text-amber-700 dark:text-amber-300"
              labelColorClass="text-amber-600 dark:text-amber-400"
            />
            <StatBlock
              label="Overflow"
              value={derivedStats.overflowCM}
              tooltip="Overflow: BOD + augmentation bonuses"
              colorClass="bg-zinc-200 dark:bg-zinc-600"
              textColorClass="text-zinc-800 dark:text-zinc-100"
              labelColorClass="text-zinc-600 dark:text-zinc-300"
            />
          </div>
        </div>

        {/* Secondary Stats */}
        <div>
          <div className="mb-1.5 flex items-center gap-1 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
            <Brain className="h-3.5 w-3.5" />
            Secondary Stats
          </div>
          <div className="grid grid-cols-2 gap-2">
            <StatBlock
              label="Composure"
              value={derivedStats.composure}
              tooltip="Composure: CHA + WIL (resist social influence)"
            />
            <StatBlock
              label="Judge Intentions"
              value={derivedStats.judgeIntentions}
              tooltip="Judge Intentions: CHA + INT (read people)"
            />
            <StatBlock
              label="Memory"
              value={derivedStats.memory}
              tooltip="Memory: LOG + WIL (recall information)"
            />
            <StatBlock
              label="Lift/Carry"
              value={`${derivedStats.liftCarry} kg`}
              tooltip="Lift/Carry: STR × 2 kg"
            />
          </div>
        </div>

        {/* Movement */}
        <div>
          <div className="mb-1.5 flex items-center gap-1 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
            <Footprints className="h-3.5 w-3.5" />
            Movement
          </div>
          <div className="grid grid-cols-2 gap-2">
            <StatBlock
              label="Walk"
              value={`${derivedStats.walkSpeed}m`}
              tooltip="Walk Speed: AGI × 2 meters per Combat Turn"
            />
            <StatBlock
              label="Run"
              value={`${derivedStats.runSpeed}m`}
              tooltip="Run Speed: AGI × 4 meters per Combat Turn"
            />
          </div>
        </div>

        {/* Dice Pools */}
        {hasPools && (
          <div className="rounded border border-cyan-200 dark:border-cyan-800">
            <button
              onClick={() => setShowPools(!showPools)}
              className="flex w-full items-center justify-between px-3 py-2 text-xs font-medium text-cyan-700 hover:bg-cyan-50 dark:text-cyan-300 dark:hover:bg-cyan-900/30"
            >
              <span className="flex items-center gap-1">
                <Dice5 className="h-3 w-3" />
                Dice Pools
                {defensePool && (
                  <span className="ml-1 rounded bg-cyan-100 px-1 py-0.5 font-mono text-[10px] dark:bg-cyan-900/40">
                    Def {defensePool.pool}
                  </span>
                )}
              </span>
              {showPools ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
            {showPools && (
              <div className="border-t border-cyan-200 px-3 py-2 dark:border-cyan-800">
                <div className="space-y-1.5">
                  {/* Defense Pool */}
                  {defensePool && (
                    <div className="flex items-center justify-between" title={defensePool.formula}>
                      <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                        Defense
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
                          REA + INT
                        </span>
                        <span className="rounded bg-cyan-100 px-1.5 py-0.5 font-mono text-xs font-bold text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300">
                          {defensePool.pool}d
                        </span>
                      </span>
                    </div>
                  )}
                  {/* Top Skill Pools */}
                  {poolEntries.map((entry) => (
                    <div
                      key={entry.name}
                      className="flex items-center justify-between"
                      title={entry.formula}
                    >
                      <span className="truncate text-xs text-zinc-600 dark:text-zinc-400">
                        {entry.name}
                      </span>
                      <span className="ml-2 shrink-0 rounded bg-cyan-100 px-1.5 py-0.5 font-mono text-xs font-bold text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300">
                        {entry.pool}d
                      </span>
                    </div>
                  ))}
                  {!hasSkillPools && (
                    <div className="text-[10px] text-zinc-400 dark:text-zinc-500">
                      Add skills to see skill pools
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Essence (if there's essence loss) */}
        {augmentationEffects.essenceLoss > 0 && (
          <div className="rounded border border-amber-200 bg-amber-50 p-2 text-center dark:border-amber-800 dark:bg-amber-900/20">
            <div className="text-xs font-medium text-amber-600 dark:text-amber-400">Essence</div>
            <div className="font-mono font-bold text-amber-700 dark:text-amber-300">
              {derivedStats.essence.toFixed(2)}
            </div>
            <div className="text-[10px] text-amber-500">
              Lost: {augmentationEffects.essenceLoss.toFixed(2)}
            </div>
          </div>
        )}

        {/* Active Effects Summary */}
        {sources.length > 0 && (
          <div className="rounded border border-zinc-200 dark:border-zinc-700">
            <button
              onClick={() => setShowEffects(!showEffects)}
              className="flex w-full items-center justify-between px-3 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              <span className="flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Active Effects ({sources.length})
              </span>
              {showEffects ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </button>
            {showEffects && (
              <div className="border-t border-zinc-200 px-3 py-2 dark:border-zinc-700">
                <div className="space-y-1">
                  {sources.map((s, i) => (
                    <div key={i} className="flex items-center justify-between text-[10px]">
                      <span className="text-zinc-500 dark:text-zinc-400">{s.source.name}</span>
                      <span className="font-medium text-zinc-700 dark:text-zinc-300">
                        {s.effect.type.replace(/-/g, " ")}
                        {typeof s.effect.value === "number"
                          ? ` (${s.effect.value >= 0 ? "+" : ""}${s.effect.value})`
                          : s.effect.value?.perRating
                            ? ` (${s.effect.value.perRating >= 0 ? "+" : ""}${s.effect.value.perRating}/rating)`
                            : ""}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </CreationCard>
  );
}
