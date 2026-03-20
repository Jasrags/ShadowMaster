/**
 * Tests for contact-constants.ts (#798)
 *
 * Covers: STATUS_STYLES completeness, TRANSACTION_TYPE_LABELS completeness,
 * getFavorBalanceStyle positive/negative/zero cases
 */

import { describe, it, expect } from "vitest";
import {
  STATUS_STYLES,
  TRANSACTION_TYPE_LABELS,
  getFavorBalanceStyle,
} from "@/app/characters/[id]/contacts/components/contact-constants";
import type { ContactStatus, FavorTransactionType } from "@/lib/types";

describe("contact-constants", () => {
  describe("STATUS_STYLES", () => {
    const ALL_STATUSES: ContactStatus[] = ["active", "burned", "inactive", "missing", "deceased"];

    it("has an entry for every ContactStatus", () => {
      for (const status of ALL_STATUSES) {
        expect(STATUS_STYLES[status]).toBeDefined();
      }
    });

    it("each entry has bg, text, and border fields", () => {
      for (const status of ALL_STATUSES) {
        const style = STATUS_STYLES[status];
        expect(style.bg).toMatch(/^bg-/);
        expect(style.text).toMatch(/^text-/);
        expect(style.border).toMatch(/^border-/);
      }
    });
  });

  describe("TRANSACTION_TYPE_LABELS", () => {
    const ALL_TYPES: FavorTransactionType[] = [
      "favor_called",
      "favor_failed",
      "favor_granted",
      "favor_owed",
      "favor_repaid",
      "loyalty_change",
      "connection_change",
      "contact_burned",
      "contact_acquired",
      "contact_reactivated",
      "status_change",
      "gift",
      "betrayal",
      "reputation_effect",
      "chip_spent_dice_bonus",
      "chip_spent_loyalty",
    ];

    it("has an entry for every FavorTransactionType", () => {
      for (const type of ALL_TYPES) {
        expect(TRANSACTION_TYPE_LABELS[type]).toBeDefined();
      }
    });

    it("each entry has a non-empty label and color", () => {
      for (const type of ALL_TYPES) {
        const entry = TRANSACTION_TYPE_LABELS[type];
        expect(entry.label.length).toBeGreaterThan(0);
        expect(entry.color).toMatch(/^text-/);
      }
    });

    it("includes chip transaction types added in #789", () => {
      expect(TRANSACTION_TYPE_LABELS.chip_spent_dice_bonus.label).toBe("Chips for Dice");
      expect(TRANSACTION_TYPE_LABELS.chip_spent_loyalty.label).toBe("Chips for Loyalty");
    });
  });

  describe("getFavorBalanceStyle", () => {
    it("returns emerald color and 'owed to you' for positive balance", () => {
      const result = getFavorBalanceStyle(3);
      expect(result.color).toBe("text-emerald-400");
      expect(result.text).toBe("+3 owed to you");
    });

    it("returns amber color and 'owed by you' for negative balance", () => {
      const result = getFavorBalanceStyle(-2);
      expect(result.color).toBe("text-amber-400");
      expect(result.text).toBe("2 owed by you");
    });

    it("returns muted color and 'Even' for zero balance", () => {
      const result = getFavorBalanceStyle(0);
      expect(result.color).toBe("text-muted-foreground");
      expect(result.text).toBe("Even");
    });

    it("handles large positive balance", () => {
      const result = getFavorBalanceStyle(100);
      expect(result.text).toBe("+100 owed to you");
    });

    it("handles large negative balance", () => {
      const result = getFavorBalanceStyle(-50);
      expect(result.text).toBe("50 owed by you");
    });
  });
});
