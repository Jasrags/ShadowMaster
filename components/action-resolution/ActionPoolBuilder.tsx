"use client";

import React, { useState, useMemo, useCallback } from "react";
import { Button } from "react-aria-components";
import {
  Dice1,
  Plus,
  Minus,
  Zap,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Target,
  Shield,
  Crosshair,
} from "lucide-react";
import type { ActionPool, PoolModifier, EdgeActionType, ActionContext } from "@/lib/types";

interface ActionPoolBuilderProps {
  /** Character's attribute values */
  attributes: Record<string, number>;
  /** Character's skill ratings */
  skills: Record<string, { rating: number; specializations?: string[] }>;
  /** Current wound modifier */
  woundModifier?: number;
  /** Available limits */
  limits?: {
    physical?: number;
    mental?: number;
    social?: number;
  };
  /** Current Edge available */
  currentEdge: number;
  /** Maximum Edge */
  maxEdge: number;
  /** Whether a roll is in progress */
  isLoading?: boolean;
  /** Callback when roll is requested */
  onRoll?: (config: {
    pool: ActionPool;
    edgeAction?: EdgeActionType;
    context?: ActionContext;
  }) => void;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Whether to show advanced options */
  showAdvanced?: boolean;
  /** Pre-selected action type */
  defaultActionType?: string;
}

interface ModifierInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size: "sm" | "md" | "lg";
}

