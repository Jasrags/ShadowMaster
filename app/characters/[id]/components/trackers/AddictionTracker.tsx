"use client";

import React, { useState } from "react";
import { AlertCircle, Calendar, History, Activity, Plus, Dice5 } from "lucide-react";
import type { Character, QualitySelection, AddictionState } from "@/lib/types";
import { executeRoll } from "@/lib/rules/action-resolution/dice-engine";

const SEVERITY_THRESHOLD: Record<AddictionState["severity"], number> = {
  mild: 2,
  moderate: 3,
  severe: 4,
  burnout: 5,
};

interface CravingTestResult {
  hits: number;
  threshold: number;
  resisted: boolean;
}

interface AddictionTrackerProps {
  selection: QualitySelection;
  onUpdate: (updates: Partial<AddictionState>) => Promise<void>;
  character: Character;
}

export function AddictionTracker({ selection, onUpdate, character }: AddictionTrackerProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [rollResult, setRollResult] = useState<CravingTestResult | null>(null);

  const dynamicState = selection.dynamicState;
  if (!dynamicState || dynamicState.type !== "addiction") return null;

  const state = dynamicState.state as AddictionState;

  const handleToggleWithdrawal = async () => {
    setIsUpdating(true);
    try {
      await onUpdate({ withdrawalActive: !state.withdrawalActive });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleCraving = async () => {
    setIsUpdating(true);
    try {
      await onUpdate({ cravingActive: !state.cravingActive });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogDose = async () => {
    setIsUpdating(true);
    try {
      const now = new Date().toISOString();
      await onUpdate({
        lastDose: now,
        cravingActive: false,
        withdrawalActive: false,
        daysClean: 0,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCravingTest = async () => {
    setIsUpdating(true);
    setRollResult(null);
    try {
      const pool = (character.attributes.body || 1) + (character.attributes.willpower || 1);
      const threshold = SEVERITY_THRESHOLD[state.severity];
      const result = executeRoll(pool);
      const resisted = result.hits >= threshold;
      setRollResult({ hits: result.hits, threshold, resisted });
      if (!resisted) {
        await onUpdate({ cravingActive: true });
      } else {
        await onUpdate({ cravingActive: false });
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const formattedLastDose = new Date(state.lastDose).toLocaleString();
  const formattedNextCheck = new Date(state.nextCravingCheck).toLocaleString();

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex items-start justify-between">
        <div>
          <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-500" />
            {state.substance} Addiction
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5 uppercase tracking-wider font-mono">
            {state.severity} • {state.substanceType}
          </p>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
            Days Clean
          </div>
          <div className="text-xl font-mono font-bold text-emerald-500">{state.daysClean}</div>
        </div>
      </div>

      {/* Status Grid */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleToggleCraving}
          disabled={isUpdating}
          className={`flex flex-col items-center justify-center p-3 rounded border transition-all ${
            state.cravingActive
              ? "bg-amber-500/10 border-amber-500 text-amber-500"
              : "bg-muted/30 border-border text-muted-foreground hover:bg-muted/50"
          }`}
        >
          <Activity className={`w-5 h-5 mb-1 ${state.cravingActive ? "animate-pulse" : ""}`} />
          <span className="text-[10px] font-bold uppercase">Craving</span>
          <span className="text-[8px] opacity-70 italic">
            {state.cravingActive ? "Active" : "Inactive"}
          </span>
        </button>

        <button
          onClick={handleToggleWithdrawal}
          disabled={isUpdating}
          className={`flex flex-col items-center justify-center p-3 rounded border transition-all ${
            state.withdrawalActive
              ? "bg-red-500/10 border-red-500 text-red-500"
              : "bg-muted/30 border-border text-muted-foreground hover:bg-muted/50"
          }`}
        >
          <AlertCircle className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-bold uppercase">Withdrawal</span>
          <span className="text-[8px] opacity-70 italic">
            {state.withdrawalActive ? `Active (-${state.withdrawalPenalty})` : "Inactive"}
          </span>
        </button>
      </div>

      {/* Timestamps */}
      <div className="space-y-2 py-3 border-y border-border/30">
        <div className="flex items-center justify-between text-[10px]">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <History className="w-3 h-3" />
            <span>Last Dose</span>
          </div>
          <span className="font-mono text-foreground">{formattedLastDose}</span>
        </div>
        <div className="flex items-center justify-between text-[10px]">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>Next Craving Check</span>
          </div>
          <span className="font-mono text-foreground">{formattedNextCheck}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleLogDose}
          disabled={isUpdating}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Log Dose
        </button>
        <button
          onClick={handleCravingTest}
          disabled={isUpdating}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-muted hover:bg-muted-foreground/10 text-foreground border border-border rounded text-xs font-bold transition-colors shadow-sm"
        >
          <Dice5 className="w-4 h-4" />
          Craving Test
        </button>
      </div>

      {/* Roll Result */}
      {rollResult && (
        <div
          className={`p-3 rounded border text-xs font-medium ${
            rollResult.resisted
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
              : "bg-red-500/10 border-red-500/30 text-red-500"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-bold">{rollResult.resisted ? "Resisted!" : "Failed!"}</span>
            <span className="font-mono">
              {rollResult.hits} hits vs {rollResult.threshold} threshold
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
