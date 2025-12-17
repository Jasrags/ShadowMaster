"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Plus, Search, Copy, Globe, Lock, Filter } from "lucide-react";
import type { LocationTemplate, Campaign, LocationType } from "@/lib/types";
import { LocationTypeBadge } from "../components/LocationTypeBadge";

export default function LocationTemplatesPage() {
    const params = useParams();
    const router = useRouter();
    const campaignId = params.id as string;

    const [templates, setTemplates] = useState<LocationTemplate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState<LocationType | "">("");
    const [viewMode, setViewMode] = useState<"all" | "public" | "private">("all");

    const fetchTemplates = useCallback(async () => {
        setLoading(true);
        try {
            let url = `/api/location-templates?`;
            if (search) url += `search=${encodeURIComponent(search)}&`;
            if (typeFilter) url += `type=${encodeURIComponent(typeFilter)}&`;
            if (viewMode === "public") url += `public=true&`;
            // Note: private filtering handled on client or needs API support, assumes API returns user's + public

            const response = await fetch(url);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to fetch templates");
            }

            let filteredTemplates = data.templates;
            if (viewMode === "private") {
                // Client-side filter for now as API returns (user's + public)
                // We'd need to know current user ID to filter strictly "mine and private" vs "mine and public"
                // For now let's just show all that API returns, which is safe.
                // TODO: Refine this if needed.
            }

            setTemplates(filteredTemplates);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    }, [search, typeFilter, viewMode]);

    useEffect(() => {
        // Debounce search
        const timer = setTimeout(() => {
            fetchTemplates();
        }, 300);
        return () => clearTimeout(timer);
    }, [fetchTemplates]);

    const handleUseTemplate = (templateId: string) => {
        // Navigate to create location page with template ID
        router.push(`/campaigns/${campaignId}/locations/new?templateId=${templateId}`);
    };

    return (
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Location Templates</h1>
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                        Manage and use reusable location blueprints
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link
                        href={`/campaigns/${campaignId}/locations`}
                        className="inline-flex items-center gap-2 rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-black dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Locations
                    </Link>
                </div>
            </div>

            {/* Filters */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-black">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                    <input
                        type="text"
                        placeholder="Search templates..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-md border border-zinc-300 bg-white py-2 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-400"
                    />
                </div>
                <div className="flex gap-3">
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value as LocationType)}
                        className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                    >
                        <option value="">All Types</option>
                        <option value="physical">Physical</option>
                        <option value="matrix-host">Matrix Host</option>
                        <option value="astral">Astral</option>
                        <option value="safe-house">Safe House</option>
                        <option value="meeting-place">Meeting Place</option>
                        <option value="corporate">Corporate</option>
                        <option value="gang-territory">Gang Territory</option>
                        <option value="residential">Residential</option>
                        <option value="commercial">Commercial</option>
                        <option value="industrial">Industrial</option>
                        <option value="underground">Underground</option>
                        <option value="other">Other</option>
                    </select>

                    <div className="flex rounded-md shadow-sm">
                        <button
                            onClick={() => setViewMode("all")}
                            className={`px-3 py-2 text-sm font-medium rounded-l-md border ${viewMode === "all"
                                ? "bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-900/30 dark:border-indigo-800 dark:text-indigo-400"
                                : "bg-white border-zinc-300 text-zinc-700 hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-300"
                                }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setViewMode("public")}
                            className={`px-3 py-2 text-sm font-medium rounded-r-md border-t border-b border-r ${viewMode === "public"
                                ? "bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-900/30 dark:border-indigo-800 dark:text-indigo-400"
                                : "bg-white border-zinc-300 text-zinc-700 hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-300"
                                }`}
                        >
                            Public Only
                        </button>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-24">
                    <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
                </div>
            ) : error ? (
                <div className="rounded-lg bg-red-50 p-4 text-center text-red-700 dark:bg-red-900/30 dark:text-red-400">
                    {error}
                </div>
            ) : templates.length === 0 ? (
                <div className="rounded-lg border border-dashed border-zinc-300 py-12 text-center dark:border-zinc-700">
                    <Filter className="mx-auto h-12 w-12 text-zinc-400 mb-3" />
                    <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">No templates found</h3>
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                        Try adjusting your filters or search query.
                    </p>
                    <p className="mt-4 text-sm text-zinc-500">
                        You can create templates from existing locations using the "Save as Template" button on the location details page.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {templates.map((template) => (
                        <div
                            key={template.id}
                            className="bg-white dark:bg-black rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:shadow-lg transition-shadow"
                        >
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-3">
                                    <LocationTypeBadge type={template.type} />
                                    {template.isPublic ? (
                                        <span className="text-xs flex items-center gap-1 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-full">
                                            <Globe className="h-3 w-3" /> Public
                                        </span>
                                    ) : (
                                        <span className="text-xs flex items-center gap-1 text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-full">
                                            <Lock className="h-3 w-3" /> Private
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-1">{template.name}</h3>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-4 h-10">
                                    {template.description || "No description provided."}
                                </p>

                                {template.tags && template.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mb-4">
                                        {template.tags.slice(0, 3).map(tag => (
                                            <span key={tag} className="text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2 py-0.5 rounded">
                                                {tag}
                                            </span>
                                        ))}
                                        {template.tags.length > 3 && (
                                            <span className="text-xs text-zinc-500">+ {template.tags.length - 3}</span>
                                        )}
                                    </div>
                                )}

                                <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 border-t border-zinc-100 dark:border-zinc-800 pt-3">
                                    <span>Used {template.usageCount} times</span>
                                    <span>{new Date(template.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className="bg-zinc-50 dark:bg-zinc-900 px-5 py-3 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
                                <button
                                    onClick={() => handleUseTemplate(template.id)}
                                    className="flex-1 inline-flex justify-center items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
                                >
                                    <Copy className="h-4 w-4" />
                                    Use Template
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
