"use client";

import { useState, useEffect } from "react";
import { Modal, ModalOverlay, Dialog, Heading, Button, Form } from "react-aria-components";
import { Loader2, RefreshCw, X, Users, User } from "lucide-react";
import type { Campaign, CampaignSession, Character } from "@/lib/types";

interface EdgeRefreshDialogProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: Campaign;
  session: CampaignSession;
  onSuccess: (updatedCampaign: Campaign) => void;
}

const REASON_PRESETS = [
  { value: "session-start", label: "Session Start" },
  { value: "scene-change", label: "Scene Change" },
  { value: "custom", label: "Custom..." },
];

export default function EdgeRefreshDialog({
  isOpen,
  onClose,
  campaign,
  session,
  onSuccess,
}: EdgeRefreshDialogProps) {
  const [loading, setLoading] = useState(false);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [fetchingCharacters, setFetchingCharacters] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [scope, setScope] = useState<"party" | "individual">("party");
  const [selectedCharacterId, setSelectedCharacterId] = useState("");
  const [reasonPreset, setReasonPreset] = useState("session-start");
  const [customReason, setCustomReason] = useState("");

  // Fetch characters in campaign
  useEffect(() => {
    if (isOpen) {
      const fetchCharacters = async () => {
        setFetchingCharacters(true);
        try {
          const res = await fetch(`/api/campaigns/${campaign.id}/characters`);
          const data = await res.json();
          if (data.success) {
            setCharacters(data.characters);
          }
        } catch {
          // Ignore errors
        } finally {
          setFetchingCharacters(false);
        }
      };
      fetchCharacters();
      // Reset form on open
      setScope("party");
      setSelectedCharacterId("");
      setReasonPreset("session-start");
      setCustomReason("");
      setError(null);
    }
  }, [isOpen, campaign.id]);

  const effectiveReason =
    reasonPreset === "custom"
      ? customReason
      : REASON_PRESETS.find((p) => p.value === reasonPreset)?.label || reasonPreset;

  const isValid =
    effectiveReason.trim().length > 0 &&
    (scope === "party" || (scope === "individual" && selectedCharacterId));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/campaigns/${campaign.id}/sessions/${session.id}/edge-refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scope,
          characterId: scope === "individual" ? selectedCharacterId : undefined,
          reason: effectiveReason,
        }),
      });

      const data = await res.json();

      if (data.success) {
        onSuccess(data.campaign);
        onClose();
      } else {
        setError(data.error || "Failed to refresh Edge");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
    >
      <Modal className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-zinc-900">
        <Dialog className="relative outline-none">
          {({ close }) => (
            <div className="flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50/50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-100 text-cyan-600 dark:bg-cyan-900/40 dark:text-cyan-400">
                    <RefreshCw className="h-5 w-5" />
                  </div>
                  <div>
                    <Heading
                      slot="title"
                      className="text-lg font-bold text-zinc-900 dark:text-zinc-50"
                    >
                      Edge Refresh
                    </Heading>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{session.title}</p>
                  </div>
                </div>
                <Button
                  onPress={close}
                  className="rounded-full p-2 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <Form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-5">
                  {/* Scope toggle */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      Scope
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setScope("party")}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                          scope === "party"
                            ? "bg-cyan-600 text-white shadow-md"
                            : "border border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                        }`}
                      >
                        <Users className="h-4 w-4" />
                        All Characters
                      </button>
                      <button
                        type="button"
                        onClick={() => setScope("individual")}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                          scope === "individual"
                            ? "bg-cyan-600 text-white shadow-md"
                            : "border border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                        }`}
                      >
                        <User className="h-4 w-4" />
                        Individual
                      </button>
                    </div>
                  </div>

                  {/* Character selector (individual only) */}
                  {scope === "individual" && (
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        Character
                      </label>
                      {fetchingCharacters ? (
                        <div className="flex items-center gap-2 py-2 text-sm text-zinc-400">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Loading characters...
                        </div>
                      ) : (
                        <select
                          value={selectedCharacterId}
                          onChange={(e) => setSelectedCharacterId(e.target.value)}
                          required
                          className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                        >
                          <option value="">Select a character...</option>
                          {characters.map((char) => (
                            <option key={char.id} value={char.id}>
                              {char.name} ({char.metatype})
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  )}

                  {/* Reason selector */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      Reason
                    </label>
                    <select
                      value={reasonPreset}
                      onChange={(e) => setReasonPreset(e.target.value)}
                      className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                    >
                      {REASON_PRESETS.map((preset) => (
                        <option key={preset.value} value={preset.value}>
                          {preset.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Custom reason input */}
                  {reasonPreset === "custom" && (
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        Custom Reason
                      </label>
                      <input
                        type="text"
                        value={customReason}
                        onChange={(e) => setCustomReason(e.target.value)}
                        placeholder="Enter reason for Edge refresh..."
                        required
                        className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                      />
                    </div>
                  )}
                </div>

                {error && (
                  <div className="mt-4 rounded-md bg-red-50 p-3 text-xs text-red-600 dark:bg-red-900/20 dark:text-red-400">
                    {error}
                  </div>
                )}

                <div className="mt-6 flex justify-end gap-3 border-t border-zinc-100 pt-5 dark:border-zinc-800">
                  <Button
                    onPress={close}
                    className="rounded-md px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    isDisabled={loading || !isValid}
                    className="flex items-center gap-2 rounded-md bg-cyan-600 px-6 py-2 text-sm font-bold text-white shadow-lg hover:bg-cyan-700 disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                    Refresh Edge
                  </Button>
                </div>
              </Form>
            </div>
          )}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
