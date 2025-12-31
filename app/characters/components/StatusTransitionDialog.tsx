"use client";

import { useState, useEffect } from "react";
import { Dialog, Modal, ModalOverlay, Heading } from "react-aria-components";
import { X, Loader2, AlertTriangle, CheckCircle, ShieldAlert } from "lucide-react";
import type { CharacterStatus } from "@/lib/types";

interface TransitionOption {
  to: CharacterStatus;
  label: string;
  description: string;
}

interface ValidationResult {
  valid: boolean;
  errors?: Array<{ code: string; message: string; path?: string }>;
  warnings?: Array<{ code: string; message: string; path?: string }>;
}

interface StatusTransitionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  characterId: string;
  characterName: string;
  currentStatus: CharacterStatus;
}

export default function StatusTransitionDialog({
  isOpen,
  onClose,
  onSuccess,
  characterId,
  characterName,
  currentStatus,
}: StatusTransitionDialogProps) {
  const [transitions, setTransitions] = useState<TransitionOption[]>([]);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<CharacterStatus | "">("");
  const [note, setNote] = useState("");
  const [skipValidation, setSkipValidation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingTransitions, setLoadingTransitions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Array<{ code: string; message: string }>>([]);
  const [canOverride, setCanOverride] = useState(false);

  // Fetch available transitions when dialog opens
  useEffect(() => {
    if (isOpen) {
      fetchTransitions();
    }
  }, [isOpen, characterId]);

  const fetchTransitions = async () => {
    setLoadingTransitions(true);
    setError(null);

    try {
      const response = await fetch(`/api/characters/${characterId}/admin/transition`);
      const data = await response.json();

      if (data.success) {
        setTransitions(data.transitions || []);
        setValidation(data.validation || null);
        // Pre-select first option if available
        if (data.transitions?.length > 0) {
          setSelectedStatus(data.transitions[0].to);
        }
      } else {
        setError(data.error || "Failed to fetch transitions");
      }
    } catch {
      setError("Failed to fetch available transitions");
    } finally {
      setLoadingTransitions(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedStatus) {
      setError("Please select a target status");
      return;
    }

    if (!note.trim()) {
      setError("A reason/note is required for admin status transitions");
      return;
    }

    setLoading(true);
    setError(null);
    setValidationErrors([]);
    setCanOverride(false);

    try {
      const response = await fetch(`/api/characters/${characterId}/admin/transition`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetStatus: selectedStatus,
          note: note.trim(),
          skipValidation,
        }),
      });

      const data = await response.json();

      if (data.success) {
        handleClose();
        onSuccess();
      } else if (data.canOverride && data.errors) {
        // Validation failed but can be overridden
        setValidationErrors(data.errors);
        setCanOverride(true);
        setError("Character validation failed. Review errors below and choose to override if appropriate.");
      } else {
        setError(data.error || "Failed to transition status");
        if (data.errors) {
          setValidationErrors(data.errors);
        }
      }
    } catch {
      setError("An error occurred while transitioning status");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedStatus("");
    setNote("");
    setSkipValidation(false);
    setError(null);
    setValidationErrors([]);
    setCanOverride(false);
    onClose();
  };

  const getStatusBadgeColor = (status: CharacterStatus): string => {
    switch (status) {
      case "draft":
        return "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300";
      case "active":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "retired":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
      case "deceased":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300";
    }
  };

  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={(open) => !open && handleClose()}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <Modal className="w-full max-w-lg rounded-lg bg-white shadow-xl dark:bg-zinc-900">
        <Dialog className="outline-none">
          <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
            <Heading slot="title" className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Admin: Change Character Status
            </Heading>
            <button
              onClick={handleClose}
              className="rounded-md p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <X className="h-5 w-5 text-zinc-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {/* Character Info */}
            <div className="mb-4 rounded-md bg-zinc-50 p-3 dark:bg-zinc-800/50">
              <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {characterName}
              </div>
              <div className="mt-1 flex items-center gap-2 text-sm">
                <span className="text-zinc-500 dark:text-zinc-400">Current Status:</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusBadgeColor(currentStatus)}`}>
                  {currentStatus}
                </span>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Validation Errors */}
            {validationErrors.length > 0 && (
              <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/50 dark:bg-amber-900/20">
                <div className="flex items-center gap-2 text-sm font-medium text-amber-800 dark:text-amber-400">
                  <ShieldAlert className="h-4 w-4" />
                  Validation Errors
                </div>
                <ul className="mt-2 space-y-1 text-sm text-amber-700 dark:text-amber-400">
                  {validationErrors.map((err, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-500">-</span>
                      <span>{err.message}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Pre-existing validation warnings for draft characters */}
            {currentStatus === "draft" && validation && !validation.valid && (
              <div className="mb-4 rounded-md border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800/50">
                <div className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  <AlertTriangle className="h-4 w-4" />
                  Character has validation issues
                </div>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  This draft character has {validation.errors?.length || 0} validation error(s).
                  You can still finalize with admin override.
                </p>
              </div>
            )}

            {loadingTransitions ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
                <span className="ml-2 text-sm text-zinc-500">Loading available transitions...</span>
              </div>
            ) : transitions.length === 0 ? (
              <div className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
                No transitions available for this character status.
              </div>
            ) : (
              <div className="space-y-4">
                {/* Target Status Selection */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    New Status
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value as CharacterStatus)}
                    className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-black dark:text-white"
                    disabled={loading}
                  >
                    <option value="">Select a status...</option>
                    {transitions.map((t) => (
                      <option key={t.to} value={t.to}>
                        {t.label} ({t.to})
                      </option>
                    ))}
                  </select>
                  {selectedStatus && (
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                      {transitions.find((t) => t.to === selectedStatus)?.description}
                    </p>
                  )}
                </div>

                {/* Reason/Note */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Reason / Note <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Explain why you are making this status change..."
                    rows={3}
                    className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-black dark:text-white dark:placeholder:text-zinc-600"
                    disabled={loading}
                    required
                  />
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    Required for audit trail. Be specific about why this change is being made.
                  </p>
                </div>

                {/* Skip Validation Checkbox (only shown when there are validation errors to override) */}
                {canOverride && (
                  <div className="rounded-md border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/50 dark:bg-amber-900/20">
                    <label className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={skipValidation}
                        onChange={(e) => setSkipValidation(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                        disabled={loading}
                      />
                      <div>
                        <span className="text-sm font-medium text-amber-800 dark:text-amber-400">
                          Override validation and proceed anyway
                        </span>
                        <p className="mt-0.5 text-xs text-amber-700 dark:text-amber-500">
                          As an administrator, you can bypass validation requirements. This will be logged in the audit trail.
                        </p>
                      </div>
                    </label>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 flex justify-end gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-800">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !selectedStatus || !note.trim() || (canOverride && !skipValidation)}
                className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Transitioning...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Confirm Transition
                  </>
                )}
              </button>
            </div>
          </form>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
