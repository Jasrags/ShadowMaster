"use client";

import { useState, useEffect } from "react";
import { ModalOverlay, Modal, Dialog } from "react-aria-components";
import { Loader2, Check, X, TrendingUp, Clock, User } from "lucide-react";
import type { Campaign, AdvancementRecord, ID } from "@/lib/types";

interface PendingAdvancement {
  advancement: AdvancementRecord;
  characterId: ID;
  characterName: string;
  characterOwnerId: ID;
}

interface CampaignAdvancementsTabProps {
  campaign: Campaign;
  onApprovalProcessed: () => void;
}

// Advancement type labels for display
const advancementTypeLabels: Record<string, string> = {
  attribute: "Attribute",
  skill: "Skill",
  "skill-specialization": "Specialization",
  edge: "Edge",
  quality: "Quality",
  spell: "Spell",
  "complex-form": "Complex Form",
  power: "Power",
  initiation: "Initiation",
  submersion: "Submersion",
};

// Format a date for display
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

// AdvancementCard Component
function AdvancementCard({
  pendingAdvancement,
  onApprove,
  onReject,
  isProcessing,
}: {
  pendingAdvancement: PendingAdvancement;
  onApprove: () => void;
  onReject: () => void;
  isProcessing: boolean;
}) {
  const { advancement, characterName } = pendingAdvancement;

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Character name */}
          <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 mb-1">
            <User className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{characterName}</span>
          </div>

          {/* Advancement title */}
          <h3 className="font-medium text-zinc-900 dark:text-zinc-50">
            {advancementTypeLabels[advancement.type] || advancement.type}: {advancement.targetName}
          </h3>

          {/* Change details */}
          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm">
            <span className="inline-flex items-center gap-1 text-zinc-600 dark:text-zinc-300">
              <TrendingUp className="h-4 w-4" />
              {advancement.previousValue !== undefined
                ? `${advancement.previousValue} → ${advancement.newValue}`
                : `New at ${advancement.newValue}`}
            </span>
            <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
              {advancement.karmaCost} Karma
            </span>
          </div>

          {/* Timestamp */}
          <div className="mt-2 flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
            <Clock className="h-3 w-3" />
            Requested {formatDate(advancement.createdAt)}
          </div>

          {/* Notes if present */}
          {advancement.notes && (
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 italic">
              &quot;{advancement.notes}&quot;
            </p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-2">
          <button
            onClick={onApprove}
            disabled={isProcessing}
            className="inline-flex items-center gap-1.5 rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            Approve
          </button>
          <button
            onClick={onReject}
            disabled={isProcessing}
            className="inline-flex items-center gap-1.5 rounded-md border border-red-300 bg-white px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-red-800 dark:bg-zinc-800 dark:text-red-400 dark:hover:bg-red-900/30 transition-colors"
          >
            <X className="h-4 w-4" />
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}

// RejectAdvancementDialog Component
function RejectAdvancementDialog({
  isOpen,
  onClose,
  onConfirm,
  characterName,
  advancementName,
  isSubmitting,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
  characterName: string;
  advancementName: string;
  isSubmitting: boolean;
}) {
  const [reason, setReason] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(reason.trim() || undefined);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setReason("");
      onClose();
    }
  };

  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={(open) => !open && handleClose()}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <Modal className="w-full max-w-md rounded-lg bg-white shadow-xl dark:bg-zinc-900">
        <Dialog className="outline-none">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Reject Advancement
            </h2>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="rounded-md p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit}>
            <div className="px-6 py-4">
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                You are rejecting{" "}
                <strong className="text-zinc-900 dark:text-zinc-50">{advancementName}</strong> for{" "}
                <strong className="text-zinc-900 dark:text-zinc-50">{characterName}</strong>. The
                karma will be refunded to the character.
              </p>
              <label className="block">
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Reason (optional)
                </span>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Provide feedback for the player..."
                  rows={3}
                  className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                  disabled={isSubmitting}
                />
              </label>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 border-t border-zinc-200 px-6 py-4 dark:border-zinc-800">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Reject Advancement
              </button>
            </div>
          </form>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}

