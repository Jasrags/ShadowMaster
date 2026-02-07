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
 */

import { useMemo } from "react";
import { useMetatypes } from "@/lib/rules";
import type { CreationState, CyberwareItem, BiowareItem } from "@/lib/types";
import { CreationCard } from "./shared";
import { Activity, Shield, Heart, Brain, Footprints } from "lucide-react";

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
  const metatypes = useMetatypes();
  const selectedMetatype = state.selections.metatype as string;

  // Get metatype data for attribute minimums
  const metatypeData = useMemo(() => {
    return metatypes.find((m) => m.id === selectedMetatype);
  }, [metatypes, selectedMetatype]);

  // Get current attributes from state
  const attributes = useMemo(() => {
    return (state.selections.attributes || {}) as Record<string, number>;
  }, [state.selections.attributes]);

  // Calculate augmentation effects (essence loss, attribute bonuses, initiative dice)
  const augmentationEffects = useMemo(() => {
    const cyberware = (state.selections.cyberware || []) as CyberwareItem[];
    const bioware = (state.selections.bioware || []) as BiowareItem[];

    let essenceLoss = 0;
    let initiativeDiceBonus = 0;
    const attributeBonuses: Record<string, number> = {};

    // Process cyberware
    cyberware.forEach((item) => {
      essenceLoss += item.essenceCost || 0;

      // Check for initiative dice bonuses
      if (item.initiativeDiceBonus) {
        initiativeDiceBonus += item.initiativeDiceBonus;
      }

      // Check for attribute bonuses
      if (item.attributeBonuses) {
        Object.entries(item.attributeBonuses).forEach(([attr, value]) => {
          attributeBonuses[attr] = (attributeBonuses[attr] || 0) + value;
        });
      }
    });

    // Process bioware
    bioware.forEach((item) => {
      essenceLoss += item.essenceCost || 0;

      // Check for attribute bonuses
      if (item.attributeBonuses) {
        Object.entries(item.attributeBonuses).forEach(([attr, value]) => {
          attributeBonuses[attr] = (attributeBonuses[attr] || 0) + value;
        });
      }
    });

    return {
      essenceLoss,
      remainingEssence: Math.max(0, 6 - essenceLoss),
      initiativeDiceBonus,
      attributeBonuses,
    };
  }, [state.selections.cyberware, state.selections.bioware]);

  // Calculate derived stats
  const derivedStats = useMemo((): DerivedStats => {
    // Helper to get attribute value with metatype minimum fallback
    const getAttr = (attrId: string): number => {
      if (attributes[attrId] !== undefined) {
        return attributes[attrId];
      }
      // Fall back to metatype minimum
      if (metatypeData?.attributes?.[attrId]) {
        const attrData = metatypeData.attributes[attrId];
        if (typeof attrData === "object" && "min" in attrData) {
          return attrData.min;
        }
      }
      return 1; // Default minimum
    };

    const augBonuses = augmentationEffects.attributeBonuses;

    // Base attributes with augmentation bonuses
    const body = getAttr("body") + (augBonuses.body || 0);
    const agility = getAttr("agility") + (augBonuses.agility || 0);
    const reaction = getAttr("reaction") + (augBonuses.reaction || 0);
    const strength = getAttr("strength") + (augBonuses.strength || 0);
    const willpower = getAttr("willpower") + (augBonuses.willpower || 0);
    const logic = getAttr("logic") + (augBonuses.logic || 0);
    const intuition = getAttr("intuition") + (augBonuses.intuition || 0);
    const charisma = getAttr("charisma") + (augBonuses.charisma || 0);

    const essence = augmentationEffects.remainingEssence;
    const initiativeDice = 1 + augmentationEffects.initiativeDiceBonus;

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
  }, [attributes, metatypeData, augmentationEffects]);

  // Check if we have any attributes selected
  const hasAttributes = Object.keys(attributes).length > 0 || !!selectedMetatype;

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
                augmentationEffects.initiativeDiceBonus > 0
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
      </div>
    </CreationCard>
  );
}
