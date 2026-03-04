"use client";

import { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  Dialog,
  Heading,
  Button,
  TextField,
  Label,
  Input,
  TextArea,
  Form,
} from "react-aria-components";
import { Loader2, Gift, Trophy, Coins, X } from "lucide-react";
import type { Campaign, CampaignSession, Character } from "@/lib/types";

interface MidSessionAwardDialogProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: Campaign;
  session: CampaignSession;
  onSuccess: (updatedCampaign: Campaign) => void;
}

export default function MidSessionAwardDialog({
  isOpen,
  onClose,
  campaign,
  session,
  onSuccess,
}: MidSessionAwardDialogProps) {
  const [loading, setLoading] = useState(false);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [fetchingCharacters, setFetchingCharacters] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [selectedCharacterId, setSelectedCharacterId] = useState("");
  const [karma, setKarma] = useState(0);
  const [nuyen, setNuyen] = useState(0);
  const [reason, setReason] = useState("");

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
      setSelectedCharacterId("");
      setKarma(0);
      setNuyen(0);
      setReason("");
      setError(null);
    }
  }, [isOpen, campaign.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/campaigns/${campaign.id}/sessions/${session.id}/awards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          characterId: selectedCharacterId,
          karma,
          nuyen,
          reason,
        }),
      });

      const data = await res.json();

      if (data.success) {
        onSuccess(data.campaign);
        onClose();
      } else {
        setError(data.error || "Failed to give award");
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
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400">
                    <Gift className="h-5 w-5" />
                  </div>
                  <div>
                    <Heading
                      slot="title"
                      className="text-lg font-bold text-zinc-900 dark:text-zinc-50"
                    >
                      Quick Award
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
                  {/* Character selector */}
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
                        className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
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

                  {/* Karma + Nuyen inputs */}
                  <div className="grid grid-cols-2 gap-4">
                    <TextField className="flex flex-col gap-1">
                      <Label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        Karma
                      </Label>
                      <div className="relative">
                        <Input
                          type="number"
                          value={karma}
                          onChange={(e) => setKarma(parseInt(e.target.value) || 0)}
                          min={0}
                          className="w-full rounded-md border border-zinc-200 bg-white py-2 pl-8 pr-3 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 dark:border-zinc-700 dark:bg-zinc-800"
                        />
                        <div className="absolute left-2.5 top-2.5 text-amber-500">
                          <Trophy className="h-4 w-4" />
                        </div>
                      </div>
                    </TextField>
                    <TextField className="flex flex-col gap-1">
                      <Label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        Nuyen (¥)
                      </Label>
                      <div className="relative">
                        <Input
                          type="number"
                          value={nuyen}
                          onChange={(e) => setNuyen(parseInt(e.target.value) || 0)}
                          min={0}
                          className="w-full rounded-md border border-zinc-200 bg-white py-2 pl-8 pr-3 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 dark:border-zinc-700 dark:bg-zinc-800"
                        />
                        <div className="absolute left-2.5 top-2.5 text-emerald-500">
                          <Coins className="h-4 w-4" />
                        </div>
                      </div>
                    </TextField>
                  </div>

                  {/* Reason textarea */}
                  <TextField className="flex flex-col gap-1">
                    <Label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      Reason
                    </Label>
                    <TextArea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Excellent roleplay, combat excellence, puzzle solving..."
                      rows={3}
                      required
                      className="w-full rounded-md border border-zinc-200 bg-white p-3 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 dark:border-zinc-700 dark:bg-zinc-800"
                    />
                  </TextField>
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
                    isDisabled={loading || !selectedCharacterId || !reason.trim()}
                    className="flex items-center gap-2 rounded-md bg-amber-600 px-6 py-2 text-sm font-bold text-white shadow-lg hover:bg-amber-700 disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Gift className="h-4 w-4" />
                    )}
                    Give Award
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
