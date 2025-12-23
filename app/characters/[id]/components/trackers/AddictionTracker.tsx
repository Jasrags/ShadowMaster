"use client";

import React, { useState } from "react";
import { 
  AlertCircle, 
  Calendar, 
  History, 
  Activity, 
  Plus 
} from "lucide-react";
import type { QualitySelection, AddictionState } from "@/lib/types";

interface AddictionTrackerProps {
  selection: QualitySelection;
  onUpdate: (updates: Partial<AddictionState>) => Promise<void>;
}

export function AddictionTracker({ selection, onUpdate }: AddictionTrackerProps) {
  const [isUpdating, setIsUpdating] = useState(false);

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
        daysClean: 0
      });
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
          <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Days Clean</div>
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
              ? 'bg-amber-500/10 border-amber-500 text-amber-500' 
              : 'bg-muted/30 border-border text-muted-foreground hover:bg-muted/50'
          }`}
        >
          <Activity className={`w-5 h-5 mb-1 ${state.cravingActive ? 'animate-pulse' : ''}`} />
          <span className="text-[10px] font-bold uppercase">Craving</span>
          <span className="text-[8px] opacity-70 italic">{state.cravingActive ? 'Active' : 'Inactive'}</span>
        </button>

        <button
          onClick={handleToggleWithdrawal}
          disabled={isUpdating}
          className={`flex flex-col items-center justify-center p-3 rounded border transition-all ${
            state.withdrawalActive 
              ? 'bg-red-500/10 border-red-500 text-red-500' 
              : 'bg-muted/30 border-border text-muted-foreground hover:bg-muted/50'
          }`}
        >
          <AlertCircle className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-bold uppercase">Withdrawal</span>
          <span className="text-[8px] opacity-70 italic">
            {state.withdrawalActive ? `Active (-${state.withdrawalPenalty})` : 'Inactive'}
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
          disabled={isUpdating}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-muted hover:bg-muted-foreground/10 text-foreground border border-border rounded text-xs font-bold transition-colors shadow-sm"
        >
          <Activity className="w-4 h-4" />
          Craving Test
        </button>
      </div>
    </div>
  );
}
