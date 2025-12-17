"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import type { Campaign, Book, CreationMethod, GameplayLevel, CampaignVisibility, CampaignStatus } from "@/lib/types";
import { ArrowLeft, Loader2, Save, AlertTriangle, Trash2, Archive } from "lucide-react";

interface SettingsPageProps {
    params: Promise<{ id: string }>;
}

const gameplayLevelOptions: { value: GameplayLevel; label: string }[] = [
    { value: "street", label: "Street Level" },
    { value: "experienced", label: "Experienced" },
    { value: "prime-runner", label: "Prime Runner" },
];

const visibilityOptions: { value: CampaignVisibility; label: string; description: string }[] = [
    { value: "private", label: "Private", description: "Only you can see this campaign" },
    { value: "invite-only", label: "Invite Only", description: "Players need an invite code to join" },
    { value: "public", label: "Public", description: "Anyone can see and join this campaign" },
];

const statusOptions: { value: CampaignStatus; label: string }[] = [
    { value: "active", label: "Active" },
    { value: "paused", label: "Paused" },
    { value: "completed", label: "Completed" },
];

export default function CampaignSettingsPage({ params }: SettingsPageProps) {
    const router = useRouter();
    const { id } = use(params);

    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Form state
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [enabledBookIds, setEnabledBookIds] = useState<string[]>([]);
    const [enabledCreationMethodIds, setEnabledCreationMethodIds] = useState<string[]>([]);
    const [gameplayLevel, setGameplayLevel] = useState<GameplayLevel>("experienced");
    const [visibility, setVisibility] = useState<CampaignVisibility>("invite-only");
    const [status, setStatus] = useState<CampaignStatus>("active");
    const [maxPlayers, setMaxPlayers] = useState<number | undefined>(undefined);

    // Edition data
    const [books, setBooks] = useState<Book[]>([]);
    const [creationMethods, setCreationMethods] = useState<CreationMethod[]>([]);

    // Fetch campaign and edition data
    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            setError(null);
            try {
                // Fetch campaign
                const campaignRes = await fetch(`/api/campaigns/${id}`);
                const campaignData = await campaignRes.json();

                if (!campaignData.success) {
                    setError(campaignData.error || "Failed to load campaign");
                    return;
                }

                if (campaignData.userRole !== "gm") {
                    setError("Only the GM can access campaign settings");
                    return;
                }

                const c = campaignData.campaign as Campaign;
                setCampaign(c);
                setTitle(c.title);
                setDescription(c.description || "");
                setEnabledBookIds(c.enabledBookIds);
                setEnabledCreationMethodIds(c.enabledCreationMethodIds);
                setGameplayLevel(c.gameplayLevel);
                setVisibility(c.visibility);
                setStatus(c.status);
                setMaxPlayers(c.maxPlayers);

                // Fetch edition data
                const editionRes = await fetch(`/api/editions/${c.editionCode}`);
                const editionData = await editionRes.json();
                if (editionData.success) {
                    setBooks(editionData.books || []);
                    setCreationMethods(editionData.creationMethods || []);
                }
            } catch {
                setError("An error occurred while loading the campaign");
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [id]);

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const res = await fetch(`/api/campaigns/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    description: description || undefined,
                    enabledBookIds,
                    enabledCreationMethodIds,
                    gameplayLevel,
                    visibility,
                    status,
                    maxPlayers: maxPlayers || undefined,
                }),
            });

            const data = await res.json();

            if (data.success) {
                setCampaign(data.campaign);
                setSuccessMessage("Campaign settings saved successfully");
                setTimeout(() => setSuccessMessage(null), 3000);
            } else {
                setError(data.error || "Failed to save settings");
            }
        } catch {
            setError("An error occurred while saving");
        } finally {
            setSaving(false);
        }
    };

    const handleArchive = async () => {
        if (!confirm("Are you sure you want to archive this campaign? Players will no longer be able to access it.")) {
            return;
        }

        try {
            const res = await fetch(`/api/campaigns/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "archived" }),
            });

            const data = await res.json();

            if (data.success) {
                router.push("/campaigns");
            } else {
                setError(data.error || "Failed to archive campaign");
            }
        } catch {
            setError("An error occurred");
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this campaign? This action cannot be undone.")) {
            return;
        }

        try {
            const res = await fetch(`/api/campaigns/${id}`, {
                method: "DELETE",
            });

            const data = await res.json();

            if (data.success) {
                router.push("/campaigns");
            } else {
                setError(data.error || "Failed to delete campaign");
            }
        } catch {
            setError("An error occurred");
        }
    };

    const toggleBookId = (bookId: string) => {
        setEnabledBookIds((prev) =>
            prev.includes(bookId) ? prev.filter((id) => id !== bookId) : [...prev, bookId]
        );
    };

    const toggleMethodId = (methodId: string) => {
        setEnabledCreationMethodIds((prev) =>
            prev.includes(methodId) ? prev.filter((id) => id !== methodId) : [...prev, methodId]
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
            </div>
        );
    }

    if (error && !campaign) {
        return (
            <div className="mx-auto max-w-3xl px-4 py-8">
                <div className="rounded-lg bg-red-50 p-6 text-center dark:bg-red-900/30">
                    <p className="text-red-700 dark:text-red-400">{error}</p>
                    <button
                        onClick={() => router.push("/campaigns")}
                        className="mt-4 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                    >
                        Back to Campaigns
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Back Button */}
            <button
                onClick={() => router.push(`/campaigns/${id}`)}
                className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Campaign
            </button>

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                        Campaign Settings
                    </h1>
                    <button
                        onClick={handleSave}
                        disabled={saving || enabledBookIds.length === 0 || enabledCreationMethodIds.length === 0}
                        className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4" />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>

                {/* Messages */}
                {error && (
                    <div className="rounded-md bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
                        {error}
                    </div>
                )}
                {successMessage && (
                    <div className="rounded-md bg-green-50 p-4 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        {successMessage}
                    </div>
                )}

                {/* Basic Info */}
                <section className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-black">
                    <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                        Basic Information
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Campaign Title
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                minLength={3}
                                maxLength={100}
                                className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-black dark:text-white"
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Description
                            </label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-black dark:text-white"
                            />
                        </div>
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Status
                            </label>
                            <select
                                id="status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value as CampaignStatus)}
                                className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-black dark:text-white"
                            >
                                {statusOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </section>

                {/* Ruleset Configuration */}
                <section className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-black">
                    <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                        Ruleset Configuration
                    </h2>
                    <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
                        Edition: <span className="font-medium text-zinc-700 dark:text-zinc-300">{campaign?.editionCode.toUpperCase()}</span>
                        <span className="ml-2 text-xs">(Cannot be changed)</span>
                    </p>

                    <div className="space-y-6">
                        {/* Books */}
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Enabled Books
                            </label>
                            <div className="mt-2 space-y-2">
                                {books.map((book) => (
                                    <label key={book.id} className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={enabledBookIds.includes(book.id)}
                                            onChange={() => toggleBookId(book.id)}
                                            disabled={book.isCore} // Core book cannot be disabled
                                            className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                                        />
                                        <span className="text-sm text-zinc-700 dark:text-zinc-300">
                                            {book.title}
                                            {book.isCore && (
                                                <span className="ml-1 text-xs text-indigo-600 dark:text-indigo-400">(Core - Required)</span>
                                            )}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Creation Methods */}
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Allowed Creation Methods
                            </label>
                            <div className="mt-2 space-y-2">
                                {creationMethods.map((method) => (
                                    <label key={method.id} className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={enabledCreationMethodIds.includes(method.id)}
                                            onChange={() => toggleMethodId(method.id)}
                                            className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <span className="text-sm text-zinc-700 dark:text-zinc-300">
                                            {method.name}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Gameplay Level */}
                        <div>
                            <label htmlFor="gameplayLevel" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Gameplay Level
                            </label>
                            <select
                                id="gameplayLevel"
                                value={gameplayLevel}
                                onChange={(e) => setGameplayLevel(e.target.value as GameplayLevel)}
                                className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-black dark:text-white"
                            >
                                {gameplayLevelOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </section>

                {/* Visibility & Access */}
                <section className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-black">
                    <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                        Visibility & Access
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Campaign Visibility
                            </label>
                            <div className="mt-2 space-y-2">
                                {visibilityOptions.map((opt) => (
                                    <label key={opt.value} className="flex items-start gap-3">
                                        <input
                                            type="radio"
                                            name="visibility"
                                            value={opt.value}
                                            checked={visibility === opt.value}
                                            onChange={() => setVisibility(opt.value)}
                                            className="mt-1 border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <div>
                                            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                                {opt.label}
                                            </span>
                                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                                {opt.description}
                                            </p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="maxPlayers" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Max Players
                            </label>
                            <input
                                type="number"
                                id="maxPlayers"
                                value={maxPlayers || ""}
                                onChange={(e) => setMaxPlayers(e.target.value ? parseInt(e.target.value) : undefined)}
                                min={campaign?.playerIds.length || 1}
                                className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-black dark:text-white"
                                placeholder="Unlimited"
                            />
                            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                                Current players: {campaign?.playerIds.length || 0}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Danger Zone */}
                <section className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-900/10">
                    <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-red-700 dark:text-red-400">
                        <AlertTriangle className="h-5 w-5" />
                        Danger Zone
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-zinc-900 dark:text-zinc-50">Archive Campaign</p>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                    Archive this campaign. Players will no longer have access.
                                </p>
                            </div>
                            <button
                                onClick={handleArchive}
                                className="inline-flex items-center gap-2 rounded-md border border-yellow-300 bg-yellow-50 px-3 py-2 text-sm font-medium text-yellow-700 hover:bg-yellow-100 dark:border-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 dark:hover:bg-yellow-900/50"
                            >
                                <Archive className="h-4 w-4" />
                                Archive
                            </button>
                        </div>
                        <div className="flex items-center justify-between border-t border-red-200 pt-4 dark:border-red-900">
                            <div>
                                <p className="font-medium text-zinc-900 dark:text-zinc-50">Delete Campaign</p>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                    Permanently delete this campaign. This cannot be undone.
                                </p>
                            </div>
                            <button
                                onClick={handleDelete}
                                className="inline-flex items-center gap-2 rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
                            >
                                <Trash2 className="h-4 w-4" />
                                Delete
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
