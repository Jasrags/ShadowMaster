"use client";

import { useState, useEffect } from "react";
import { ModalOverlay, Modal, Dialog } from "react-aria-components";
import { Loader2, Check, X, Clock, User, Shield } from "lucide-react";
import type { Campaign, Character, ID } from "@/lib/types";

interface PendingCharacter {
  character: Character;
  characterId: ID;
  characterName: string;
  characterOwnerId: ID;
  submittedAt: string;
}

interface CampaignCharacterApprovalsTabProps {
  campaign: Campaign;
  onApprovalProcessed: () => void;
}

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

// Magical path labels for display
const magicalPathLabels: Record<string, string> = {
  mundane: "Mundane",
  "full-mage": "Full Mage",
  "aspected-mage": "Aspected Mage",
  "mystic-adept": "Mystic Adept",
  adept: "Adept",
  technomancer: "Technomancer",
};

// PendingCharacterCard Component
function PendingCharacterCard({
  pendingCharacter,
  onApprove,
  onReject,
  isProcessing,
}: {
  pendingCharacter: PendingCharacter;
  onApprove: () => void;
  onReject: () => void;
  isProcessing: boolean;
}) {
  const { character, characterOwnerId, submittedAt } = pendingCharacter;

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Owner ID */}
          <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 mb-1">
            <User className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">Player: {characterOwnerId.slice(0, 8)}...</span>
          </div>

          {/* Character name */}
          <h3 className="font-medium text-zinc-900 dark:text-zinc-50">
            {character.name || "Unnamed Character"}
          </h3>

          {/* Character details */}
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
            {character.metatype && (
              <span className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                {character.metatype}
              </span>
            )}
            {character.magicalPath && character.magicalPath !== "mundane" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                <Shield className="h-3 w-3" />
                {magicalPathLabels[character.magicalPath] || character.magicalPath}
              </span>
            )}
          </div>

          {/* Submission date */}
          <div className="mt-2 flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
            <Clock className="h-3 w-3" />
            Submitted {formatDate(submittedAt)}
          </div>
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

// RejectCharacterDialog Component
function RejectCharacterDialog({
  isOpen,
  onClose,
  onConfirm,
  characterName,
  isSubmitting,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (feedback: string) => void;
  characterName: string;
  isSubmitting: boolean;
}) {
  const [feedback, setFeedback] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedback.trim()) {
      onConfirm(feedback.trim());
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFeedback("");
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
              Reject Character
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
                <strong className="text-zinc-900 dark:text-zinc-50">{characterName}</strong>. The
                character will be returned to draft for the player to revise.
              </p>
              <label className="block">
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Feedback (required)
                </span>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Explain what needs to be changed..."
                  rows={3}
                  className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                  disabled={isSubmitting}
                  required
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
                disabled={isSubmitting || !feedback.trim()}
                className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Reject Character
              </button>
            </div>
          </form>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}

// Main Component
export default function CampaignCharacterApprovalsTab({
  campaign,
  onApprovalProcessed,
}: CampaignCharacterApprovalsTabProps) {
  const [pendingCharacters, setPendingCharacters] = useState<PendingCharacter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  // Reject dialog state
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectingCharacter, setRejectingCharacter] = useState<PendingCharacter | null>(null);
  const [isSubmittingReject, setIsSubmittingReject] = useState(false);

  // Fetch pending characters
  useEffect(() => {
    async function fetchPendingCharacters() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/campaigns/${campaign.id}/characters/pending-review`);
        const data = await res.json();
        if (data.success) {
          setPendingCharacters(data.pendingCharacters || []);
        } else {
          setError(data.error || "Failed to load pending characters");
        }
      } catch {
        setError("An error occurred while loading pending characters");
      } finally {
        setLoading(false);
      }
    }

    fetchPendingCharacters();
  }, [campaign.id]);

  // Approve a character
  const handleApprove = async (pendingCharacter: PendingCharacter) => {
    const { characterId } = pendingCharacter;

    setProcessingIds((prev) => new Set(prev).add(characterId));

    try {
      const res = await fetch(`/api/campaigns/${campaign.id}/characters/${characterId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve" }),
      });
      const data = await res.json();

      if (data.success) {
        setPendingCharacters((prev) => prev.filter((p) => p.characterId !== characterId));
        onApprovalProcessed();
      } else {
        setError(data.error || "Failed to approve character");
      }
    } catch {
      setError("An error occurred while approving the character");
    } finally {
      setProcessingIds((prev) => {
        const next = new Set(prev);
        next.delete(characterId);
        return next;
      });
    }
  };

  // Open reject dialog
  const handleOpenRejectDialog = (pendingCharacter: PendingCharacter) => {
    setRejectingCharacter(pendingCharacter);
    setRejectDialogOpen(true);
  };

  // Confirm rejection
  const handleConfirmReject = async (feedback: string) => {
    if (!rejectingCharacter) return;

    const { characterId } = rejectingCharacter;

    setIsSubmittingReject(true);
    setProcessingIds((prev) => new Set(prev).add(characterId));

    try {
      const res = await fetch(`/api/campaigns/${campaign.id}/characters/${characterId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject", feedback }),
      });
      const data = await res.json();

      if (data.success) {
        setPendingCharacters((prev) => prev.filter((p) => p.characterId !== characterId));
        onApprovalProcessed();
        setRejectDialogOpen(false);
        setRejectingCharacter(null);
      } else {
        setError(data.error || "Failed to reject character");
      }
    } catch {
      setError("An error occurred while rejecting the character");
    } finally {
      setIsSubmittingReject(false);
      setProcessingIds((prev) => {
        const next = new Set(prev);
        next.delete(characterId);
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
  if (pendingCharacters.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-300 p-12 text-center dark:border-zinc-700">
        <Check className="mx-auto h-12 w-12 text-green-500" />
        <h3 className="mt-4 text-lg font-medium text-zinc-900 dark:text-zinc-50">All caught up!</h3>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          No pending character reviews.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">Character Reviews</h2>
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          {pendingCharacters.length} character{pendingCharacters.length !== 1 ? "s" : ""} pending
        </span>
      </div>

      <div className="space-y-3">
        {pendingCharacters.map((pendingCharacter) => (
          <PendingCharacterCard
            key={pendingCharacter.characterId}
            pendingCharacter={pendingCharacter}
            onApprove={() => handleApprove(pendingCharacter)}
            onReject={() => handleOpenRejectDialog(pendingCharacter)}
            isProcessing={processingIds.has(pendingCharacter.characterId)}
          />
        ))}
      </div>

      {/* Reject Dialog */}
      {rejectingCharacter && (
        <RejectCharacterDialog
          isOpen={rejectDialogOpen}
          onClose={() => {
            setRejectDialogOpen(false);
            setRejectingCharacter(null);
          }}
          onConfirm={handleConfirmReject}
          characterName={rejectingCharacter.characterName}
          isSubmitting={isSubmittingReject}
        />
      )}
    </div>
  );
}
