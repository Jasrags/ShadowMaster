"use client";

import { useMemo, useState } from "react";
import type { Character, AdvancementRecord } from "@/lib/types";
import { CheckCircle, XCircle, Clock } from "lucide-react";

interface HistoryTabProps {
  character: Character;
}

export function HistoryTab({ character }: HistoryTabProps) {
  const [filter, setFilter] = useState<"all" | "completed" | "pending">("all");

  // Get all advancement records
  const allRecords = useMemo(() => character.advancementHistory || [], [character.advancementHistory]);
  const completedRecords = useMemo(() => allRecords.filter((r) => r.trainingStatus === "completed"), [allRecords]);

  // Filter records
  const filteredRecords = useMemo(() => {
    if (filter === "all") return allRecords;
    if (filter === "completed") {
      return completedRecords;
    }
    return allRecords.filter(
      (r) => r.trainingStatus === "pending" || r.trainingStatus === "in-progress"
    );
  }, [allRecords, completedRecords, filter]);

  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };

  // Get status icon
  const getStatusIcon = (record: AdvancementRecord) => {
    switch (record.trainingStatus) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-emerald-400" />;
      case "interrupted":
        return <XCircle className="h-4 w-4 text-amber-400" />;
      default:
        return <Clock className="h-4 w-4 text-blue-400" />;
    }
  };

  // Get status label
  const getStatusLabel = (record: AdvancementRecord): string => {
    switch (record.trainingStatus) {
      case "completed":
        return "Completed";
      case "interrupted":
        return "Interrupted";
      case "in-progress":
        return "In Progress";
      default:
        return "Pending";
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-2 border-b border-zinc-700">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 font-medium transition-colors ${
            filter === "all"
              ? "text-zinc-100 border-b-2 border-emerald-500"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          All ({allRecords.length})
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`px-4 py-2 font-medium transition-colors ${
            filter === "completed"
              ? "text-zinc-100 border-b-2 border-emerald-500"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          Completed ({completedRecords.length})
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={`px-4 py-2 font-medium transition-colors ${
            filter === "pending"
              ? "text-zinc-100 border-b-2 border-emerald-500"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          Pending ({allRecords.filter((r) => r.trainingStatus !== "completed").length})
        </button>
      </div>

      {/* Records List */}
      {filteredRecords.length === 0 ? (
        <div className="p-8 text-center rounded-lg border border-zinc-700 bg-zinc-800/50">
          <p className="text-zinc-400">No advancement records</p>
          <p className="text-sm text-zinc-500 mt-2">
            Advancement history will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRecords.map((record) => (
            <div
              key={record.id}
              className="p-4 rounded-lg border border-zinc-700 bg-zinc-800/50"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(record)}
                    <span className="font-semibold text-zinc-100">{record.targetName}</span>
                    <span className="text-sm text-zinc-400 capitalize">({record.type})</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      record.trainingStatus === "completed"
                        ? "bg-emerald-900/50 text-emerald-300"
                        : record.trainingStatus === "interrupted"
                        ? "bg-amber-900/50 text-amber-300"
                        : "bg-blue-900/50 text-blue-300"
                    }`}>
                      {getStatusLabel(record)}
                    </span>
                  </div>
                  <div className="text-sm text-zinc-400 space-y-1">
                    <div>
                      {record.previousValue !== undefined ? (
                        <span>
                          Rating: {record.previousValue} → {record.newValue}
                        </span>
                      ) : (
                        <span>Rating: {record.newValue}</span>
                      )}
                    </div>
                    <div>
                      Karma Cost: <span className="text-amber-400">{record.karmaCost}</span>
                    </div>
                    <div>
                      Date: {formatDate(record.karmaSpentAt)}
                      {record.completedAt && ` • Completed: ${formatDate(record.completedAt)}`}
                    </div>
                    {record.gmApproved && (
                      <div className="text-emerald-400">
                        ✓ Approved by GM
                      </div>
                    )}
                    {record.notes && (
                      <div className="text-zinc-500 italic mt-2">{record.notes}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

