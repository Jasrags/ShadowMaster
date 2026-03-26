"use client";

import { useState } from "react";
import {
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Target,
  Handshake,
  Crosshair,
  Loader2,
} from "lucide-react";
import type { RunTrackerSession } from "@/lib/types";
import type {
  RunPhaseData,
  NotorietyTriggerData,
  BetrayalTypeData,
} from "@/lib/rules/module-payloads";

const PHASE_ICONS: Record<string, typeof Target> = {
  "the-meet": Handshake,
  "the-run": Crosshair,
  "the-handoff": Target,
};

const PHASE_COLORS: Record<string, { active: string; completed: string; pending: string }> = {
  "the-meet": {
    active: "border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
    completed:
      "border-green-500 bg-green-50 text-green-700 dark:border-green-600 dark:bg-green-600/20 dark:text-green-400",
    pending:
      "border-zinc-300 bg-zinc-100 text-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-500",
  },
  "the-run": {
    active: "border-red-500 bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
    completed:
      "border-green-500 bg-green-50 text-green-700 dark:border-green-600 dark:bg-green-600/20 dark:text-green-400",
    pending:
      "border-zinc-300 bg-zinc-100 text-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-500",
  },
  "the-handoff": {
    active:
      "border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400",
    completed:
      "border-green-500 bg-green-50 text-green-700 dark:border-green-600 dark:bg-green-600/20 dark:text-green-400",
    pending:
      "border-zinc-300 bg-zinc-100 text-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-500",
  },
};

const DEFAULT_PHASE_COLORS = {
  active: "border-zinc-400 bg-zinc-100 text-zinc-600 dark:bg-zinc-400/10 dark:text-zinc-300",
  completed:
    "border-green-500 bg-green-50 text-green-700 dark:border-green-600 dark:bg-green-600/20 dark:text-green-400",
  pending:
    "border-zinc-300 bg-zinc-100 text-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-500",
};

function getPhaseStatus(
  phaseId: string,
  activePhaseId: string,
  phases: RunPhaseData[]
): "completed" | "active" | "pending" {
  const phaseIndex = phases.findIndex((p) => p.id === phaseId);
  const activeIndex = phases.findIndex((p) => p.id === activePhaseId);
  if (activeIndex === -1) return "pending";
  if (phaseIndex < activeIndex) return "completed";
  if (phaseIndex === activeIndex) return "active";
  return "pending";
}

export interface RunSessionCardProps {
  session: RunTrackerSession;
  phases: RunPhaseData[];
  meetTriggers: NotorietyTriggerData[];
  betrayalTypes: BetrayalTypeData[];
  expandedPhases: Set<string>;
  onToggleConsiderations: (phaseId: string) => void;
  onAdvancePhase: (session: RunTrackerSession, nextPhaseId: string) => Promise<void>;
  onCompleteRun: (session: RunTrackerSession) => Promise<void>;
}

