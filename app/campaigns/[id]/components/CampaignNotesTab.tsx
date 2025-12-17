"use client";

import { useState, useEffect } from "react";
import type { Campaign, CampaignNote } from "@/lib/types";
import { Plus, Loader2, FileText, Eye, EyeOff, Trash2, Edit2, X, Check } from "lucide-react";

interface CampaignNotesTabProps {
    campaign: Campaign;
    isGM: boolean;
}

export default function CampaignNotesTab({ campaign, isGM }: CampaignNotesTabProps) {
    const [notes, setNotes] = useState<CampaignNote[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showEditor, setShowEditor] = useState(false);
    const [editingNote, setEditingNote] = useState<CampaignNote | null>(null);

    // Form state
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState<CampaignNote["category"]>("general");
    const [playerVisible, setPlayerVisible] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function fetchNotes() {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`/api/campaigns/${campaign.id}/notes`);
                const data = await res.json();
                if (data.success) {
                    setNotes(data.notes || []);
                } else {
                    setError(data.error || "Failed to load notes");
                }
            } catch {
                setError("An error occurred while loading notes");
            } finally {
                setLoading(false);
            }
        }

        fetchNotes();
    }, [campaign.id]);

    const resetForm = () => {
        setTitle("");
        setContent("");
        setCategory("general");
        setPlayerVisible(false);
        setEditingNote(null);
        setShowEditor(false);
    };

    const handleEdit = (note: CampaignNote) => {
        setEditingNote(note);
        setTitle(note.title);
        setContent(note.content);
        setCategory(note.category || "general");
        setPlayerVisible(note.playerVisible);
        setShowEditor(true);
    };

    const handleSave = async () => {
        if (!title.trim() || !content.trim()) return;

        setSaving(true);
        try {
            if (editingNote) {
                // Update existing note
                const res = await fetch(`/api/campaigns/${campaign.id}/notes/${editingNote.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ title, content, category, playerVisible }),
                });
                const data = await res.json();
                if (data.success) {
                    setNotes((prev) =>
                        prev.map((n) => (n.id === editingNote.id ? data.note : n))
                    );
                    resetForm();
                }
            } else {
                // Create new note
                const res = await fetch(`/api/campaigns/${campaign.id}/notes`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ title, content, category, playerVisible }),
                });
                const data = await res.json();
                if (data.success) {
                    setNotes((prev) => [...prev, data.note]);
                    resetForm();
                }
            }
        } catch {
            setError("Failed to save note");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (noteId: string) => {
        if (!confirm("Delete this note?")) return;

        try {
            const res = await fetch(`/api/campaigns/${campaign.id}/notes/${noteId}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (data.success) {
                setNotes((prev) => prev.filter((n) => n.id !== noteId));
            }
        } catch {
            setError("Failed to delete note");
        }
    };

    const categoryLabels: Record<string, string> = {
        general: "General",
        session: "Session",
        npc: "NPC",
        location: "Location",
        plot: "Plot",
        rules: "Rules",
    };

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
                    Campaign Notes ({notes.length})
                </h3>
                {isGM && !showEditor && (
                    <button
                        onClick={() => setShowEditor(true)}
                        className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                    >
                        <Plus className="h-4 w-4" />
                        Add Note
                    </button>
                )}
            </div>

            {/* Note Editor */}
            {showEditor && isGM && (
                <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Note title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-black dark:text-white"
                        />
                        <textarea
                            placeholder="Note content (markdown supported)"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={6}
                            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-black dark:text-white"
                        />
                        <div className="flex flex-wrap items-center gap-4">
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value as CampaignNote["category"])}
                                className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-black dark:text-white"
                            >
                                {Object.entries(categoryLabels).map(([value, label]) => (
                                    <option key={value} value={value}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                            <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                                <input
                                    type="checkbox"
                                    checked={playerVisible}
                                    onChange={(e) => setPlayerVisible(e.target.checked)}
                                    className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                Visible to players
                            </label>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={resetForm}
                                className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                            >
                                <X className="h-4 w-4" />
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving || !title.trim() || !content.trim()}
                                className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                                {editingNote ? "Update" : "Save"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Notes List */}
            {notes.length === 0 ? (
                <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-12 text-center dark:border-zinc-700 dark:bg-black">
                    <FileText className="mx-auto h-12 w-12 text-zinc-300 dark:text-zinc-600" />
                    <h3 className="mt-4 text-lg font-medium text-zinc-900 dark:text-zinc-50">
                        No notes yet
                    </h3>
                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                        {isGM ? "Add notes to track campaign information." : "The GM hasn't shared any notes yet."}
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {notes.map((note) => (
                        <div
                            key={note.id}
                            className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-black"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-medium text-zinc-900 dark:text-zinc-50">
                                            {note.title}
                                        </h4>
                                        {note.category && (
                                            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                                                {categoryLabels[note.category] || note.category}
                                            </span>
                                        )}
                                        {isGM && (
                                            <span className="text-zinc-400" title={note.playerVisible ? "Visible to players" : "GM only"}>
                                                {note.playerVisible ? (
                                                    <Eye className="h-4 w-4" />
                                                ) : (
                                                    <EyeOff className="h-4 w-4" />
                                                )}
                                            </span>
                                        )}
                                    </div>
                                    <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-600 dark:text-zinc-400">
                                        {note.content}
                                    </p>
                                    <p className="mt-2 text-xs text-zinc-400">
                                        {new Date(note.updatedAt).toLocaleDateString()}
                                    </p>
                                </div>
                                {isGM && (
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => handleEdit(note)}
                                            className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800"
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(note.id)}
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
