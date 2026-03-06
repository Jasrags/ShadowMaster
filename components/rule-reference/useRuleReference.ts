"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import type { RuleReferenceEntry, RuleReferenceCategory, RuleReferenceData } from "@/lib/types";

const DEFAULT_EDITION = "sr5";

interface UseRuleReferenceReturn {
  entries: RuleReferenceEntry[];
  filteredEntries: RuleReferenceEntry[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: RuleReferenceCategory | null;
  setSelectedCategory: (category: RuleReferenceCategory | null) => void;
  selectedEntry: RuleReferenceEntry | null;
  setSelectedEntry: (entry: RuleReferenceEntry | null) => void;
  isLoading: boolean;
  error: string | null;
  categories: RuleReferenceCategory[];
}

export function useRuleReference(
  defaultCategory: RuleReferenceCategory | null,
  editionCode: string = DEFAULT_EDITION
): UseRuleReferenceReturn {
  const [data, setData] = useState<RuleReferenceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<RuleReferenceCategory | null>(
    defaultCategory
  );
  const [selectedEntry, setSelectedEntry] = useState<RuleReferenceEntry | null>(null);

  useEffect(() => {
    setSelectedCategory(defaultCategory);
  }, [defaultCategory]);

  useEffect(() => {
    if (!editionCode) return;

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    fetch(`/api/editions/${editionCode}/rule-reference`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load rule reference data");
        return res.json();
      })
      .then((json) => {
        if (!cancelled) {
          setData(json.data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [editionCode]);

  const entries = data?.entries ?? [];

  const categories = useMemo(() => {
    const cats = new Set<RuleReferenceCategory>();
    for (const entry of entries) {
      cats.add(entry.category);
    }
    return Array.from(cats).sort();
  }, [entries]);

  const filteredEntries = useMemo(() => {
    let result = entries;

    if (selectedCategory) {
      result = result.filter((e) => e.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(query) ||
          e.summary.toLowerCase().includes(query) ||
          e.tags.some((t) => t.toLowerCase().includes(query)) ||
          (e.subcategory && e.subcategory.toLowerCase().includes(query))
      );
    }

    return result;
  }, [entries, selectedCategory, searchQuery]);

  const wrappedSetSearchQuery = useCallback((query: string) => {
    setSearchQuery(query);
    setSelectedEntry(null);
  }, []);

  const wrappedSetCategory = useCallback((category: RuleReferenceCategory | null) => {
    setSelectedCategory(category);
    setSelectedEntry(null);
  }, []);

  return {
    entries,
    filteredEntries,
    searchQuery,
    setSearchQuery: wrappedSetSearchQuery,
    selectedCategory,
    setSelectedCategory: wrappedSetCategory,
    selectedEntry,
    setSelectedEntry,
    isLoading,
    error,
    categories,
  };
}
