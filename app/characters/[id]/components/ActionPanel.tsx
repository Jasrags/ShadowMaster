"use client";

import React, { useMemo, useState } from "react";
import { Button } from "react-aria-components";
import {
  Dice1,
  Zap,
  ChevronDown,
  ChevronUp,
  Swords,
  Shield,
  Target,
  Move,
  Eye,
  HandMetal,
} from "lucide-react";
import { useEdge } from "@/lib/rules/action-resolution/hooks";
import { useCombatSession, useActionEconomy } from "@/lib/combat";
import type { Character } from "@/lib/types";
import type { Theme } from "@/lib/themes";

interface ActionPanelProps {
  /** Character data */
  character: Character;
  /** Current wound modifier */
  woundModifier: number;
  /** Physical limit */
  physicalLimit: number;
  /** Mental limit */
  mentalLimit: number;
  /** Social limit */
  socialLimit: number;
  /** Whether the panel is expanded */
  isExpanded: boolean;
  /** Callback to toggle expansion */
  onToggleExpand: () => void;
  /** Callback to open dice roller with a pool */
  onOpenDiceRoller: (pool: number, context: string) => void;
  /** Current theme */
  theme: Theme;
}

interface QuickRollButtonProps {
  label: string;
  pool: number;
  context: string;
  onClick: (pool: number, context: string) => void;
  theme: Theme;
}

function QuickRollButton({ label, pool, context, onClick, theme }: QuickRollButtonProps) {
  return (
    <Button
      onPress={() => onClick(pool, context)}
      className={`
        flex items-center justify-between w-full
        px-3 py-2 rounded
        ${theme.components.card.wrapper}
        ${theme.components.card.hover}
        ${theme.components.card.border}
        transition-colors text-sm
      `}
    >
      <span className={theme.colors.heading}>{label}</span>
      <span className={`${theme.fonts.mono} font-bold ${theme.colors.accent}`}>{pool}d6</span>
    </Button>
  );
}

interface CombatActionButtonProps {
  label: string;
  icon: React.ReactNode;
  pool: number;
  context: string;
  actionType: "free" | "simple" | "complex" | "interrupt";
  onClick: (pool: number, context: string) => void;
  isAvailable: boolean;
  theme: Theme;
}

function CombatActionButton({
  label,
  icon,
  pool,
  context,
  actionType,
  onClick,
  isAvailable,
  theme,
}: CombatActionButtonProps) {
  const typeColors = {
    free: "bg-emerald-500/20 border-emerald-500/30 text-emerald-500",
    simple: "bg-blue-500/20 border-blue-500/30 text-blue-500",
    complex: "bg-purple-500/20 border-purple-500/30 text-purple-500",
    interrupt: "bg-amber-500/20 border-amber-500/30 text-amber-500",
  };

  const typeLabels = {
    free: "F",
    simple: "S",
    complex: "C",
    interrupt: "Int",
  };

  return (
    <Button
      onPress={() => onClick(pool, context)}
      isDisabled={!isAvailable}
      className={`
        flex items-center gap-2 w-full
        px-3 py-2 rounded border
        ${isAvailable ? typeColors[actionType] : "bg-muted border-border text-muted-foreground"}
        ${isAvailable ? "hover:opacity-80" : "opacity-50 cursor-not-allowed"}
        transition-all text-sm
      `}
    >
      <span className="w-5 h-5 flex items-center justify-center">{icon}</span>
      <span className="flex-1 text-left font-medium">{label}</span>
      <span className={`text-xs ${theme.fonts.mono} opacity-70`}>{pool}d6</span>
      <span className={`text-[10px] ${theme.fonts.mono} px-1.5 py-0.5 rounded bg-background/50`}>
        {typeLabels[actionType]}
      </span>
    </Button>
  );
}

