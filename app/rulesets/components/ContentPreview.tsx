"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Loader2, Search, X } from "lucide-react";
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

const PAGE_SIZE = 50;

export default function ContentPreview({ editionCode, category }: ContentPreviewProps) {
  const [items, setItems] = useState<ContentPreviewItem[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(category);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const hasMore = items.length < total;

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Reset when search or category changes
  useEffect(() => {
    setItems([]);
    setOffset(0);
    setTotal(0);
  }, [debouncedSearch, selectedCategory]);

  // Fetch content (initial load or next page)
  useEffect(() => {
    let cancelled = false;

    async function fetchContent() {
      const isFirstPage = offset === 0;
      if (isFirstPage) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      try {
        const params = new URLSearchParams({
          limit: PAGE_SIZE.toString(),
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

        if (cancelled) return;

        if (data.success) {
          setItems((prev) => (isFirstPage ? data.items : [...prev, ...data.items]));
          setTotal(data.pagination?.total ?? 0);
        } else {
          setError(data.error || "Failed to load content");
        }
      } catch (err) {
        if (!cancelled) {
          setError("An error occurred while loading content");
          console.error(err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    }

    fetchContent();

    return () => {
      cancelled = true;
    };
  }, [editionCode, offset, selectedCategory, debouncedSearch]);

  // Load next page
  const loadMore = useCallback(() => {
    if (!loadingMore && !loading && hasMore) {
      setOffset((prev) => prev + PAGE_SIZE);
    }
  }, [loadingMore, loading, hasMore]);

  // IntersectionObserver for infinite scroll sentinel
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [loadMore]);

  const handleCategoryChange = (cat: string | undefined) => {
    setSelectedCategory(cat);
  };

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
        <>
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

          {/* Scroll sentinel + loading indicator */}
          {hasMore && (
            <div
              ref={sentinelRef}
              data-testid="scroll-loader"
              className="flex items-center justify-center py-4"
            >
              {loadingMore && (
                <Loader2 className="w-5 h-5 animate-spin text-emerald-500" aria-hidden="true" />
              )}
            </div>
          )}

          {/* Item count footer */}
          <div className="text-center pt-2 border-t border-border">
            <span className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-mono font-semibold text-foreground">{items.length}</span> of{" "}
              <span className="font-mono font-semibold text-foreground">{total}</span> items
            </span>
          </div>
        </>
      )}
    </div>
  );
}
