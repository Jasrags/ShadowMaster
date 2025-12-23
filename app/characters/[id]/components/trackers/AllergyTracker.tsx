"use client";

import React, { useState } from "react";
import { 
  AlertCircle, 
  Wind, 
  ShieldAlert, 
  Zap
} from "lucide-react";
import type { QualitySelection, AllergyState } from "@/lib/types";

interface AllergyTrackerProps {
  selection: QualitySelection;
  onUpdate: (updates: Partial<AllergyState>) => Promise<void>;
}

export function AllergyTracker({ selection, onUpdate }: AllergyTrackerProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const dynamicState = selection.dynamicState;
  if (!dynamicState || dynamicState.type !== "allergy") return null;

  const state = dynamicState.state as AllergyState;

  const handleToggleExposure = async () => {
    setIsUpdating(true);
    try {
      const now = new Date().toISOString();
      await onUpdate({ 
        currentlyExposed: !state.currentlyExposed,
        exposureStartTime: !state.currentlyExposed ? now : state.exposureStartTime
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAdjustDamage = async (amount: number) => {
    setIsUpdating(true);
    try {
      const newDamage = Math.max(0, state.damageAccumulated + amount);
      await onUpdate({ damageAccumulated: newDamage });
    } finally {
      setIsUpdating(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "extreme": return "text-red-600 dark:text-red-500";
      case "severe": return "text-red-500 dark:text-red-400";
      case "moderate": return "text-amber-500 dark:text-amber-400";
      case "mild": return "text-emerald-500 dark:text-emerald-400";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex items-start justify-between">
        <div className="flex gap-3">
          <div className={`p-2 rounded bg-muted/40 ${state.currentlyExposed ? 'text-amber-500 animate-pulse' : 'text-muted-foreground'}`}>
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground">
              {state.allergen} Allergy
            </h4>
            <p className={`text-xs mt-0.5 uppercase tracking-wider font-mono font-bold ${getSeverityColor(state.severity)}`}>
              {state.severity} • {state.prevalence}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Accumulated Dmg</div>
          <div className={`text-xl font-mono font-bold ${state.damageAccumulated > 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
            {state.damageAccumulated}
          </div>
        </div>
      </div>

      {/* Exposure Toggle */}
      <button
        onClick={handleToggleExposure}
        disabled={isUpdating}
        className={`w-full flex items-center justify-between p-4 rounded border transition-all ${
          state.currentlyExposed 
            ? 'bg-amber-500/10 border-amber-500 text-amber-500 shadow-inner' 
            : 'bg-muted/30 border-border text-muted-foreground hover:bg-muted/50'
        }`}
      >
        <div className="flex items-center gap-3">
          <ShieldAlert className={`w-5 h-5 ${state.currentlyExposed ? 'animate-bounce' : ''}`} />
          <div className="text-left">
            <div className="text-[10px] font-bold uppercase">Exposure Status</div>
            <div className="text-[9px] opacity-70 italic font-mono">
              {state.currentlyExposed ? `Active since ${new Date(state.exposureStartTime!).toLocaleTimeString()}` : 'Not currently exposed'}
            </div>
          </div>
        </div>
        <div className={`w-10 h-5 rounded-full p-1 transition-colors ${state.currentlyExposed ? 'bg-amber-500' : 'bg-muted-foreground/30'}`}>
          <div className={`w-3 h-3 bg-white rounded-full transition-transform ${state.currentlyExposed ? 'translate-x-5' : 'translate-x-0'}`} />
        </div>
      </button>

      {/* Damage Management */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
          <AlertCircle className="w-3 h-3" />
          Quick Damage Adjustment
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[-5, -1, 1, 5].map((val) => (
            <button
              key={val}
              disabled={isUpdating}
              onClick={() => handleAdjustDamage(val)}
              className="py-2 bg-muted hover:bg-muted-foreground/10 text-foreground border border-border rounded font-mono text-sm font-bold transition-colors"
            >
              {val > 0 ? `+${val}` : val}
            </button>
          ))}
        </div>
      </div>

      {/* Mechanics Note */}
      <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded flex gap-3 items-start">
        <Zap className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
        <p className="text-[10px] text-blue-600/80 dark:text-blue-400/80 italic leading-relaxed">
          {state.severity === 'mild' && "Exposure applies a -2 dice pool modifier for all actions."}
          {state.severity === 'moderate' && "Exposure applies a -4 dice pool modifier for all actions."}
          {state.severity === 'severe' && "Exposure applies a -4 dice pool modifier and deals 1 box of Physical damage per minute."}
          {state.severity === 'extreme' && "Exposure applies a -6 dice pool modifier and deals 1 box of Physical damage per 30 seconds."}
        </p>
      </div>
    </div>
  );
}