export function ActionPanel({
  character,
  woundModifier,
  physicalLimit,
  mentalLimit,
  socialLimit,
  isExpanded,
  onToggleExpand,
  onOpenDiceRoller,
  theme,
}: ActionPanelProps) {
  // Combat session context
  const { isInCombat, isMyTurn } = useCombatSession();
  const actionEconomy = useActionEconomy();

  // Tab state for switching between Quick Rolls and Combat Actions
  const [activeTab, setActiveTab] = useState<"quick" | "combat">("quick");

  // Use Edge hook for real-time Edge management
  const {
    current: edgeCurrent,
    maximum: edgeMaximum,
    isLoading: edgeLoading,
    spend: spendEdge,
    restore: restoreEdge,
    restoreFull: restoreFullEdge,
  } = useEdge(character.id);

  // Calculate common pools
  const pools = useMemo(() => {
    const attrs = character.attributes || {};
    const skills = character.skills || {};

    // Initiative
    const initiative = (attrs.reaction || 1) + (attrs.intuition || 1);

    // Common tests
    const perception = (attrs.intuition || 1) + (skills.perception || 0);
    const composure = (attrs.charisma || 1) + (attrs.willpower || 1);
    const judgeIntentions = (attrs.charisma || 1) + (attrs.intuition || 1);
    const memory = (attrs.logic || 1) + (attrs.willpower || 1);
    const liftCarry = (attrs.body || 1) + (attrs.strength || 1);

    return {
      initiative,
      perception,
      composure,
      judgeIntentions,
      memory,
      liftCarry,
    };
  }, [character]);

  // Calculate combat pools
  const combatPools = useMemo(() => {
    const attrs = character.attributes || {};
    const skills = character.skills || {};

    // Attack pools (varies by weapon type - these are basic defaults)
    const meleeAttack =
      (attrs.agility || 1) + (skills["unarmed-combat"] || skills.blades || 0);
    const rangedAttack =
      (attrs.agility || 1) + (skills.pistols || skills.automatics || 0);

    // Defense pool
    const defense = (attrs.reaction || 1) + (attrs.intuition || 1);

    // Dodge (defense + gymnastics)
    const dodge =
      (attrs.reaction || 1) + (attrs.intuition || 1) + (skills.gymnastics || 0);

    // Block (unarmed combat)
    const block = (attrs.reaction || 1) + (skills["unarmed-combat"] || 0);

    // Full defense (willpower added to defense)
    const fullDefense =
      (attrs.reaction || 1) + (attrs.intuition || 1) + (attrs.willpower || 1);

    // Soak (body + armor)
    const totalArmor =
      character.armor?.reduce(
        (sum, a) => (a.equipped ? sum + a.armorRating : sum),
        0
      ) || 0;
    const soak = (attrs.body || 1) + totalArmor;

    return {
      meleeAttack,
      rangedAttack,
      defense,
      dodge,
      block,
      fullDefense,
      soak,
    };
  }, [character]);

  // Check if action type is available
  const canUseAction = (type: "free" | "simple" | "complex" | "interrupt") => {
    if (!isInCombat || !actionEconomy) return true; // Always available outside combat
    if (!isMyTurn && type !== "interrupt") return false;

    switch (type) {
      case "free":
        return actionEconomy.free > 0;
      case "simple":
        return actionEconomy.simple > 0;
      case "complex":
        return actionEconomy.complex > 0 || actionEconomy.simple >= 2;
      case "interrupt":
        return actionEconomy.interrupt;
      default:
        return false;
    }
  };

  return (
    <div className={`rounded-lg overflow-hidden ${theme.components.section.wrapper}`}>
      {/* Header - Always visible */}
      <button
        onClick={onToggleExpand}
        className={`
          w-full flex items-center justify-between p-3
          ${theme.components.section.header}
          hover:opacity-80 transition-opacity
        `}
      >
        <div className="flex items-center gap-3">
          <Dice1 className={`w-5 h-5 ${theme.colors.accent}`} />
          <span className={`font-medium ${theme.colors.heading}`}>
            Action Panel
          </span>
        </div>
        <div className="flex items-center gap-3">
          {/* Edge Quick Display */}
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-rose-500 dark:text-rose-400" />
            <span className={`${theme.fonts.mono} text-sm font-bold text-rose-500 dark:text-rose-400`}>
              {edgeCurrent}/{edgeMaximum}
            </span>
          </div>
          {/* Wound Modifier Display */}
          {woundModifier !== 0 && (
            <span className={`
              text-xs ${theme.fonts.mono} px-2 py-0.5 rounded border
              ${theme.components.badge.negative}
            `}>
              {woundModifier}
            </span>
          )}
          {isExpanded ? (
            <ChevronUp className={`w-4 h-4 ${theme.colors.muted}`} />
          ) : (
            <ChevronDown className={`w-4 h-4 ${theme.colors.muted}`} />
          )}
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className={`p-4 space-y-4 border-t ${theme.colors.border}`}>
          {/* Edge Tracker */}
          <div className={`p-3 rounded ${theme.components.card.wrapper} ${theme.components.card.border}`}>
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-rose-500 dark:text-rose-400" />
              <span className={`text-xs uppercase ${theme.fonts.mono} ${theme.colors.muted}`}>
                Edge
              </span>
            </div>

            {/* Edge Pips */}
            <div className="flex items-center gap-1.5 mb-3">
              {Array.from({ length: edgeMaximum }).map((_, i) => (
                <div
                  key={i}
                  className={`
                    w-4 h-4 rounded-full border-2 transition-all duration-200
                    ${i < edgeCurrent
                      ? "bg-rose-500 border-rose-400 shadow-lg shadow-rose-500/30"
                      : `bg-muted ${theme.colors.border}`
                    }
                  `}
                />
              ))}
              <span className={`ml-2 ${theme.fonts.mono} font-bold text-rose-500 dark:text-rose-400`}>
                {edgeCurrent}/{edgeMaximum}
              </span>
            </div>

            {/* Edge Controls */}
            <div className="flex items-center gap-2">
              <Button
                onPress={() => spendEdge(1)}
                isDisabled={edgeCurrent <= 0 || edgeLoading}
                className={`
                  flex-1 flex items-center justify-center gap-1.5
                  px-3 py-1.5 rounded text-sm
                  bg-rose-500/20 text-rose-500 dark:text-rose-400 border border-rose-500/30
                  hover:bg-rose-500/30
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-colors
                `}
              >
                Spend
              </Button>
              <Button
                onPress={() => restoreEdge(1)}
                isDisabled={edgeCurrent >= edgeMaximum || edgeLoading}
                className={`
                  flex-1 flex items-center justify-center gap-1.5
                  px-3 py-1.5 rounded text-sm
                  bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 border border-emerald-500/30
                  hover:bg-emerald-500/30
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-colors
                `}
              >
                Restore
              </Button>
              <Button
                onPress={() => restoreFullEdge()}
                isDisabled={edgeCurrent >= edgeMaximum || edgeLoading}
                className={`
                  px-3 py-1.5 rounded text-sm
                  ${theme.components.card.wrapper} ${theme.components.card.border}
                  ${theme.colors.muted}
                  hover:opacity-80
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-colors
                `}
                aria-label="Restore all Edge"
              >
                Full
              </Button>
            </div>
          </div>

          {/* Limits */}
          <div className={`grid grid-cols-3 gap-2 p-3 rounded ${theme.components.card.wrapper} ${theme.components.card.border}`}>
            <div className="text-center">
              <div className={`text-[10px] uppercase ${theme.fonts.mono} ${theme.colors.muted}`}>
                Physical
              </div>
              <div className={`${theme.fonts.mono} font-bold text-red-500 dark:text-red-400`}>
                {physicalLimit}
              </div>
            </div>
            <div className="text-center">
              <div className={`text-[10px] uppercase ${theme.fonts.mono} ${theme.colors.muted}`}>
                Mental
              </div>
              <div className={`${theme.fonts.mono} font-bold text-blue-500 dark:text-blue-400`}>
                {mentalLimit}
              </div>
            </div>
            <div className="text-center">
              <div className={`text-[10px] uppercase ${theme.fonts.mono} ${theme.colors.muted}`}>
                Social
              </div>
              <div className={`${theme.fonts.mono} font-bold text-pink-500 dark:text-pink-400`}>
                {socialLimit}
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/30">
            <button
              onClick={() => setActiveTab("quick")}
              className={`
                flex-1 flex items-center justify-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                ${activeTab === "quick"
                  ? `${theme.colors.accent} bg-background shadow-sm`
                  : `${theme.colors.muted} hover:text-foreground`
                }
              `}
            >
              <Dice1 className="w-4 h-4" />
              Quick Rolls
            </button>
            <button
              onClick={() => setActiveTab("combat")}
              className={`
                flex-1 flex items-center justify-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                ${activeTab === "combat"
                  ? `${theme.colors.accent} bg-background shadow-sm`
                  : `${theme.colors.muted} hover:text-foreground`
                }
                ${isInCombat ? "ring-1 ring-amber-500/50" : ""}
              `}
            >
              <Swords className={`w-4 h-4 ${isInCombat ? "text-amber-500" : ""}`} />
              Combat
              {isInCombat && (
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              )}
            </button>
          </div>

          {/* Quick Rolls Tab */}
          {activeTab === "quick" && (
            <div className="space-y-2">
              <div className={`text-xs uppercase ${theme.fonts.mono} ${theme.colors.muted}`}>
                Common Tests
              </div>
              <div className="grid grid-cols-2 gap-2">
                <QuickRollButton
                  label="Initiative"
                  pool={pools.initiative}
                  context="Initiative (REA + INT)"
                  onClick={onOpenDiceRoller}
                  theme={theme}
                />
                <QuickRollButton
                  label="Perception"
                  pool={pools.perception}
                  context="Perception (INT + Perception)"
                  onClick={onOpenDiceRoller}
                  theme={theme}
                />
                <QuickRollButton
                  label="Composure"
                  pool={pools.composure}
                  context="Composure (CHA + WIL)"
                  onClick={onOpenDiceRoller}
                  theme={theme}
                />
                <QuickRollButton
                  label="Judge Intent"
                  pool={pools.judgeIntentions}
                  context="Judge Intentions (CHA + INT)"
                  onClick={onOpenDiceRoller}
                  theme={theme}
                />
                <QuickRollButton
                  label="Memory"
                  pool={pools.memory}
                  context="Memory (LOG + WIL)"
                  onClick={onOpenDiceRoller}
                  theme={theme}
                />
                <QuickRollButton
                  label="Lift/Carry"
                  pool={pools.liftCarry}
                  context="Lift/Carry (BOD + STR)"
                  onClick={onOpenDiceRoller}
                  theme={theme}
                />
              </div>
            </div>
          )}

          {/* Combat Actions Tab */}
          {activeTab === "combat" && (
            <div className="space-y-4">
              {/* Action Economy Display (when in combat) */}
              {isInCombat && actionEconomy && (
                <div className={`p-2 rounded ${theme.components.card.wrapper} ${theme.components.card.border}`}>
                  <div className={`text-[10px] uppercase ${theme.fonts.mono} ${theme.colors.muted} mb-2`}>
                    Actions Remaining
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1" title="Free Actions">
                      <span className="text-xs text-muted-foreground">F</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${theme.fonts.mono} ${
                        actionEconomy.free > 0 ? "bg-emerald-500/20 text-emerald-500" : "bg-muted text-muted-foreground"
                      }`}>
                        {actionEconomy.free}
                      </span>
                    </div>
                    <div className="flex items-center gap-1" title="Simple Actions">
                      <span className="text-xs text-muted-foreground">S</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${theme.fonts.mono} ${
                        actionEconomy.simple > 0 ? "bg-blue-500/20 text-blue-500" : "bg-muted text-muted-foreground"
                      }`}>
                        {actionEconomy.simple}
                      </span>
                    </div>
                    <div className="flex items-center gap-1" title="Complex Actions">
                      <span className="text-xs text-muted-foreground">C</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${theme.fonts.mono} ${
                        actionEconomy.complex > 0 ? "bg-purple-500/20 text-purple-500" : "bg-muted text-muted-foreground"
                      }`}>
                        {actionEconomy.complex}
                      </span>
                    </div>
                    <div className="flex items-center gap-1" title="Interrupt Available">
                      <Shield className={`w-4 h-4 ${actionEconomy.interrupt ? "text-amber-500" : "text-muted-foreground"}`} />
                    </div>
                  </div>
                </div>
              )}

              {/* Attack Actions */}
              <div className="space-y-2">
                <div className={`text-xs uppercase ${theme.fonts.mono} ${theme.colors.muted}`}>
                  Attack Actions
                </div>
                <div className="space-y-1">
                  <CombatActionButton
                    label="Melee Attack"
                    icon={<HandMetal className="w-4 h-4" />}
                    pool={combatPools.meleeAttack + woundModifier}
                    context="Melee Attack (AGI + Combat Skill)"
                    actionType="complex"
                    onClick={onOpenDiceRoller}
                    isAvailable={canUseAction("complex")}
                    theme={theme}
                  />
                  <CombatActionButton
                    label="Ranged Attack"
                    icon={<Target className="w-4 h-4" />}
                    pool={combatPools.rangedAttack + woundModifier}
                    context="Ranged Attack (AGI + Firearms)"
                    actionType="simple"
                    onClick={onOpenDiceRoller}
                    isAvailable={canUseAction("simple")}
                    theme={theme}
                  />
                  <CombatActionButton
                    label="Take Aim"
                    icon={<Eye className="w-4 h-4" />}
                    pool={0}
                    context="Take Aim (+1 to next attack)"
                    actionType="simple"
                    onClick={onOpenDiceRoller}
                    isAvailable={canUseAction("simple")}
                    theme={theme}
                  />
                </div>
              </div>

              {/* Defense Actions */}
              <div className="space-y-2">
                <div className={`text-xs uppercase ${theme.fonts.mono} ${theme.colors.muted}`}>
                  Defense Actions
                </div>
                <div className="space-y-1">
                  <CombatActionButton
                    label="Dodge"
                    icon={<Move className="w-4 h-4" />}
                    pool={combatPools.dodge + woundModifier}
                    context="Dodge (REA + INT + Gymnastics)"
                    actionType="interrupt"
                    onClick={onOpenDiceRoller}
                    isAvailable={canUseAction("interrupt")}
                    theme={theme}
                  />
                  <CombatActionButton
                    label="Block"
                    icon={<Shield className="w-4 h-4" />}
                    pool={combatPools.block + woundModifier}
                    context="Block (REA + Unarmed Combat)"
                    actionType="interrupt"
                    onClick={onOpenDiceRoller}
                    isAvailable={canUseAction("interrupt")}
                    theme={theme}
                  />
                  <CombatActionButton
                    label="Full Defense"
                    icon={<Shield className="w-4 h-4" />}
                    pool={combatPools.fullDefense + woundModifier}
                    context="Full Defense (REA + INT + WIL)"
                    actionType="complex"
                    onClick={onOpenDiceRoller}
                    isAvailable={canUseAction("complex")}
                    theme={theme}
                  />
                </div>
              </div>

              {/* Resistance */}
              <div className="space-y-2">
                <div className={`text-xs uppercase ${theme.fonts.mono} ${theme.colors.muted}`}>
                  Resistance
                </div>
                <div className="space-y-1">
                  <CombatActionButton
                    label="Soak Damage"
                    icon={<Shield className="w-4 h-4" />}
                    pool={combatPools.soak}
                    context="Soak (BOD + Armor)"
                    actionType="free"
                    onClick={onOpenDiceRoller}
                    isAvailable={true}
                    theme={theme}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Wound Modifier Warning */}
          {woundModifier !== 0 && (
            <div className={`
              flex items-center gap-2 p-2 rounded text-xs border
              ${theme.components.badge.negative}
            `}>
              <span>Wound Modifier:</span>
              <span className={`${theme.fonts.mono} font-bold`}>{woundModifier}</span>
              <span className={theme.colors.muted}>(applied to all tests)</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
