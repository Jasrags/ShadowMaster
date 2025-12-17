"use client";

import { useState } from "react";
import type { Campaign } from "@/lib/types";
import { Users, Copy, Check, RefreshCw, Trash2, Loader2 } from "lucide-react";

interface CampaignRosterTabProps {
    campaign: Campaign;
    onCampaignUpdate: (campaign: Campaign) => void;
}

export default function CampaignRosterTab({ campaign, onCampaignUpdate }: CampaignRosterTabProps) {
    const [copiedCode, setCopiedCode] = useState(false);
    const [regenerating, setRegenerating] = useState(false);
    const [removingPlayer, setRemovingPlayer] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleCopyInviteCode = () => {
        if (campaign.inviteCode) {
            navigator.clipboard.writeText(campaign.inviteCode);
            setCopiedCode(true);
            setTimeout(() => setCopiedCode(false), 2000);
        }
    };

    const handleRegenerateCode = async () => {
        setRegenerating(true);
        setError(null);
        try {
            const res = await fetch(`/api/campaigns/${campaign.id}/regenerate-code`, {
                method: "POST",
            });
            const data = await res.json();

            if (data.success) {
                onCampaignUpdate(data.campaign);
            } else {
                setError(data.error || "Failed to regenerate code");
            }
        } catch {
            setError("An error occurred");
        } finally {
            setRegenerating(false);
        }
    };

    const handleRemovePlayer = async (playerId: string) => {
        if (!confirm("Are you sure you want to remove this player from the campaign?")) {
            return;
        }

        setRemovingPlayer(playerId);
        setError(null);

        try {
            const res = await fetch(`/api/campaigns/${campaign.id}/players/${playerId}`, {
                method: "DELETE",
            });
            const data = await res.json();

            if (data.success) {
                // Update local campaign state
                onCampaignUpdate({
                    ...campaign,
                    playerIds: campaign.playerIds.filter((id) => id !== playerId),
                });
            } else {
                setError(data.error || "Failed to remove player");
            }
        } catch {
            setError("An error occurred");
        } finally {
            setRemovingPlayer(null);
        }
    };

    return (
        <div className="space-y-6">
            {error && (
                <div className="rounded-md bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
                    {error}
                </div>
            )}

            {/* Invite Code Section */}
            {campaign.visibility !== "private" && (
                <section className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-black">
                    <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                        Invite Code
                    </h3>
                    <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
                        Share this code with players so they can join your campaign.
                    </p>
                    <div className="flex items-center gap-3">
                        <div className="flex-1 rounded-md bg-zinc-100 px-4 py-3 font-mono text-lg tracking-widest text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50">
                            {campaign.inviteCode || "No code generated"}
                        </div>
                        <button
                            onClick={handleCopyInviteCode}
                            disabled={!campaign.inviteCode}
                            className="inline-flex items-center gap-2 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                        >
                            {copiedCode ? (
                                <>
                                    <Check className="h-4 w-4 text-green-500" />
                                    Copied
                                </>
                            ) : (
                                <>
                                    <Copy className="h-4 w-4" />
                                    Copy
                                </>
                            )}
                        </button>
                        <button
                            onClick={handleRegenerateCode}
                            disabled={regenerating}
                            className="inline-flex items-center gap-2 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                        >
                            {regenerating ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <RefreshCw className="h-4 w-4" />
                            )}
                            Regenerate
                        </button>
                    </div>
                    <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                        Regenerating the code will invalidate the old one.
                    </p>
                </section>
            )}

            {/* Player List */}
            <section className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-black">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                    <Users className="h-5 w-5 text-indigo-500" />
                    Players ({campaign.playerIds.length})
                </h3>

                {campaign.playerIds.length === 0 ? (
                    <div className="rounded-md bg-zinc-50 p-8 text-center dark:bg-zinc-900">
                        <Users className="mx-auto h-12 w-12 text-zinc-300 dark:text-zinc-600" />
                        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
                            No players have joined yet. Share your invite code to get players.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {campaign.playerIds.map((playerId) => (
                            <div
                                key={playerId}
                                className="flex items-center justify-between rounded-md border border-zinc-200 p-3 dark:border-zinc-700"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                                        <Users className="h-5 w-5 text-zinc-500" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-zinc-900 dark:text-zinc-50">
                                            Player
                                        </p>
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                            ID: {playerId.slice(0, 8)}...
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleRemovePlayer(playerId)}
                                    disabled={removingPlayer === playerId}
                                    className="inline-flex items-center gap-1 rounded-md border border-red-300 bg-white px-2 py-1 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50 dark:border-red-800 dark:bg-zinc-800 dark:text-red-400 dark:hover:bg-red-900/30"
                                >
                                    {removingPlayer === playerId ? (
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                    ) : (
                                        <Trash2 className="h-3 w-3" />
                                    )}
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
