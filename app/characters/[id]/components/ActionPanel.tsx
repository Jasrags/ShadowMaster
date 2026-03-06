"use client";

import React, { useMemo, useState, useCallback } from "react";
import { Button } from "react-aria-components";
import { Dice1, Zap, Swords, History, Sliders } from "lucide-react";
import { DisplayCard } from "@/components/character/sheet/DisplayCard";
import { useEdge, useActionResolver, useActionHistory } from "@/lib/rules/action-resolution/hooks";
import { useCombatSession } from "@/lib/combat";
import { ActionPoolBuilder } from "@/components/action-resolution/ActionPoolBuilder";
import { EdgeTracker } from "@/components/action-resolution/EdgeTracker";
import { ActionHistory } from "@/components/action-resolution/ActionHistory";
import { CombatActionFlow } from "./CombatActionFlow";
import type { ActionPool, EdgeActionType, ActionContext } from "@/lib/types";
import type { Character } from "@/lib/types";
import { THEMES, DEFAULT_THEME, type Theme } from "@/lib/themes";

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
  /** Callback to open dice roller with a pool */
  onOpenDiceRoller: (pool: number, context: string) => void;
  /** Current theme */
  theme?: Theme;
}

interface QuickRollButtonProps {
  label: string;
  pool: number;
  context: string;
  onClick: (pool: number, context: string) => void;
  theme?: Theme;
}

