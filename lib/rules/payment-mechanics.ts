/**
 * Payment Mechanics (Run Faster pp. 174, 178, 180)
 *
 * Covers three payment subsystems for contact transactions:
 * 1. Corporate scrip exchange rates (9 megacorps)
 * 2. Barter value modifiers (vintage, provenance, master crafted)
 * 3. 2D6 payment preference table for random contact generation
 *
 * NOTE: This module is a standalone rules layer. Integration with the
 * contact creation UI and favor transaction flow will be done in a
 * wiring PR.
 *
 * @see /docs/capabilities/campaign.social-governance.md
 */

import type { ContactPreferredPayment } from "@/lib/types";

// =============================================================================
// TYPES
// =============================================================================

/** Corporate scrip exchange rate definition */
export interface ScripExchangeRate {
  /** Kebab-case identifier */
  id: string;
  /** Corporation name */
  name: string;
  /** Units of scrip per 1 nuyen (e.g., 0.8 means 0.8 scrip = 1¥) */
  rateToOneNuyen: number;
}

/** Barter value modifiers */
export interface BarterModifiers {
  /** Number of decades old (+1% per decade, max 10%) */
  vintageDecades?: number;
  /** Provenance type: "recent" = 2×, "historical" = 3× */
  provenance?: "recent" | "historical";
  /** Whether the item is master crafted (+20%) */
  masterCrafted?: boolean;
}

/** Payment preference table entry */
export interface PaymentPreferenceEntry {
  /** 2D6 roll result */
  roll: number;
  /** Display description */
  description: string;
  /** Mapped to ContactPreferredPayment type */
  paymentType: ContactPreferredPayment;
}

// =============================================================================
// CONSTANTS
// =============================================================================

/** Maximum vintage bonus percentage */
const MAX_VINTAGE_PERCENT = 10;

/** Master crafted bonus percentage */
const MASTER_CRAFTED_PERCENT = 20;

/** Provenance multipliers */
const PROVENANCE_MULTIPLIERS: Record<NonNullable<BarterModifiers["provenance"]>, number> = {
  recent: 2,
  historical: 3,
};

// =============================================================================
// CORPORATE SCRIP DATA (Run Faster p. 174)
// =============================================================================

const SCRIP_EXCHANGE_RATES: readonly ScripExchangeRate[] = [
  { id: "saeder-krupp", name: "Saeder-Krupp", rateToOneNuyen: 0.8 },
  { id: "shiawase", name: "Shiawase", rateToOneNuyen: 1 },
  { id: "mct", name: "MCT", rateToOneNuyen: 1.01 },
  { id: "wuxing", name: "Wuxing", rateToOneNuyen: 3 },
  { id: "ares", name: "Ares", rateToOneNuyen: 3.5 },
  { id: "evo", name: "Evo", rateToOneNuyen: 5 },
  { id: "renraku", name: "Renraku", rateToOneNuyen: 10 },
  { id: "horizon", name: "Horizon", rateToOneNuyen: 15 },
  { id: "aztechnology", name: "Aztechnology", rateToOneNuyen: 20 },
];

// =============================================================================
// PAYMENT PREFERENCE TABLE (Run Faster p. 180)
// =============================================================================

const PAYMENT_PREFERENCE_TABLE: readonly PaymentPreferenceEntry[] = [
  { roll: 2, description: "Cash (hard currency)", paymentType: "cash-hard-currency" },
  { roll: 3, description: "Service (drek jobs)", paymentType: "service-drek-jobs" },
  { roll: 4, description: "Cash (corp scrip)", paymentType: "cash-corporate-scrip" },
  {
    roll: 5,
    description: "Barter (items needed for the profession)",
    paymentType: "barter-profession-items",
  },
  { roll: 6, description: "Service (shadowrunner job)", paymentType: "service-shadowrun-job" },
  { roll: 7, description: "Cash (credstick)", paymentType: "cash-credstick" },
  { roll: 8, description: "Cash (credstick)", paymentType: "cash-credstick" },
  { roll: 9, description: "Barter (easy-to-sell items)", paymentType: "barter-easy-to-sell" },
  { roll: 10, description: "Service (free-labor jobs)", paymentType: "service-free-labor" },
  { roll: 11, description: "Barter (hobby/vice items)", paymentType: "barter-hobby-vice" },
  {
    roll: 12,
    description: "Cash (ECC or other foreign electronic currency)",
    paymentType: "cash-hard-currency",
  },
];