export function RunSessionCard({
  session,
  phases,
  meetTriggers,
  betrayalTypes,
  expandedPhases,
  onToggleConsiderations,
  onAdvancePhase,
  onCompleteRun,
}: RunSessionCardProps) {
  const [saving, setSaving] = useState(false);

  const activeIndex = phases.findIndex((p) => p.id === session.activePhaseId);

  if (activeIndex === -1) {
    return (
      <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-4">
        <p className="text-sm text-yellow-600 dark:text-yellow-400">
          Unknown active phase &quot;{session.activePhaseId}&quot; for run &quot;{session.label}
          &quot;. The run phase data may have changed.
        </p>
      </div>
    );
  }

  const isLastPhase = activeIndex === phases.length - 1;

  const handleAdvance = async (nextPhaseId: string) => {
    setSaving(true);
    try {
      await onAdvancePhase(session, nextPhaseId);
    } finally {
      setSaving(false);
    }
  };

  const handleComplete = async () => {
    setSaving(true);
    try {
      await onCompleteRun(session);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800">
      {/* Session header */}
      <div className="border-b border-zinc-200 px-4 py-3 dark:border-zinc-700">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{session.label}</h4>
          <div className="flex items-center gap-2">
            {saving && <Loader2 className="h-3 w-3 animate-spin text-zinc-400" />}
            {!isLastPhase && (
              <button
                onClick={() => handleAdvance(phases[activeIndex + 1].id)}
                disabled={saving}
                className="inline-flex items-center gap-1 rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
              >
                Next Phase
                <ChevronRight className="h-3 w-3" />
              </button>
            )}
            {isLastPhase && (
              <button
                onClick={handleComplete}
                disabled={saving}
                className="inline-flex items-center gap-1 rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-500 disabled:opacity-50"
              >
                <CheckCircle2 className="h-3 w-3" />
                Complete Run
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Phase stepper */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          {phases.map((phase, i) => {
            const status = getPhaseStatus(phase.id, session.activePhaseId, phases);
            const colors = PHASE_COLORS[phase.id] ?? DEFAULT_PHASE_COLORS;
            const Icon = PHASE_ICONS[phase.id] ?? Target;

            return (
              <div key={phase.id} className="flex items-center gap-2 flex-1">
                <button
                  onClick={() => handleAdvance(phase.id)}
                  disabled={saving || status === "active"}
                  className={`flex items-center gap-2 rounded-lg border-2 px-3 py-2 text-xs font-medium transition-colors w-full ${colors[status]} ${
                    status !== "active" ? "cursor-pointer hover:opacity-80" : "cursor-default"
                  }`}
                >
                  {status === "completed" ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                  ) : (
                    <Icon className="h-4 w-4 shrink-0" />
                  )}
                  <span className="truncate">{phase.name}</span>
                </button>
                {i < phases.length - 1 && (
                  <ChevronRight className="h-4 w-4 shrink-0 text-zinc-400" />
                )}
              </div>
            );
          })}
        </div>

        {/* Active phase details */}
        {phases.map((phase) => {
          if (phase.id !== session.activePhaseId) return null;

          return (
            <div key={phase.id} className="space-y-3">
              {/* Description */}
              <p className="text-sm text-zinc-600 dark:text-zinc-300">{phase.description}</p>

              {/* Key Considerations */}
              {phase.keyConsiderations && phase.keyConsiderations.length > 0 && (
                <div>
                  <button
                    onClick={() => onToggleConsiderations(phase.id)}
                    className="flex items-center gap-1 text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                  >
                    <ChevronRight
                      className={`h-3 w-3 transition-transform ${
                        expandedPhases.has(phase.id) ? "rotate-90" : ""
                      }`}
                    />
                    Key Considerations ({phase.keyConsiderations.length})
                  </button>
                  {expandedPhases.has(phase.id) && (
                    <ul className="mt-2 space-y-1 pl-4">
                      {phase.keyConsiderations.map((consideration) => (
                        <li
                          key={consideration}
                          className="flex items-start gap-2 text-xs text-zinc-600 dark:text-zinc-400"
                        >
                          <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-zinc-400" />
                          {consideration}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* Meet Phase: Notoriety Triggers */}
              {phase.id === "the-meet" && meetTriggers.length > 0 && (
                <div className="rounded-md border border-amber-500/30 bg-amber-500/5 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                      Notoriety Triggers
                    </span>
                  </div>
                  <ul className="space-y-1.5">
                    {meetTriggers.map((trigger) => (
                      <li key={trigger.id} className="flex items-start gap-2 text-xs">
                        <span className="mt-0.5 inline-flex items-center rounded bg-red-500/20 px-1.5 py-0.5 text-[10px] font-bold text-red-400">
                          +{trigger.notorietyChange}
                        </span>
                        <div>
                          <span className="font-medium text-zinc-700 dark:text-zinc-200">
                            {trigger.name}
                          </span>
                          <span className="text-zinc-500 dark:text-zinc-400">
                            {" — "}
                            {trigger.description}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Handoff Phase: Betrayal Warnings */}
              {phase.id === "the-handoff" && betrayalTypes.length > 0 && (
                <div className="rounded-md border border-red-500/30 bg-red-500/5 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider">
                      Betrayal Warning Signals
                    </span>
                  </div>
                  <div className="space-y-2">
                    {betrayalTypes.map((bt) => (
                      <div key={bt.id}>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-zinc-700 dark:text-zinc-200">
                            {bt.name}
                          </span>
                          <span
                            className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                              bt.severity === "lethal"
                                ? "bg-red-500/20 text-red-400"
                                : bt.severity === "severe"
                                  ? "bg-orange-500/20 text-orange-400"
                                  : "bg-yellow-500/20 text-yellow-400"
                            }`}
                          >
                            {bt.severity}
                          </span>
                        </div>
                        {bt.warningSignals && bt.warningSignals.length > 0 && (
                          <ul className="mt-1 space-y-0.5 pl-3">
                            {bt.warningSignals.map((signal) => (
                              <li
                                key={signal}
                                className="flex items-start gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400"
                              >
                                <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-red-400/60" />
                                {signal}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
