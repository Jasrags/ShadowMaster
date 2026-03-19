/**
 * Tests for Confirm Edge Contact API endpoint
 *
 * POST /api/characters/[characterId]/contacts/[contactId]/confirm-edge
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
  getCharacterContact: vi.fn(),
  updateCharacterContact: vi.fn(),
}));
vi.mock("@/lib/storage/favor-ledger", () => ({ addFavorTransaction: vi.fn() }));
vi.mock("@/lib/rules/i-know-a-guy", () => ({
  canConfirmEdgeContact: vi.fn(),
}));

import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import { getCharacter, saveCharacter } from "@/lib/storage/characters";
import { getCharacterContact, updateCharacterContact } from "@/lib/storage/contacts";
import { addFavorTransaction } from "@/lib/storage/favor-ledger";
import { canConfirmEdgeContact } from "@/lib/rules/i-know-a-guy";
import { POST } from "../route";
import type { Character, User } from "@/lib/types";
import type { SocialContact } from "@/lib/types/contacts";

const TEST_USER_ID = "user-1";
const TEST_CHAR_ID = "char-1";
const TEST_CONTACT_ID = "contact-1";

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
    nuyen: 5000,
    karmaCurrent: 10,
    karmaTotal: 10,
    createdAt: "2024-01-01T00:00:00Z",
    ...overrides,
  } as Character;
}

function mockContact(overrides: Partial<SocialContact> = {}): SocialContact {
  return {
    id: TEST_CONTACT_ID,
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

function makeRequest() {
  return new NextRequest(
    `http://localhost:3000/api/characters/${TEST_CHAR_ID}/contacts/${TEST_CONTACT_ID}/confirm-edge`,
    { method: "POST" }
  );
}

function makeParams() {
  return Promise.resolve({ characterId: TEST_CHAR_ID, contactId: TEST_CONTACT_ID });
}

describe("POST /api/characters/[characterId]/contacts/[contactId]/confirm-edge", () => {
  beforeEach(() => vi.clearAllMocks());

  // Auth
  it("returns 401 when not authenticated", async () => {
    vi.mocked(getSession).mockResolvedValue(null);
    const res = await POST(makeRequest(), { params: makeParams() });
    expect(res.status).toBe(401);
  });

  it("returns 404 when character not found", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(mockUser());
    vi.mocked(getCharacter).mockResolvedValue(null);
    const res = await POST(makeRequest(), { params: makeParams() });
    expect(res.status).toBe(404);
  });

  it("returns 404 when contact not found", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(mockUser());
    vi.mocked(getCharacter).mockResolvedValue(mockCharacter());
    vi.mocked(getCharacterContact).mockResolvedValue(null);
    const res = await POST(makeRequest(), { params: makeParams() });
    expect(res.status).toBe(404);
  });

  // Validation
  it("returns 400 when contact is not pending confirmation", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(mockUser());
    vi.mocked(getCharacter).mockResolvedValue(mockCharacter());
    vi.mocked(getCharacterContact).mockResolvedValue(
      mockContact({ pendingKarmaConfirmation: false })
    );

    const res = await POST(makeRequest(), { params: makeParams() });
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toContain("not pending");
  });

  it("returns 400 when insufficient Karma", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(mockUser());
    vi.mocked(getCharacter).mockResolvedValue(mockCharacter({ karmaCurrent: 2 }));
    vi.mocked(getCharacterContact).mockResolvedValue(mockContact());
    vi.mocked(canConfirmEdgeContact).mockReturnValue({
      allowed: false,
      karmaCost: 4,
      reason: "Insufficient karma: need 4, have 2",
    });

    const res = await POST(makeRequest(), { params: makeParams() });
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toContain("Insufficient karma");
  });

  // Success
  it("confirms contact, deducts Karma, returns result", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(mockUser());
    vi.mocked(getCharacter).mockResolvedValue(mockCharacter({ karmaCurrent: 10 }));
    vi.mocked(getCharacterContact).mockResolvedValue(mockContact());
    vi.mocked(canConfirmEdgeContact).mockReturnValue({ allowed: true, karmaCost: 4 });
    vi.mocked(saveCharacter).mockResolvedValue({} as never);
    vi.mocked(updateCharacterContact).mockResolvedValue(
      mockContact({ pendingKarmaConfirmation: false })
    );
    vi.mocked(addFavorTransaction).mockResolvedValue({} as never);

    const res = await POST(makeRequest(), { params: makeParams() });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.karmaSpent).toBe(4);
    expect(data.karmaRemaining).toBe(6); // 10 - 4
  });

  it("deducts Karma from character", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(mockUser());
    vi.mocked(getCharacter).mockResolvedValue(mockCharacter({ karmaCurrent: 10 }));
    vi.mocked(getCharacterContact).mockResolvedValue(mockContact());
    vi.mocked(canConfirmEdgeContact).mockReturnValue({ allowed: true, karmaCost: 4 });
    vi.mocked(saveCharacter).mockResolvedValue({} as never);
    vi.mocked(updateCharacterContact).mockResolvedValue(mockContact());
    vi.mocked(addFavorTransaction).mockResolvedValue({} as never);

    await POST(makeRequest(), { params: makeParams() });

    expect(saveCharacter).toHaveBeenCalledWith(expect.objectContaining({ karmaCurrent: 6 }));
  });

  it("removes pendingKarmaConfirmation flag", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(mockUser());
    vi.mocked(getCharacter).mockResolvedValue(mockCharacter());
    vi.mocked(getCharacterContact).mockResolvedValue(mockContact());
    vi.mocked(canConfirmEdgeContact).mockReturnValue({ allowed: true, karmaCost: 4 });
    vi.mocked(saveCharacter).mockResolvedValue({} as never);
    vi.mocked(updateCharacterContact).mockResolvedValue(mockContact());
    vi.mocked(addFavorTransaction).mockResolvedValue({} as never);

    await POST(makeRequest(), { params: makeParams() });

    expect(updateCharacterContact).toHaveBeenCalledWith(
      TEST_USER_ID,
      TEST_CHAR_ID,
      TEST_CONTACT_ID,
      expect.objectContaining({ pendingKarmaConfirmation: false })
    );
  });

  it("records transaction with Karma cost", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(mockUser());
    vi.mocked(getCharacter).mockResolvedValue(mockCharacter());
    vi.mocked(getCharacterContact).mockResolvedValue(mockContact());
    vi.mocked(canConfirmEdgeContact).mockReturnValue({ allowed: true, karmaCost: 4 });
    vi.mocked(saveCharacter).mockResolvedValue({} as never);
    vi.mocked(updateCharacterContact).mockResolvedValue(mockContact());
    vi.mocked(addFavorTransaction).mockResolvedValue({} as never);

    await POST(makeRequest(), { params: makeParams() });

    expect(addFavorTransaction).toHaveBeenCalledWith(
      TEST_USER_ID,
      TEST_CHAR_ID,
      expect.objectContaining({
        type: "contact_acquired",
        karmaSpent: 4,
      })
    );
  });

  // Error
  it("returns 500 on storage error", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(mockUser());
    vi.mocked(getCharacter).mockRejectedValue(new Error("boom"));

    const res = await POST(makeRequest(), { params: makeParams() });
    expect(res.status).toBe(500);
  });
});
