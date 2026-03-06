"use client";

import React, { useMemo, useState, useCallback } from "react";
import { Button } from "react-aria-components";
import {
  Swords,
  Shield,
  Target,
  Move,
  Eye,
  HandMetal,
  AlertCircle,
  ArrowLeft,
  Check,
  Lock,
  Wand2,
  Monitor,
  MessageSquare,
  Car,
  Dice1,
  Zap,
} from "lucide-react";
import { useEdge, useActionResolver } from "@/lib/rules/action-resolution/hooks";
import { useCombatSession, useActionEconomy } from "@/lib/combat";
import { useAvailableActions } from "@/lib/rules/RulesetContext";
import { EdgeActionSelector } from "@/components/action-resolution/EdgeActionSelector";
import { TargetSelector } from "./TargetSelector";
import type {
  Character,
  ActionDefinition,
  ActionPool,
  PoolModifier,
  ActionContext,
  EdgeActionType,
} from "@/lib/types";
import { THEMES, DEFAULT_THEME, type Theme } from "@/lib/themes";

interface CombatActionFlowProps {
  character: Character;
  onOpenDiceRoller: (pool: number, context: string) => void;
  woundModifier: number;
  physicalLimit: number;
  mentalLimit: number;
  socialLimit: number;
  theme?: Theme;
}

type ActionFlowStep = "select" | "target" | "confirm" | "result";

function getActionIcon(action: ActionDefinition): React.ReactNode {
  const subcategory = action.subcategory || "";
  const domain = action.domain;

  switch (subcategory) {
    case "ranged":
      return <Target className="w-4 h-4" />;
    case "melee":
      return <HandMetal className="w-4 h-4" />;
    case "defense":
      return <Shield className="w-4 h-4" />;
    case "movement":
      return <Move className="w-4 h-4" />;
    case "perception":
      return <Eye className="w-4 h-4" />;
    default:
      break;
  }

  switch (domain) {
    case "combat":
      return <Swords className="w-4 h-4" />;
    case "magic":
      return <Wand2 className="w-4 h-4" />;
    case "matrix":
      return <Monitor className="w-4 h-4" />;
    case "social":
      return <MessageSquare className="w-4 h-4" />;
    case "vehicle":
      return <Car className="w-4 h-4" />;
    default:
      return <Dice1 className="w-4 h-4" />;
  }
}

function getLimitForAction(
  action: ActionDefinition,
  limits: { physical: number; mental: number; social: number }
): { value: number | undefined; source: string | undefined } {
  const domain = action.domain;
  const subcategory = action.subcategory || "";

  // Combat actions typically use Physical limit
  if (domain === "combat" || subcategory === "melee" || subcategory === "ranged") {
    return { value: limits.physical, source: "Physical" };
  }
  if (domain === "magic") {
    return { value: limits.mental, source: "Mental" };
  }
  if (domain === "social") {
    return { value: limits.social, source: "Social" };
  }
  if (subcategory === "perception") {
    return { value: limits.mental, source: "Mental" };
  }
  return { value: undefined, source: undefined };
}