function QuickRollButton({
  label,
  pool,
  context,
  onClick,
  theme: themeProp,
}: QuickRollButtonProps) {
  const theme = themeProp || THEMES[DEFAULT_THEME];
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
  onOpenDiceRoller,
  theme,
}: ActionPanelProps) {
  const t = theme || THEMES[DEFAULT_THEME];
  const { isInCombat } = useCombatSession();

  // Tab state
  const [activeTab, setActiveTab] = useState<"quick" | "combat" | "advanced" | "history">("quick");

  // Action resolver for server-side roll persistence
  const {
    roll: executeRoll,
    history: rollHistory,
    isRolling,
  } = useActionResolver({
    characterId: character.id,
    persistRolls: true,
  });

  // Action history hook for loading more actions
  const {
    actions: persistedActions,
    isLoading: historyLoading,
    hasMore: hasMoreHistory,
    loadMore: loadMoreHistory,
  } = useActionHistory(character.id);

  // Combine local and persisted history
  const combinedHistory = useMemo(() => {
    const local = rollHistory || [];
    const persisted = persistedActions || [];
    const all = [...local];
    persisted.forEach((p) => {
      if (!all.find((a) => a.id === p.id)) {
        all.push(p);
      }
    });
    return all.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [rollHistory, persistedActions]);

  // Handle roll from ActionPoolBuilder
  const handleAdvancedRoll = useCallback(
    async (config: { pool: ActionPool; edgeAction?: EdgeActionType; context?: ActionContext }) => {
      const result = await executeRoll(config.pool, config.context, config.edgeAction);
      if (result) {
        onOpenDiceRoller(result.pool.totalDice, config.context?.actionType || "Advanced Roll");
      }
    },
    [executeRoll, onOpenDiceRoller]
  );

  // Transform skills for ActionPoolBuilder
  const skillsForBuilder = useMemo(() => {
    const result: Record<string, { rating: number; specializations?: string[] }> = {};
    const skills = character.skills || {};
    const specs = character.skillSpecializations || {};

    for (const [skillId, rating] of Object.entries(skills)) {
      const rawSpecs = specs[skillId];
      const specArray = rawSpecs ? (Array.isArray(rawSpecs) ? rawSpecs : [rawSpecs]) : undefined;
      result[skillId] = { rating, specializations: specArray };
    }
    return result;
  }, [character.skills, character.skillSpecializations]);

  // Edge management
  const {
    current: edgeCurrent,
    maximum: edgeMaximum,
    isLoading: edgeLoading,
    spend: spendEdge,
    restore: restoreEdge,
    restoreFull: restoreFullEdge,
  } = useEdge(character.id);

  // Calculate common pools for Quick tab
  const pools = useMemo(() => {
    const attrs = character.attributes || {};
    const skills = character.skills || {};

    return {
      initiative: (attrs.reaction || 1) + (attrs.intuition || 1),
      perception: (attrs.intuition || 1) + (skills.perception || 0),
      composure: (attrs.charisma || 1) + (attrs.willpower || 1),
      judgeIntentions: (attrs.charisma || 1) + (attrs.intuition || 1),
      memory: (attrs.logic || 1) + (attrs.willpower || 1),
      liftCarry: (attrs.body || 1) + (attrs.strength || 1),
    };
  }, [character]);

  return (
    <DisplayCard
      id="sheet-action-panel"
      title="Action Panel"
      icon={<Dice1 className="w-5 h-5 text-amber-500" />}
      collapsible
      headerAction={
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-rose-500 dark:text-rose-400" />
            <span className="font-mono text-sm font-bold text-rose-500 dark:text-rose-400">
              {edgeCurrent}/{edgeMaximum}
            </span>
          </div>
          {woundModifier !== 0 && (
            <span className="font-mono text-xs px-2 py-0.5 rounded border text-red-500 border-red-500/30 bg-red-500/10">
              {woundModifier}
            </span>
          )}
        </div>
      }
    >
      <div className="space-y-4">
        {/* Edge Tracker */}
        <EdgeTracker
          current={edgeCurrent}
          maximum={edgeMaximum}
          isLoading={edgeLoading}
          onSpend={spendEdge}
          onRestore={restoreEdge}
          onRestoreFull={restoreFullEdge}
          showControls={true}
          size="md"
        />

        {/* Limits */}
        <div
          className={`grid grid-cols-3 gap-2 p-3 rounded ${t.components.card.wrapper} ${t.components.card.border}`}
        >
          <div className="text-center">
            <div className={`text-[10px] uppercase ${t.fonts.mono} ${t.colors.muted}`}>
              Physical
            </div>
            <div className={`${t.fonts.mono} font-bold text-red-500 dark:text-red-400`}>
              {physicalLimit}
            </div>
          </div>
          <div className="text-center">
            <div className={`text-[10px] uppercase ${t.fonts.mono} ${t.colors.muted}`}>Mental</div>
            <div className={`${t.fonts.mono} font-bold text-blue-500 dark:text-blue-400`}>
              {mentalLimit}
            </div>
          </div>
          <div className="text-center">
            <div className={`text-[10px] uppercase ${t.fonts.mono} ${t.colors.muted}`}>Social</div>
            <div className={`${t.fonts.mono} font-bold text-pink-500 dark:text-pink-400`}>
              {socialLimit}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/30">
          <button
            onClick={() => setActiveTab("quick")}
            className={`
              flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium transition-colors
              ${
                activeTab === "quick"
                  ? `${t.colors.accent} bg-background shadow-sm`
                  : `${t.colors.muted} hover:text-foreground`
              }
            `}
          >
            <Dice1 className="w-3 h-3" />
            Quick
          </button>
          <button
            onClick={() => setActiveTab("combat")}
            className={`
              flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium transition-colors
              ${
                activeTab === "combat"
                  ? `${t.colors.accent} bg-background shadow-sm`
                  : `${t.colors.muted} hover:text-foreground`
              }
              ${isInCombat ? "ring-1 ring-amber-500/50" : ""}
            `}
          >
            <Swords className={`w-3 h-3 ${isInCombat ? "text-amber-500" : ""}`} />
            Combat
            {isInCombat && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />}
          </button>
          <button
            onClick={() => setActiveTab("advanced")}
            className={`
              flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium transition-colors
              ${
                activeTab === "advanced"
                  ? `${t.colors.accent} bg-background shadow-sm`
                  : `${t.colors.muted} hover:text-foreground`
              }
            `}
          >
            <Sliders className="w-3 h-3" />
            Advanced
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`
              flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium transition-colors
              ${
                activeTab === "history"
                  ? `${t.colors.accent} bg-background shadow-sm`
                  : `${t.colors.muted} hover:text-foreground`
              }
            `}
          >
            <History className="w-3 h-3" />
            History
            {combinedHistory.length > 0 && (
              <span className={`text-[10px] ${t.fonts.mono} px-1 rounded bg-muted`}>
                {combinedHistory.length}
              </span>
            )}
          </button>
        </div>

        {/* Quick Rolls Tab */}
        {activeTab === "quick" && (
          <div className="space-y-2">
            <div className={`text-xs uppercase ${t.fonts.mono} ${t.colors.muted}`}>
              Common Tests
            </div>
            <div className="grid grid-cols-2 gap-2">
              <QuickRollButton
                label="Initiative"
                pool={pools.initiative}
                context="Initiative (REA + INT)"
                onClick={onOpenDiceRoller}
                theme={t}
              />
              <QuickRollButton
                label="Perception"
                pool={pools.perception}
                context="Perception (INT + Perception)"
                onClick={onOpenDiceRoller}
                theme={t}
              />
              <QuickRollButton
                label="Composure"
                pool={pools.composure}
                context="Composure (CHA + WIL)"
                onClick={onOpenDiceRoller}
                theme={t}
              />
              <QuickRollButton
                label="Judge Intent"
                pool={pools.judgeIntentions}
                context="Judge Intentions (CHA + INT)"
                onClick={onOpenDiceRoller}
                theme={t}
              />
              <QuickRollButton
                label="Memory"
                pool={pools.memory}
                context="Memory (LOG + WIL)"
                onClick={onOpenDiceRoller}
                theme={t}
              />
              <QuickRollButton
                label="Lift/Carry"
                pool={pools.liftCarry}
                context="Lift/Carry (BOD + STR)"
                onClick={onOpenDiceRoller}
                theme={t}
              />
            </div>
          </div>
        )}

        {/* Combat Actions Tab - Delegated to CombatActionFlow */}
        {activeTab === "combat" && (
          <CombatActionFlow
            character={character}
            onOpenDiceRoller={onOpenDiceRoller}
            woundModifier={woundModifier}
            physicalLimit={physicalLimit}
            mentalLimit={mentalLimit}
            socialLimit={socialLimit}
            theme={t}
          />
        )}

        {/* Advanced Tab - ActionPoolBuilder */}
        {activeTab === "advanced" && (
          <div className="space-y-4">
            <ActionPoolBuilder
              attributes={character.attributes || {}}
              skills={skillsForBuilder}
              woundModifier={woundModifier}
              limits={{
                physical: physicalLimit,
                mental: mentalLimit,
                social: socialLimit,
              }}
              currentEdge={edgeCurrent}
              maxEdge={edgeMaximum}
              isLoading={isRolling}
              onRoll={handleAdvancedRoll}
              size="sm"
              showAdvanced={true}
            />
          </div>
        )}

        {/* History Tab - ActionHistory */}
        {activeTab === "history" && (
          <div className="space-y-4">
            <ActionHistory
              actions={combinedHistory}
              isLoading={historyLoading}
              hasMore={hasMoreHistory}
              onLoadMore={loadMoreHistory}
              showReroll={edgeCurrent > 0}
              onReroll={(action) => {
                executeRoll(action.pool, action.context, "second-chance");
              }}
              maxVisible={5}
              size="sm"
            />
          </div>
        )}

        {/* Wound Modifier Warning */}
        {woundModifier !== 0 && (
          <div
            className={`
              flex items-center gap-2 p-2 rounded text-xs border
              ${t.components.badge.negative}
            `}
          >
            <span>Wound Modifier:</span>
            <span className={`${t.fonts.mono} font-bold`}>{woundModifier}</span>
            <span className={t.colors.muted}>(applied to all tests)</span>
          </div>
        )}
      </div>
    </DisplayCard>
  );
}
