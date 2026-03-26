"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Plus, Loader2, CheckCircle2, Info, Target } from "lucide-react";
import type { RunTrackerSession, Campaign } from "@/lib/types";
import type {
  RunPhaseData,
  NotorietyTriggerData,
  BetrayalTypeData,
  JohnsonProfilesModulePayload,
} from "@/lib/rules/module-payloads";
import { RunSessionCard } from "./CampaignRunSessionCard";

interface CampaignRunTrackerTabProps {
  campaign: Campaign;
}

export default function CampaignRunTrackerTab({ campaign }: CampaignRunTrackerTabProps) {
  const [sessions, setSessions] = useState<RunTrackerSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creatingSession, setCreatingSession] = useState(false);

  // Ruleset data
  const [phases, setPhases] = useState<RunPhaseData[]>([]);
  const [notorietyTriggers, setNotorietyTriggers] = useState<NotorietyTriggerData[]>([]);
  const [betrayalTypes, setBetrayalTypes] = useState<BetrayalTypeData[]>([]);

  // New session form
  const [showNewForm, setShowNewForm] = useState(false);
  const [newLabel, setNewLabel] = useState("");

  // Collapsible considerations
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set());

  const meetTriggers = useMemo(
    () => notorietyTriggers.filter((t) => t.phase === "the-meet"),
    [notorietyTriggers]
  );

  const fetchSessions = useCallback(async () => {
    try {
      const res = await fetch(`/api/campaigns/${campaign.id}/run-tracker`);
      const data = await res.json();
      if (data.success) {
        setSessions(data.runTrackerSessions || []);
      } else {
        setError(data.error || "Failed to load run tracker sessions");
      }
    } catch {
      setError("Failed to load run tracker sessions");
    } finally {
      setLoading(false);
    }
  }, [campaign.id]);

  const fetchRulesetData = useCallback(async () => {
    try {
      const res = await fetch(`/api/rulesets/${campaign.editionCode}`);
      const data = await res.json();
      if (data.success && data.extractedData) {
        const jp = data.extractedData.johnsonProfiles as JohnsonProfilesModulePayload | null;
        if (jp) {
          setPhases(jp.runPhases || []);
          setNotorietyTriggers(jp.notorietyTriggers || []);
          setBetrayalTypes(jp.betrayalTypes || []);
        }
      }
    } catch {
      // Non-critical — phases will be empty, user sees a message
    }
  }, [campaign.editionCode]);

  useEffect(() => {
    fetchSessions();
    fetchRulesetData();
  }, [fetchSessions, fetchRulesetData]);

  const handleCreateSession = async () => {
    if (!newLabel.trim() || phases.length === 0) return;
    setCreatingSession(true);
    try {
      const res = await fetch(`/api/campaigns/${campaign.id}/run-tracker`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: newLabel.trim(), initialPhaseId: phases[0].id }),
      });
      const data = await res.json();
      if (data.success) {
        setSessions((prev) => [...prev, data.session]);
        setNewLabel("");
        setShowNewForm(false);
      } else {
        setError(data.error || "Failed to create session");
      }
    } catch {
      setError("Failed to create session");
    } finally {
      setCreatingSession(false);
    }
  };

  const handleAdvancePhase = async (session: RunTrackerSession, nextPhaseId: string) => {
    const res = await fetch(`/api/campaigns/${campaign.id}/run-tracker`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: session.id, activePhaseId: nextPhaseId }),
    });
    const data = await res.json();
    if (data.success) {
      setSessions((prev) => prev.map((s) => (s.id === session.id ? data.session : s)));
    } else {
      setError(data.error || "Failed to advance phase");
    }
  };

  const handleCompleteRun = async (session: RunTrackerSession) => {
    const res = await fetch(`/api/campaigns/${campaign.id}/run-tracker`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: session.id, status: "completed" }),
    });
    const data = await res.json();
    if (data.success) {
      setSessions((prev) => prev.map((s) => (s.id === session.id ? data.session : s)));
    } else {
      setError(data.error || "Failed to complete run");
    }
  };

  const toggleConsiderations = (phaseId: string) => {
    setExpandedPhases((prev) => {
      const next = new Set(prev);
      if (next.has(phaseId)) {
        next.delete(phaseId);
      } else {
        next.add(phaseId);
      }
      return next;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (phases.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-300 py-12 text-center dark:border-zinc-700">
        <Info className="mx-auto h-12 w-12 text-zinc-400 opacity-50" />
        <h3 className="mt-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          Run phase data not available
        </h3>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Enable the Run Faster sourcebook in this campaign to use the run tracker.
        </p>
      </div>
    );
  }

  const activeSessions = sessions.filter((s) => s.status === "active");
  const completedSessions = sessions.filter((s) => s.status === "completed");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">Run Tracker</h3>
        <button
          onClick={() => setShowNewForm(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500"
        >
          <Plus className="h-4 w-4" />
          New Run
        </button>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
          {error}
          <button onClick={() => setError(null)} className="ml-2 underline hover:no-underline">
            Dismiss
          </button>
        </div>
      )}

      {/* New Run Form */}
      {showNewForm && (
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
          <h4 className="mb-3 text-sm font-medium text-zinc-900 dark:text-zinc-50">
            Start a New Run
          </h4>
          <div className="flex gap-3">
            <input
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              maxLength={200}
              placeholder="e.g. Run #3 — Wetwork for Aztechnology"
              className="flex-1 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-500"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateSession();
              }}
            />
            <button
              onClick={handleCreateSession}
              disabled={creatingSession || !newLabel.trim()}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
            >
              {creatingSession ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create"}
            </button>
            <button
              onClick={() => {
                setShowNewForm(false);
                setNewLabel("");
              }}
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Active Runs */}
      {activeSessions.length === 0 && completedSessions.length === 0 && !showNewForm && (
        <div className="rounded-lg border border-dashed border-zinc-300 py-12 text-center dark:border-zinc-700">
          <Target className="mx-auto h-12 w-12 text-zinc-400 opacity-50" />
          <h3 className="mt-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            No runs tracked yet
          </h3>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Start a new run to track your team through the run lifecycle.
          </p>
        </div>
      )}

      {activeSessions.map((session) => (
        <RunSessionCard
          key={session.id}
          session={session}
          phases={phases}
          meetTriggers={meetTriggers}
          betrayalTypes={betrayalTypes}
          expandedPhases={expandedPhases}
          onToggleConsiderations={toggleConsiderations}
          onAdvancePhase={handleAdvancePhase}
          onCompleteRun={handleCompleteRun}
        />
      ))}

      {/* Completed Runs */}
      {completedSessions.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            Completed Runs
          </h4>
          {completedSessions.map((session) => (
            <div
              key={session.id}
              className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {session.label}
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  {session.phaseTransitions.length} phase transition
                  {session.phaseTransitions.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
