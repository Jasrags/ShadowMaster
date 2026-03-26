"use client";

import { useState, useCallback } from "react";
import {
  AlertTriangle,
  Eye,
  EyeOff,
  Shield,
  ShieldAlert,
  Skull,
  X,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { SocialContact } from "@/lib/types";
import type { BetrayalTypeData, JohnsonFactionData } from "@/lib/rules/module-payloads";

// =============================================================================
// TYPES
// =============================================================================

interface BetrayalAssessmentPanelProps {
  contact: SocialContact;
  campaignId: string;
  betrayalTypes: BetrayalTypeData[];
  factions: JohnsonFactionData[];
  onContactUpdated: (contact: SocialContact) => void;
}

// =============================================================================
// SEVERITY DISPLAY
// =============================================================================

const SEVERITY_CONFIG = {
  moderate: {
    label: "Moderate",
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/30",
    icon: Shield,
  },
  severe: {
    label: "Severe",
    color: "text-orange-400",
    bg: "bg-orange-500/10 border-orange-500/30",
    icon: ShieldAlert,
  },
  lethal: {
    label: "Lethal",
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/30",
    icon: Skull,
  },
} as const;

const RISK_COLORS: Record<string, string> = {
  "very-low": "text-green-400 bg-green-500/10",
  low: "text-green-300 bg-green-500/10",
  moderate: "text-amber-400 bg-amber-500/10",
  high: "text-orange-400 bg-orange-500/10",
  "very-high": "text-red-400 bg-red-500/10",
  uncertain: "text-zinc-400 bg-zinc-500/10",
};

// =============================================================================
// COMPONENT
// =============================================================================

export function BetrayalAssessmentPanel({
  contact,
  campaignId,
  betrayalTypes,
  factions,
  onContactUpdated,
}: BetrayalAssessmentPanelProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(!!contact.betrayalPlanning);
  const [selectedTypeId, setSelectedTypeId] = useState<string>(
    contact.betrayalPlanning?.betrayalTypeId ?? ""
  );

  const faction = contact.factionId ? factions.find((f) => f.id === contact.factionId) : null;

  const activePlanning = contact.betrayalPlanning;
  const activeType = activePlanning
    ? betrayalTypes.find((t) => t.id === activePlanning.betrayalTypeId)
    : null;

  const handleSetBetrayal = useCallback(async () => {
    if (!selectedTypeId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/campaigns/${campaignId}/contacts/${contact.id}/betrayal`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "set", betrayalTypeId: selectedTypeId }),
      });
      const data = await res.json();
      if (data.success) {
        onContactUpdated(data.contact);
      } else {
        setError(data.error || "Failed to set betrayal planning");
      }
    } catch {
      setError("Failed to set betrayal planning");
    } finally {
      setLoading(false);
    }
  }, [campaignId, contact.id, selectedTypeId, onContactUpdated]);

  const handleClearBetrayal = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/campaigns/${campaignId}/contacts/${contact.id}/betrayal`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "clear" }),
      });
      const data = await res.json();
      if (data.success) {
        onContactUpdated(data.contact);
        setSelectedTypeId("");
      } else {
        setError(data.error || "Failed to clear betrayal planning");
      }
    } catch {
      setError("Failed to clear betrayal planning");
    } finally {
      setLoading(false);
    }
  }, [campaignId, contact.id, onContactUpdated]);

  const handleToggleSignal = useCallback(
    async (signal: string, revealed: boolean) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/campaigns/${campaignId}/contacts/${contact.id}/betrayal`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: revealed ? "hide-signal" : "reveal-signal",
            signal,
          }),
        });
        const data = await res.json();
        if (data.success) {
          onContactUpdated(data.contact);
        } else {
          setError(data.error || "Failed to update signal");
        }
      } catch {
        setError("Failed to update signal");
      } finally {
        setLoading(false);
      }
    },
    [campaignId, contact.id, onContactUpdated]
  );

  return (
    <div className="rounded-lg border border-zinc-700 bg-zinc-800/50">
      {/* Header */}
      <button
        onClick={() => setExpanded((prev) => !prev)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-2">
          <AlertTriangle
            className={`h-4 w-4 ${activePlanning ? "text-red-400" : "text-zinc-500"}`}
          />
          <span className="text-sm font-medium text-zinc-200">Betrayal Assessment</span>
          {activePlanning && (
            <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-bold uppercase text-red-400">
              Planning Active
            </span>
          )}
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-zinc-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-zinc-500" />
        )}
      </button>

      {!expanded && null}

      {expanded && (
        <div className="space-y-4 border-t border-zinc-700 px-4 py-4">
          {error && (
            <div className="rounded bg-red-900/30 p-2 text-xs text-red-400">
              {error}
              <button onClick={() => setError(null)} className="ml-2 underline hover:no-underline">
                Dismiss
              </button>
            </div>
          )}

          {/* Faction Risk Hint */}
          {faction && faction.betrayalRisk && (
            <div className="rounded border border-zinc-600 bg-zinc-900/50 p-3 text-xs">
              <div className="mb-1 flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase text-zinc-500">Faction Risk</span>
                <span
                  className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${RISK_COLORS[faction.betrayalRisk] ?? "text-zinc-400 bg-zinc-500/10"}`}
                >
                  {faction.betrayalRisk}
                </span>
              </div>
              {faction.betrayalNotes && <p className="text-zinc-400">{faction.betrayalNotes}</p>}
            </div>
          )}

          {/* Loyalty-Based Risk Hint */}
          <div className="rounded border border-zinc-600 bg-zinc-900/50 p-3 text-xs">
            <div className="mb-1 flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase text-zinc-500">
                Loyalty Assessment
              </span>
              <span
                className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                  contact.loyalty <= 2
                    ? "text-red-400 bg-red-500/10"
                    : contact.loyalty <= 4
                      ? "text-amber-400 bg-amber-500/10"
                      : "text-green-400 bg-green-500/10"
                }`}
              >
                Loyalty {contact.loyalty}
              </span>
            </div>
            <p className="text-zinc-400">
              {contact.loyalty <= 1
                ? "Minimal loyalty — contact would betray for almost any reason."
                : contact.loyalty <= 2
                  ? "Low loyalty — contact is unreliable and easily swayed."
                  : contact.loyalty <= 3
                    ? "Average loyalty — contact is professional but not personally invested."
                    : contact.loyalty <= 4
                      ? "Good loyalty — contact values the relationship and is generally reliable."
                      : "High loyalty — contact is a trusted ally unlikely to betray willingly."}
            </p>
          </div>

          {/* Betrayal Types Reference */}
          <div>
            <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
              Betrayal Types
            </h4>
            <div className="space-y-2">
              {betrayalTypes.map((bt) => {
                const config = SEVERITY_CONFIG[bt.severity] ?? SEVERITY_CONFIG.moderate;
                const Icon = config.icon;
                return (
                  <div key={bt.id} className={`rounded border p-3 text-xs ${config.bg}`}>
                    <div className="mb-1 flex items-center gap-2">
                      <Icon className={`h-3.5 w-3.5 ${config.color}`} />
                      <span className={`font-medium ${config.color}`}>{bt.name}</span>
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${config.color}`}
                      >
                        {config.label}
                      </span>
                    </div>
                    <p className="text-zinc-400">{bt.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Betrayal Planning */}
          {activePlanning && activeType ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-medium uppercase tracking-wider text-red-400">
                  Active Betrayal Plan
                </h4>
                <button
                  onClick={handleClearBetrayal}
                  disabled={loading}
                  className="inline-flex items-center gap-1 rounded border border-zinc-600 px-2 py-1 text-[10px] text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200 disabled:opacity-50"
                >
                  <X className="h-3 w-3" />
                  Clear
                </button>
              </div>

              <div className="rounded border border-red-500/30 bg-red-500/5 p-3 text-xs">
                <div className="mb-2 flex items-center gap-2">
                  <Skull className="h-4 w-4 text-red-400" />
                  <span className="font-medium text-red-300">{activeType.name}</span>
                </div>
                <p className="text-zinc-400">{activeType.description}</p>
              </div>

              {/* Warning Signals Checklist */}
              {activeType.warningSignals && activeType.warningSignals.length > 0 && (
                <div>
                  <h5 className="mb-2 text-xs font-medium text-zinc-400">
                    Warning Signals — click to reveal/hide for players
                  </h5>
                  <div className="space-y-1">
                    {activeType.warningSignals.map((signal) => {
                      const isRevealed = activePlanning.revealedSignals.includes(signal);
                      return (
                        <button
                          key={signal}
                          onClick={() => handleToggleSignal(signal, isRevealed)}
                          disabled={loading}
                          className={`flex w-full items-start gap-2 rounded border px-3 py-2 text-left text-xs transition-colors disabled:opacity-50 ${
                            isRevealed
                              ? "border-amber-500/30 bg-amber-500/10 text-amber-300"
                              : "border-zinc-700 bg-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-400"
                          }`}
                        >
                          {isRevealed ? (
                            <Eye className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" />
                          ) : (
                            <EyeOff className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                          )}
                          <span>{signal}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Set Betrayal Planning */
            <div className="space-y-3">
              <h4 className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                Mark as Planning Betrayal
              </h4>
              <div className="flex gap-2">
                <select
                  value={selectedTypeId}
                  onChange={(e) => setSelectedTypeId(e.target.value)}
                  className="flex-1 rounded border border-zinc-600 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                >
                  <option value="">Select betrayal type...</option>
                  {betrayalTypes.map((bt) => (
                    <option key={bt.id} value={bt.id}>
                      {bt.name} ({bt.severity})
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleSetBetrayal}
                  disabled={loading || !selectedTypeId}
                  className="rounded bg-red-600 px-3 py-2 text-xs font-medium text-white hover:bg-red-500 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Mark"}
                </button>
              </div>
              <p className="text-[10px] text-zinc-600">
                This is hidden from players. Only the GM can see betrayal planning state.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
