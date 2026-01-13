"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Campaign } from "@/lib/types";
import { Search, Loader2 } from "lucide-react";
import CampaignCard from "../components/CampaignCard";
import CampaignFilters from "../components/CampaignFilters";

export default function DiscoveryPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Filters
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [edition, setEdition] = useState("sr5");
  const [gameplayLevel, setGameplayLevel] = useState("");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  // Construct API URL
  // Construct API URL - Removed as we build it in useEffect now

  // Fetch campaigns
  useEffect(() => {
    async function fetchCampaigns() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (debouncedQuery) params.set("q", debouncedQuery);
        if (edition) params.set("edition", edition);
        if (gameplayLevel) params.set("level", gameplayLevel);
        if (selectedTags.length > 0) params.set("tags", selectedTags.join(","));
        const url = `/api/campaigns/public?${params.toString()}`;

        const res = await fetch(url);
        const data = await res.json();
        if (data.success) {
          setCampaigns(data.campaigns);
        }
      } catch (error) {
        console.error("Failed to fetch public campaigns", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCampaigns();
  }, [debouncedQuery, edition, gameplayLevel, selectedTags]);

  const handleViewCampaign = (campaignId: string) => {
    // For public discovery, we might want to go to a "preview" page or just the main campaign page
    // If they are not in it, they will see the "Join" UI hopefully
    router.push(`/campaigns/${campaignId}`);
  };

  const addTag = () => {
    if (tagInput.trim() && !selectedTags.includes(tagInput.trim())) {
      setSelectedTags([...selectedTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">The Broker</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Find your next run. Browse public campaigns seeking shadowrunners.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-4">
        {/* Sidebar Filters */}
        <div className="space-y-6 lg:col-span-1">
          <CampaignFilters
            edition={edition}
            onEditionChange={setEdition}
            gameplayLevel={gameplayLevel}
            onGameplayLevelChange={setGameplayLevel}
            selectedTags={selectedTags}
            tagInput={tagInput}
            onTagInputChange={setTagInput}
            onAddTag={addTag}
            onRemoveTag={removeTag}
          />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Search Bar */}
          <div className="mb-6 relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-zinc-400" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="block w-full rounded-lg border border-zinc-300 bg-white py-3 pl-10 pr-3 leading-5 placeholder-zinc-500 focus:border-indigo-500 focus:placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-black dark:text-white dark:focus:border-indigo-400 dark:focus:ring-indigo-400 sm:text-sm"
              placeholder="Search campaigns by name, description, or keyword..."
            />
          </div>

          {/* Results */}
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
            </div>
          ) : campaigns.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
              {campaigns.map((campaign) => (
                <CampaignCard
                  key={campaign.id}
                  campaign={campaign}
                  userRole="player" // In discovery, everyone is essentially a potential player
                  onView={handleViewCampaign}
                />
              ))}
            </div>
          ) : (
            <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 p-12 text-center dark:border-zinc-700">
              <Search className="mx-auto h-12 w-12 text-zinc-400" />
              <h3 className="mt-2 text-sm font-medium text-zinc-900 dark:text-zinc-50">
                No campaigns found
              </h3>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Try adjusting your search or filters to find what you&apos;re looking for.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
