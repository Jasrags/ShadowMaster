"use client";

import { useState, useEffect } from "react";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
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
};

export default function ContentPreview({ editionCode, category }: ContentPreviewProps) {
  const [items, setItems] = useState<ContentPreviewItem[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(category);

  const limit = 10;

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
  }, [editionCode, offset, selectedCategory]);

  const handleCategoryChange = (cat: string | undefined) => {
    setSelectedCategory(cat);
    setOffset(0);
  };

  const hasNext = offset + limit < total;
  const hasPrev = offset > 0;

  return (
    <div className="space-y-4">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleCategoryChange(undefined)}
          className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
            !selectedCategory
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          All
        </button>
        {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
          <button
            key={key}
            onClick={() => handleCategoryChange(key)}
            className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
              selectedCategory === key
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Content List */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-center py-8 text-destructive">{error}</div>
      ) : items.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No content found{selectedCategory ? ` in ${CATEGORY_LABELS[selectedCategory]}` : ""}.
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={`${item.category}-${item.id}`}
              className="p-3 rounded-lg bg-secondary/30 border border-border hover:bg-secondary/50 transition-colors"
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
                {item.category && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                    {CATEGORY_LABELS[item.category] || item.category}
                  </span>
                )}
              </div>
              {item.source && (
                <p className="text-xs text-muted-foreground mt-2">Source: {item.source}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {total > limit && (
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="text-sm text-muted-foreground">
            Showing {offset + 1}-{Math.min(offset + limit, total)} of {total}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setOffset(Math.max(0, offset - limit))}
              disabled={!hasPrev}
              className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setOffset(offset + limit)}
              disabled={!hasNext}
              className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
