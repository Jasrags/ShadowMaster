/**
 * Tests that all API error responses use the standard { success: false, error } envelope.
 *
 * Covers routes identified in issue #688 that previously returned bare { error } responses.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextResponse } from "next/server";

// ---- Shared mocks ----

vi.mock("@/lib/auth/session", () => ({
  getSession: vi.fn(),
}));

vi.mock("@/lib/storage/users", () => ({
  getUserById: vi.fn(),
}));

vi.mock("@/lib/storage/characters", () => ({
  getCharacter: vi.fn(),
  getUserCharacters: vi.fn(),
  getAllCharacters: vi.fn(),
  getCharacterById: vi.fn(),
  updateCharacter: vi.fn(),
}));

vi.mock("@/lib/storage/notifications", () => ({
  getUserNotifications: vi.fn(),
  getUnreadCount: vi.fn(),
  updateNotification: vi.fn(),
}));

vi.mock("@/lib/rules/rigging/action-validator", () => ({
  validateVehicleAction: vi.fn(),
  getTestTypeForAction: vi.fn(),
}));

vi.mock("@/lib/rules/rigging/dice-pool-calculator", () => ({
  calculateVehicleDicePool: vi.fn(),
}));

vi.mock("@/lib/rules/rigging/vcr-validator", () => ({
  hasVehicleControlRig: vi.fn(() => false),
  getVehicleControlRig: vi.fn(),
}));

vi.mock("@/lib/rules/rigging/rcc-validator", () => ({
  hasRCC: vi.fn(() => false),
  getActiveRCC: vi.fn(),
  buildRCCConfiguration: vi.fn(),
}));

vi.mock("@/lib/rules/matrix/cyberdeck-validator", () => ({
  validateCyberdeckConfig: vi.fn(),
  getCharacterCyberdecks: vi.fn(() => []),
}));

vi.mock("@/lib/rules/matrix/program-validator", () => ({
  validateProgramAllocation: vi.fn(),
}));

vi.mock("@/lib/rules/matrix/overwatch-tracker", () => ({
  startOverwatchSession: vi.fn(),
  recordOverwatchEvent: vi.fn(),
  endOverwatchSession: vi.fn(),
  getConvergenceProgress: vi.fn(),
}));

vi.mock("@/lib/rules/matrix/overwatch-calculator", () => ({
  handleConvergence: vi.fn(),
}));

vi.mock("@/lib/types/matrix", () => ({
  OVERWATCH_THRESHOLD: 40,
}));

vi.mock("@/lib/rules/loader", () => ({
  loadRuleset: vi.fn(),
}));

vi.mock("@/lib/migrations/add-gear-state", () => ({
  needsGearStateMigration: vi.fn(),
  migrateCharacterGearState: vi.fn(),
  migrateCharactersGearState: vi.fn(),
  getMigrationSummary: vi.fn(),
}));

// ---- Imports (after mocks) ----

import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import { getCharacter } from "@/lib/storage/characters";
import { updateNotification } from "@/lib/storage/notifications";

const mockedGetSession = vi.mocked(getSession);
const mockedGetUserById = vi.mocked(getUserById);
const mockedGetCharacter = vi.mocked(getCharacter);
const mockedUpdateNotification = vi.mocked(updateNotification);

/**
 * Helper: assert that an error response includes { success: false, error: "..." }
 */
async function expectEnvelopedError(
  response: ReturnType<typeof NextResponse.json>,
  expectedStatus: number
) {
  const data = await (response as { json: () => Promise<Record<string, unknown>> }).json();
  expect(data).toHaveProperty("success", false);
  expect(data).toHaveProperty("error");
  expect(typeof data.error).toBe("string");
  expect((response as { status: number }).status).toBe(expectedStatus);
}

// =============================================================================
// Helper: create a mock NextRequest
// =============================================================================

function createRequest(url: string, init?: { method?: string; body?: string }) {
  // Using the mocked NextRequest from setup.ts
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { NextRequest } = require("next/server");
  return new NextRequest(url, init);
}

// =============================================================================
// Tests
// =============================================================================

