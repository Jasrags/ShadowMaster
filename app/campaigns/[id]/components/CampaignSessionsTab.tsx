"use client";

import { useState, useEffect } from "react";
import type { Campaign, CampaignSession } from "@/lib/types";
import { Plus, Loader2, Calendar, Check, Clock, Users, Edit2, Trash2 } from "lucide-react";

interface CampaignSessionsTabProps {
    campaign: Campaign;
    isGM: boolean;
}

export default function CampaignSessionsTab({ campaign, isGM }: CampaignSessionsTabProps) {
    const [sessions, setSessions] = useState<CampaignSession[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showEditor, setShowEditor] = useState(false);
    const [editingSession, setEditingSession] = useState<CampaignSession | null>(null);

    // Form state
    const [title, setTitle] = useState("");
    const [scheduledAt, setScheduledAt] = useState("");
    const [durationMinutes, setDurationMinutes] = useState(180);
    const [notes, setNotes] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function fetchSessions() {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`/api/campaigns/${campaign.id}/sessions`);
                const data = await res.json();
                if (data.success) {
                    setSessions(data.sessions || []);
                } else {
                    setError(data.error || "Failed to load sessions");
                }
            } catch {
                setError("An error occurred while loading sessions");
            } finally {
                setLoading(false);
            }
        }

        fetchSessions();
    }, [campaign.id]);

    const resetForm = () => {
        setTitle("");
        setScheduledAt("");
        setDurationMinutes(180);
        setNotes("");
        setEditingSession(null);
        setShowEditor(false);
    };

    const handleEdit = (session: CampaignSession) => {
        setEditingSession(session);
        setTitle(session.title);
        setScheduledAt(session.scheduledAt.slice(0, 16)); // Format for datetime-local
        setDurationMinutes(session.durationMinutes || 180);
        setNotes(session.notes || "");
        setShowEditor(true);
    };

    const handleSave = async () => {
        if (!title.trim() || !scheduledAt) return;

        setSaving(true);
        try {
            if (editingSession) {
                const res = await fetch(`/api/campaigns/${campaign.id}/sessions/${editingSession.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ title, scheduledAt: new Date(scheduledAt).toISOString(), durationMinutes, notes }),
                });
                const data = await res.json();
                if (data.success) {
                    setSessions((prev) =>
                        prev.map((s) => (s.id === editingSession.id ? data.session : s))
                    );
                    resetForm();
                }
            } else {
                const res = await fetch(`/api/campaigns/${campaign.id}/sessions`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ title, scheduledAt: new Date(scheduledAt).toISOString(), durationMinutes, notes }),
                });
                const data = await res.json();
                if (data.success) {
                    setSessions((prev) => [...prev, data.session]);
                    resetForm();
                }
            }
        } catch {
            setError("Failed to save session");
        } finally {
            setSaving(false);
        }
    };

    const handleComplete = async (session: CampaignSession) => {
        try {
            const res = await fetch(`/api/campaigns/${campaign.id}/sessions/${session.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "completed" }),
            });
            const data = await res.json();
            if (data.success) {
                setSessions((prev) =>
                    prev.map((s) => (s.id === session.id ? data.session : s))
                );
            }
        } catch {
            setError("Failed to complete session");
        }
    };

    const handleDelete = async (sessionId: string) => {
        if (!confirm("Delete this session?")) return;

        try {
            const res = await fetch(`/api/campaigns/${campaign.id}/sessions/${sessionId}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (data.success) {
                setSessions((prev) => prev.filter((s) => s.id !== sessionId));
            }
        } catch {
            setError("Failed to delete session");
        }
    };

    const statusColors: Record<string, string> = {
        scheduled: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
        completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        cancelled: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
    };

    const sortedSessions = [...sessions].sort((a, b) =>
        new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-md bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
                    Sessions ({sessions.length})
                </h3>
                {isGM && !showEditor && (
                    <button
                        onClick={() => setShowEditor(true)}
                        className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                    >
                        <Plus className="h-4 w-4" />
                        Schedule Session
                    </button>
                )}
            </div>

            {/* Session Editor */}
            {showEditor && isGM && (
                <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Session title (e.g., 'Session 1: The Meet')"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-black dark:text-white"
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="mb-1 block text-sm text-zinc-600 dark:text-zinc-400">Date & Time</label>
                                <input
                                    type="datetime-local"
                                    value={scheduledAt}
                                    onChange={(e) => setScheduledAt(e.target.value)}
                                    className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-black dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm text-zinc-600 dark:text-zinc-400">Duration (minutes)</label>
                                <input
                                    type="number"
                                    value={durationMinutes}
                                    onChange={(e) => setDurationMinutes(parseInt(e.target.value) || 180)}
                                    className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-black dark:text-white"
                                />
                            </div>
                        </div>
                        <textarea
                            placeholder="Session notes (optional)"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-black dark:text-white"
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={resetForm}
                                className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving || !title.trim() || !scheduledAt}
                                className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                                {editingSession ? "Update" : "Save"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Sessions List */}
            {sortedSessions.length === 0 ? (
                <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-12 text-center dark:border-zinc-700 dark:bg-black">
                    <Calendar className="mx-auto h-12 w-12 text-zinc-300 dark:text-zinc-600" />
                    <h3 className="mt-4 text-lg font-medium text-zinc-900 dark:text-zinc-50">
                        No sessions scheduled
                    </h3>
                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                        {isGM ? "Schedule your first session." : "The GM hasn't scheduled any sessions yet."}
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {sortedSessions.map((session) => (
                        <div
                            key={session.id}
                            className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-black"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-medium text-zinc-900 dark:text-zinc-50">
                                            {session.title}
                                        </h4>
                                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[session.status]}`}>
                                            {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                                        </span>
                                    </div>
                                    <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                                        <span className="inline-flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            {new Date(session.scheduledAt).toLocaleDateString()} at{" "}
                                            {new Date(session.scheduledAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                        </span>
                                        <span className="inline-flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            {Math.floor((session.durationMinutes || 180) / 60)}h {(session.durationMinutes || 180) % 60}m
                                        </span>
                                        <span className="inline-flex items-center gap-1">
                                            <Users className="h-4 w-4" />
                                            {session.attendeeIds?.length || 0} attendees
                                        </span>
                                    </div>
                                    {session.notes && (
                                        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-500">
                                            {session.notes}
                                        </p>
                                    )}
                                </div>
                                {isGM && (
                                    <div className="flex gap-1">
                                        {session.status === "scheduled" && (
                                            <button
                                                onClick={() => handleComplete(session)}
                                                className="rounded p-1 text-zinc-400 hover:bg-green-100 hover:text-green-600 dark:hover:bg-green-900/30"
                                                title="Mark as completed"
                                            >
                                                <Check className="h-4 w-4" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleEdit(session)}
                                            className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800"
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(session.id)}
                                            className="rounded p-1 text-zinc-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
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
