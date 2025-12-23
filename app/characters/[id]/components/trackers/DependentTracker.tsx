"use client";

import React, { useState } from "react";
import { 
  Heart, 
  ShieldCheck, 
  ShieldAlert, 
  HelpCircle,
  Clock,
  Coins,
  UserCheck
} from "lucide-react";
import type { QualitySelection, DependentState } from "@/lib/types";

interface DependentTrackerProps {
  selection: QualitySelection;
  onUpdate: (updates: Partial<DependentState>) => Promise<void>;
}

export function DependentTracker({ selection, onUpdate }: DependentTrackerProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const dynamicState = selection.dynamicState;
  if (!dynamicState || dynamicState.type !== "dependent") return null;

  const state = dynamicState.state as DependentState;

  const handleUpdateStatus = async (status: DependentState["currentStatus"]) => {
    setIsUpdating(true);
    try {
      await onUpdate({ 
        currentStatus: status,
        lastCheckedIn: status === "safe" ? new Date().toISOString() : state.lastCheckedIn
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "safe": return { icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" };
      case "needs-attention": return { icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" };
      case "in-danger": return { icon: ShieldAlert, color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" };
      case "missing": return { icon: HelpCircle, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20" };
      default: return { icon: HelpCircle, color: "text-muted-foreground", bg: "bg-muted/10", border: "border-border" };
    }
  };

  const currentStatusConfig = getStatusConfig(state.currentStatus);
  const StatusIcon = currentStatusConfig.icon;

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex items-start justify-between">
        <div className="flex gap-3">
          <div className={`relative p-2 rounded ${currentStatusConfig.bg} ${currentStatusConfig.color}`}>
            <Heart className="w-5 h-5 fill-current opacity-20" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
               <Heart className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground">
              {state.name}
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5 uppercase tracking-wider font-mono">
              {state.relationship} • Tier {state.tier}
            </p>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest ${currentStatusConfig.bg} ${currentStatusConfig.color} ${currentStatusConfig.border}`}>
          <StatusIcon className="w-3 h-3" />
          {state.currentStatus.replace(/-/g, ' ')}
        </div>
      </div>

      {/* Resource Impact */}
      <div className="grid grid-cols-2 gap-3 p-3 bg-muted/30 rounded border border-border/50">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground uppercase tracking-widest font-bold">
            <Coins className="w-3 h-3 text-amber-500" />
            Lifestyle Cost
          </div>
          <div className="text-sm font-mono font-bold text-foreground">
            +{state.lifestyleCostModifier}%
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground uppercase tracking-widest font-bold">
            <Clock className="w-3 h-3 text-blue-500" />
            Time Commitment
          </div>
          <div className="text-sm font-mono font-bold text-foreground">
            {state.timeCommitmentHours} hrs/week
          </div>
        </div>
      </div>

      {/* Status Selection */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
          <UserCheck className="w-3 h-3" />
          Update Dependent Status
        </div>
        <div className="grid grid-cols-2 gap-2">
          {(["safe", "needs-attention", "in-danger", "missing"] as const).map((status) => {
            const config = getStatusConfig(status);
            const Icon = config.icon;
            const isActive = state.currentStatus === status;

            return (
              <button
                key={status}
                disabled={isUpdating}
                onClick={() => handleUpdateStatus(status)}
                className={`flex items-center gap-2 p-2.5 rounded border transition-all text-xs font-bold ${
                  isActive 
                    ? `${config.bg} ${config.color} ${config.border} shadow-sm` 
                    : 'bg-muted/30 border-border text-muted-foreground hover:bg-muted/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {status.charAt(0).toUpperCase() + status.slice(1).replace(/-/g, ' ')}
              </button>
            );
          })}
        </div>
      </div>

      {/* Last Check-in */}
      <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-3 border-t border-border/30">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3 h-3" />
          <span>Last Checked-in</span>
        </div>
        <span className="font-mono text-foreground italic">
          {new Date(state.lastCheckedIn).toLocaleString()}
        </span>
      </div>
    </div>
  );
}