function ModifierInput({ label, value, onChange, min = -10, max = 10, size }: ModifierInputProps) {
  const sizeClasses = {
    sm: { text: "text-xs", button: "w-6 h-6" },
    md: { text: "text-sm", button: "w-8 h-8" },
    lg: { text: "text-base", button: "w-10 h-10" },
  };

  const s = sizeClasses[size];

  return (
    <div className="flex items-center justify-between">
      <span className={`text-muted-foreground ${s.text}`}>{label}</span>
      <div className="flex items-center gap-1">
        <Button
          onPress={() => onChange(Math.max(min, value - 1))}
          isDisabled={value <= min}
          className={`
            ${s.button} rounded flex items-center justify-center
            bg-muted border border-border text-muted-foreground
            hover:bg-muted/80 hover:text-foreground
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors
          `}
        >
          <Minus className="w-3 h-3" />
        </Button>
        <span
          className={`
            w-10 text-center font-mono font-bold
            ${value > 0 ? "text-emerald-500 dark:text-emerald-400" : value < 0 ? "text-rose-500 dark:text-rose-400" : "text-muted-foreground"}
            ${s.text}
          `}
        >
          {value > 0 ? `+${value}` : value}
        </span>
        <Button
          onPress={() => onChange(Math.min(max, value + 1))}
          isDisabled={value >= max}
          className={`
            ${s.button} rounded flex items-center justify-center
            bg-muted border border-border text-muted-foreground
            hover:bg-muted/80 hover:text-foreground
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors
          `}
        >
          <Plus className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}

export function ActionPoolBuilder({
  attributes,
  skills,
  woundModifier = 0,
  limits,
  currentEdge,
  maxEdge,
  isLoading = false,
  onRoll,
  size = "md",
  showAdvanced = true,
  defaultActionType = "Test",
}: ActionPoolBuilderProps) {
  // Selection state
  const [selectedAttribute, setSelectedAttribute] = useState<string>("");
  const [selectedSkill, setSelectedSkill] = useState<string>("");
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>("");
  const [selectedLimit, setSelectedLimit] = useState<"physical" | "mental" | "social" | "none">(
    "none"
  );

  // Modifier state
  const [situationalMod, setSituationalMod] = useState(0);
  const [equipmentMod, setEquipmentMod] = useState(0);
  const [customMod, setCustomMod] = useState(0);

  // Edge state
  const [useEdge, setUseEdge] = useState(false);
  const [edgeAction, setEdgeAction] = useState<EdgeActionType | null>(null);

  // Context state
  const [actionType, setActionType] = useState(defaultActionType);
  const [description, setDescription] = useState("");
  const [targetName, setTargetName] = useState("");

  // UI state
  const [showModifiers, setShowModifiers] = useState(false);
  const [showContext, setShowContext] = useState(false);

  const sizeClasses = {
    sm: { text: "text-xs", padding: "p-2", input: "px-2 py-1" },
    md: { text: "text-sm", padding: "p-3", input: "px-3 py-2" },
    lg: { text: "text-base", padding: "p-4", input: "px-4 py-3" },
  };

  const s = sizeClasses[size];

  // Get sorted lists
  const attributeList = useMemo(() => Object.keys(attributes).sort(), [attributes]);
  const skillList = useMemo(() => Object.keys(skills).sort(), [skills]);

  // Get specializations for selected skill
  const specializations = useMemo(() => {
    if (!selectedSkill || !skills[selectedSkill]) return [];
    return skills[selectedSkill].specializations || [];
  }, [selectedSkill, skills]);

  // Calculate pool
  const pool = useMemo((): ActionPool => {
    const modifiers: PoolModifier[] = [];
    let basePool = 0;

    // Attribute
    if (selectedAttribute && attributes[selectedAttribute]) {
      basePool += attributes[selectedAttribute];
      modifiers.push({
        source: "attribute",
        value: attributes[selectedAttribute],
        description: selectedAttribute,
      });
    }

    // Skill
    if (selectedSkill && skills[selectedSkill]) {
      const skillRating = skills[selectedSkill].rating;
      basePool += skillRating;
      modifiers.push({
        source: "skill",
        value: skillRating,
        description: selectedSkill,
      });
    }

    // Specialization
    if (selectedSpecialization) {
      basePool += 2;
      modifiers.push({
        source: "specialization",
        value: 2,
        description: `Specialization (${selectedSpecialization})`,
      });
    }

    // Wound modifier (always negative)
    if (woundModifier !== 0) {
      modifiers.push({
        source: "wound",
        value: woundModifier,
        description: "Wound Modifier",
      });
    }

    // Situational
    if (situationalMod !== 0) {
      modifiers.push({
        source: "situational",
        value: situationalMod,
        description: "Situational",
      });
    }

    // Equipment
    if (equipmentMod !== 0) {
      modifiers.push({
        source: "equipment",
        value: equipmentMod,
        description: "Equipment",
      });
    }

    // Custom
    if (customMod !== 0) {
      modifiers.push({
        source: "other",
        value: customMod,
        description: "Other",
      });
    }

    // Calculate total
    const totalModifiers = modifiers.reduce((sum, mod) => sum + mod.value, 0);
    const totalDice = Math.max(0, totalModifiers);

    // Get limit
    const limit =
      selectedLimit !== "none" && limits?.[selectedLimit] ? limits[selectedLimit] : undefined;

    return {
      basePool,
      totalDice,
      modifiers,
      limit,
    };
  }, [
    selectedAttribute,
    selectedSkill,
    selectedSpecialization,
    attributes,
    skills,
    woundModifier,
    situationalMod,
    equipmentMod,
    customMod,
    selectedLimit,
    limits,
  ]);

  // Check if we can roll
  const canRoll = pool.totalDice > 0 && !isLoading;
  const canUseEdge = currentEdge > 0 && !isLoading;

  // Handle roll
  const handleRoll = useCallback(() => {
    if (!onRoll) return;

    const context: ActionContext = {
      actionType,
    };

    if (selectedSkill) context.skillUsed = selectedSkill;
    if (selectedAttribute) context.attributeUsed = selectedAttribute;
    if (description) context.description = description;
    if (targetName) context.targetName = targetName;

    onRoll({
      pool,
      edgeAction: useEdge && edgeAction ? edgeAction : undefined,
      context,
    });
  }, [
    onRoll,
    pool,
    useEdge,
    edgeAction,
    actionType,
    selectedSkill,
    selectedAttribute,
    description,
    targetName,
  ]);

  // Handle Edge action selection
  const handleEdgeAction = (action: EdgeActionType | null) => {
    if (action === edgeAction) {
      setEdgeAction(null);
      setUseEdge(false);
    } else {
      setEdgeAction(action);
      setUseEdge(true);
    }
  };

  return (
    <div className={`rounded-lg border border-border bg-card/50 ${s.padding}`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Dice1 className="w-5 h-5 text-violet-500 dark:text-violet-400" />
        <span className={`font-medium text-foreground ${s.text}`}>Build Dice Pool</span>
      </div>

      {/* Attribute + Skill Selection */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className={`block text-muted-foreground ${s.text} mb-1`}>Attribute</label>
          <select
            value={selectedAttribute}
            onChange={(e) => setSelectedAttribute(e.target.value)}
            className={`
              w-full bg-muted border border-border rounded
              text-foreground ${s.input} ${s.text}
              focus:outline-none focus:border-primary
            `}
          >
            <option value="">Select...</option>
            {attributeList.map((attr) => (
              <option key={attr} value={attr}>
                {attr} ({attributes[attr]})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={`block text-muted-foreground ${s.text} mb-1`}>Skill</label>
          <select
            value={selectedSkill}
            onChange={(e) => {
              setSelectedSkill(e.target.value);
              setSelectedSpecialization("");
            }}
            className={`
              w-full bg-muted border border-border rounded
              text-foreground ${s.input} ${s.text}
              focus:outline-none focus:border-primary
            `}
          >
            <option value="">Select...</option>
            {skillList.map((skill) => (
              <option key={skill} value={skill}>
                {skill} ({skills[skill].rating})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Specialization */}
      {specializations.length > 0 && (
        <div className="mb-4">
          <label className={`block text-muted-foreground ${s.text} mb-1`}>
            Specialization (+2)
          </label>
          <select
            value={selectedSpecialization}
            onChange={(e) => setSelectedSpecialization(e.target.value)}
            className={`
              w-full bg-muted border border-border rounded
              text-foreground ${s.input} ${s.text}
              focus:outline-none focus:border-primary
            `}
          >
            <option value="">None</option>
            {specializations.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Limit Selection */}
      {limits && (
        <div className="mb-4">
          <label className={`block text-muted-foreground ${s.text} mb-1`}>Limit</label>
          <div className="flex gap-2">
            {(["physical", "mental", "social", "none"] as const).map((limitType) => (
              <Button
                key={limitType}
                onPress={() => setSelectedLimit(limitType)}
                className={`
                  flex-1 flex items-center justify-center gap-1
                  px-2 py-1.5 rounded ${s.text}
                  ${
                    selectedLimit === limitType
                      ? "bg-violet-500/20 text-violet-500 dark:text-violet-400 border border-violet-500/30"
                      : "bg-muted text-muted-foreground border border-border hover:bg-muted/80"
                  }
                  transition-colors
                `}
              >
                {limitType === "physical" && <Crosshair className="w-3 h-3" />}
                {limitType === "mental" && <Target className="w-3 h-3" />}
                {limitType === "social" && <Shield className="w-3 h-3" />}
                {limitType === "none"
                  ? "None"
                  : `${limitType.charAt(0).toUpperCase() + limitType.slice(1)} (${limits[limitType] || 0})`}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Modifiers (collapsible) */}
      {showAdvanced && (
        <div className="mb-4">
          <button
            onClick={() => setShowModifiers(!showModifiers)}
            className={`
              w-full flex items-center justify-between
              px-3 py-2 rounded bg-muted/50 border border-border
              text-muted-foreground hover:text-foreground transition-colors ${s.text}
            `}
          >
            <span>Modifiers</span>
            <div className="flex items-center gap-2">
              {(situationalMod !== 0 || equipmentMod !== 0 || customMod !== 0) && (
                <span className="text-violet-500 dark:text-violet-400">Modified</span>
              )}
              {showModifiers ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </div>
          </button>

          {showModifiers && (
            <div className="mt-2 space-y-2 p-3 rounded bg-muted/30 border border-border">
              {woundModifier !== 0 && (
                <div className="flex items-center justify-between text-rose-500 dark:text-rose-400">
                  <span className={s.text}>Wound Modifier</span>
                  <span className="font-mono">{woundModifier}</span>
                </div>
              )}
              <ModifierInput
                label="Situational"
                value={situationalMod}
                onChange={setSituationalMod}
                size={size}
              />
              <ModifierInput
                label="Equipment"
                value={equipmentMod}
                onChange={setEquipmentMod}
                size={size}
              />
              <ModifierInput label="Other" value={customMod} onChange={setCustomMod} size={size} />
            </div>
          )}
        </div>
      )}

      {/* Context (collapsible) */}
      {showAdvanced && (
        <div className="mb-4">
          <button
            onClick={() => setShowContext(!showContext)}
            className={`
              w-full flex items-center justify-between
              px-3 py-2 rounded bg-muted/50 border border-border
              text-muted-foreground hover:text-foreground transition-colors ${s.text}
            `}
          >
            <span>Context</span>
            {showContext ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showContext && (
            <div className="mt-2 space-y-3 p-3 rounded bg-muted/30 border border-border">
              <div>
                <label className={`block text-muted-foreground ${s.text} mb-1`}>Action Type</label>
                <input
                  type="text"
                  value={actionType}
                  onChange={(e) => setActionType(e.target.value)}
                  placeholder="e.g., Attack, Perception, Spellcasting"
                  className={`
                    w-full bg-muted border border-border rounded
                    text-foreground ${s.input} ${s.text}
                    focus:outline-none focus:border-primary
                  `}
                />
              </div>
              <div>
                <label className={`block text-muted-foreground ${s.text} mb-1`}>Target</label>
                <input
                  type="text"
                  value={targetName}
                  onChange={(e) => setTargetName(e.target.value)}
                  placeholder="Target name (optional)"
                  className={`
                    w-full bg-muted border border-border rounded
                    text-foreground ${s.input} ${s.text}
                    focus:outline-none focus:border-primary
                  `}
                />
              </div>
              <div>
                <label className={`block text-muted-foreground ${s.text} mb-1`}>Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What are you doing?"
                  rows={2}
                  className={`
                    w-full bg-muted border border-border rounded
                    text-foreground ${s.input} ${s.text}
                    focus:outline-none focus:border-primary resize-none
                  `}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Pool Summary */}
      <div className="mb-4 p-3 rounded bg-muted/50 border border-border">
        <div className="flex items-center justify-between mb-2">
          <span className={`text-muted-foreground ${s.text}`}>Total Dice Pool</span>
          <span className="font-mono font-bold text-2xl text-violet-500 dark:text-violet-400">
            {pool.totalDice}d6
          </span>
        </div>
        {pool.limit && (
          <div className="flex items-center justify-between">
            <span className={`text-muted-foreground ${s.text}`}>Limit</span>
            <span className="font-mono text-muted-foreground">{pool.limit} hits max</span>
          </div>
        )}
        {pool.modifiers.length > 0 && (
          <div className="mt-2 pt-2 border-t border-border space-y-1">
            {pool.modifiers.map((mod, index) => (
              <div key={index} className={`flex justify-between ${s.text}`}>
                <span className="text-muted-foreground">{mod.description}</span>
                <span
                  className={
                    mod.value > 0
                      ? "text-emerald-500 dark:text-emerald-400"
                      : mod.value < 0
                        ? "text-rose-500 dark:text-rose-400"
                        : "text-muted-foreground"
                  }
                >
                  {mod.value > 0 ? "+" : ""}
                  {mod.value}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edge Actions */}
      {canUseEdge && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-rose-500 dark:text-rose-400" />
            <span className={`text-muted-foreground ${s.text}`}>
              Edge Actions ({currentEdge}/{maxEdge})
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              onPress={() => handleEdgeAction("push_the_limit")}
              className={`
                flex items-center justify-center gap-1
                px-2 py-1.5 rounded ${s.text}
                ${
                  edgeAction === "push_the_limit"
                    ? "bg-rose-500/20 text-rose-500 dark:text-rose-400 border border-rose-500/30"
                    : "bg-muted text-muted-foreground border border-border hover:bg-muted/80"
                }
                transition-colors
              `}
            >
              <Zap className="w-3 h-3" />
              Push the Limit
            </Button>
            <Button
              onPress={() => handleEdgeAction("blitz")}
              className={`
                flex items-center justify-center gap-1
                px-2 py-1.5 rounded ${s.text}
                ${
                  edgeAction === "blitz"
                    ? "bg-rose-500/20 text-rose-500 dark:text-rose-400 border border-rose-500/30"
                    : "bg-muted text-muted-foreground border border-border hover:bg-muted/80"
                }
                transition-colors
              `}
            >
              <Zap className="w-3 h-3" />
              Blitz
            </Button>
          </div>
          {edgeAction && (
            <p className={`mt-2 text-muted-foreground ${s.text}`}>
              {edgeAction === "push_the_limit" && <>Add Edge to pool, no limit, exploding 6s</>}
              {edgeAction === "blitz" && <>Go first in combat (5 initiative dice)</>}
            </p>
          )}
        </div>
      )}

      {/* Warnings */}
      {pool.totalDice === 0 && (selectedAttribute || selectedSkill) && (
        <div className="mb-4 flex items-start gap-2 p-2 rounded bg-amber-500/10 border border-amber-500/20">
          <AlertCircle className="w-4 h-4 text-amber-500 dark:text-amber-400 mt-0.5 flex-shrink-0" />
          <p className={`text-amber-500 dark:text-amber-400 ${s.text}`}>
            Your dice pool is 0. Check your modifiers.
          </p>
        </div>
      )}

      {/* Roll Button */}
      <Button
        onPress={handleRoll}
        isDisabled={!canRoll}
        className={`
          w-full flex items-center justify-center gap-2
          px-4 py-3 rounded-lg font-medium
          ${
            canRoll
              ? "bg-violet-600 hover:bg-violet-500 text-white"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          }
          transition-colors
        `}
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <Dice1 className="w-5 h-5" />
            Roll {pool.totalDice}d6
            {useEdge && edgeAction && (
              <span className="ml-1 text-rose-300">+ {edgeAction.replace("_", " ")}</span>
            )}
          </>
        )}
      </Button>
    </div>
  );
}
