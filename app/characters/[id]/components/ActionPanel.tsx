"use client";

import React, { useMemo } from "react";
import { Button } from "react-aria-components";
import { Dice1, Zap, ChevronDown, ChevronUp } from "lucide-react";
import { EdgeTracker } from "@/components/action-resolution";
import { useEdge } from "@/lib/rules/action-resolution/hooks";
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

          {/* Quick Rolls */}
          <div className="space-y-2">
            <div className={`text-xs uppercase ${theme.fonts.mono} ${theme.colors.muted}`}>
              Quick Rolls
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

export default ActionPanel;
