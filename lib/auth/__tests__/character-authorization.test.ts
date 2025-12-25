/**
 * Tests for Character Authorization
 *
 * Tests permission checking and role-based access control.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getPermissionsForRole,
  hasPermission,
  type CharacterPermission,
} from "../character-authorization";
import type { CharacterStatus } from "@/lib/types/character";
import type { ActorRole } from "@/lib/types/audit";

// =============================================================================
// PERMISSION MATRIX TESTS
// =============================================================================

describe("getPermissionsForRole", () => {
  describe("admin role", () => {
    it("should have all permissions regardless of status", () => {
      const statuses: CharacterStatus[] = [
        "draft",
        "active",
        "retired",
        "deceased",
      ];

      for (const status of statuses) {
        const permissions = getPermissionsForRole("admin", status);
        expect(permissions).toContain("view");
        expect(permissions).toContain("edit");
        expect(permissions).toContain("delete");
        expect(permissions).toContain("finalize");
        expect(permissions).toContain("retire");
        expect(permissions).toContain("resurrect");
        expect(permissions).toContain("advance");
        expect(permissions).toContain("approve_advancement");
        expect(permissions).toContain("transfer");
      }
    });
  });

  describe("owner role", () => {
    it("should have edit and finalize for draft characters", () => {
      const permissions = getPermissionsForRole("owner", "draft");

      expect(permissions).toContain("view");
      expect(permissions).toContain("edit");
      expect(permissions).toContain("finalize");
      expect(permissions).toContain("delete");
      expect(permissions).toContain("manage_campaign");
    });

    it("should not have edit for active characters", () => {
      const permissions = getPermissionsForRole("owner", "active");

      expect(permissions).toContain("view");
      expect(permissions).not.toContain("edit");
      expect(permissions).toContain("retire");
      expect(permissions).toContain("advance");
      expect(permissions).toContain("delete");
    });

    it("should have limited permissions for retired characters", () => {
      const permissions = getPermissionsForRole("owner", "retired");

      expect(permissions).toContain("view");
      expect(permissions).toContain("delete");
      expect(permissions).toContain("advance"); // Can still advance
      expect(permissions).not.toContain("edit");
    });

    it("should not have resurrect permission", () => {
      const permissions = getPermissionsForRole("owner", "deceased");

      expect(permissions).not.toContain("resurrect");
    });
  });

  describe("gm role", () => {
    it("should have view permission for all statuses", () => {
      const statuses: CharacterStatus[] = [
        "draft",
        "active",
        "retired",
        "deceased",
      ];

      for (const status of statuses) {
        const permissions = getPermissionsForRole("gm", status);
        expect(permissions).toContain("view");
      }
    });

    it("should have retire and approval permissions for active characters", () => {
      const permissions = getPermissionsForRole("gm", "active");

      expect(permissions).toContain("retire");
      expect(permissions).toContain("approve_advancement");
      expect(permissions).toContain("reject_advancement");
    });

    it("should have resurrect permission for deceased characters", () => {
      const permissions = getPermissionsForRole("gm", "deceased");

      expect(permissions).toContain("resurrect");
    });

    it("should not have edit permission", () => {
      const statuses: CharacterStatus[] = [
        "draft",
        "active",
        "retired",
        "deceased",
      ];

      for (const status of statuses) {
        const permissions = getPermissionsForRole("gm", status);
        expect(permissions).not.toContain("edit");
      }
    });
  });

  describe("system role", () => {
    it("should have all permissions like admin", () => {
      const permissions = getPermissionsForRole("system", "active");

      expect(permissions).toContain("view");
      expect(permissions).toContain("edit");
      expect(permissions).toContain("delete");
      expect(permissions).toContain("finalize");
      expect(permissions).toContain("advance");
      expect(permissions).toContain("transfer");
    });
  });
});

// =============================================================================
// PERMISSION CHECK TESTS
// =============================================================================

describe("hasPermission", () => {
  it("should return true when permission is in list", () => {
    const permissions: CharacterPermission[] = ["view", "edit", "delete"];
    expect(hasPermission(permissions, "view")).toBe(true);
    expect(hasPermission(permissions, "edit")).toBe(true);
    expect(hasPermission(permissions, "delete")).toBe(true);
  });

  it("should return false when permission is not in list", () => {
    const permissions: CharacterPermission[] = ["view"];
    expect(hasPermission(permissions, "edit")).toBe(false);
    expect(hasPermission(permissions, "delete")).toBe(false);
    expect(hasPermission(permissions, "finalize")).toBe(false);
  });

  it("should return false for empty permissions list", () => {
    const permissions: CharacterPermission[] = [];
    expect(hasPermission(permissions, "view")).toBe(false);
  });
});

// =============================================================================
// PERMISSION SCENARIOS
// =============================================================================

describe("Permission Scenarios", () => {
  describe("Draft character editing", () => {
    it("owner can edit draft", () => {
      const permissions = getPermissionsForRole("owner", "draft");
      expect(hasPermission(permissions, "edit")).toBe(true);
    });

    it("gm cannot edit draft", () => {
      const permissions = getPermissionsForRole("gm", "draft");
      expect(hasPermission(permissions, "edit")).toBe(false);
    });

    it("admin can edit draft", () => {
      const permissions = getPermissionsForRole("admin", "draft");
      expect(hasPermission(permissions, "edit")).toBe(true);
    });
  });

  describe("Character finalization", () => {
    it("owner can finalize their draft", () => {
      const permissions = getPermissionsForRole("owner", "draft");
      expect(hasPermission(permissions, "finalize")).toBe(true);
    });

    it("gm cannot finalize player draft", () => {
      const permissions = getPermissionsForRole("gm", "draft");
      expect(hasPermission(permissions, "finalize")).toBe(false);
    });
  });

  describe("Character retirement", () => {
    it("owner can retire active character", () => {
      const permissions = getPermissionsForRole("owner", "active");
      expect(hasPermission(permissions, "retire")).toBe(true);
    });

    it("gm can retire active character", () => {
      const permissions = getPermissionsForRole("gm", "active");
      expect(hasPermission(permissions, "retire")).toBe(true);
    });
  });

  describe("Character resurrection", () => {
    it("owner cannot resurrect deceased character", () => {
      const permissions = getPermissionsForRole("owner", "deceased");
      expect(hasPermission(permissions, "resurrect")).toBe(false);
    });

    it("gm can resurrect deceased character", () => {
      const permissions = getPermissionsForRole("gm", "deceased");
      expect(hasPermission(permissions, "resurrect")).toBe(true);
    });

    it("admin can resurrect deceased character", () => {
      const permissions = getPermissionsForRole("admin", "deceased");
      expect(hasPermission(permissions, "resurrect")).toBe(true);
    });
  });

  describe("Advancement approval", () => {
    it("owner cannot approve their own advancements", () => {
      const permissions = getPermissionsForRole("owner", "active");
      expect(hasPermission(permissions, "approve_advancement")).toBe(false);
    });

    it("gm can approve advancements", () => {
      const permissions = getPermissionsForRole("gm", "active");
      expect(hasPermission(permissions, "approve_advancement")).toBe(true);
      expect(hasPermission(permissions, "reject_advancement")).toBe(true);
    });
  });

  describe("Character deletion", () => {
    it("owner can delete their character at any status", () => {
      const statuses: CharacterStatus[] = [
        "draft",
        "active",
        "retired",
        "deceased",
      ];

      for (const status of statuses) {
        const permissions = getPermissionsForRole("owner", status);
        expect(hasPermission(permissions, "delete")).toBe(true);
      }
    });
  });
});
