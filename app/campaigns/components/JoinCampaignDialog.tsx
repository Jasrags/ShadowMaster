"use client";

import { useState } from "react";
import { Dialog, Modal, ModalOverlay, Heading } from "react-aria-components";
import { X, Key, Loader2 } from "lucide-react";

interface JoinCampaignDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function JoinCampaignDialog({ isOpen, onClose, onSuccess }: JoinCampaignDialogProps) {
    const [inviteCode, setInviteCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inviteCode.trim()) {
            setError("Please enter an invite code");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Try to join using invite code as the campaign ID parameter
            const res = await fetch(`/api/campaigns/${inviteCode}/join`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ inviteCode: inviteCode.trim() }),
            });

            const data = await res.json();

            if (data.success) {
                setInviteCode("");
                onSuccess();
            } else {
                setError(data.error || "Failed to join campaign");
            }
        } catch {
            setError("An error occurred while joining");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setInviteCode("");
        setError(null);
        onClose();
    };

    return (
        <ModalOverlay
            isOpen={isOpen}
            onOpenChange={(open) => !open && handleClose()}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
            <Modal className="w-full max-w-md rounded-lg bg-white shadow-xl dark:bg-zinc-900">
                <Dialog className="outline-none">
                    <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
                        <Heading slot="title" className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                            Join Campaign
                        </Heading>
                        <button
                            onClick={handleClose}
                            className="rounded-md p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        >
                            <X className="h-5 w-5 text-zinc-500" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6">
                        {error && (
                            <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label
                                    htmlFor="inviteCode"
                                    className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                                >
                                    Invite Code
                                </label>
                                <div className="mt-1 flex rounded-md shadow-sm">
                                    <span className="inline-flex items-center rounded-l-md border border-r-0 border-zinc-300 bg-zinc-50 px-3 text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800">
                                        <Key className="h-4 w-4" />
                                    </span>
                                    <input
                                        type="text"
                                        id="inviteCode"
                                        value={inviteCode}
                                        onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                                        placeholder="XXXXXXXX"
                                        className="block w-full rounded-none rounded-r-md border border-zinc-300 px-3 py-2 uppercase placeholder:normal-case focus:border-indigo-500 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-black dark:text-white"
                                        disabled={loading}
                                    />
                                </div>
                                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                                    Enter the 8-character invite code from your GM
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
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
                                disabled={loading || !inviteCode.trim()}
                                className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Joining...
                                    </>
                                ) : (
                                    "Join Campaign"
                                )}
                            </button>
                        </div>
                    </form>
                </Dialog>
            </Modal>
        </ModalOverlay>
    );
}