// Main Component
export default function CampaignAdvancementsTab({
  campaign,
  onApprovalProcessed,
}: CampaignAdvancementsTabProps) {
  const [pendingAdvancements, setPendingAdvancements] = useState<PendingAdvancement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  // Reject dialog state
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectingAdvancement, setRejectingAdvancement] = useState<PendingAdvancement | null>(null);
  const [isSubmittingReject, setIsSubmittingReject] = useState(false);

  // Fetch pending advancements
  useEffect(() => {
    async function fetchPendingAdvancements() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/campaigns/${campaign.id}/advancements/pending`);
        const data = await res.json();
        if (data.success) {
          setPendingAdvancements(data.pendingAdvancements || []);
        } else {
          setError(data.error || "Failed to load pending advancements");
        }
      } catch {
        setError("An error occurred while loading pending advancements");
      } finally {
        setLoading(false);
      }
    }

    fetchPendingAdvancements();
  }, [campaign.id]);

  // Approve an advancement
  const handleApprove = async (pendingAdvancement: PendingAdvancement) => {
    const { advancement, characterId } = pendingAdvancement;
    const recordId = advancement.id;

    setProcessingIds((prev) => new Set(prev).add(recordId));

    try {
      const res = await fetch(`/api/characters/${characterId}/advancement/${recordId}/approve`, {
        method: "POST",
      });
      const data = await res.json();

      if (data.success) {
        // Remove from list (optimistic update)
        setPendingAdvancements((prev) => prev.filter((p) => p.advancement.id !== recordId));
        onApprovalProcessed();
      } else {
        setError(data.error || "Failed to approve advancement");
      }
    } catch {
      setError("An error occurred while approving the advancement");
    } finally {
      setProcessingIds((prev) => {
        const next = new Set(prev);
        next.delete(recordId);
        return next;
      });
    }
  };

  // Open reject dialog
  const handleOpenRejectDialog = (pendingAdvancement: PendingAdvancement) => {
    setRejectingAdvancement(pendingAdvancement);
    setRejectDialogOpen(true);
  };

  // Confirm rejection
  const handleConfirmReject = async (reason?: string) => {
    if (!rejectingAdvancement) return;

    const { advancement, characterId } = rejectingAdvancement;
    const recordId = advancement.id;

    setIsSubmittingReject(true);
    setProcessingIds((prev) => new Set(prev).add(recordId));

    try {
      const res = await fetch(`/api/characters/${characterId}/advancement/${recordId}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      const data = await res.json();

      if (data.success) {
        // Remove from list (optimistic update)
        setPendingAdvancements((prev) => prev.filter((p) => p.advancement.id !== recordId));
        onApprovalProcessed();
        setRejectDialogOpen(false);
        setRejectingAdvancement(null);
      } else {
        setError(data.error || "Failed to reject advancement");
      }
    } catch {
      setError("An error occurred while rejecting the advancement");
    } finally {
      setIsSubmittingReject(false);
      setProcessingIds((prev) => {
        const next = new Set(prev);
        next.delete(recordId);
        return next;
      });
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-6 text-center dark:bg-red-900/30">
        <p className="text-red-700 dark:text-red-400">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  // Empty state
  if (pendingAdvancements.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-300 p-12 text-center dark:border-zinc-700">
        <Check className="mx-auto h-12 w-12 text-green-500" />
        <h3 className="mt-4 text-lg font-medium text-zinc-900 dark:text-zinc-50">All caught up!</h3>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          No pending advancement requests to review.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">Pending Approvals</h2>
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          {pendingAdvancements.length} request{pendingAdvancements.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="space-y-3">
        {pendingAdvancements.map((pendingAdvancement) => (
          <AdvancementCard
            key={pendingAdvancement.advancement.id}
            pendingAdvancement={pendingAdvancement}
            onApprove={() => handleApprove(pendingAdvancement)}
            onReject={() => handleOpenRejectDialog(pendingAdvancement)}
            isProcessing={processingIds.has(pendingAdvancement.advancement.id)}
          />
        ))}
      </div>

      {/* Reject Dialog */}
      {rejectingAdvancement && (
        <RejectAdvancementDialog
          isOpen={rejectDialogOpen}
          onClose={() => {
            setRejectDialogOpen(false);
            setRejectingAdvancement(null);
          }}
          onConfirm={handleConfirmReject}
          characterName={rejectingAdvancement.characterName}
          advancementName={`${advancementTypeLabels[rejectingAdvancement.advancement.type] || rejectingAdvancement.advancement.type}: ${rejectingAdvancement.advancement.targetName}`}
          isSubmitting={isSubmittingReject}
        />
      )}
    </div>
  );
}
