/**
 * Ruleset Discovery Types
 *
 * Types supporting the Ruleset Discovery capability for browsing
 * editions, source materials, and content summaries.
 *
 * @see docs/capabilities/ruleset.discovery.md
 */

import type { EditionCode, BookCategory } from "./edition";

// =============================================================================
// CONTENT SUMMARY TYPES
// =============================================================================

/**
 * Category summary for content discovery
 */
export interface ContentCategory {
  id: string;
  name: string;
  itemCount: number;
  /** Optional description of the category */
  description?: string;
}

/**
 * Complete content summary for an edition
 * Provides counts and category overviews for all major content domains.
 */
export interface ContentSummary {
  editionCode: EditionCode;
  
  /** Total counts by domain */
  metatypeCount: number;
  skillCount: number;
  qualityCount: number;
  spellCount: number;
  gearCount: number;
  augmentationCount: number;
  vehicleCount: number;
  
  /** Detailed category breakdowns */
  categories: ContentCategory[];
  
  /** When this summary was generated */
  generatedAt: string;
}

// =============================================================================
// BOOK SUMMARY TYPES
// =============================================================================

/**
 * Summary of a book's metadata and content contributions
 */
export interface BookSummary {
  id: string;
  title: string;
  abbreviation?: string;
  category: BookCategory;
  /** Role description (e.g., "Core rules foundation", "Gear expansion") */
  role: string;
  /** Content domains this book contributes to */
  contentContributions: ContentCategory[];
  /** Page count if available */
  pageCount?: number;
  /** Release year of the book */
  releaseYear?: number;
}

// =============================================================================
// EDITION DISCOVERY TYPES
// =============================================================================

/**
 * Extended edition metadata for discovery interfaces
 * Supplements the base Edition type with discovery-specific fields.
 */
export interface EditionDiscoveryMetadata {
  /** Game philosophy/design approach abstract */
  philosophy?: string;
  
  /** Key mechanical features of this edition */
  mechanicalHighlights?: string[];
  
  /** Types of content supported (core, sourcebook, adventure) */
  supportedContentTypes?: BookCategory[];
  
  /** Tags for categorization and filtering */
  tags?: string[];
}

// =============================================================================
// CREATION METHOD SUMMARY TYPES
// =============================================================================

/**
 * Summary of a creation method's resource allocation impact
 */
export interface CreationMethodSummary {
  id: string;
  name: string;
  /** Brief description of the method */
  description: string;
  /** Detailed explanation of resource allocation */
  resourceAllocationImpact: string;
  /** Complexity level for new players */
  complexity: "beginner" | "intermediate" | "advanced";
  /** Estimated time to complete character creation */
  estimatedTimeMinutes?: number;
  /** Key tradeoffs or considerations */
  tradeoffs?: string[];
}

// =============================================================================
// CONTENT PREVIEW TYPES
// =============================================================================

/**
 * Preview item for content browsing (metatypes, gear, etc.)
 * Minimal data for high-performance discovery browsing.
 */
export interface ContentPreviewItem {
  id: string;
  name: string;
  category?: string;
  /** Brief description for preview */
  summary?: string;
  /** Source book reference */
  source?: string;
}

/**
 * Paginated content preview response
 */
export interface ContentPreviewResponse {
  items: ContentPreviewItem[];
  total: number;
  offset: number;
  limit: number;
  category?: string;
}

// =============================================================================
// DISCOVERY API RESPONSE TYPES
// =============================================================================

/**
 * Enhanced edition response with discovery metadata
 */
export interface EditionDiscoveryResponse {
  success: boolean;
  editionCode: EditionCode;
  contentSummary?: ContentSummary;
  books?: BookSummary[];
  creationMethods?: CreationMethodSummary[];
  discoveryMetadata?: EditionDiscoveryMetadata;
  error?: string;
}