// =============================================================================
// SCRIP EXCHANGE FUNCTIONS
// =============================================================================

/**
 * Get all corporate scrip exchange rates.
 */
export function getScripExchangeRates(): readonly ScripExchangeRate[] {
  return SCRIP_EXCHANGE_RATES;
}

/**
 * Get a specific corporation's scrip exchange rate.
 *
 * @param corporationId - Kebab-case corporation identifier
 * @returns Exchange rate or undefined if not found
 */
export function getScripExchangeRate(corporationId: string): ScripExchangeRate | undefined {
  return SCRIP_EXCHANGE_RATES.find((r) => r.id === corporationId);
}

/**
 * Convert nuyen to corporate scrip.
 *
 * @param nuyen - Amount in nuyen
 * @param rateToOneNuyen - Scrip units per 1 nuyen
 * @returns Amount in corporate scrip
 */
export function convertNuyenToScrip(nuyen: number, rateToOneNuyen: number): number {
  if (rateToOneNuyen <= 0) {
    throw new Error(`convertNuyenToScrip: rateToOneNuyen must be positive, got ${rateToOneNuyen}`);
  }
  return nuyen * rateToOneNuyen;
}

/**
 * Convert corporate scrip to nuyen.
 *
 * @param scrip - Amount in corporate scrip
 * @param rateToOneNuyen - Scrip units per 1 nuyen (must be > 0)
 * @returns Amount in nuyen
 * @throws Error if rateToOneNuyen is not positive
 */
export function convertScripToNuyen(scrip: number, rateToOneNuyen: number): number {
  if (rateToOneNuyen <= 0) {
    throw new Error(`convertScripToNuyen: rateToOneNuyen must be positive, got ${rateToOneNuyen}`);
  }
  return scrip / rateToOneNuyen;
}

// =============================================================================
// BARTER VALUE CALCULATION
// =============================================================================

/**
 * Calculate the barter value of an item with optional quality modifiers.
 *
 * Modifiers stack multiplicatively:
 * - Vintage: +1% per decade (max 10%)
 * - Provenance: 2× (recent/living) or 3× (historical/deceased)
 * - Master Crafted: +20%
 *
 * @param baseValue - Item's base nuyen value (must be >= 0)
 * @param modifiers - Optional barter quality modifiers
 * @returns Adjusted barter value (rounded to nearest integer)
 * @throws Error if baseValue is negative or non-finite
 */
export function calculateBarterValue(baseValue: number, modifiers: BarterModifiers): number {
  if (!Number.isFinite(baseValue) || baseValue < 0) {
    throw new Error(`calculateBarterValue: baseValue must be non-negative, got ${baseValue}`);
  }

  let multiplier = 1;

  // Vintage: +1% per decade, capped at 10%
  if (modifiers.vintageDecades && modifiers.vintageDecades > 0) {
    const vintagePercent = Math.min(modifiers.vintageDecades, MAX_VINTAGE_PERCENT);
    multiplier *= 1 + vintagePercent / 100;
  }

  // Provenance: 2× or 3×
  if (modifiers.provenance) {
    multiplier *= PROVENANCE_MULTIPLIERS[modifiers.provenance] ?? 1;
  }

  // Master Crafted: +20%
  if (modifiers.masterCrafted) {
    multiplier *= 1 + MASTER_CRAFTED_PERCENT / 100;
  }

  return Math.round(baseValue * multiplier);
}

// =============================================================================
// PAYMENT PREFERENCE TABLE
// =============================================================================

/**
 * Get the full 2D6 payment preference table.
 */
export function getPaymentPreferenceTable(): readonly PaymentPreferenceEntry[] {
  return PAYMENT_PREFERENCE_TABLE;
}

/**
 * Get the payment preference for a specific 2D6 roll result.
 *
 * @param roll - 2D6 roll result (2-12)
 * @returns Payment preference entry or undefined for invalid rolls
 */
export function getPaymentPreference(roll: number): PaymentPreferenceEntry | undefined {
  return PAYMENT_PREFERENCE_TABLE.find((entry) => entry.roll === roll);
}
