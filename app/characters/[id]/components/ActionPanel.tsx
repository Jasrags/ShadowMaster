"use client";

import React, { useMemo } from "react";
import { Button } from "react-aria-components";
import { Dice1, Zap, History, ChevronDown, ChevronUp } from "lucide-react";
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
  color?: string;
}

function QuickRollButton({ label, pool, context, onClick, color = "text-zinc-400" }: QuickRollButtonProps) {
  return (
    <Button
      onPress={() => onClick(pool, context)}
      className={`
        flex items-center justify-between w-full
        px-3 py-2 rounded
        bg-zinc-800/50 border border-zinc-700
        hover:bg-zinc-700 hover:border-zinc-600
        transition-colors text-sm
      `}
    >
      <span className="text-zinc-300">{label}</span>
      <span className={`font-mono font-bold ${color}`}>{pool}d6</span>
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
    <div className={`
      rounded-lg border overflow-hidden transition-all
      ${theme.id === 'modern-card'
        ? 'bg-white border-stone-200'
        : 'bg-zinc-900/80 border-zinc-700'}
    `}>
      {/* Header - Always visible */}
      <button
        onClick={onToggleExpand}
        className={`
          w-full flex items-center justify-between p-3
          ${theme.id === 'modern-card'
            ? 'hover:bg-stone-50'
            : 'hover:bg-zinc-800/50'}
          transition-colors
        `}
      >
        <div className="flex items-center gap-3">
          <Dice1 className={`w-5 h-5 ${theme.id === 'modern-card' ? 'text-indigo-600' : 'text-violet-400'}`} />
          <span className={`font-medium ${theme.id === 'modern-card' ? 'text-stone-900' : 'text-zinc-200'}`}>
            Action Panel
          </span>
        </div>
        <div className="flex items-center gap-3">
          {/* Edge Quick Display */}
          <div className="flex items-center gap-1.5">
            <Zap className={`w-4 h-4 ${theme.id === 'modern-card' ? 'text-rose-600' : 'text-rose-400'}`} />
            <span className={`font-mono text-sm font-bold ${theme.id === 'modern-card' ? 'text-rose-600' : 'text-rose-400'}`}>
              {edgeCurrent}/{edgeMaximum}
            </span>
          </div>
          {/* Wound Modifier Display */}
          {woundModifier !== 0 && (
            <span className={`
              text-xs font-mono px-2 py-0.5 rounded
              ${theme.id === 'modern-card'
                ? 'bg-amber-100 text-amber-700'
                : 'bg-amber-500/20 text-amber-400'}
            `}>
              {woundModifier}
            </span>
          )}
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-zinc-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-zinc-500" />
          )}
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className={`p-4 space-y-4 border-t ${theme.id === 'modern-card' ? 'border-stone-200' : 'border-zinc-700'}`}>
          {/* Edge Tracker */}
          <div>
            <EdgeTracker
              current={edgeCurrent}
              maximum={edgeMaximum}
              isLoading={edgeLoading}
              onSpend={spendEdge}
              onRestore={restoreEdge}
              onRestoreFull={restoreFullEdge}
              size="sm"
            />
          </div>

          {/* Limits */}
          <div className={`
            grid grid-cols-3 gap-2 p-3 rounded
            ${theme.id === 'modern-card' ? 'bg-stone-50' : 'bg-zinc-800/50'}
          `}>
            <div className="text-center">
              <div className={`text-[10px] uppercase ${theme.id === 'modern-card' ? 'text-stone-500' : 'text-zinc-500'}`}>
                Physical
              </div>
              <div className={`font-mono font-bold ${theme.id === 'modern-card' ? 'text-red-600' : 'text-red-400'}`}>
                {physicalLimit}
              </div>
            </div>
            <div className="text-center">
              <div className={`text-[10px] uppercase ${theme.id === 'modern-card' ? 'text-stone-500' : 'text-zinc-500'}`}>
                Mental
              </div>
              <div className={`font-mono font-bold ${theme.id === 'modern-card' ? 'text-blue-600' : 'text-blue-400'}`}>
                {mentalLimit}
              </div>
            </div>
            <div className="text-center">
              <div className={`text-[10px] uppercase ${theme.id === 'modern-card' ? 'text-stone-500' : 'text-zinc-500'}`}>
                Social
              </div>
              <div className={`font-mono font-bold ${theme.id === 'modern-card' ? 'text-pink-600' : 'text-pink-400'}`}>
                {socialLimit}
              </div>
            </div>
          </div>

          {/* Quick Rolls */}
          <div className="space-y-2">
            <div className={`text-xs uppercase font-medium ${theme.id === 'modern-card' ? 'text-stone-500' : 'text-zinc-500'}`}>
              Quick Rolls
            </div>
            <div className="grid grid-cols-2 gap-2">
              <QuickRollButton
                label="Initiative"
                pool={pools.initiative}
                context="Initiative (REA + INT)"
                onClick={onOpenDiceRoller}
                color={theme.id === 'modern-card' ? 'text-emerald-600' : 'text-emerald-400'}
              />
              <QuickRollButton
                label="Perception"
                pool={pools.perception}
                context="Perception (INT + Perception)"
                onClick={onOpenDiceRoller}
                color={theme.id === 'modern-card' ? 'text-cyan-600' : 'text-cyan-400'}
              />
              <QuickRollButton
                label="Composure"
                pool={pools.composure}
                context="Composure (CHA + WIL)"
                onClick={onOpenDiceRoller}
                color={theme.id === 'modern-card' ? 'text-pink-600' : 'text-pink-400'}
              />
              <QuickRollButton
                label="Judge Intent"
                pool={pools.judgeIntentions}
                context="Judge Intentions (CHA + INT)"
                onClick={onOpenDiceRoller}
                color={theme.id === 'modern-card' ? 'text-purple-600' : 'text-purple-400'}
              />
              <QuickRollButton
                label="Memory"
                pool={pools.memory}
                context="Memory (LOG + WIL)"
                onClick={onOpenDiceRoller}
                color={theme.id === 'modern-card' ? 'text-blue-600' : 'text-blue-400'}
              />
              <QuickRollButton
                label="Lift/Carry"
                pool={pools.liftCarry}
                context="Lift/Carry (BOD + STR)"
                onClick={onOpenDiceRoller}
                color={theme.id === 'modern-card' ? 'text-red-600' : 'text-red-400'}
              />
            </div>
          </div>

          {/* Wound Modifier Warning */}
          {woundModifier !== 0 && (
            <div className={`
              flex items-center gap-2 p-2 rounded text-xs
              ${theme.id === 'modern-card'
                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'}
            `}>
              <span>Wound Modifier:</span>
              <span className="font-mono font-bold">{woundModifier}</span>
              <span className="text-amber-500/70">(applied to all tests)</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ActionPanel;
