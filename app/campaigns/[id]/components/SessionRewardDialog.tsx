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
    CheckboxGroup,
    Checkbox,
    Form,
} from "react-aria-components";
import { Loader2, Trophy, Coins, Users, X } from "lucide-react";
import type { Campaign, CampaignSession, Character } from "@/lib/types";

interface SessionRewardDialogProps {
    isOpen: boolean;
    onClose: () => void;
    campaign: Campaign;
    session: CampaignSession;
    onSuccess: (updatedCampaign: Campaign) => void;
}

export default function SessionRewardDialog({
    isOpen,
    onClose,
    campaign,
    session,
    onSuccess,
}: SessionRewardDialogProps) {
    const [loading, setLoading] = useState(false);
    const [characters, setCharacters] = useState<Character[]>([]);
    const [fetchingCharacters, setFetchingCharacters] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [karmaAward, setKarmaAward] = useState(2);
    const [nuyenAward, setNuyenAward] = useState(2000);
    const [recap, setRecap] = useState(session.recap || "");
    const [participantCharacterIds, setParticipantCharacterIds] = useState<string[]>([]);
    const [distributeRewards, setDistributeRewards] = useState(true);

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
                        // Default participants to characters owned by attendees
                        const initialParticipants = data.characters
                            .filter((char: Character) => session.attendeeIds.includes(char.ownerId))
                            .map((char: Character) => char.id);
                        setParticipantCharacterIds(initialParticipants);
                    }
                } catch {
                    // Ignore errors
                } finally {
                    setFetchingCharacters(false);
                }
            };
            fetchCharacters();
        }
    }, [isOpen, campaign.id, session.attendeeIds]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`/api/campaigns/${campaign.id}/sessions/${session.id}/complete`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    participantCharacterIds,
                    karmaAward,
                    nuyenAward,
                    recap,
                    distributeRewards,
                }),
            });

            const data = await res.json();

            if (data.success) {
                onSuccess(data.campaign);
                onClose();
            } else {
                setError(data.error || "Failed to complete session");
            }
        } catch (err) {
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
            <Modal className="w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-zinc-900">
                <Dialog className="relative outline-none">
                    {({ close }) => (
                        <div className="flex flex-col">
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50/50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400">
                                        <Trophy className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <Heading slot="title" className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                                            Close Session & Awards
                                        </Heading>
                                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                            {session.title} • {new Date(session.scheduledAt).toLocaleDateString()}
                                        </p>
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
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    {/* Left Column: Awards */}
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                                                <Trophy className="h-4 w-4 text-amber-500" />
                                                Session Rewards
                                            </h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <TextField className="flex flex-col gap-1">
                                                    <Label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Karma</Label>
                                                    <div className="relative">
                                                        <Input
                                                            type="number"
                                                            value={karmaAward}
                                                            onChange={(e) => setKarmaAward(parseInt(e.target.value) || 0)}
                                                            className="w-full rounded-md border border-zinc-200 bg-white py-2 pl-8 pr-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800"
                                                        />
                                                        <div className="absolute left-2.5 top-2.5 text-amber-500">
                                                            <Trophy className="h-4 w-4" />
                                                        </div>
                                                    </div>
                                                </TextField>
                                                <TextField className="flex flex-col gap-1">
                                                    <Label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Nuyen (¥)</Label>
                                                    <div className="relative">
                                                        <Input
                                                            type="number"
                                                            value={nuyenAward}
                                                            onChange={(e) => setNuyenAward(parseInt(e.target.value) || 0)}
                                                            className="w-full rounded-md border border-zinc-200 bg-white py-2 pl-8 pr-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800"
                                                        />
                                                        <div className="absolute left-2.5 top-2.5 text-emerald-500">
                                                            <Coins className="h-4 w-4" />
                                                        </div>
                                                    </div>
                                                </TextField>
                                            </div>
                                        </div>

                                        <TextField className="flex flex-col gap-1">
                                            <Label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Session Recap</Label>
                                            <TextArea
                                                value={recap}
                                                onChange={(e) => setRecap(e.target.value)}
                                                placeholder="What happened during this run?"
                                                rows={5}
                                                className="w-full rounded-md border border-zinc-200 bg-white p-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800"
                                            />
                                        </TextField>

                                        <div className="flex items-center gap-2 rounded-lg bg-indigo-50 p-3 dark:bg-indigo-900/20">
                                            <Checkbox
                                                isSelected={distributeRewards}
                                                onChange={setDistributeRewards}
                                                className="flex items-center gap-2 text-sm text-indigo-700 dark:text-indigo-400"
                                            >
                                                {({ isSelected }) => (
                                                    <>
                                                        <div className={`flex h-4 w-4 items-center justify-center rounded border ${isSelected ? "bg-indigo-600 border-indigo-600" : "bg-white border-zinc-300 dark:bg-zinc-800 dark:border-zinc-600"}`}>
                                                            {isSelected && <div className="h-2 w-2 bg-white rounded-full" />}
                                                        </div>
                                                        Distribute rewards immediately
                                                    </>
                                                )}
                                            </Checkbox>
                                        </div>
                                    </div>

                                    {/* Right Column: Participants */}
                                    <div className="flex flex-col">
                                        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                                            <Users className="h-4 w-4 text-indigo-500" />
                                            Participants
                                        </h3>
                                        <div className="flex-1 overflow-y-auto rounded-lg border border-zinc-200 bg-zinc-50 p-2 dark:border-zinc-800 dark:bg-zinc-900/50">
                                            {fetchingCharacters ? (
                                                <div className="flex h-full items-center justify-center py-8">
                                                    <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
                                                </div>
                                            ) : characters.length === 0 ? (
                                                <p className="py-8 text-center text-sm text-zinc-500">No characters found in campaign.</p>
                                            ) : (
                                                <CheckboxGroup
                                                    value={participantCharacterIds}
                                                    onChange={setParticipantCharacterIds}
                                                    className="space-y-1"
                                                >
                                                    {characters.map((char) => (
                                                        <Checkbox
                                                            key={char.id}
                                                            value={char.id}
                                                            className="flex items-center gap-3 rounded-md p-2 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50"
                                                        >
                                                            {({ isSelected }) => (
                                                                <>
                                                                    <div className={`flex h-4 w-4 items-center justify-center rounded border ${isSelected ? "bg-indigo-600 border-indigo-600" : "bg-white border-zinc-300 dark:bg-zinc-800 dark:border-zinc-600"}`}>
                                                                        {isSelected && <div className="h-2 w-2 bg-white rounded-full" />}
                                                                    </div>
                                                                    <div className="flex-1 overflow-hidden">
                                                                        <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">{char.name}</p>
                                                                        <p className="truncate text-[10px] text-zinc-500">{char.metatype}</p>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </Checkbox>
                                                    ))}
                                                </CheckboxGroup>
                                            )}
                                        </div>
                                        <p className="mt-2 text-[10px] text-zinc-500 dark:text-zinc-400">
                                            {participantCharacterIds.length} characters selected for rewards.
                                        </p>
                                    </div>
                                </div>

                                {error && (
                                    <div className="mt-6 rounded-md bg-red-50 p-3 text-xs text-red-600 dark:bg-red-900/20 dark:text-red-400">
                                        {error}
                                    </div>
                                )}

                                <div className="mt-8 flex justify-end gap-3 border-t border-zinc-100 pt-6 dark:border-zinc-800">
                                    <Button
                                        onPress={close}
                                        className="rounded-md px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        isDisabled={loading}
                                        className="flex items-center gap-2 rounded-md bg-indigo-600 px-6 py-2 text-sm font-bold text-white shadow-lg hover:bg-indigo-700 disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Trophy className="h-4 w-4" />
                                        )}
                                        Complete Session
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
