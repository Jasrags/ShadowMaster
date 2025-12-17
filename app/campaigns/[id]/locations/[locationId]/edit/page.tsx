"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Loader2, Save } from "lucide-react";
import type {
    LocationType,
    LocationVisibility,
    Location,
    UpdateLocationRequest,
    Campaign,
} from "@/lib/types";

const LOCATION_TYPES: { value: LocationType; label: string }[] = [
    { value: "physical", label: "Physical" },
    { value: "matrix-host", label: "Matrix Host" },
    { value: "astral", label: "Astral" },
    { value: "safe-house", label: "Safe House" },
    { value: "meeting-place", label: "Meeting Place" },
    { value: "corporate", label: "Corporate" },
    { value: "gang-territory", label: "Gang Territory" },
    { value: "residential", label: "Residential" },
    { value: "commercial", label: "Commercial" },
    { value: "industrial", label: "Industrial" },
    { value: "underground", label: "Underground" },
    { value: "other", label: "Other" },
];

const VISIBILITY_OPTIONS: { value: LocationVisibility; label: string; description: string }[] = [
    { value: "gm-only", label: "GM Only", description: "Only visible to the GM" },
    { value: "players", label: "Players", description: "Visible to all campaign members" },
    { value: "public", label: "Public", description: "Visible to everyone" },
];

