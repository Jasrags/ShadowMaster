/**
 * Rule Reference types
 *
 * Types for the in-app rule quick-reference system.
 * Supports structured reference entries with tables, searchable tags,
 * and category-based filtering.
 */

import type { EditionCode } from "./edition";

export type RuleReferenceCategory =
  | "combat"
  | "magic"
  | "matrix"
  | "rigging"
  | "social"
  | "environment"
  | "tests"
  | "equipment";

export interface RuleReferenceTable {
  headers: string[];
  rows: string[][];
}

export interface RuleReferenceEntry {
  id: string;
  title: string;
  category: RuleReferenceCategory;
  subcategory?: string;
  tags: string[];
  summary: string;
  tables: RuleReferenceTable[];
  notes?: string[];
  source: { book: string; page: number | string };
}

export interface RuleReferenceData {
  version: string;
  editionCode: EditionCode;
  entries: RuleReferenceEntry[];
}
