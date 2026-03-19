/**
 * Tests for Expire Edge Contacts API endpoint
 *
 * POST /api/characters/[characterId]/contacts/expire-edge
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
  getCharacterContacts: vi.fn(),
  removeCharacterContact: vi.fn(),
}));
vi.mock("@/lib/storage/favor-ledger", () => ({ addFavorTransaction: vi.fn() }));

import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import { getCharacter, saveCharacter } from "@/lib/storage/characters";
import { getCharacterContacts, removeCharacterContact } from "@/lib/storage/contacts";
import { addFavorTransaction } from "@/lib/storage/favor-ledger";
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
    condition: { physicalDamage: 0, stunDamage: 0, edgeCurrent: 4, edgeRefreshBlocked: true },
    nuyen: 5000,
    karmaCurrent: 10,
    karmaTotal: 10,
    createdAt: "2024-01-01T00:00:00Z",
    ...overrides,
  } as Character;
}

function mockContact(id: string, pending: boolean): SocialContact {
  return {
    id,
    characterId: TEST_CHAR_ID,
    name: `Contact ${id}`,
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
    pendingKarmaConfirmation: pending,
    createdAt: "2024-01-01T00:00:00Z",
  };
}

function makeRequest() {
  return new NextRequest(
    `http://localhost:3000/api/characters/${TEST_CHAR_ID}/contacts/expire-edge`,
    { method: "POST" }
  );
}

function makeParams() {
  return Promise.resolve({ characterId: TEST_CHAR_ID });
}

describe("POST /api/characters/[characterId]/contacts/expire-edge", () => {
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

  // No-op
  it("returns success with 0 expired when no pending contacts", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(mockUser());
    vi.mocked(getCharacter).mockResolvedValue(mockCharacter());
    vi.mocked(getCharacterContacts).mockResolvedValue([
      mockContact("c-1", false), // confirmed
    ]);

    const res = await POST(makeRequest(), { params: makeParams() });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.expiredCount).toBe(0);
    expect(data.expiredContactIds).toEqual([]);
    expect(removeCharacterContact).not.toHaveBeenCalled();
  });

  // Success — removes unconfirmed
  it("removes unconfirmed Edge contacts and lifts refresh block", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(mockUser());
    vi.mocked(getCharacter).mockResolvedValue(mockCharacter());
    vi.mocked(getCharacterContacts).mockResolvedValue([
      mockContact("c-pending-1", true),
      mockContact("c-confirmed", false),
      mockContact("c-pending-2", true),
    ]);
    vi.mocked(removeCharacterContact).mockResolvedValue(true);
    vi.mocked(addFavorTransaction).mockResolvedValue({} as never);
    vi.mocked(saveCharacter).mockResolvedValue({} as never);

    const res = await POST(makeRequest(), { params: makeParams() });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.expiredCount).toBe(2);
    expect(data.expiredContactIds).toEqual(["c-pending-1", "c-pending-2"]);
  });

  it("calls removeCharacterContact for each unconfirmed contact", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(mockUser());
    vi.mocked(getCharacter).mockResolvedValue(mockCharacter());
    vi.mocked(getCharacterContacts).mockResolvedValue([
      mockContact("c-1", true),
      mockContact("c-2", true),
    ]);
    vi.mocked(removeCharacterContact).mockResolvedValue(true);
    vi.mocked(addFavorTransaction).mockResolvedValue({} as never);
    vi.mocked(saveCharacter).mockResolvedValue({} as never);

    await POST(makeRequest(), { params: makeParams() });

    expect(removeCharacterContact).toHaveBeenCalledTimes(2);
    expect(removeCharacterContact).toHaveBeenCalledWith(TEST_USER_ID, TEST_CHAR_ID, "c-1");
    expect(removeCharacterContact).toHaveBeenCalledWith(TEST_USER_ID, TEST_CHAR_ID, "c-2");
  });

  it("records status_change transaction for each expired contact", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(mockUser());
    vi.mocked(getCharacter).mockResolvedValue(mockCharacter());
    vi.mocked(getCharacterContacts).mockResolvedValue([mockContact("c-1", true)]);
    vi.mocked(removeCharacterContact).mockResolvedValue(true);
    vi.mocked(addFavorTransaction).mockResolvedValue({} as never);
    vi.mocked(saveCharacter).mockResolvedValue({} as never);

    await POST(makeRequest(), { params: makeParams() });

    expect(addFavorTransaction).toHaveBeenCalledWith(
      TEST_USER_ID,
      TEST_CHAR_ID,
      expect.objectContaining({
        contactId: "c-1",
        type: "status_change",
        description: expect.stringContaining("expired"),
      })
    );
  });

  it("lifts edgeRefreshBlocked flag", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(mockUser());
    vi.mocked(getCharacter).mockResolvedValue(mockCharacter());
    vi.mocked(getCharacterContacts).mockResolvedValue([mockContact("c-1", true)]);
    vi.mocked(removeCharacterContact).mockResolvedValue(true);
    vi.mocked(addFavorTransaction).mockResolvedValue({} as never);
    vi.mocked(saveCharacter).mockResolvedValue({} as never);

    await POST(makeRequest(), { params: makeParams() });

    expect(saveCharacter).toHaveBeenCalledWith(
      expect.objectContaining({
        condition: expect.objectContaining({ edgeRefreshBlocked: false }),
      })
    );
  });

  it("does not save character if edgeRefreshBlocked was already false", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(mockUser());
    vi.mocked(getCharacter).mockResolvedValue(
      mockCharacter({ condition: { physicalDamage: 0, stunDamage: 0, edgeRefreshBlocked: false } })
    );
    vi.mocked(getCharacterContacts).mockResolvedValue([mockContact("c-1", true)]);
    vi.mocked(removeCharacterContact).mockResolvedValue(true);
    vi.mocked(addFavorTransaction).mockResolvedValue({} as never);

    await POST(makeRequest(), { params: makeParams() });

    expect(saveCharacter).not.toHaveBeenCalled();
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
