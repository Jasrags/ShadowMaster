"use client";

import { useState, useEffect, useRef } from "react";
import { Loader2, ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import type { ContentPreviewItem, EditionCode } from "@/lib/types";

interface ContentPreviewProps {
  editionCode: EditionCode;
  category?: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  metatypes: "Metatypes",
  skills: "Skills",
  qualities: "Qualities",
  gear: "Gear",
  magic: "Magic",
  cyberware: "Cyberware",
  bioware: "Bioware",
  vehicles: "Vehicles",
  programs: "Programs",
  foci: "Foci",
  adeptPowers: "Adept Powers",
  spirits: "Spirits",
  critterPowers: "Critter Powers",
  critterWeaknesses: "Critter Weaknesses",
  critters: "Critters",
  modifications: "Modifications",
  lifestyle: "Lifestyle",
  contactArchetypes: "Contact Archetypes",
  contactTemplates: "Contact Templates",
  favorServices: "Favor Services",
  actions: "Actions",
};

export default function ContentPreview({ editionCode, category }: ContentPreviewProps) {
  const [items, setItems] = useState<ContentPreviewItem[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(category);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const limit = 10;

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Reset pagination when search changes
  useEffect(() => {
    setOffset(0);
  }, [debouncedSearch]);

  useEffect(() => {
    async function fetchContent() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          limit: limit.toString(),
          offset: offset.toString(),
        });
        if (selectedCategory) {
          params.set("category", selectedCategory);
        }
        if (debouncedSearch) {
          params.set("search", debouncedSearch);
        }

        const res = await fetch(`/api/editions/${editionCode}/content?${params}`);
        const data = await res.json();

        if (data.success) {
          setItems(data.items);
          setTotal(data.total);
        } else {
          setError(data.error || "Failed to load content");
        }
      } catch (err) {
        setError("An error occurred while loading content");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchContent();
  }, [editionCode, offset, selectedCategory, debouncedSearch]);

  const handleCategoryChange = (cat: string | undefined) => {
    setSelectedCategory(cat);
    setOffset(0);
  };

  const hasNext = offset + limit < total;
  const hasPrev = offset > 0;

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search all content... (e.g. fireball, ares predator, troll)"
          className="w-full rounded-lg border border-zinc-200 bg-white py-2.5 pl-10 pr-10 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-emerald-400"
          aria-label="Search content"
        />
        {searchInput && (
          <button
            onClick={() => setSearchInput("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-0.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
        <button
          onClick={() => handleCategoryChange(undefined)}
          className={`px-3 py-1.5 text-sm rounded-full transition-all font-medium ${
            !selectedCategory
              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/25"
              : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
          }`}
        >
          All
        </button>
        {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
          <button
            key={key}
            onClick={() => handleCategoryChange(key)}
            className={`px-3 py-1.5 text-sm rounded-full transition-all font-medium ${
              selectedCategory === key
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/25"
                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Search context */}
      {debouncedSearch && !loading && (
        <p className="text-sm text-muted-foreground">
          Found <span className="font-mono font-semibold text-foreground">{total}</span> result
          {total !== 1 ? "s" : ""} for &ldquo;
          <span className="font-semibold text-foreground">{debouncedSearch}</span>&rdquo;
          {selectedCategory ? ` in ${CATEGORY_LABELS[selectedCategory] || selectedCategory}` : ""}
        </p>
      )}

      {/* Content List */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-500" aria-hidden="true" />
        </div>
      ) : error ? (
        <div className="text-center py-8 text-destructive">{error}</div>
      ) : items.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No content found
          {debouncedSearch ? ` matching "${debouncedSearch}"` : ""}
          {selectedCategory ? ` in ${CATEGORY_LABELS[selectedCategory] || selectedCategory}` : ""}.
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={`${item.category}-${item.id}`}
              className="p-3 rounded-lg bg-muted/30 border border-border hover:border-emerald-500/30 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-foreground">{item.name}</h4>
                  {item.summary && (
                    <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                      {item.summary}
                    </p>
                  )}
                </div>
                <div className="flex gap-1.5 shrink-0 ml-2">
                  {item.subcategory && (
                    <span className="text-xs bg-zinc-500/10 text-zinc-500 dark:text-zinc-400 px-2 py-0.5 rounded font-mono">
                      {item.subcategory}
                    </span>
                  )}
                  {item.category && (
                    <span className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded font-mono">
                      {CATEGORY_LABELS[item.category] || item.category}
                    </span>
                  )}
                </div>
              </div>
              {item.source && (
                <p className="text-xs text-muted-foreground mt-2 font-mono">
                  Source: {item.source}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {total > limit && (
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="text-sm text-muted-foreground">
            Showing <span className="font-mono font-semibold text-foreground">{offset + 1}</span>-
            <span className="font-mono font-semibold text-foreground">
              {Math.min(offset + limit, total)}
            </span>{" "}
            of <span className="font-mono font-semibold text-foreground">{total}</span>
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setOffset(Math.max(0, offset - limit))}
              disabled={!hasPrev}
              className="p-2 rounded-lg bg-muted hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              onClick={() => setOffset(offset + limit)}
              disabled={!hasNext}
              className="p-2 rounded-lg bg-muted hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