export default function EditLocationPage() {
    const params = useParams();
    const router = useRouter();
    const campaignId = params.id as string;
    const locationId = params.locationId as string;

    const [location, setLocation] = useState<Location | null>(null);
    const [, setCampaign] = useState<Campaign | null>(null);
    const [parentLocations, setParentLocations] = useState<Location[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState<UpdateLocationRequest>({});
    const [tagInput, setTagInput] = useState("");

    const fetchLocation = useCallback(async () => {
        try {
            const response = await fetch(`/api/locations/${locationId}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to fetch location");
            }

            setLocation(data.location);
            // Initialize form with existing data
            setFormData({
                name: data.location.name,
                type: data.location.type,
                description: data.location.description || "",
                visibility: data.location.visibility,
                address: data.location.address || "",
                district: data.location.district || "",
                city: data.location.city || "",
                country: data.location.country || "",
                coordinates: data.location.coordinates,
                securityRating: data.location.securityRating,
                matrixHost: data.location.matrixHost,
                astralProperties: data.location.astralProperties,
                imageUrl: data.location.imageUrl || "",
                mapUrl: data.location.mapUrl || "",
                tags: data.location.tags || [],
                gmNotes: data.location.gmNotes || "",
                customFields: data.location.customFields || {},
                parentLocationId: data.location.parentLocationId,
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    }, [locationId]);

    const fetchCampaign = useCallback(async () => {
        try {
            const response = await fetch(`/api/campaigns/${campaignId}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to fetch campaign");
            }

            if (data.userRole !== "gm") {
                router.push(`/campaigns/${campaignId}/locations/${locationId}`);
                return;
            }

            setCampaign(data.campaign);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        }
    }, [campaignId, locationId, router]);

    const fetchLocations = useCallback(async () => {
        try {
            const response = await fetch(`/api/campaigns/${campaignId}/locations`);
            const data = await response.json();

            if (response.ok) {
                // Filter out the current location so it can't be its own parent
                const locations = (data.locations || []).filter(
                    (loc: Location) => loc.id !== locationId
                );
                setParentLocations(locations);
            }
        } catch {
            // Ignore - parent locations are optional
        }
    }, [campaignId, locationId]);

    useEffect(() => {
        fetchLocation();
        fetchCampaign();
        fetchLocations();
    }, [fetchLocation, fetchCampaign, fetchLocations]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            const response = await fetch(`/api/locations/${locationId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to update location");
            }

            router.push(`/campaigns/${campaignId}/locations/${locationId}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setSaving(false);
        }
    };

    const handleAddTag = () => {
        const tag = tagInput.trim().toLowerCase();
        if (tag && !formData.tags?.includes(tag)) {
            setFormData({
                ...formData,
                tags: [...(formData.tags || []), tag],
            });
            setTagInput("");
        }
    };

    const handleRemoveTag = (tag: string) => {
        setFormData({
            ...formData,
            tags: formData.tags?.filter((t) => t !== tag),
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
            </div>
        );
    }

    if (!location) {
        return (
            <div className="mx-auto max-w-2xl px-4 py-8">
                <div className="rounded-lg bg-red-50 p-6 text-center dark:bg-red-900/30">
                    <p className="text-red-700 dark:text-red-400">{error || "Location not found"}</p>
                    <Link
                        href={`/campaigns/${campaignId}/locations`}
                        className="mt-4 inline-block text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                    >
                        ← Back to Locations
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Back link */}
            <button
                onClick={() => router.push(`/campaigns/${campaignId}/locations/${locationId}`)}
                className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Location
            </button>

            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">Edit Location</h1>

            {error && (
                <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-black">
                    <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Basic Information</h2>

                    {/* Name */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                            Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.name || ""}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            maxLength={200}
                            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                            placeholder="Enter location name"
                        />
                    </div>

                    {/* Type */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                            Type <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.type || "physical"}
                            onChange={(e) =>
                                setFormData({ ...formData, type: e.target.value as LocationType })
                            }
                            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                        >
                            {LOCATION_TYPES.map((t) => (
                                <option key={t.value} value={t.value}>
                                    {t.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Visibility */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                            Visibility <span className="text-red-500">*</span>
                        </label>
                        <div className="space-y-2">
                            {VISIBILITY_OPTIONS.map((v) => (
                                <label
                                    key={v.value}
                                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${formData.visibility === v.value
                                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                                        : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="visibility"
                                        value={v.value}
                                        checked={formData.visibility === v.value}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                visibility: e.target.value as LocationVisibility,
                                            })
                                        }
                                        className="mt-1"
                                    />
                                    <div>
                                        <span className="text-zinc-900 dark:text-zinc-50 font-medium">{v.label}</span>
                                        <p className="text-zinc-500 dark:text-zinc-400 text-sm">{v.description}</p>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                            Description
                        </label>
                        <textarea
                            value={formData.description || ""}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={4}
                            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 resize-none"
                            placeholder="Describe this location..."
                        />
                    </div>
                </div>

                {/* Physical Properties */}
                <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-black">
                    <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Physical Properties</h2>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                City
                            </label>
                            <input
                                type="text"
                                value={formData.city || ""}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                                placeholder="Seattle"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                District
                            </label>
                            <input
                                type="text"
                                value={formData.district || ""}
                                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                                placeholder="Downtown"
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                            Address
                        </label>
                        <input
                            type="text"
                            value={formData.address || ""}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                            placeholder="123 Corporate Way"
                        />
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                            Country
                        </label>
                        <input
                            type="text"
                            value={formData.country || ""}
                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                            placeholder="UCAS"
                        />
                    </div>

                    {/* Coordinates */}
                    <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                Latitude
                            </label>
                            <input
                                type="number"
                                step="any"
                                value={formData.coordinates?.latitude || ""}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        coordinates: {
                                            ...formData.coordinates,
                                            latitude: parseFloat(e.target.value),
                                            longitude: formData.coordinates?.longitude || 0,
                                        },
                                    })
                                }
                                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                                placeholder="47.6062"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                Longitude
                            </label>
                            <input
                                type="number"
                                step="any"
                                value={formData.coordinates?.longitude || ""}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        coordinates: {
                                            ...formData.coordinates,
                                            longitude: parseFloat(e.target.value),
                                            latitude: formData.coordinates?.latitude || 0,
                                        },
                                    })
                                }
                                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                                placeholder="-122.3321"
                            />
                        </div>
                    </div>

                    {/* Parent Location */}
                    {parentLocations.length > 0 && (
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                Parent Location
                            </label>
                            <select
                                value={formData.parentLocationId || ""}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        parentLocationId: e.target.value || undefined,
                                    })
                                }
                                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                            >
                                <option value="">None (Top Level)</option>
                                {parentLocations.map((loc) => (
                                    <option key={loc.id} value={loc.id}>
                                        {loc.name}
                                    </option>
                                ))}
                            </select>
                            <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-1">
                                Make this a sub-location of another location
                            </p>
                        </div>
                    )}

                </div>

                {/* Game Mechanics */}
                <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-black">
                    <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Game Mechanics</h2>

                    {/* Security Rating */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                            Security Rating (1-10)
                        </label>
                        <input
                            type="number"
                            min={1}
                            max={10}
                            value={formData.securityRating || ""}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    securityRating: e.target.value ? parseInt(e.target.value) : undefined,
                                })
                            }
                            className="w-32 rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                            placeholder="1-10"
                        />
                    </div>

                    {/* Matrix Host */}
                    <div className="mb-6 border-t border-zinc-100 dark:border-zinc-800 pt-4">
                        <h3 className="text-md font-medium text-zinc-900 dark:text-zinc-50 mb-3">Matrix Host</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                    Host Rating
                                </label>
                                <input
                                    type="number"
                                    min={1}
                                    value={formData.matrixHost?.hostRating || ""}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            matrixHost: {
                                                hostType: "public",
                                                ...formData.matrixHost,
                                                hostRating: parseInt(e.target.value),
                                            },
                                        })
                                    }
                                    className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                                    placeholder="Rating"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                    Host Type
                                </label>
                                <select
                                    value={formData.matrixHost?.hostType || "public"}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            matrixHost: {
                                                hostRating: 0,
                                                ...formData.matrixHost,
                                                hostType: e.target.value as any,
                                            },
                                        })
                                    }
                                    className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                                >
                                    <option value="public">Public</option>
                                    <option value="private">Private</option>
                                    <option value="restricted">Restricted</option>
                                    <option value="public-grid">Public Grid</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Astral Properties */}
                    <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4">
                        <h3 className="text-md font-medium text-zinc-900 dark:text-zinc-50 mb-3">Astral Properties</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                    Background Count
                                </label>
                                <input
                                    type="number"
                                    value={formData.astralProperties?.backgroundCount || ""}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            astralProperties: {
                                                ...formData.astralProperties,
                                                backgroundCount: parseInt(e.target.value),
                                            },
                                        })
                                    }
                                    className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                                    placeholder="0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                    Barrier Rating
                                </label>
                                <input
                                    type="number"
                                    value={formData.astralProperties?.barrierRating || ""}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            astralProperties: {
                                                ...formData.astralProperties,
                                                barrierRating: parseInt(e.target.value),
                                            },
                                        })
                                    }
                                    className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                                    placeholder="0"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Media */}
                <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-black">
                    <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Media</h2>
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                            Image URL
                        </label>
                        <input
                            type="url"
                            value={formData.imageUrl || ""}
                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                            placeholder="https://example.com/location-image.jpg"
                        />
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                            Map URL
                        </label>
                        <input
                            type="url"
                            value={formData.mapUrl || ""}
                            onChange={(e) => setFormData({ ...formData, mapUrl: e.target.value })}
                            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                            placeholder="https://example.com/location-map.jpg"
                        />
                    </div>
                </div>

                {/* References */}
                <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-black">
                    <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">References</h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                        Link to sourcebooks or external resources.
                    </p>
                    <textarea
                        value={formData.customFields?.references as string || ""}
                        onChange={(e) => setFormData({
                            ...formData,
                            customFields: { ...formData.customFields, references: e.target.value }
                        })}
                        rows={2}
                        className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 resize-none"
                        placeholder="e.g. SR5 Core Rulebook, p. 123"
                    />
                </div>

                {/* Tags */}
                <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-black">
                    <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Tags</h2>

                    <div className="flex gap-2 mb-3">
                        <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleAddTag();
                                }
                            }}
                            className="flex-1 rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                            placeholder="Add a tag..."
                        />
                        <button
                            type="button"
                            onClick={handleAddTag}
                            className="inline-flex items-center gap-2 rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                        >
                            <Plus className="h-4 w-4" />
                            Add
                        </button>
                    </div>

                    {formData.tags && formData.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {formData.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="inline-flex items-center gap-1 px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-sm text-zinc-700 dark:text-zinc-300"
                                >
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTag(tag)}
                                        className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* GM Notes */}
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 dark:border-amber-700/30 dark:bg-amber-900/20">
                    <h2 className="text-lg font-semibold text-amber-700 dark:text-amber-400 mb-4">🔒 GM Notes</h2>
                    <p className="text-amber-600 dark:text-amber-500 text-sm mb-3">
                        These notes are only visible to you
                    </p>
                    <textarea
                        value={formData.gmNotes || ""}
                        onChange={(e) => setFormData({ ...formData, gmNotes: e.target.value })}
                        rows={4}
                        className="w-full rounded-md border border-amber-300 bg-white px-3 py-2 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:border-amber-700/50 dark:bg-zinc-900 dark:text-zinc-100 resize-none"
                        placeholder="Add private notes about this location..."
                    />
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={saving || !formData.name}
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-3 text-sm font-medium text-white hover:bg-indigo-700 disabled:bg-zinc-300 disabled:cursor-not-allowed dark:disabled:bg-zinc-700 transition-colors"
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
                    <Link
                        href={`/campaigns/${campaignId}/locations/${locationId}`}
                        className="inline-flex items-center justify-center rounded-md border border-zinc-300 bg-white px-6 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition-colors"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}
