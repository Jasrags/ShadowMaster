/**
 * Tests for Edge Acquire API endpoint (I Know a Guy)
 *
 * POST /api/characters/[characterId]/contacts/edge-acquire
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/auth/session", () => ({ getSession: vi.fn() }));
vi.mock("@/lib/storage/users", () => ({ getUserById: vi.fn() }));
vi.mock("@/lib/storage/characters", () => ({
  getCharacter: vi.fn(),
  saveCharacter: vi.fn(),
}));
vi.mock("@/lib/storage/contacts", () => ({
  addCharacterContact: vi.fn(),
  updateCharacterContact: vi.fn(),
}));
vi.mock("@/lib/storage/favor-ledger", () => ({ addFavorTransaction: vi.fn() }));
vi.mock("@/lib/rules/i-know-a-guy", () => ({
  validateIKnowAGuy: vi.fn(),
  createEdgeContactSpec: vi.fn(),
  calculateConfirmationKarmaCost: vi.fn(),
}));

import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import { getCharacter, saveCharacter } from "@/lib/storage/characters";
import { addCharacterContact, updateCharacterContact } from "@/lib/storage/contacts";
import { addFavorTransaction } from "@/lib/storage/favor-ledger";
import {
  validateIKnowAGuy,
  createEdgeContactSpec,
  calculateConfirmationKarmaCost,
} from "@/lib/rules/i-know-a-guy";
import { POST } from "../route";
import type { Character, User } from "@/lib/types";
import type { SocialContact } from "@/lib/types/contacts";

const TEST_USER_ID = "user-1";
const TEST_CHAR_ID = "char-1";

function mockUser(): User {
  return {
    id: TEST_USER_ID,
    username: "test",
    email: "t@t.com",
    passwordHash: "x",
    role: "player",
    createdAt: "2024-01-01T00:00:00Z",
  } as unknown as User;
}

function mockCharacter(overrides: Partial<Character> = {}): Character {
  return {
    id: TEST_CHAR_ID,
    ownerId: TEST_USER_ID,
    name: "Runner",
    editionCode: "sr5",
    specialAttributes: { edge: 6, essence: 6 },
    condition: { physicalDamage: 0, stunDamage: 0, edgeCurrent: 6 },
    nuyen: 5000,
    karmaCurrent: 10,
    karmaTotal: 10,
    createdAt: "2024-01-01T00:00:00Z",
    ...overrides,
  } as Character;
}

function mockContact(overrides: Partial<SocialContact> = {}): SocialContact {
  return {
    id: "contact-new",
    characterId: TEST_CHAR_ID,
    name: "Quick Fix",
    connection: 3,
    loyalty: 1,
    archetype: "Fixer",
    status: "active",
    favorBalance: 0,
    group: "personal",
    visibility: {
      playerVisible: true,
      showConnection: true,
      showLoyalty: true,
      showFavorBalance: true,
      showSpecializations: true,
    },
    acquisitionMethod: "edge",
    pendingKarmaConfirmation: true,
    createdAt: "2024-01-01T00:00:00Z",
    ...overrides,
  };
}

function makeRequest(body: unknown) {
  return new NextRequest(
    `http://localhost:3000/api/characters/${TEST_CHAR_ID}/contacts/edge-acquire`,
    {
      method: "POST",
      body: JSON.stringify(body),
    }
  );
}

function makeParams() {
  return Promise.resolve({ characterId: TEST_CHAR_ID });
}

function setupSuccess(charOverrides: Partial<Character> = {}) {
  vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
  vi.mocked(getUserById).mockResolvedValue(mockUser());
  vi.mocked(getCharacter).mockResolvedValue(mockCharacter(charOverrides));
  return mockCharacter(charOverrides);
}

describe("POST /api/characters/[characterId]/contacts/edge-acquire", () => {
  beforeEach(() => vi.clearAllMocks());

  // Auth
  it("returns 401 when not authenticated", async () => {
    vi.mocked(getSession).mockResolvedValue(null);
    const res = await POST(makeRequest({ name: "X", archetype: "Fixer", connection: 1 }), {
      params: makeParams(),
    });
    expect(res.status).toBe(401);
  });

  it("returns 404 when user not found", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(null);
    const res = await POST(makeRequest({ name: "X", archetype: "Fixer", connection: 1 }), {
      params: makeParams(),
    });
    expect(res.status).toBe(404);
  });

  it("returns 404 when character not found", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(mockUser());
    vi.mocked(getCharacter).mockResolvedValue(null);
    const res = await POST(makeRequest({ name: "X", archetype: "Fixer", connection: 1 }), {
      params: makeParams(),
    });
    expect(res.status).toBe(404);
  });

  // Validation
  it("returns 400 when name missing", async () => {
    setupSuccess();
    const res = await POST(makeRequest({ archetype: "Fixer", connection: 1 }), {
      params: makeParams(),
    });
    expect(res.status).toBe(400);
    expect((await res.json()).error).toContain("name");
  });

  it("returns 400 when archetype missing", async () => {
    setupSuccess();
    const res = await POST(makeRequest({ name: "X", connection: 1 }), { params: makeParams() });
    expect(res.status).toBe(400);
    expect((await res.json()).error).toContain("archetype");
  });

  it("returns 400 when connection invalid", async () => {
    setupSuccess();
    const res = await POST(makeRequest({ name: "X", archetype: "Fixer", connection: -1 }), {
      params: makeParams(),
    });
    expect(res.status).toBe(400);
    expect((await res.json()).error).toContain("connection");
  });

  it("returns 400 when connection exceeds max of 12", async () => {
    setupSuccess();
    const res = await POST(makeRequest({ name: "X", archetype: "Fixer", connection: 13 }), {
      params: makeParams(),
    });
    expect(res.status).toBe(400);
    expect((await res.json()).error).toContain("between 1 and 12");
  });

  it("returns 400 when Edge insufficient", async () => {
    setupSuccess({ condition: { physicalDamage: 0, stunDamage: 0, edgeCurrent: 2 } });
    vi.mocked(validateIKnowAGuy).mockReturnValue({
      allowed: false,
      edgeCost: 6,
      reason: "Insufficient Edge: need 6, have 2",
    });

    const res = await POST(makeRequest({ name: "X", archetype: "Fixer", connection: 3 }), {
      params: makeParams(),
    });
    expect(res.status).toBe(400);
    expect((await res.json()).error).toContain("Insufficient Edge");
  });

  // Success
  it("creates Edge contact, deducts Edge, returns cost breakdown", async () => {
    const char = setupSuccess();
    const createdContact = mockContact();
    const updatedContact = mockContact();

    vi.mocked(validateIKnowAGuy).mockReturnValue({ allowed: true, edgeCost: 6 });
    vi.mocked(createEdgeContactSpec).mockReturnValue({
      name: "Quick Fix",
      connection: 3,
      loyalty: 1,
      archetype: "Fixer",
      acquisitionMethod: "edge",
      pendingKarmaConfirmation: true,
    });
    vi.mocked(calculateConfirmationKarmaCost).mockReturnValue(4);
    vi.mocked(addCharacterContact).mockResolvedValue(createdContact);
    vi.mocked(updateCharacterContact).mockResolvedValue(updatedContact);
    vi.mocked(saveCharacter).mockResolvedValue(char);
    vi.mocked(addFavorTransaction).mockResolvedValue({} as never);

    const res = await POST(makeRequest({ name: "Quick Fix", archetype: "Fixer", connection: 3 }), {
      params: makeParams(),
    });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.edgeSpent).toBe(6);
    expect(data.edgeRemaining).toBe(0); // 6 - 6
    expect(data.karmaCostToConfirm).toBe(4);
    expect(data.contact).toBeDefined();
  });

  it("sets edgeRefreshBlocked on character", async () => {
    setupSuccess();
    vi.mocked(validateIKnowAGuy).mockReturnValue({ allowed: true, edgeCost: 2 });
    vi.mocked(createEdgeContactSpec).mockReturnValue({
      name: "X",
      connection: 1,
      loyalty: 1,
      archetype: "Fixer",
      acquisitionMethod: "edge",
      pendingKarmaConfirmation: true,
    });
    vi.mocked(calculateConfirmationKarmaCost).mockReturnValue(2);
    vi.mocked(addCharacterContact).mockResolvedValue(mockContact());
    vi.mocked(updateCharacterContact).mockResolvedValue(mockContact());
    vi.mocked(saveCharacter).mockResolvedValue({} as never);
    vi.mocked(addFavorTransaction).mockResolvedValue({} as never);

    await POST(makeRequest({ name: "X", archetype: "Fixer", connection: 1 }), {
      params: makeParams(),
    });

    expect(saveCharacter).toHaveBeenCalledWith(
      expect.objectContaining({
        condition: expect.objectContaining({ edgeRefreshBlocked: true }),
      })
    );
  });

  it("records contact_acquired transaction", async () => {
    setupSuccess();
    vi.mocked(validateIKnowAGuy).mockReturnValue({ allowed: true, edgeCost: 2 });
    vi.mocked(createEdgeContactSpec).mockReturnValue({
      name: "Doc",
      connection: 1,
      loyalty: 1,
      archetype: "Street Doc",
      acquisitionMethod: "edge",
      pendingKarmaConfirmation: true,
    });
    vi.mocked(calculateConfirmationKarmaCost).mockReturnValue(2);
    vi.mocked(addCharacterContact).mockResolvedValue(mockContact({ id: "c-99" }));
    vi.mocked(updateCharacterContact).mockResolvedValue(mockContact({ id: "c-99" }));
    vi.mocked(saveCharacter).mockResolvedValue({} as never);
    vi.mocked(addFavorTransaction).mockResolvedValue({} as never);

    await POST(makeRequest({ name: "Doc", archetype: "Street Doc", connection: 1 }), {
      params: makeParams(),
    });

    expect(addFavorTransaction).toHaveBeenCalledWith(
      TEST_USER_ID,
      TEST_CHAR_ID,
      expect.objectContaining({
        contactId: "c-99",
        type: "contact_acquired",
        description: expect.stringContaining("I Know a Guy"),
      })
    );
  });

  it("uses specialAttributes.edge when edgeCurrent is undefined", async () => {
    setupSuccess({ condition: { physicalDamage: 0, stunDamage: 0 } });
    vi.mocked(validateIKnowAGuy).mockReturnValue({ allowed: true, edgeCost: 2 });
    vi.mocked(createEdgeContactSpec).mockReturnValue({
      name: "X",
      connection: 1,
      loyalty: 1,
      archetype: "Fixer",
      acquisitionMethod: "edge",
      pendingKarmaConfirmation: true,
    });
    vi.mocked(calculateConfirmationKarmaCost).mockReturnValue(2);
    vi.mocked(addCharacterContact).mockResolvedValue(mockContact());
    vi.mocked(updateCharacterContact).mockResolvedValue(mockContact());
    vi.mocked(saveCharacter).mockResolvedValue({} as never);
    vi.mocked(addFavorTransaction).mockResolvedValue({} as never);

    await POST(makeRequest({ name: "X", archetype: "Fixer", connection: 1 }), {
      params: makeParams(),
    });

    // Should use specialAttributes.edge (6) as fallback
    expect(validateIKnowAGuy).toHaveBeenCalledWith({
      currentEdge: 6,
      desiredConnection: 1,
    });
  });

  // Error
  it("returns 500 on storage error", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(mockUser());
    vi.mocked(getCharacter).mockRejectedValue(new Error("boom"));

    const res = await POST(makeRequest({ name: "X", archetype: "Fixer", connection: 1 }), {
      params: makeParams(),
    });
    expect(res.status).toBe(500);
  });
});
