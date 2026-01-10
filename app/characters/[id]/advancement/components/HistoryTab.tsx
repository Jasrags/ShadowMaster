import { useMemo, useState } from "react";
import type { Character, AdvancementRecord } from "@/lib/types";
import { CheckCircle, Clock, Check, X, AlertCircle } from "lucide-react";
import { Button } from "react-aria-components";

interface HistoryTabProps {
  character: Character;
  isGM?: boolean;
  onCharacterUpdate?: (updatedCharacter: Character) => void;
}

export function HistoryTab({ character, isGM, onCharacterUpdate }: HistoryTabProps) {
  const [filter, setFilter] = useState<"all" | "completed" | "pending" | "rejected">("all");
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null);

  // Get all advancement records
  const allRecords = useMemo(
    () => character.advancementHistory || [],
    [character.advancementHistory]
  );
  const completedRecords = useMemo(
    () => allRecords.filter((r) => r.trainingStatus === "completed" && r.gmApproved),
    [allRecords]
  );
  const rejectedRecords = useMemo(() => allRecords.filter((r) => r.rejectionReason), [allRecords]);

  // Filter records
  const filteredRecords = useMemo(() => {
    if (filter === "all") return allRecords;
    if (filter === "completed") return completedRecords;
    if (filter === "rejected") return rejectedRecords;
    return allRecords.filter((r) => !r.gmApproved && !r.rejectionReason);
  }, [allRecords, completedRecords, rejectedRecords, filter]);

  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };

  // Handle GM Action
  const handleGMAction = async (recordId: string, action: "approve" | "reject") => {
    setIsSubmitting(recordId);
    try {
      let rejectionReason = "";
      if (action === "reject") {
        rejectionReason = window.prompt("Reason for rejection:") || "Rejected by GM";
      }

      const response = await fetch(
        `/api/characters/${character.id}/advancement/${recordId}/${action}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: action === "reject" ? JSON.stringify({ reason: rejectionReason }) : undefined,
        }
      );

      const result = await response.json();
      if (!result.success) throw new Error(result.error || `Failed to ${action} advancement`);

      if (onCharacterUpdate) onCharacterUpdate(result.character);
    } catch (err) {
      alert(err instanceof Error ? err.message : `Failed to ${action} advancement`);
    } finally {
      setIsSubmitting(null);
    }
  };

  // Get status icon
  const getStatusIcon = (record: AdvancementRecord) => {
    if (record.rejectionReason) return <AlertCircle className="h-4 w-4 text-red-400" />;
    if (record.gmApproved && record.trainingStatus === "completed") {
      return <CheckCircle className="h-4 w-4 text-emerald-400" />;
    }
    return <Clock className="h-4 w-4 text-blue-400" />;
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
          onClick={() => setFilter("pending")}
          className={`px-4 py-2 font-medium transition-colors ${
            filter === "pending"
              ? "text-zinc-100 border-b-2 border-emerald-500"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          Pending ({allRecords.filter((r) => !r.gmApproved && !r.rejectionReason).length})
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`px-4 py-2 font-medium transition-colors ${
            filter === "completed"
              ? "text-zinc-100 border-b-2 border-emerald-500"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          Approved ({completedRecords.length})
        </button>
        <button
          onClick={() => setFilter("rejected")}
          className={`px-4 py-2 font-medium transition-colors ${
            filter === "rejected"
              ? "text-zinc-100 border-b-2 border-emerald-500"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          Rejected ({rejectedRecords.length})
        </button>
      </div>

      {/* Records List */}
      {filteredRecords.length === 0 ? (
        <div className="p-8 text-center rounded-lg border border-zinc-700 bg-zinc-800/50">
          <p className="text-zinc-400">No advancement records</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRecords.map((record) => (
            <div
              key={record.id}
              className={`p-4 rounded-lg border ${
                record.rejectionReason
                  ? "border-red-900/50 bg-red-900/10"
                  : record.gmApproved
                    ? "border-zinc-700 bg-zinc-800/50"
                    : "border-blue-900/30 bg-blue-900/10"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(record)}
                    <span className="font-semibold text-zinc-100">{record.targetName}</span>
                    <span className="text-sm text-zinc-400 capitalize">({record.type})</span>
                    {!record.gmApproved && !record.rejectionReason && (
                      <span className="text-xs px-2 py-0.5 rounded bg-blue-900/50 text-blue-300">
                        Awaiting Approval
                      </span>
                    )}
                    {record.gmApproved && (
                      <span className="text-xs px-2 py-0.5 rounded bg-emerald-900/50 text-emerald-300">
                        Approved
                      </span>
                    )}
                    {record.rejectionReason && (
                      <span className="text-xs px-2 py-0.5 rounded bg-red-900/50 text-red-300">
                        Rejected
                      </span>
                    )}
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
                    <div className="text-xs">Date: {formatDate(record.karmaSpentAt)}</div>
                    {record.rejectionReason && (
                      <div className="mt-2 p-2 rounded bg-red-900/20 border border-red-900/30 text-red-400 text-xs italic">
                        Reason: {record.rejectionReason}
                      </div>
                    )}
                    {record.notes && (
                      <div className="text-zinc-500 italic mt-2">{record.notes}</div>
                    )}
                  </div>
                </div>

                {isGM && !record.gmApproved && !record.rejectionReason && (
                  <div className="flex gap-2">
                    <Button
                      onPress={() => handleGMAction(record.id, "reject")}
                      isDisabled={isSubmitting !== null}
                      className="p-2 rounded bg-red-900/30 hover:bg-red-800/50 text-red-400 transition-colors"
                      aria-label="Reject"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Button
                      onPress={() => handleGMAction(record.id, "approve")}
                      isDisabled={isSubmitting !== null}
                      className="p-2 rounded bg-emerald-900/30 hover:bg-emerald-800/50 text-emerald-400 transition-colors"
                      aria-label="Approve"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
