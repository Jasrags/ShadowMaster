"use client";

import React, { useState } from "react";
import {
  Shield,
  Slash,
  History,
  Plus,
  AlertTriangle,
  Scroll,
  MinusCircle,
  Calendar,
} from "lucide-react";
import type { QualitySelection, CodeOfHonorState } from "@/lib/types";

interface CodeOfHonorTrackerProps {
  selection: QualitySelection;
  onUpdate: (updates: Partial<CodeOfHonorState>) => Promise<void>;
}

export function CodeOfHonorTracker({ selection, onUpdate }: CodeOfHonorTrackerProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showAddViolation, setShowAddViolation] = useState(false);
  const [newViolation, setNewViolation] = useState({ description: "", karmaLost: 1 });

  const dynamicState = selection.dynamicState;
  if (!dynamicState || dynamicState.type !== "code-of-honor") return null;

  const state = dynamicState.state as CodeOfHonorState;

  const handleAddViolation = async () => {
    if (!newViolation.description.trim()) return;

    setIsUpdating(true);
    try {
      const violation = {
        date: new Date().toISOString(),
        description: newViolation.description,
        karmaLost: newViolation.karmaLost,
      };

      const updatedViolations = [...state.violations, violation];
      const updatedTotalKarma = state.totalKarmaLost + violation.karmaLost;

      await onUpdate({
        violations: updatedViolations,
        totalKarmaLost: updatedTotalKarma,
      });

      setNewViolation({ description: "", karmaLost: 1 });
      setShowAddViolation(false);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex items-start justify-between">
        <div className="flex gap-3">
          <div className="p-2 rounded bg-muted/40 text-blue-500">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground">{state.codeName}</h4>
            <div className="flex flex-wrap gap-1 mt-1">
              {state.protectedGroups?.map((group, idx) => (
                <span
                  key={idx}
                  className="text-[8px] px-1.5 py-px bg-muted text-muted-foreground border border-border rounded font-mono uppercase tracking-widest"
                >
                  {group}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
            Karma Lost
          </div>
          <div
            className={`text-xl font-mono font-bold ${state.totalKarmaLost > 0 ? "text-red-500" : "text-muted-foreground"}`}
          >
            {state.totalKarmaLost}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="p-3 bg-muted/30 rounded border border-border/50 text-[10px] text-muted-foreground leading-relaxed italic">
        <Scroll className="w-3 h-3 mb-1 opacity-50" />
        {state.description || "No specific code details provided."}
      </div>

      {/* Violations List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
            <History className="w-3 h-3" />
            Code Violations
          </div>
          <button
            onClick={() => setShowAddViolation(!showAddViolation)}
            className="text-[10px] flex items-center gap-1 text-blue-500 hover:text-blue-400 font-bold transition-colors"
          >
            <Plus className="w-3 h-3" />
            Log Violation
          </button>
        </div>

        {showAddViolation && (
          <div className="p-4 rounded border border-amber-500/30 bg-amber-500/5 space-y-4 animate-in fade-in slide-in-from-top-2">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block">
                Violation Description
              </label>
              <textarea
                value={newViolation.description}
                onChange={(e) => setNewViolation({ ...newViolation, description: e.target.value })}
                className="w-full h-20 bg-background border border-border rounded p-2 text-xs focus:ring-1 focus:ring-amber-500 transition-all outline-none"
                placeholder="Describe the code violation..."
              />
            </div>
            <div className="flex items-end gap-3">
              <div className="flex-1 space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block">
                  Karma Penalty
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setNewViolation({
                        ...newViolation,
                        karmaLost: Math.max(1, newViolation.karmaLost - 1),
                      })
                    }
                    className="p-1 rounded bg-muted hover:bg-muted-foreground/10 border border-border"
                  >
                    <MinusCircle className="w-4 h-4" />
                  </button>
                  <span className="flex-1 text-center font-mono font-bold">
                    {newViolation.karmaLost}
                  </span>
                  <button
                    onClick={() =>
                      setNewViolation({ ...newViolation, karmaLost: newViolation.karmaLost + 1 })
                    }
                    className="p-1 rounded bg-muted hover:bg-muted-foreground/10 border border-border"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowAddViolation(false)}
                  className="px-3 py-2 text-[10px] font-bold uppercase text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddViolation}
                  disabled={isUpdating || !newViolation.description.trim()}
                  className="px-4 py-2 text-[10px] font-bold uppercase bg-amber-600 hover:bg-amber-500 text-white rounded shadow-sm transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1 thin-scrollbar">
          {state.violations.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 bg-muted/20 border border-dashed border-border rounded text-center">
              <Slash className="w-8 h-8 text-muted-foreground/30 mb-2" />
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                No Violations Found
              </p>
              <p className="text-[9px] text-muted-foreground italic">
                Your honor remains intact... for now.
              </p>
            </div>
          ) : (
            [...state.violations].reverse().map((violation, idx) => (
              <div
                key={idx}
                className="p-3 bg-muted/40 border border-border/50 rounded flex gap-3 items-start group"
              >
                <div className="p-1 rounded bg-red-500/10 text-red-500 shrink-0">
                  <AlertTriangle className="w-3 h-3" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-foreground line-clamp-1">
                      {violation.description}
                    </span>
                    <span className="text-[9px] font-mono text-red-500 font-bold bg-red-500/5 px-1.5 rounded-sm shrink-0">
                      -{violation.karmaLost} Karma
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[8px] text-muted-foreground uppercase tracking-widest font-bold">
                    <Calendar className="w-2.5 h-2.5" />
                    {new Date(violation.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
