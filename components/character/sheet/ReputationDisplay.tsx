"use client";

import { useState, useCallback } from "react";
import { Button as AriaButton } from "react-aria-components";
import { Shield, Plus, Undo2, ChevronDown, ChevronRight } from "lucide-react";
import { DisplayCard } from "./DisplayCard";
import { useJohnsonProfiles } from "@/lib/rules";
import { getActiveTriggerRecords } from "@/lib/rules/notoriety";
import type { Character } from "@/lib/types";
import type { NotorietyTriggerRecord } from "@/lib/types";
import type { NotorietyTriggerData } from "@/lib/rules/module-payloads";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ReputationDisplayProps {
  character: Character;
  onUpdate: (updatedCharacter: Character) => void;
}

// ---------------------------------------------------------------------------
// Score Pill
// ---------------------------------------------------------------------------

function ScorePill({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: "emerald" | "red" | "amber";
}) {
  const colors = {
    emerald:
      "bg-emerald-50 border-emerald-300 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-400",
    red: "bg-red-50 border-red-300 text-red-700 dark:bg-red-500/10 dark:border-red-500/30 dark:text-red-400",
    amber:
      "bg-amber-50 border-amber-300 text-amber-700 dark:bg-amber-500/10 dark:border-amber-500/30 dark:text-amber-400",
  };

  return (
    <div className={`flex flex-col items-center rounded-lg border px-4 py-2 ${colors[color]}`}>
      <span className="text-xs font-mono uppercase tracking-wide opacity-70">{label}</span>
      <span className="text-2xl font-mono font-bold">{value}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Trigger Item (available trigger from ruleset)
// ---------------------------------------------------------------------------

function TriggerItem({
  trigger,
  onApply,
  isBusy,
}: {
  trigger: NotorietyTriggerData;
  onApply: (trigger: NotorietyTriggerData) => void;
  isBusy: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-700/50 dark:bg-zinc-800/30">
      <div className="flex-1 min-w-0">
        <div className="text-sm text-zinc-800 dark:text-zinc-200">{trigger.name}</div>
        <div className="text-xs text-zinc-500 dark:text-zinc-500">{trigger.description}</div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xs font-mono text-red-600 dark:text-red-400">
          +{trigger.notorietyChange}
        </span>
        <AriaButton
          onPress={() => onApply(trigger)}
          isDisabled={isBusy}
          className="flex items-center gap-1 rounded border border-red-300 bg-red-50 px-2 py-1 text-xs text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
        >
          <Plus className="h-3 w-3" />
          Apply
        </AriaButton>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Log Entry (applied trigger record)
// ---------------------------------------------------------------------------

function LogEntry({
  record,
  onReverse,
  isBusy,
}: {
  record: NotorietyTriggerRecord;
  onReverse: (recordId: string) => void;
  isBusy: boolean;
}) {
  const isReversed = !!record.reversedAt;
  const date = new Date(record.appliedAt);
  const formattedDate = date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      className={`flex items-center justify-between gap-2 rounded-md border px-3 py-2 ${
        isReversed
          ? "border-zinc-200/50 bg-zinc-100/50 opacity-50 dark:border-zinc-700/30 dark:bg-zinc-800/10"
          : "border-zinc-200 bg-zinc-50 dark:border-zinc-700/50 dark:bg-zinc-800/30"
      }`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={`text-sm ${isReversed ? "line-through text-zinc-400 dark:text-zinc-500" : "text-zinc-800 dark:text-zinc-200"}`}
          >
            {record.triggerName}
          </span>
          <span
            className={`text-xs font-mono ${isReversed ? "text-zinc-400 dark:text-zinc-600" : "text-red-600 dark:text-red-400"}`}
          >
            +{record.notorietyChange}
          </span>
          {isReversed && (
            <span className="text-xs font-mono text-emerald-600 border border-emerald-300 bg-emerald-50 rounded px-1 dark:text-emerald-500 dark:border-emerald-500/30 dark:bg-emerald-500/10">
              reversed
            </span>
          )}
        </div>
        <div className="text-xs text-zinc-500 dark:text-zinc-500">
          {formattedDate}
          {record.sessionNote && <> &mdash; {record.sessionNote}</>}
        </div>
      </div>
      {!isReversed && (
        <AriaButton
          onPress={() => onReverse(record.id)}
          isDisabled={isBusy}
          className="flex items-center gap-1 rounded border border-zinc-300 bg-zinc-100 px-2 py-1 text-xs text-zinc-600 hover:bg-zinc-200 hover:text-zinc-700 transition-colors disabled:opacity-50 dark:border-zinc-600/30 dark:bg-zinc-700/20 dark:text-zinc-400 dark:hover:bg-zinc-700/40 dark:hover:text-zinc-300"
        >
          <Undo2 className="h-3 w-3" />
          Undo
        </AriaButton>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ReputationDisplay
// ---------------------------------------------------------------------------

export function ReputationDisplay({ character, onUpdate }: ReputationDisplayProps) {
  const johnsonProfiles = useJohnsonProfiles();
  const triggers = johnsonProfiles?.notorietyTriggers ?? [];

  const reputation = character.reputation ?? {
    streetCred: 0,
    notoriety: 0,
    publicAwareness: 0,
  };

  const log = reputation.notorietyLog ?? [];
  const activeRecords = getActiveTriggerRecords(log);

  const [isBusy, setIsBusy] = useState(false);
  const [showTriggers, setShowTriggers] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApply = useCallback(
    async (trigger: NotorietyTriggerData) => {
      setIsBusy(true);
      setError(null);
      try {
        const res = await fetch(`/api/characters/${character.id}/reputation/notoriety-triggers`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            triggerId: trigger.id,
            triggerName: trigger.name,
            notorietyChange: trigger.notorietyChange,
            source: trigger.source,
            page: trigger.page,
          }),
        });
        const data = await res.json();
        if (!data.success) {
          setError(data.error ?? "Failed to apply trigger");
          return;
        }

        if (onUpdate && data.record) {
          const updatedLog = [...log, data.record as NotorietyTriggerRecord];
          onUpdate({
            ...character,
            reputation: {
              ...reputation,
              notoriety: data.notoriety as number,
              notorietyLog: updatedLog,
            },
          });
        }
      } catch {
        setError("Failed to apply trigger");
      } finally {
        setIsBusy(false);
      }
    },
    [character, reputation, log, onUpdate]
  );

  const handleReverse = useCallback(
    async (recordId: string) => {
      setIsBusy(true);
      setError(null);
      try {
        const res = await fetch(`/api/characters/${character.id}/reputation/notoriety-triggers`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ recordId }),
        });
        const data = await res.json();
        if (!data.success) {
          setError(data.error ?? "Failed to reverse trigger");
          return;
        }

        if (onUpdate && data.record) {
          const reversedRecord = data.record as NotorietyTriggerRecord;
          const updatedLog = log.map((r) => (r.id === reversedRecord.id ? reversedRecord : r));
          onUpdate({
            ...character,
            reputation: {
              ...reputation,
              notoriety: data.notoriety as number,
              notorietyLog: updatedLog,
            },
          });
        }
      } catch {
        setError("Failed to reverse trigger");
      } finally {
        setIsBusy(false);
      }
    },
    [character, reputation, log, onUpdate]
  );

  return (
    <DisplayCard
      id="sheet-reputation"
      title="Reputation"
      icon={<Shield className="h-4 w-4 text-zinc-400" />}
      collapsible
    >
      <div className="space-y-4">
        {/* Score pills */}
        <div className="grid grid-cols-3 gap-3">
          <ScorePill label="Street Cred" value={reputation.streetCred} color="emerald" />
          <ScorePill label="Notoriety" value={reputation.notoriety} color="red" />
          <ScorePill label="Public Awareness" value={reputation.publicAwareness} color="amber" />
        </div>

        {/* Error banner */}
        {error && (
          <div className="rounded border border-red-300 bg-red-50 px-3 py-2 text-xs text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Notoriety triggers section */}
        {triggers.length > 0 && (
          <div>
            <AriaButton
              onPress={() => setShowTriggers(!showTriggers)}
              className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-700 transition-colors dark:text-zinc-400 dark:hover:text-zinc-300"
            >
              {showTriggers ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
              Notoriety Triggers ({triggers.length})
            </AriaButton>

            {showTriggers && (
              <div className="mt-2 space-y-1">
                {triggers.map((trigger) => (
                  <TriggerItem
                    key={trigger.id}
                    trigger={trigger}
                    onApply={handleApply}
                    isBusy={isBusy}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Applied triggers log */}
        {log.length > 0 && (
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wide text-zinc-500 mb-2">
              Trigger History ({activeRecords.length} active)
            </h4>
            <div className="space-y-1">
              {log.map((record) => (
                <LogEntry
                  key={record.id}
                  record={record}
                  onReverse={handleReverse}
                  isBusy={isBusy}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </DisplayCard>
  );
}