export function CombatActionFlow({
  character,
  onOpenDiceRoller,
  woundModifier,
  physicalLimit,
  mentalLimit,
  socialLimit,
  theme,
}: CombatActionFlowProps) {
  const t = theme || THEMES[DEFAULT_THEME];
  const { isInCombat, isMyTurn, executeAction, isLoading: combatLoading } = useCombatSession();
  const actionEconomy = useActionEconomy();

  const {
    available: availableActions,
    unavailable: unavailableActions,
    all: allActions,
  } = useAvailableActions(character, { domain: "combat" });

  const {
    current: edgeCurrent,
    maximum: edgeMaximum,
    spend: spendEdge,
    refresh: refreshEdge,
  } = useEdge(character.id);

  const {
    roll: executeRoll,
    currentResult,
    isRolling,
    clearResult,
  } = useActionResolver({
    characterId: character.id,
    persistRolls: true,
  });

  // Flow state
  const [flowStep, setFlowStep] = useState<ActionFlowStep>("select");
  const [selectedAction, setSelectedAction] = useState<ActionDefinition | null>(null);
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);
  const [selectedTargetName, setSelectedTargetName] = useState<string | null>(null);
  const [edgeAction, setEdgeAction] = useState<EdgeActionType | null>(null);

  const resetFlow = useCallback(() => {
    setFlowStep("select");
    setSelectedAction(null);
    setSelectedTargetId(null);
    setSelectedTargetName(null);
    setEdgeAction(null);
    clearResult();
  }, [clearResult]);

  const handleSelectAction = useCallback(
    (action: ActionDefinition) => {
      setSelectedAction(action);
      const needsTarget = action.subcategory === "ranged" || action.subcategory === "melee";
      if (needsTarget && isInCombat) {
        setFlowStep("target");
      } else {
        setFlowStep("confirm");
      }
    },
    [isInCombat]
  );

  const handleTargetSelect = useCallback((targetId: string, targetName: string) => {
    setSelectedTargetId(targetId);
    setSelectedTargetName(targetName);
    setFlowStep("confirm");
  }, []);

  const handleExecuteAction = useCallback(
    async (actionId: string) => {
      if (!isInCombat) return;
      await executeAction(actionId);
    },
    [isInCombat, executeAction]
  );

  // Calculate dice pool for an action
  const calculateActionPool = useCallback(
    (action: ActionDefinition): number => {
      const attrs = character.attributes || {};
      const skills = character.skills || {};

      if (!action.rollConfig) return 0;

      let pool = 0;
      if (action.rollConfig.attribute) {
        pool += attrs[action.rollConfig.attribute.toLowerCase()] || 0;
      }
      if (action.rollConfig.skill) {
        pool += skills[action.rollConfig.skill.toLowerCase().replace(/ /g, "-")] || 0;
      }
      pool += woundModifier;
      return Math.max(0, pool);
    },
    [character.attributes, character.skills, woundModifier]
  );

  // Build a proper ActionPool object for executeRoll
  const buildCombatPool = useCallback(
    (action: ActionDefinition): ActionPool => {
      const attrs = character.attributes || {};
      const skills = character.skills || {};
      const modifiers: PoolModifier[] = [];
      let basePool = 0;

      if (action.rollConfig?.attribute) {
        const attrKey = action.rollConfig.attribute.toLowerCase();
        const attrVal = attrs[attrKey] || 0;
        basePool += attrVal;
        modifiers.push({
          source: "attribute",
          value: attrVal,
          description: action.rollConfig.attribute,
        });
      }

      if (action.rollConfig?.skill) {
        const skillKey = action.rollConfig.skill.toLowerCase().replace(/ /g, "-");
        const skillVal = skills[skillKey] || 0;
        basePool += skillVal;
        modifiers.push({ source: "skill", value: skillVal, description: action.rollConfig.skill });
      }

      if (woundModifier !== 0) {
        modifiers.push({ source: "wound", value: woundModifier, description: "Wound Modifier" });
      }

      const totalDice = Math.max(
        0,
        modifiers.reduce((sum, m) => sum + m.value, 0)
      );
      const limitInfo = getLimitForAction(action, {
        physical: physicalLimit,
        mental: mentalLimit,
        social: socialLimit,
      });

      return {
        basePool,
        totalDice,
        modifiers,
        limit: edgeAction === "push-the-limit" ? undefined : limitInfo.value,
        limitSource: edgeAction === "push-the-limit" ? undefined : limitInfo.source,
        attribute: action.rollConfig?.attribute,
        skill: action.rollConfig?.skill,
      };
    },
    [
      character.attributes,
      character.skills,
      woundModifier,
      physicalLimit,
      mentalLimit,
      socialLimit,
      edgeAction,
    ]
  );

  // Effective pool considering Push the Limit
  const getEffectivePool = useCallback(
    (action: ActionDefinition): number => {
      const base = calculateActionPool(action);
      if (edgeAction === "push-the-limit") {
        return base + (character.attributes?.edge || 0);
      }
      return base;
    },
    [calculateActionPool, edgeAction, character.attributes]
  );

  // Calculate combat pools for fallback hardcoded actions
  const combatPools = useMemo(() => {
    const attrs = character.attributes || {};
    const skills = character.skills || {};

    return {
      meleeAttack: (attrs.agility || 1) + (skills["unarmed-combat"] || skills.blades || 0),
      rangedAttack: (attrs.agility || 1) + (skills.pistols || skills.automatics || 0),
      defense: (attrs.reaction || 1) + (attrs.intuition || 1),
      dodge: (attrs.reaction || 1) + (attrs.intuition || 1) + (skills.gymnastics || 0),
      block: (attrs.reaction || 1) + (skills["unarmed-combat"] || 0),
      fullDefense: (attrs.reaction || 1) + (attrs.intuition || 1) + (attrs.willpower || 1),
      soak:
        (attrs.body || 1) +
        (character.armor?.reduce((sum, a) => (a.equipped ? sum + a.armorRating : sum), 0) || 0),
    };
  }, [character]);

  const canUseAction = (type: "free" | "simple" | "complex" | "interrupt") => {
    if (!isInCombat || !actionEconomy) return true;
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

  // Handle the roll button press
  const handleRoll = useCallback(
    async (action: ActionDefinition) => {
      const pool = buildCombatPool(action);
      const effectivePool = getEffectivePool(action);
      const context: ActionContext = {
        actionType: action.name,
        description: action.description,
        attributeUsed: action.rollConfig?.attribute,
        skillUsed: action.rollConfig?.skill,
        targetName: selectedTargetName || undefined,
      };

      if (isInCombat) {
        await handleExecuteAction(action.id);
      }

      const result = await executeRoll(pool, context, edgeAction || undefined);

      if (result) {
        // Refresh Edge state after a roll that may have spent Edge
        if (edgeAction) {
          await refreshEdge();
        }
        setFlowStep("result");
      }

      // Also open the visual dice roller for backward compat
      onOpenDiceRoller(
        effectivePool,
        `${action.name}${selectedTargetName ? ` vs ${selectedTargetName}` : ""}`
      );
    },
    [
      buildCombatPool,
      getEffectivePool,
      selectedTargetName,
      isInCombat,
      handleExecuteAction,
      executeRoll,
      edgeAction,
      refreshEdge,
      onOpenDiceRoller,
    ]
  );

  // Handle non-roll Edge actions (Seize Initiative, Dead Man's Trigger)
  const handleNonRollEdge = useCallback(
    async (action: EdgeActionType | null) => {
      if (!action) return;
      const actionNames: Record<string, string> = {
        "seize-the-initiative": "Seize the Initiative",
        "dead-mans-trigger": "Dead Man's Trigger",
      };
      await spendEdge(1, actionNames[action] || action);
    },
    [spendEdge]
  );

  // Handle post-roll Edge actions
  const handlePostRollEdge = useCallback(
    async (action: EdgeActionType | null) => {
      if (!action || !currentResult) return;
      // For second-chance and close-call, spend edge and note it
      await spendEdge(1, action === "second-chance" ? "Second Chance" : "Close Call");
      await refreshEdge();
    },
    [currentResult, spendEdge, refreshEdge]
  );

  const typeColors: Record<string, string> = {
    free: "bg-emerald-500/20 border-emerald-500/30 text-emerald-500",
    simple: "bg-blue-500/20 border-blue-500/30 text-blue-500",
    complex: "bg-purple-500/20 border-purple-500/30 text-purple-500",
    interrupt: "bg-amber-500/20 border-amber-500/30 text-amber-500",
  };

  const typeLabels: Record<string, string> = {
    free: "F",
    simple: "S",
    complex: "C",
    interrupt: "Int",
  };

  return (
    <div className="space-y-4">
      {/* Action Economy Display (when in combat) */}
      {isInCombat && actionEconomy && (
        <div className={`p-2 rounded ${t.components.card.wrapper} ${t.components.card.border}`}>
          <div className={`text-[10px] uppercase ${t.fonts.mono} ${t.colors.muted} mb-2`}>
            Actions Remaining
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1" title="Free Actions">
              <span className="text-xs text-muted-foreground">F</span>
              <span
                className={`px-2 py-0.5 rounded text-xs font-bold ${t.fonts.mono} ${
                  actionEconomy.free > 0
                    ? "bg-emerald-500/20 text-emerald-500"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {actionEconomy.free >= 999 ? "\u221e" : actionEconomy.free}
              </span>
            </div>
            <div className="flex items-center gap-1" title="Simple Actions">
              <span className="text-xs text-muted-foreground">S</span>
              <span
                className={`px-2 py-0.5 rounded text-xs font-bold ${t.fonts.mono} ${
                  actionEconomy.simple > 0
                    ? "bg-blue-500/20 text-blue-500"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {actionEconomy.simple}
              </span>
            </div>
            <div className="flex items-center gap-1" title="Complex Actions">
              <span className="text-xs text-muted-foreground">C</span>
              <span
                className={`px-2 py-0.5 rounded text-xs font-bold ${t.fonts.mono} ${
                  actionEconomy.complex > 0
                    ? "bg-purple-500/20 text-purple-500"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {actionEconomy.complex}
              </span>
            </div>
            <div className="flex items-center gap-1" title="Interrupt Available">
              <Shield
                className={`w-4 h-4 ${actionEconomy.interrupt ? "text-amber-500" : "text-muted-foreground"}`}
              />
            </div>
          </div>
        </div>
      )}

      {/* Non-roll Edge Actions (Seize Initiative, Dead Man's Trigger) */}
      {edgeCurrent > 0 && (
        <EdgeActionSelector
          timing="non-roll"
          selectedAction={null}
          onSelect={handleNonRollEdge}
          currentEdge={edgeCurrent}
          maxEdge={edgeMaximum}
          isDisabled={isRolling}
          size="sm"
        />
      )}

      {/* Select Step */}
      {flowStep === "select" && (
        <>
          {/* Available Actions */}
          {availableActions.length > 0 && (
            <div className="space-y-2">
              <div className={`text-xs uppercase ${t.fonts.mono} ${t.colors.muted}`}>
                Available Actions
              </div>
              <div className="space-y-1">
                {availableActions.map((result) => {
                  const action = result.action;
                  const pool = calculateActionPool(action);
                  const actionType = action.type as "free" | "simple" | "complex" | "interrupt";
                  const canUse = canUseAction(actionType);

                  return (
                    <Button
                      key={action.id}
                      onPress={() => handleSelectAction(action)}
                      isDisabled={!canUse || combatLoading}
                      className={`
                        flex items-center gap-2 w-full
                        px-3 py-2 rounded border
                        ${canUse ? typeColors[actionType] : "bg-muted border-border text-muted-foreground"}
                        ${canUse ? "hover:opacity-80" : "opacity-50 cursor-not-allowed"}
                        transition-all text-sm
                      `}
                    >
                      <span className="w-5 h-5 flex items-center justify-center">
                        {getActionIcon(action)}
                      </span>
                      <span className="flex-1 text-left font-medium">{action.name}</span>
                      <span className={`text-xs ${t.fonts.mono} opacity-70`}>{pool}d6</span>
                      <span
                        className={`text-[10px] ${t.fonts.mono} px-1.5 py-0.5 rounded bg-background/50`}
                      >
                        {typeLabels[actionType]}
                      </span>
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Unavailable Actions */}
          {unavailableActions.length > 0 && (
            <div className="space-y-2">
              <div
                className={`text-xs uppercase ${t.fonts.mono} ${t.colors.muted} flex items-center gap-2`}
              >
                <Lock className="w-3 h-3" />
                Unavailable Actions
              </div>
              <div className="space-y-1">
                {unavailableActions.map((result) => {
                  const action = result.action;
                  const actionType = action.type as "free" | "simple" | "complex" | "interrupt";
                  const unavailTypeColors: Record<string, string> = {
                    free: "border-emerald-500/20",
                    simple: "border-blue-500/20",
                    complex: "border-purple-500/20",
                    interrupt: "border-amber-500/20",
                  };

                  return (
                    <div
                      key={action.id}
                      className={`
                        flex items-center gap-2 w-full
                        px-3 py-2 rounded border
                        bg-muted/30 ${unavailTypeColors[actionType]}
                        opacity-50 cursor-not-allowed
                        text-sm
                      `}
                      title={result.reasons.join(", ")}
                    >
                      <span className="w-5 h-5 flex items-center justify-center text-muted-foreground">
                        {getActionIcon(action)}
                      </span>
                      <span className="flex-1 text-left font-medium text-muted-foreground">
                        {action.name}
                      </span>
                      <span
                        className={`text-[10px] ${t.fonts.mono} px-1.5 py-0.5 rounded bg-background/50 text-muted-foreground`}
                      >
                        {typeLabels[actionType]}
                      </span>
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                    </div>
                  );
                })}
              </div>
              <div className={`text-[10px] ${t.colors.muted} italic`}>
                Hover over an action to see requirements
              </div>
            </div>
          )}

          {/* Fallback hardcoded actions */}
          {allActions.length === 0 && (
            <>
              <div className="space-y-2">
                <div className={`text-xs uppercase ${t.fonts.mono} ${t.colors.muted}`}>
                  Attack Actions
                </div>
                <div className="space-y-1">
                  <Button
                    onPress={() =>
                      handleSelectAction({
                        id: "melee-attack",
                        name: "Melee Attack",
                        description: "Melee Attack (AGI + Combat Skill)",
                        type: "complex",
                        domain: "combat",
                        subcategory: "melee",
                        rollConfig: { attribute: "agility", skill: "unarmed-combat" },
                      } as ActionDefinition)
                    }
                    isDisabled={!canUseAction("complex") || combatLoading}
                    className={`
                      flex items-center gap-2 w-full px-3 py-2 rounded border
                      ${canUseAction("complex") ? typeColors.complex : "bg-muted border-border text-muted-foreground"}
                      ${canUseAction("complex") ? "hover:opacity-80" : "opacity-50 cursor-not-allowed"}
                      transition-all text-sm
                    `}
                  >
                    <HandMetal className="w-4 h-4" />
                    <span className="flex-1 text-left font-medium">Melee Attack</span>
                    <span className={`text-xs ${t.fonts.mono} opacity-70`}>
                      {combatPools.meleeAttack + woundModifier}d6
                    </span>
                    <span
                      className={`text-[10px] ${t.fonts.mono} px-1.5 py-0.5 rounded bg-background/50`}
                    >
                      C
                    </span>
                  </Button>
                  <Button
                    onPress={() =>
                      handleSelectAction({
                        id: "ranged-attack",
                        name: "Ranged Attack",
                        description: "Ranged Attack (AGI + Firearms)",
                        type: "simple",
                        domain: "combat",
                        subcategory: "ranged",
                        rollConfig: { attribute: "agility", skill: "pistols" },
                      } as ActionDefinition)
                    }
                    isDisabled={!canUseAction("simple") || combatLoading}
                    className={`
                      flex items-center gap-2 w-full px-3 py-2 rounded border
                      ${canUseAction("simple") ? typeColors.simple : "bg-muted border-border text-muted-foreground"}
                      ${canUseAction("simple") ? "hover:opacity-80" : "opacity-50 cursor-not-allowed"}
                      transition-all text-sm
                    `}
                  >
                    <Target className="w-4 h-4" />
                    <span className="flex-1 text-left font-medium">Ranged Attack</span>
                    <span className={`text-xs ${t.fonts.mono} opacity-70`}>
                      {combatPools.rangedAttack + woundModifier}d6
                    </span>
                    <span
                      className={`text-[10px] ${t.fonts.mono} px-1.5 py-0.5 rounded bg-background/50`}
                    >
                      S
                    </span>
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className={`text-xs uppercase ${t.fonts.mono} ${t.colors.muted}`}>
                  Defense Actions
                </div>
                <div className="space-y-1">
                  <Button
                    onPress={() =>
                      handleSelectAction({
                        id: "dodge",
                        name: "Dodge",
                        description: "Dodge (REA + INT + Gymnastics)",
                        type: "interrupt",
                        domain: "combat",
                        subcategory: "defense",
                        rollConfig: { attribute: "reaction" },
                      } as ActionDefinition)
                    }
                    isDisabled={!canUseAction("interrupt") || combatLoading}
                    className={`
                      flex items-center gap-2 w-full px-3 py-2 rounded border
                      ${canUseAction("interrupt") ? typeColors.interrupt : "bg-muted border-border text-muted-foreground"}
                      ${canUseAction("interrupt") ? "hover:opacity-80" : "opacity-50 cursor-not-allowed"}
                      transition-all text-sm
                    `}
                  >
                    <Move className="w-4 h-4" />
                    <span className="flex-1 text-left font-medium">Dodge</span>
                    <span className={`text-xs ${t.fonts.mono} opacity-70`}>
                      {combatPools.dodge + woundModifier}d6
                    </span>
                    <span
                      className={`text-[10px] ${t.fonts.mono} px-1.5 py-0.5 rounded bg-background/50`}
                    >
                      Int
                    </span>
                  </Button>
                  <Button
                    onPress={() =>
                      handleSelectAction({
                        id: "block",
                        name: "Block",
                        description: "Block (REA + Unarmed Combat)",
                        type: "interrupt",
                        domain: "combat",
                        subcategory: "defense",
                        rollConfig: { attribute: "reaction", skill: "unarmed-combat" },
                      } as ActionDefinition)
                    }
                    isDisabled={!canUseAction("interrupt") || combatLoading}
                    className={`
                      flex items-center gap-2 w-full px-3 py-2 rounded border
                      ${canUseAction("interrupt") ? typeColors.interrupt : "bg-muted border-border text-muted-foreground"}
                      ${canUseAction("interrupt") ? "hover:opacity-80" : "opacity-50 cursor-not-allowed"}
                      transition-all text-sm
                    `}
                  >
                    <Shield className="w-4 h-4" />
                    <span className="flex-1 text-left font-medium">Block</span>
                    <span className={`text-xs ${t.fonts.mono} opacity-70`}>
                      {combatPools.block + woundModifier}d6
                    </span>
                    <span
                      className={`text-[10px] ${t.fonts.mono} px-1.5 py-0.5 rounded bg-background/50`}
                    >
                      Int
                    </span>
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className={`text-xs uppercase ${t.fonts.mono} ${t.colors.muted}`}>
                  Resistance
                </div>
                <div className="space-y-1">
                  <Button
                    onPress={() =>
                      handleSelectAction({
                        id: "soak",
                        name: "Soak Damage",
                        description: "Soak (BOD + Armor)",
                        type: "free",
                        domain: "combat",
                        subcategory: "defense",
                        rollConfig: { attribute: "body" },
                      } as ActionDefinition)
                    }
                    isDisabled={combatLoading}
                    className={`
                      flex items-center gap-2 w-full px-3 py-2 rounded border
                      ${typeColors.free}
                      hover:opacity-80
                      transition-all text-sm
                    `}
                  >
                    <Shield className="w-4 h-4" />
                    <span className="flex-1 text-left font-medium">Soak Damage</span>
                    <span className={`text-xs ${t.fonts.mono} opacity-70`}>
                      {combatPools.soak}d6
                    </span>
                    <span
                      className={`text-[10px] ${t.fonts.mono} px-1.5 py-0.5 rounded bg-background/50`}
                    >
                      F
                    </span>
                  </Button>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* Target Selection Step */}
      {flowStep === "target" && selectedAction && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Button onPress={resetFlow} className="p-1.5 rounded hover:bg-muted transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <span className={`text-sm font-medium ${t.colors.heading}`}>
              Select Target for {selectedAction.name}
            </span>
          </div>

          <TargetSelector
            characterId={character.id}
            theme={t}
            onTargetSelect={handleTargetSelect}
            variant="inline"
            selectedTargetId={selectedTargetId}
          />

          <Button
            onPress={() => setFlowStep("confirm")}
            className={`
              w-full flex items-center justify-center gap-2
              px-3 py-2 rounded text-sm
              ${t.components.card.wrapper} ${t.components.card.border}
              ${t.colors.muted} hover:text-foreground
              transition-colors
            `}
          >
            Skip (no target)
          </Button>
        </div>
      )}

      {/* Confirm Step */}
      {flowStep === "confirm" && selectedAction && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Button
              onPress={() => {
                const needsTarget =
                  selectedAction.subcategory === "ranged" || selectedAction.subcategory === "melee";
                if (needsTarget && isInCombat) {
                  setFlowStep("target");
                } else {
                  resetFlow();
                }
              }}
              className="p-1.5 rounded hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <span className={`text-sm font-medium ${t.colors.heading}`}>Confirm Action</span>
          </div>

          {/* Action Summary */}
          <div className={`p-3 rounded ${t.components.card.wrapper} ${t.components.card.border}`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                {getActionIcon(selectedAction)}
              </div>
              <div>
                <div className={`font-medium ${t.colors.heading}`}>{selectedAction.name}</div>
                <div className={`text-xs ${t.colors.muted}`}>{selectedAction.description}</div>
              </div>
            </div>

            {/* Target Display */}
            {selectedTargetName && (
              <div className="flex items-center gap-2 mb-3 p-2 rounded bg-amber-500/10 border border-amber-500/30">
                <Target className="w-4 h-4 text-amber-500" />
                <span className="text-sm text-amber-500">Target: {selectedTargetName}</span>
              </div>
            )}

            {/* Dice Pool Preview */}
            <div className="flex items-center justify-between p-2 rounded bg-muted/30">
              <span className={`text-sm ${t.colors.muted}`}>Dice Pool:</span>
              <span className={`font-bold ${t.fonts.mono} ${t.colors.accent}`}>
                {getEffectivePool(selectedAction)}d6
              </span>
            </div>

            {/* Limit display */}
            {edgeAction !== "push-the-limit" && (
              <div className="flex items-center justify-between p-2 rounded bg-muted/30 mt-1">
                <span className={`text-sm ${t.colors.muted}`}>Limit:</span>
                <span className={`${t.fonts.mono} text-muted-foreground`}>
                  {getLimitForAction(selectedAction, {
                    physical: physicalLimit,
                    mental: mentalLimit,
                    social: socialLimit,
                  }).source || "None"}
                  {getLimitForAction(selectedAction, {
                    physical: physicalLimit,
                    mental: mentalLimit,
                    social: socialLimit,
                  }).value
                    ? ` (${getLimitForAction(selectedAction, { physical: physicalLimit, mental: mentalLimit, social: socialLimit }).value})`
                    : ""}
                </span>
              </div>
            )}
            {edgeAction === "push-the-limit" && (
              <div className="flex items-center justify-between p-2 rounded bg-rose-500/10 border border-rose-500/20 mt-1">
                <span className={`text-sm text-rose-500 dark:text-rose-400`}>Limit:</span>
                <span className="font-mono text-rose-500 dark:text-rose-400">
                  None (Push the Limit)
                </span>
              </div>
            )}
          </div>

          {/* Pre-roll Edge Actions */}
          {edgeCurrent > 0 && (
            <EdgeActionSelector
              timing="pre-roll"
              selectedAction={edgeAction}
              onSelect={setEdgeAction}
              currentEdge={edgeCurrent}
              maxEdge={edgeMaximum}
              isDisabled={isRolling}
              size="sm"
            />
          )}

          {/* Roll Button */}
          <Button
            onPress={() => handleRoll(selectedAction)}
            isDisabled={combatLoading || isRolling}
            className={`
              w-full flex items-center justify-center gap-2
              px-4 py-3 rounded font-medium
              bg-emerald-500 text-white
              hover:bg-emerald-600
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors
            `}
          >
            {isRolling ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Check className="w-4 h-4" />
                Roll {getEffectivePool(selectedAction)}d6
                {edgeAction && (
                  <span className="ml-1 text-rose-200">
                    + {edgeAction === "push-the-limit" ? "Push the Limit" : "Blitz"}
                  </span>
                )}
              </>
            )}
          </Button>
        </div>
      )}

      {/* Result Step */}
      {flowStep === "result" && currentResult && (
        <div className="space-y-3">
          <div className={`text-xs uppercase ${t.fonts.mono} ${t.colors.muted}`}>Roll Result</div>

          <div className={`p-3 rounded ${t.components.card.wrapper} ${t.components.card.border}`}>
            {/* Hits */}
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm ${t.colors.muted}`}>Hits:</span>
              <span className={`text-2xl font-bold ${t.fonts.mono} ${t.colors.accent}`}>
                {currentResult.hits}
              </span>
            </div>

            {/* Glitch indicators */}
            {currentResult.isGlitch && !currentResult.isCriticalGlitch && (
              <div className="flex items-center gap-2 p-2 rounded bg-amber-500/10 border border-amber-500/30 mb-2">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                <span className="text-sm text-amber-500 font-medium">Glitch!</span>
              </div>
            )}
            {currentResult.isCriticalGlitch && (
              <div className="flex items-center gap-2 p-2 rounded bg-red-500/10 border border-red-500/30 mb-2">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-500 font-medium">Critical Glitch!</span>
              </div>
            )}

            {/* Edge spent indicator */}
            {currentResult.edgeSpent > 0 && (
              <div className="flex items-center gap-2 p-2 rounded bg-rose-500/10 border border-rose-500/20 mb-2">
                <Zap className="w-4 h-4 text-rose-500" />
                <span className="text-sm text-rose-500">
                  {currentResult.edgeSpent} Edge spent
                  {currentResult.edgeAction && ` (${currentResult.edgeAction.replace(/-/g, " ")})`}
                </span>
              </div>
            )}

            {/* Dice breakdown */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Pool: {currentResult.pool.totalDice}d6</span>
              <span>Ones: {currentResult.ones}</span>
            </div>
          </div>

          {/* Post-roll Edge Actions */}
          {edgeCurrent > 0 && (
            <EdgeActionSelector
              timing="post-roll"
              selectedAction={null}
              onSelect={handlePostRollEdge}
              currentEdge={edgeCurrent}
              maxEdge={edgeMaximum}
              isDisabled={isRolling}
              hasGlitch={currentResult.isGlitch || currentResult.isCriticalGlitch}
              hasRerolled={currentResult.rerollCount > 0}
              size="sm"
            />
          )}

          {/* Done Button */}
          <Button
            onPress={resetFlow}
            className={`
              w-full flex items-center justify-center gap-2
              px-4 py-3 rounded font-medium
              ${t.components.card.wrapper} ${t.components.card.border}
              hover:bg-muted/50
              transition-colors
            `}
          >
            Done
          </Button>
        </div>
      )}
    </div>
  );
}
