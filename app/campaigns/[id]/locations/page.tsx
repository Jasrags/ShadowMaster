"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Loader2,
  Download,
  Upload,
  Layout,
  Search,
  Filter,
  LayoutGrid,
  List,
  FolderTree,
  Map as MapIcon,
} from "lucide-react";
import { LocationCard } from "./components/LocationCard";
import { LocationTree } from "./components/LocationTree";
import { LocationImportDialog } from "./components/LocationImportDialog";
import type { Location, LocationType, Campaign } from "@/lib/types";

const LOCATION_TYPES: { value: LocationType | "all"; label: string }[] = [
  { value: "all", label: "All Types" },
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

export default function LocationsPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id as string;

  const [locations, setLocations] = useState<Location[]>([]);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [userRole, setUserRole] = useState<"gm" | "player" | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [typeFilter, setTypeFilter] = useState<LocationType | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showTopLevelOnly, setShowTopLevelOnly] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list" | "tree">("grid");

  // Import State
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [importLoading, setImportLoading] = useState(false);

  const fetchLocations = useCallback(async () => {
    try {
      setLoading(true);

      // Build query params
      const queryParams = new URLSearchParams();
      if (typeFilter !== "all") {
        queryParams.set("type", typeFilter);
      }
      if (searchQuery) {
        queryParams.set("search", searchQuery);
      }

      const queryString = queryParams.toString();
      const url = `/api/campaigns/${campaignId}/locations${queryString ? `?${queryString}` : ""}`;

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch locations");
      }

      let fetchedLocations = data.locations || [];

      // Client-side filter for top-level only
      if (showTopLevelOnly) {
        fetchedLocations = fetchedLocations.filter((l: Location) => !l.parentLocationId);
      }

      setLocations(fetchedLocations);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [campaignId, typeFilter, searchQuery, showTopLevelOnly]);

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
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  }, [campaignId]);

  // Export Handler
  const handleExport = async () => {
    try {
      const response = await fetch(`/api/campaigns/${campaignId}/locations/export`);
      if (!response.ok) throw new Error("Export failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `campaign-${campaignId}-locations.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Export error:", err);
      alert("Failed to export locations");
    }
  };

  // Import Handler
  const handleImport = async (jsonData: string) => {
    setImportLoading(true);
    try {
      // Validate JSON structure loosely
      const data = JSON.parse(jsonData);
      // Wrap in object if it's just an array, or expect { locations: [] }
      // Our API expects { locations: Location[] }
      const payload = Array.isArray(data) ? { locations: data } : data;

      const response = await fetch(`/api/campaigns/${campaignId}/locations/import`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Import failed");
      }

      setIsImportDialogOpen(false);
      fetchLocations(); // Refresh list
      alert("Locations imported successfully!");
    } catch (err) {
      console.error("Import error:", err);
      alert(err instanceof Error ? err.message : "Failed to import locations");
    } finally {
      setImportLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaign();
  }, [fetchCampaign]);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  const handleDelete = async (locationId: string) => {
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

      // Refresh locations
      fetchLocations();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete location");
    }
  };

  const handleEdit = (locationId: string) => {
    router.push(`/campaigns/${campaignId}/locations/${locationId}/edit`);
  };

  const isGM = userRole === "gm";

  if (loading && locations.length === 0) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="rounded-lg bg-red-50 p-6 text-center dark:bg-red-900/30">
          <p className="text-red-700 dark:text-red-400">{error}</p>
          <button
            onClick={() => router.push(`/campaigns/${campaignId}`)}
            className="mt-4 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Back to Campaign
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back Button */}
      <button
        onClick={() => router.push(`/campaigns/${campaignId}`)}
        className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Campaign
      </button>

      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Locations</h1>
          {campaign && (
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{campaign.title}</p>
          )}
        </div>
        {isGM && (
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
              title="Export Locations"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
            <button
              onClick={() => setIsImportDialogOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
              title="Import Locations"
            >
              <Upload className="h-4 w-4" />
              Import
            </button>
            <Link
              href={`/campaigns/${campaignId}/locations/templates`}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
            >
              <Layout className="h-4 w-4" />
              Templates
            </Link>
            <Link
              href={`/campaigns/${campaignId}/locations/create`}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
            >
              <Plus className="h-4 w-4" />
              Create Location
            </Link>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-10 pr-4 text-sm text-zinc-900 placeholder:text-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-400"
          />
        </div>

        <div className="flex gap-2">
          {/* Type Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as LocationType | "all")}
              className="appear-none rounded-lg border border-zinc-200 bg-white py-2 pl-10 pr-8 text-sm text-zinc-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
            >
              {LOCATION_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Top-level only toggle */}
          <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 cursor-pointer">
            <input
              type="checkbox"
              checked={showTopLevelOnly}
              onChange={(e) => setShowTopLevelOnly(e.target.checked)}
              className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900"
            />
            <span>Top-level only</span>
          </label>

          {/* View Mode Toggle */}
          <div className="flex rounded-lg border border-zinc-200 bg-white p-1 dark:border-zinc-700 dark:bg-zinc-800">
            <button
              onClick={() => setViewMode("grid")}
              className={`rounded p-1.5 ${
                viewMode === "grid"
                  ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`rounded p-1.5 ${
                viewMode === "list"
                  ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
              title="List View"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("tree")}
              className={`rounded p-1.5 ${
                viewMode === "tree"
                  ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
              title="Tree View"
            >
              <FolderTree className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Location Grid/List/Tree */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
        </div>
      ) : locations.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-300 py-12 text-center dark:border-zinc-700">
          <MapIcon className="mx-auto h-12 w-12 text-zinc-400 opacity-50" />
          <h3 className="mt-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            No locations found
          </h3>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {searchQuery || typeFilter !== "all"
              ? "Try adjusting your filters"
              : "Get started by creating a new location"}
          </p>
          {isGM && (
            <div className="mt-6">
              <Link
                href={`/campaigns/${campaignId}/locations/create`}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
              >
                <Plus className="h-4 w-4" />
                Create Location
              </Link>
            </div>
          )}
        </div>
      ) : viewMode === "tree" ? (
        <LocationTree locations={locations} campaignId={campaignId} />
      ) : (
        <div
          className={viewMode === "grid" ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3" : "space-y-4"}
        >
          {locations.map((location) => (
            <LocationCard
              key={location.id}
              location={location}
              campaignId={campaignId}
              userRole={userRole || "player"}
              onEdit={isGM ? handleEdit : undefined}
              onDelete={isGM ? handleDelete : undefined}
            />
          ))}
        </div>
      )}

      {/* Summary */}
      {locations.length > 0 && viewMode !== "tree" && (
        <div className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Showing {locations.length} location{locations.length !== 1 ? "s" : ""}
        </div>
      )}

      <LocationImportDialog
        isOpen={isImportDialogOpen}
        onClose={() => setIsImportDialogOpen(false)}
        onImport={handleImport}
        loading={importLoading}
      />
    </div>
  );
}
