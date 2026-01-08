/**
 * Matrix Program types for Shadowrun 5E
 *
 * Programs are software that run on cyberdecks, RCCs, and commlinks.
 * They provide various benefits for Matrix actions.
 *
 * Based on SR5 Core Rulebook Chapter 10: The Matrix
 */

import type { ID } from "./core";

// =============================================================================
// PROGRAM CATEGORIES
// =============================================================================

/**
 * Categories of Matrix programs
 * - common: Basic utility programs available to everyone
 * - hacking: Attack and defense programs for deckers
 * - agent: Autonomous IC-like programs that can act independently
 */
export type ProgramCategory = "common" | "hacking" | "agent";

// =============================================================================
// CATALOG TYPES (for ruleset data)
// =============================================================================

/**
 * A program as defined in the ruleset catalog
 */
export interface ProgramCatalogItem {
  id: string;
  name: string;
  category: ProgramCategory;

  /** Cost in nuyen (agents have cost per rating) */
  cost: number;

  /** Availability rating */
  availability: number;

  /** Whether item is restricted (R) */
  restricted?: boolean;

  /** Whether item is forbidden (F) */
  forbidden?: boolean;

  /** For agent programs, the rating range */
  minRating?: number;
  maxRating?: number;

  /** Cost multiplier per rating (for agents) */
  costPerRating?: number;

  /** Description of what the program does */
  description?: string;

  /** Game effects/mechanics */
  effects?: string;

  /** Page reference in source book */
  page?: number;

  /** Source book identifier */
  source?: string;
}

/**
 * Programs module data structure in ruleset
 */
export interface ProgramsModule {
  /** Common utility programs */
  common: ProgramCatalogItem[];

  /** Hacking programs for deckers */
  hacking: ProgramCatalogItem[];

  /** Agent programs with ratings */
  agents: ProgramCatalogItem[];
}

// =============================================================================
// CHARACTER TYPES (for owned programs)
// =============================================================================

/**
 * A program owned by a character
 */
export interface CharacterProgram {
  id?: ID;

  /** Reference to catalog item */
  catalogId: string;

  /** Program name */
  name: string;

  /** Program category */
  category: ProgramCategory;

  /** Rating (for agent programs) */
  rating?: number;

  /** Total cost paid */
  cost: number;

  /** Availability at time of purchase */
  availability: number;

  /** Whether currently loaded on a device */
  loaded?: boolean;

  /** ID of device it's loaded on (cyberdeck, RCC, commlink) */
  loadedOnDeviceId?: string;

  /** Notes about this program */
  notes?: string;
}