describe("Response envelope consistency (#688)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ---------------------------------------------------------------------------
  // GET /api/notifications
  // ---------------------------------------------------------------------------
  describe("GET /api/notifications", () => {
    it("returns { success: false, error } when unauthenticated", async () => {
      mockedGetSession.mockResolvedValue(null);
      const { GET } = await import("@/app/api/notifications/route");
      const req = createRequest("http://localhost/api/notifications");
      const res = await GET(req);
      await expectEnvelopedError(res, 401);
    });

    it("returns { success: false, error } when user not found", async () => {
      mockedGetSession.mockResolvedValue("user-1");
      mockedGetUserById.mockResolvedValue(null);
      const { GET } = await import("@/app/api/notifications/route");
      const req = createRequest("http://localhost/api/notifications");
      const res = await GET(req);
      await expectEnvelopedError(res, 404);
    });
  });

  // ---------------------------------------------------------------------------
  // PATCH /api/notifications/[id]
  // ---------------------------------------------------------------------------
  describe("PATCH /api/notifications/[id]", () => {
    it("returns { success: false, error } when unauthenticated", async () => {
      mockedGetSession.mockResolvedValue(null);
      const { PATCH } = await import("@/app/api/notifications/[id]/route");
      const req = createRequest("http://localhost/api/notifications/n1", {
        method: "PATCH",
        body: JSON.stringify({ read: true }),
      });
      const res = await PATCH(req, { params: Promise.resolve({ id: "n1" }) });
      await expectEnvelopedError(res, 401);
    });

    it("returns { success: false, error } when notification not found", async () => {
      mockedGetSession.mockResolvedValue("user-1");
      mockedUpdateNotification.mockResolvedValue(null);
      const { PATCH } = await import("@/app/api/notifications/[id]/route");
      const req = createRequest("http://localhost/api/notifications/n1", {
        method: "PATCH",
        body: JSON.stringify({ read: true }),
      });
      const res = await PATCH(req, { params: Promise.resolve({ id: "n1" }) });
      await expectEnvelopedError(res, 404);
    });
  });

  // ---------------------------------------------------------------------------
  // GET /api/settings/export
  // ---------------------------------------------------------------------------
  describe("GET /api/settings/export", () => {
    it("returns { success: false, error } when unauthenticated", async () => {
      mockedGetSession.mockResolvedValue(null);
      const { GET } = await import("@/app/api/settings/export/route");
      const res = await GET();
      await expectEnvelopedError(res, 401);
    });

    it("returns { success: false, error } when user not found", async () => {
      mockedGetSession.mockResolvedValue("user-1");
      mockedGetUserById.mockResolvedValue(null);
      const { GET } = await import("@/app/api/settings/export/route");
      const res = await GET();
      await expectEnvelopedError(res, 404);
    });
  });

  // ---------------------------------------------------------------------------
  // POST /api/rigging/validate
  // ---------------------------------------------------------------------------
  describe("POST /api/rigging/validate", () => {
    it("returns { success: false, error } when unauthenticated", async () => {
      mockedGetSession.mockResolvedValue(null);
      const { POST } = await import("@/app/api/rigging/validate/route");
      const req = createRequest("http://localhost/api/rigging/validate", {
        method: "POST",
        body: JSON.stringify({ characterId: "c1", vehicleId: "v1", actionType: "accelerate" }),
      });
      const res = await POST(req);
      await expectEnvelopedError(res, 401);
    });

    it("returns { success: false, error } when user not found", async () => {
      mockedGetSession.mockResolvedValue("user-1");
      mockedGetUserById.mockResolvedValue(null);
      const { POST } = await import("@/app/api/rigging/validate/route");
      const req = createRequest("http://localhost/api/rigging/validate", {
        method: "POST",
        body: JSON.stringify({ characterId: "c1", vehicleId: "v1", actionType: "accelerate" }),
      });
      const res = await POST(req);
      await expectEnvelopedError(res, 404);
    });

    it("returns { success: false, error } when missing required fields", async () => {
      mockedGetSession.mockResolvedValue("user-1");
      mockedGetUserById.mockResolvedValue({
        id: "user-1",
        username: "test",
        role: ["player"],
      } as never);
      const { POST } = await import("@/app/api/rigging/validate/route");
      const req = createRequest("http://localhost/api/rigging/validate", {
        method: "POST",
        body: JSON.stringify({}),
      });
      const res = await POST(req);
      await expectEnvelopedError(res, 400);
    });
  });

  // ---------------------------------------------------------------------------
  // POST /api/matrix/validate
  // ---------------------------------------------------------------------------
  describe("POST /api/matrix/validate", () => {
    it("returns { success: false, error } when unauthenticated", async () => {
      mockedGetSession.mockResolvedValue(null);
      const { POST } = await import("@/app/api/matrix/validate/route");
      const req = createRequest("http://localhost/api/matrix/validate", {
        method: "POST",
        body: JSON.stringify({ characterId: "c1", deckId: "d1", config: {} }),
      });
      const res = await POST(req);
      await expectEnvelopedError(res, 401);
    });

    it("returns { success: false, error } when user not found", async () => {
      mockedGetSession.mockResolvedValue("user-1");
      mockedGetUserById.mockResolvedValue(null);
      const { POST } = await import("@/app/api/matrix/validate/route");
      const req = createRequest("http://localhost/api/matrix/validate", {
        method: "POST",
        body: JSON.stringify({ characterId: "c1", deckId: "d1", config: {} }),
      });
      const res = await POST(req);
      await expectEnvelopedError(res, 404);
    });
  });

  // ---------------------------------------------------------------------------
  // POST /api/matrix/overwatch (bare errors in POST; DELETE already correct)
  // ---------------------------------------------------------------------------
  describe("POST /api/matrix/overwatch", () => {
    it("returns { success: false, error } when unauthenticated", async () => {
      mockedGetSession.mockResolvedValue(null);
      const { POST } = await import("@/app/api/matrix/overwatch/route");
      const req = createRequest("http://localhost/api/matrix/overwatch", {
        method: "POST",
        body: JSON.stringify({ characterId: "c1", action: "hack", scoreAdded: 2 }),
      });
      const res = await POST(req);
      await expectEnvelopedError(res, 401);
    });

    it("returns { success: false, error } when user not found", async () => {
      mockedGetSession.mockResolvedValue("user-1");
      mockedGetUserById.mockResolvedValue(null);
      const { POST } = await import("@/app/api/matrix/overwatch/route");
      const req = createRequest("http://localhost/api/matrix/overwatch", {
        method: "POST",
        body: JSON.stringify({ characterId: "c1", action: "hack", scoreAdded: 2 }),
      });
      const res = await POST(req);
      await expectEnvelopedError(res, 404);
    });
  });

  // ---------------------------------------------------------------------------
  // GET /api/matrix/overwatch (bare errors in GET)
  // ---------------------------------------------------------------------------
  describe("GET /api/matrix/overwatch", () => {
    it("returns { success: false, error } when unauthenticated", async () => {
      mockedGetSession.mockResolvedValue(null);
      const { GET } = await import("@/app/api/matrix/overwatch/route");
      const req = createRequest("http://localhost/api/matrix/overwatch?characterId=c1");
      const res = await GET(req);
      await expectEnvelopedError(res, 401);
    });
  });

  // ---------------------------------------------------------------------------
  // GET/POST /api/admin/migrate/gear-state
  // ---------------------------------------------------------------------------
  describe("GET /api/admin/migrate/gear-state", () => {
    it("returns { success: false, error } when unauthenticated", async () => {
      mockedGetSession.mockResolvedValue(null);
      const { GET } = await import("@/app/api/admin/migrate/gear-state/route");
      const req = createRequest("http://localhost/api/admin/migrate/gear-state");
      const res = await GET(req);
      await expectEnvelopedError(res, 401);
    });

    it("returns { success: false, error } when user not found", async () => {
      mockedGetSession.mockResolvedValue("user-1");
      mockedGetUserById.mockResolvedValue(null);
      const { GET } = await import("@/app/api/admin/migrate/gear-state/route");
      const req = createRequest("http://localhost/api/admin/migrate/gear-state");
      const res = await GET(req);
      await expectEnvelopedError(res, 404);
    });

    it("returns { success: false, error } when not admin", async () => {
      mockedGetSession.mockResolvedValue("user-1");
      mockedGetUserById.mockResolvedValue({
        id: "user-1",
        username: "test",
        role: ["player"],
      } as never);
      const { GET } = await import("@/app/api/admin/migrate/gear-state/route");
      const req = createRequest("http://localhost/api/admin/migrate/gear-state");
      const res = await GET(req);
      await expectEnvelopedError(res, 403);
    });
  });

  // ---------------------------------------------------------------------------
  // GET /api/characters/[characterId]/rigging
  // ---------------------------------------------------------------------------
  describe("GET /api/characters/[characterId]/rigging", () => {
    it("returns { success: false, error } when unauthenticated", async () => {
      mockedGetSession.mockResolvedValue(null);
      const { GET } = await import("@/app/api/characters/[characterId]/rigging/route");
      const req = createRequest("http://localhost/api/characters/c1/rigging");
      const res = await GET(req, { params: Promise.resolve({ characterId: "c1" }) });
      await expectEnvelopedError(res, 401);
    });

    it("returns { success: false, error } when user not found", async () => {
      mockedGetSession.mockResolvedValue("user-1");
      mockedGetUserById.mockResolvedValue(null);
      const { GET } = await import("@/app/api/characters/[characterId]/rigging/route");
      const req = createRequest("http://localhost/api/characters/c1/rigging");
      const res = await GET(req, { params: Promise.resolve({ characterId: "c1" }) });
      await expectEnvelopedError(res, 404);
    });

    it("returns { success: false, error } when character not found", async () => {
      mockedGetSession.mockResolvedValue("user-1");
      mockedGetUserById.mockResolvedValue({
        id: "user-1",
        username: "test",
        role: ["player"],
      } as never);
      mockedGetCharacter.mockResolvedValue(null);
      const { GET } = await import("@/app/api/characters/[characterId]/rigging/route");
      const req = createRequest("http://localhost/api/characters/c1/rigging");
      const res = await GET(req, { params: Promise.resolve({ characterId: "c1" }) });
      await expectEnvelopedError(res, 404);
    });
  });
});
