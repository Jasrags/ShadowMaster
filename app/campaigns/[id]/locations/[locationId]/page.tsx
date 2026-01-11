"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Plus, Trash2, Calendar, History, Save } from "lucide-react";
import type { Location, Campaign } from "@/lib/types";
import { LocationTypeBadge } from "../components/LocationTypeBadge";
import { LocationVisibilityBadge } from "../components/LocationVisibilityBadge";

type Tab = "overview" | "details" | "connections" | "history";

export default function LocationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id as string;
  const locationId = params.locationId as string;

  const [location, setLocation] = useState<Location | null>(null);
  const [relatedLocations, setRelatedLocations] = useState<Location[]>([]);
  const [, setCampaign] = useState<Campaign | null>(null);
  const [userRole, setUserRole] = useState<"gm" | "player" | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const fetchLocation = useCallback(async () => {
    try {
      // Don't set loading to true on refetch to avoid flickering
      const response = await fetch(`/api/locations/${locationId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch location");
      }

      setLocation(data.location);
      setRelatedLocations(data.relatedLocations || []);
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

      setCampaign(data.campaign);
      setUserRole(data.userRole);
    } catch (err) {
      console.error("Failed to fetch campaign:", err);
    }
  }, [campaignId]);

  useEffect(() => {
    fetchLocation();
    fetchCampaign();
  }, [fetchLocation, fetchCampaign]);

  // ... (handleDelete implementation remains same) ...
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this location?")) {
      return;
    }

    try {
      const response = await fetch(`/api/locations/${locationId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete location");
      }

      router.push(`/campaigns/${campaignId}/locations`);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete location");
    }
  };

  const isGM = userRole === "gm";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (error || !location) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
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
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back link */}
      <button
        onClick={() => router.push(`/campaigns/${campaignId}/locations`)}
        className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Locations
      </button>

      {/* Header */}
      <div className="mb-6 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-black">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                {location.name}
              </h1>
              <LocationTypeBadge type={location.type} />
              {isGM && <LocationVisibilityBadge visibility={location.visibility} />}
            </div>
            {location.description && (
              <p className="text-zinc-600 dark:text-zinc-400">{location.description}</p>
            )}
          </div>
          {isGM && (
            <div className="flex gap-2">
              <SaveAsTemplateButton
                locationId={locationId}
                campaignId={campaignId}
                locationName={location.name}
              />
              <button
                onClick={() => router.push(`/campaigns/${campaignId}/locations/${locationId}/edit`)}
                className="px-3 py-1.5 rounded-md border border-zinc-300 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors text-sm"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="px-3 py-1.5 rounded-md border border-red-300 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/30 transition-colors text-sm"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-zinc-200 dark:border-zinc-800 overflow-x-auto">
        {(["overview", "details", "connections", "history"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors whitespace-nowrap ${
              activeTab === tab
                ? "border-b-2 border-indigo-500 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-black">
        {activeTab === "overview" && <OverviewTab location={location} isGM={isGM} />}
        {activeTab === "details" && <DetailsTab location={location} />}
        {activeTab === "connections" && (
          <ConnectionsTab
            location={location}
            campaignId={campaignId}
            locationId={locationId}
            isGM={isGM}
            onUpdate={fetchLocation}
            relatedLocations={relatedLocations}
          />
        )}
        {activeTab === "history" && (
          <HistoryTab
            location={location}
            locationId={locationId}
            isGM={isGM}
            onUpdate={fetchLocation}
          />
        )}
      </div>
    </div>
  );
}

function SaveAsTemplateButton({
  locationId,
  campaignId,
  locationName,
}: {
  locationId: string;
  campaignId: string;
  locationName: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(`Template: ${locationName}`);
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`/api/locations/${locationId}/create-template`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, isPublic }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create template");
      }

      setIsOpen(false);
      alert("Template created successfully!");
      router.push(`/campaigns/${campaignId}/locations/templates`);
    } catch (error) {
      alert((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="px-3 py-1.5 rounded-md border border-indigo-300 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-900/30 transition-colors text-sm flex items-center gap-1"
      >
        <Save className="h-3 w-3" />
        Save as Template
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl w-full max-w-md p-6 border border-zinc-200 dark:border-zinc-800">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-4">Save as Template</h3>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Template Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-black px-3 py-2 text-sm"
              required
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPublic"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="rounded border-zinc-300 dark:border-zinc-700 text-indigo-600"
            />
            <label htmlFor="isPublic" className="text-sm text-zinc-600 dark:text-zinc-400">
              Make Public (Visible to other GMs)
            </label>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 rounded-md text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 text-sm"
            >
              {loading ? "Saving..." : "Create Template"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Overview Tab Component
function OverviewTab({ location, isGM }: { location: Location; isGM: boolean }) {
  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
          Location Information
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {location.city && (
            <div>
              <span className="text-zinc-500 dark:text-zinc-400 text-sm">City</span>
              <p className="text-zinc-900 dark:text-zinc-50">{location.city}</p>
            </div>
          )}
          {location.district && (
            <div>
              <span className="text-zinc-500 dark:text-zinc-400 text-sm">District</span>
              <p className="text-zinc-900 dark:text-zinc-50">{location.district}</p>
            </div>
          )}
          {location.address && (
            <div className="col-span-2">
              <span className="text-zinc-500 dark:text-zinc-400 text-sm">Address</span>
              <p className="text-zinc-900 dark:text-zinc-50">{location.address}</p>
            </div>
          )}
          {location.country && (
            <div>
              <span className="text-zinc-500 dark:text-zinc-400 text-sm">Country</span>
              <p className="text-zinc-900 dark:text-zinc-50">{location.country}</p>
            </div>
          )}
        </div>
      </div>

      {/* Tags */}
      {location.tags && location.tags.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {location.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-sm text-zinc-600 dark:text-zinc-400"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Visit Statistics */}
      {location.visitCount !== undefined && location.visitCount > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
            Visit History
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                {location.visitCount}
              </p>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm">Total Visits</p>
            </div>
            {location.firstVisitedAt && (
              <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-3 text-center">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                  {new Date(location.firstVisitedAt).toLocaleDateString()}
                </p>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm">First Visit</p>
              </div>
            )}
            {location.lastVisitedAt && (
              <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-3 text-center">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                  {new Date(location.lastVisitedAt).toLocaleDateString()}
                </p>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm">Last Visit</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reference to Maps/Images if available */}
      {(location.imageUrl || location.mapUrl) && (
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-3">Media</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {location.imageUrl && (
              <div className="rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={location.imageUrl}
                  alt={location.name}
                  className="w-full h-auto object-cover"
                />
                <div className="p-2 bg-zinc-50 dark:bg-zinc-900 text-xs text-center text-zinc-500">
                  Image
                </div>
              </div>
            )}
            {location.mapUrl && (
              <div className="rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={location.mapUrl} alt="Map" className="w-full h-auto object-cover" />
                <div className="p-2 bg-zinc-50 dark:bg-zinc-900 text-xs text-center text-zinc-500">
                  Map
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* GM Notes */}
      {isGM && location.gmNotes && (
        <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6">
          <h3 className="text-lg font-semibold text-amber-600 dark:text-amber-400 mb-3">
            🔒 GM Notes
          </h3>
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/30 rounded-lg p-4">
            <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
              {location.gmNotes}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Details Tab Component
function DetailsTab({ location }: { location: Location }) {
  return (
    <div className="space-y-6">
      {/* Security */}
      {location.securityRating && (
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-3">Security</h3>
          <div className="flex items-center gap-2">
            <div className="flex">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-sm mr-0.5 ${
                    i < location.securityRating! ? "bg-red-500" : "bg-zinc-200 dark:bg-zinc-700"
                  }`}
                />
              ))}
            </div>
            <span className="text-zinc-500 dark:text-zinc-400 ml-2">
              Rating: {location.securityRating}/10
            </span>
          </div>
        </div>
      )}

      {/* Coordinates */}
      {location.coordinates && (
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
            Coordinates
          </h3>
          <p className="text-zinc-600 dark:text-zinc-300 font-mono">
            {location.coordinates.latitude.toFixed(4)}°, {location.coordinates.longitude.toFixed(4)}
            °
          </p>
        </div>
      )}

      {/* Matrix Host Details */}
      {location.matrixHost && (
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
            Matrix Host
          </h3>
          <div className="bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-700/30 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-zinc-500 dark:text-zinc-400">Host Type</span>
              <span className="text-cyan-600 dark:text-cyan-400 capitalize">
                {location.matrixHost.hostType}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500 dark:text-zinc-400">Host Rating</span>
              <span className="text-cyan-600 dark:text-cyan-400">
                {location.matrixHost.hostRating}
              </span>
            </div>
            {location.matrixHost.patrol && (
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Patrol IC</span>
                <span className="text-cyan-600 dark:text-cyan-400">
                  {location.matrixHost.patrol}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Astral Properties */}
      {location.astralProperties && (
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
            Astral Properties
          </h3>
          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700/30 rounded-lg p-4 space-y-2">
            {location.astralProperties.manaLevel && (
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Mana Level</span>
                <span className="text-purple-600 dark:text-purple-400 capitalize">
                  {location.astralProperties.manaLevel}
                </span>
              </div>
            )}
            {location.astralProperties.backgroundCount !== undefined && (
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Background Count</span>
                <span className="text-purple-600 dark:text-purple-400">
                  {location.astralProperties.backgroundCount}
                </span>
              </div>
            )}
            {location.astralProperties.barrierRating !== undefined && (
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Barrier Rating</span>
                <span className="text-purple-600 dark:text-purple-400">
                  {location.astralProperties.barrierRating}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* References */}
      {(location.customFields?.references as string) && (
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-3">References</h3>
          <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
            <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
              {location.customFields?.references as string}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Connections Tab Component
function ConnectionsTab({
  location,
  campaignId,
  locationId,
  isGM,
  onUpdate,
  relatedLocations = [],
}: {
  location: Location;
  campaignId: string;
  locationId: string;
  isGM: boolean;
  onUpdate: () => void;
  relatedLocations?: Location[];
}) {
  // ... (rest of local state) ...
  const [linking, setLinking] = useState(false);
  const [linkType, setLinkType] = useState<"npc" | "grunt" | "encounter">("npc");
  const [targetId, setTargetId] = useState("");
  const [isHidden, setIsHidden] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // ...

  // Helper to get location name/details
  const getLocationDetails = (id: string) => {
    return relatedLocations.find((l) => l.id === id);
  };

  // ... (rest of implementation) ...
  const handleLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetId.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/locations/${locationId}/link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: linkType, targetId: targetId.trim(), hidden: isHidden }),
      });

      if (!response.ok) throw new Error("Failed to link content");

      setTargetId("");
      setIsHidden(false);
      setLinking(false);
      onUpdate();
    } catch (error) {
      alert("Error linking content: " + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUnlink = async (
    type: "npc" | "grunt" | "encounter",
    id: string,
    hidden: boolean = false
  ) => {
    if (!confirm("Remove this link?")) return;

    try {
      const response = await fetch(`/api/locations/${locationId}/link`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, targetId: id, hidden }),
      });

      if (!response.ok) throw new Error("Failed to unlink content");
      onUpdate();
    } catch (error) {
      alert("Error unlinking content: " + (error as Error).message);
    }
  };

  const npcCount = location.npcIds?.length || 0;
  const gruntCount = location.gruntTeamIds?.length || 0;
  const encounterCount = location.encounterIds?.length || 0;
  const childCount = location.childLocationIds?.length || 0;
  const relatedCount = location.relatedLocationIds?.length || 0;

  // GM Only Counts
  const gmNpcIds = location.gmOnlyContent?.npcIds || [];
  const gmGruntIds = location.gmOnlyContent?.gruntTeamIds || [];
  const gmEncounterIds = location.gmOnlyContent?.encounterIds || [];
  const hasGmConnections =
    gmNpcIds.length > 0 || gmGruntIds.length > 0 || gmEncounterIds.length > 0;

  const hasConnections =
    npcCount > 0 ||
    gruntCount > 0 ||
    encounterCount > 0 ||
    childCount > 0 ||
    relatedCount > 0 ||
    hasGmConnections;

  return (
    <div className="space-y-6">
      {isGM && (
        <div className="flex justify-end">
          <button
            onClick={() => setLinking(!linking)}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Link Content
          </button>
        </div>
      )}

      {linking && (
        <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
          <form onSubmit={handleLink} className="space-y-3">
            <div className="flex gap-3 items-end">
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1">Type</label>
                <select
                  value={linkType}
                  onChange={(e) => setLinkType(e.target.value as "npc" | "grunt" | "encounter")}
                  className="rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-black px-2 py-1.5 text-sm"
                >
                  <option value="npc">NPC</option>
                  <option value="grunt">Grunt Team</option>
                  <option value="encounter">Encounter</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-zinc-500 mb-1">ID / Name</label>
                <input
                  type="text"
                  value={targetId}
                  onChange={(e) => setTargetId(e.target.value)}
                  placeholder="Enter ID..."
                  className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-black px-2 py-1.5 text-sm"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-3 py-1.5 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700 disabled:opacity-50"
              >
                {isSubmitting ? "Linking..." : "Link"}
              </button>
            </div>
            {isGM && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="hidden-link"
                  checked={isHidden}
                  onChange={(e) => setIsHidden(e.target.checked)}
                  className="rounded border-zinc-300 dark:border-zinc-700 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="hidden-link" className="text-sm text-zinc-600 dark:text-zinc-400">
                  GM Only (Hidden from players)
                </label>
              </div>
            )}
          </form>
        </div>
      )}

      {!hasConnections && !linking && (
        <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
          <p>No connections yet</p>
          {isGM && (
            <p className="text-sm mt-2">Link NPCs, grunts, and encounters to this location</p>
          )}
        </div>
      )}

      {/* Sub-locations */}
      {childCount > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
            Sub-locations ({childCount})
          </h3>
          <div className="space-y-2">
            {location.childLocationIds?.map((childId) => {
              const childLoc = getLocationDetails(childId);
              return (
                <Link
                  key={childId}
                  href={`/campaigns/${campaignId}/locations/${childId}`}
                  className="block bg-zinc-100 dark:bg-zinc-800 rounded-lg p-3 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-indigo-600 dark:text-indigo-400">📍</span>
                      <span className="font-medium text-zinc-900 dark:text-zinc-50">
                        {childLoc ? childLoc.name : `Location: ${childId}`}
                      </span>
                    </div>
                    {childLoc && (
                      <span className="text-xs text-zinc-500 dark:text-zinc-400 capitalize px-2 py-0.5 bg-zinc-200 dark:bg-zinc-700 rounded-full">
                        {childLoc.type}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Related Locations */}
      {relatedCount > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
            Related Locations ({relatedCount})
          </h3>
          <div className="space-y-2">
            {location.relatedLocationIds?.map((relatedId) => {
              const relatedLoc = getLocationDetails(relatedId);
              return (
                <Link
                  key={relatedId}
                  href={`/campaigns/${campaignId}/locations/${relatedId}`}
                  className="block bg-zinc-100 dark:bg-zinc-800 rounded-lg p-3 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-indigo-600 dark:text-indigo-400">🔗</span>
                      <span className="font-medium text-zinc-900 dark:text-zinc-50">
                        {relatedLoc ? relatedLoc.name : `Location: ${relatedId}`}
                      </span>
                    </div>
                    {relatedLoc && (
                      <span className="text-xs text-zinc-500 dark:text-zinc-400 capitalize px-2 py-0.5 bg-zinc-200 dark:bg-zinc-700 rounded-full">
                        {relatedLoc.type}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* NPCs */}
      {(npcCount > 0 || (isGM && gmNpcIds.length > 0)) && (
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-3">NPCs</h3>
          <div className="space-y-2">
            {location.npcIds?.map((npcId) => (
              <div
                key={npcId}
                className="flex items-center justify-between bg-zinc-100 dark:bg-zinc-800 rounded-lg p-3"
              >
                <span className="text-zinc-700 dark:text-zinc-300">👤 NPC: {npcId}</span>
                {isGM && (
                  <button
                    onClick={() => handleUnlink("npc", npcId)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Unlink"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            {isGM &&
              gmNpcIds.map((npcId) => (
                <div
                  key={npcId}
                  className="flex items-center justify-between bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/30 rounded-lg p-3"
                >
                  <span className="text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                    👤 NPC: {npcId}
                    <span className="text-xs bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 px-2 py-0.5 rounded-full">
                      Hidden
                    </span>
                  </span>
                  <button
                    onClick={() => handleUnlink("npc", npcId, true)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Unlink"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Grunt Teams */}
      {(gruntCount > 0 || (isGM && gmGruntIds.length > 0)) && (
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
            Grunt Teams
          </h3>
          <div className="space-y-2">
            {location.gruntTeamIds?.map((gruntId) => (
              <div
                key={gruntId}
                className="flex items-center justify-between bg-zinc-100 dark:bg-zinc-800 rounded-lg p-3"
              >
                <span className="text-zinc-700 dark:text-zinc-300">👥 Grunt Team: {gruntId}</span>
                {isGM && (
                  <button
                    onClick={() => handleUnlink("grunt", gruntId)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Unlink"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            {isGM &&
              gmGruntIds.map((gruntId) => (
                <div
                  key={gruntId}
                  className="flex items-center justify-between bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/30 rounded-lg p-3"
                >
                  <span className="text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                    👥 Grunt Team: {gruntId}
                    <span className="text-xs bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 px-2 py-0.5 rounded-full">
                      Hidden
                    </span>
                  </span>
                  <button
                    onClick={() => handleUnlink("grunt", gruntId, true)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Unlink"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Encounters */}
      {(encounterCount > 0 || (isGM && gmEncounterIds.length > 0)) && (
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-3">Encounters</h3>
          <div className="space-y-2">
            {location.encounterIds?.map((encounterId) => (
              <div
                key={encounterId}
                className="flex items-center justify-between bg-zinc-100 dark:bg-zinc-800 rounded-lg p-3"
              >
                <span className="text-zinc-700 dark:text-zinc-300">
                  ⚔️ Encounter: {encounterId}
                </span>
                {isGM && (
                  <button
                    onClick={() => handleUnlink("encounter", encounterId)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Unlink"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            {isGM &&
              gmEncounterIds.map((encounterId) => (
                <div
                  key={encounterId}
                  className="flex items-center justify-between bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/30 rounded-lg p-3"
                >
                  <span className="text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                    ⚔️ Encounter: {encounterId}
                    <span className="text-xs bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 px-2 py-0.5 rounded-full">
                      Hidden
                    </span>
                  </span>
                  <button
                    onClick={() => handleUnlink("encounter", encounterId, true)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Unlink"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

// History Tab Component
function HistoryTab({
  location,

  locationId,
  isGM,
  onUpdate,
}: {
  location: Location;

  locationId: string;
  isGM: boolean;
  onUpdate: () => void;
}) {
  const [recording, setRecording] = useState(false);
  const [characterId, setCharacterId] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRecordVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!characterId.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/locations/${locationId}/visit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          characterId: characterId.trim(),
          sessionId: sessionId.trim() || undefined,
        }),
      });

      if (!response.ok) throw new Error("Failed to record visit");

      setCharacterId("");
      setSessionId("");
      setRecording(false);
      onUpdate();
    } catch (error) {
      alert("Error recording visit: " + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Visit Statistics</h3>
        {isGM && (
          <button
            onClick={() => setRecording(!recording)}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700 transition-colors"
          >
            <History className="h-4 w-4" />
            Record Visit
          </button>
        )}
      </div>

      {recording && (
        <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
          <h4 className="text-sm font-medium mb-3">Record New Visit</h4>
          <form onSubmit={handleRecordVisit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1">Character ID</label>
              <input
                type="text"
                value={characterId}
                onChange={(e) => setCharacterId(e.target.value)}
                placeholder="Enter Character ID"
                className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-black px-2 py-1.5 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1">
                Session ID (Optional)
              </label>
              <input
                type="text"
                value={sessionId}
                onChange={(e) => setSessionId(e.target.value)}
                placeholder="Enter Session ID"
                className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-black px-2 py-1.5 text-sm"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setRecording(false)}
                className="px-3 py-1.5 rounded-md text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-3 py-1.5 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700 disabled:opacity-50"
              >
                {isSubmitting ? "Recording..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-4 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
            {location.visitCount || 0}
          </span>
          <span className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Total Visits</span>
        </div>

        <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-4 flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="h-4 w-4 text-zinc-400" />
            <span className="text-sm text-zinc-500 dark:text-zinc-400">First Visit</span>
          </div>
          <span className="font-medium text-zinc-900 dark:text-zinc-50">
            {location.firstVisitedAt
              ? new Date(location.firstVisitedAt).toLocaleDateString()
              : "Never"}
          </span>
        </div>

        <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-4 flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="h-4 w-4 text-zinc-400" />
            <span className="text-sm text-zinc-500 dark:text-zinc-400">Last Visit</span>
          </div>
          <span className="font-medium text-zinc-900 dark:text-zinc-50">
            {location.lastVisitedAt
              ? new Date(location.lastVisitedAt).toLocaleDateString()
              : "Never"}
          </span>
        </div>
      </div>

      {(location.visitedByCharacterIds?.length ?? 0) > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-3 text-zinc-700 dark:text-zinc-300">
            Visitors (Characters)
          </h4>
          <div className="flex flex-wrap gap-2">
            {location.visitedByCharacterIds?.map((id) => (
              <span
                key={id}
                className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm rounded-full"
              >
                {id}
              </span>
            ))}
          </div>
        </div>
      )}

      {(location.sessionIds?.length ?? 0) > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-3 text-zinc-700 dark:text-zinc-300">Sessions</h4>
          <div className="space-y-2">
            {location.sessionIds?.map((id) => (
              <div
                key={id}
                className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400"
              >
                <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full" />
                Session ID: {id}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
