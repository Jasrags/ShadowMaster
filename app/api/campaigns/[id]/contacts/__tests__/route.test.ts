/**
 * Tests for /api/campaigns/[id]/contacts endpoint
 *
 * Tests campaign contact listing (GET) and creation (POST) functionality.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST } from "../route";
import { NextRequest } from "next/server";
import * as sessionModule from "@/lib/auth/session";
import * as userStorage from "@/lib/storage/users";
import * as campaignStorage from "@/lib/storage/campaigns";
import * as contactStorage from "@/lib/storage/contacts";
import * as contactRules from "@/lib/rules/contacts";
import type { Campaign, User, SocialContact } from "@/lib/types";

vi.mock("@/lib/auth/session");
vi.mock("@/lib/storage/users");
vi.mock("@/lib/storage/campaigns");
vi.mock("@/lib/storage/contacts");
vi.mock("@/lib/rules/contacts");

function createMockRequest(url: string, body?: unknown, method = "GET"): NextRequest {
  const headers = new Headers();
  if (body) headers.set("Content-Type", "application/json");
  const urlObj = new URL(url);
  const request = new NextRequest(urlObj, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers,
  });
  Object.defineProperty(request, "nextUrl", { value: urlObj, writable: false });
  if (body) (request as { json: () => Promise<unknown> }).json = async () => body;
  return request;
}

function createMockUser(overrides?: Partial<User>): User {
  return {
    id: "test-user-id",
    username: "testuser",
    passwordHash: "hash",
    email: "test@example.com",
    createdAt: new Date().toISOString(),
    ...overrides,
  } as User;
}

function createMockContact(overrides?: Partial<SocialContact>): SocialContact {
  return {
    id: "test-contact-id",
    campaignId: "test-campaign-id",
    name: "Test Contact",
    archetype: "fixer",
    connection: 3,
    loyalty: 2,
    favorBalance: 0,
    status: "active",
    visibility: {
      playerVisible: true,
      showConnection: true,
      showLoyalty: true,
      showFavorBalance: true,
      showSpecializations: true,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  } as SocialContact;
}

function createMockCampaign(overrides?: Partial<Campaign>): Campaign {
  return {
    id: "test-campaign-id",
    gmId: "test-gm-id",
    title: "Test Campaign",
    status: "active",
    editionId: "sr5-edition-id",
    editionCode: "sr5",
    enabledBookIds: ["core-rulebook"],
    enabledCreationMethodIds: ["priority"],
    gameplayLevel: "street",
    visibility: "public",
    playerIds: ["player-1"],
    advancementSettings: {
      trainingTimeMultiplier: 1.0,
      attributeKarmaMultiplier: 5,
      skillKarmaMultiplier: 2,
      skillGroupKarmaMultiplier: 5,
      knowledgeSkillKarmaMultiplier: 1,
      specializationKarmaCost: 7,
      spellKarmaCost: 5,
      complexFormKarmaCost: 4,
      attributeRatingCap: 10,
      skillRatingCap: 13,
      allowInstantAdvancement: false,
      requireApproval: true,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

describe("GET /api/campaigns/[id]/contacts", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/contacts"
    );
    const response = await GET(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(401);
  });

  it("should return all contacts for GM", async () => {
    const contacts = [
      createMockContact({
        visibility: {
          playerVisible: true,
          showConnection: true,
          showLoyalty: true,
          showFavorBalance: true,
          showSpecializations: true,
        },
      }),
      createMockContact({
        id: "hidden-contact",
        visibility: {
          playerVisible: false,
          showConnection: false,
          showLoyalty: false,
          showFavorBalance: false,
          showSpecializations: false,
        },
      }),
    ];
    const mockCampaign = createMockCampaign();
    const mockUser = createMockUser({ id: "test-gm-id" });
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(userStorage.getUserById).mockResolvedValue(mockUser);
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    vi.mocked(contactStorage.getCampaignContacts).mockResolvedValue(contacts);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/contacts"
    );
    const response = await GET(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.contacts).toHaveLength(2);
    expect(data.isGm).toBe(true);
  });

  it("should filter non-visible contacts for players", async () => {
    const contacts = [
      createMockContact({
        visibility: {
          playerVisible: true,
          showConnection: true,
          showLoyalty: true,
          showFavorBalance: true,
          showSpecializations: true,
        },
      }),
      createMockContact({
        id: "hidden-contact",
        visibility: {
          playerVisible: false,
          showConnection: false,
          showLoyalty: false,
          showFavorBalance: false,
          showSpecializations: false,
        },
      }),
    ];
    const mockCampaign = createMockCampaign();
    const mockUser = createMockUser({ id: "player-1" });
    vi.mocked(sessionModule.getSession).mockResolvedValue("player-1");
    vi.mocked(userStorage.getUserById).mockResolvedValue(mockUser);
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    vi.mocked(contactStorage.getCampaignContacts).mockResolvedValue(contacts);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/contacts"
    );
    const response = await GET(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.contacts).toHaveLength(1);
    expect(data.isGm).toBe(false);
  });

  it("should filter by archetype", async () => {
    const contacts = [createMockContact({ archetype: "fixer" })];
    const mockCampaign = createMockCampaign();
    const mockUser = createMockUser({ id: "test-gm-id" });
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(userStorage.getUserById).mockResolvedValue(mockUser);
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    vi.mocked(contactStorage.getCampaignContacts).mockResolvedValue(contacts);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/contacts?archetype=fixer"
    );
    const response = await GET(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(200);
  });

  it("should return 403 when not a member", async () => {
    const mockCampaign = createMockCampaign();
    const mockUser = createMockUser({ id: "non-member" });
    vi.mocked(sessionModule.getSession).mockResolvedValue("non-member");
    vi.mocked(userStorage.getUserById).mockResolvedValue(mockUser);
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/contacts"
    );
    const response = await GET(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(403);
  });

  it("should return 404 when campaign not found", async () => {
    const mockUser = createMockUser({ id: "test-gm-id" });
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(userStorage.getUserById).mockResolvedValue(mockUser);
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(null);
    const request = createMockRequest("http://localhost:3000/api/campaigns/nonexistent/contacts");
    const response = await GET(request, { params: Promise.resolve({ id: "nonexistent" }) });
    expect(response.status).toBe(404);
  });

  it("should return 500 on error", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(userStorage.getUserById).mockRejectedValue(new Error("Error"));
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/contacts"
    );
    const response = await GET(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(500);
    consoleErrorSpy.mockRestore();
  });
});

describe("POST /api/campaigns/[id]/contacts", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/contacts",
      { name: "New Contact", archetype: "fixer", connection: 3, loyalty: 2 },
      "POST"
    );
    const response = await POST(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(401);
  });

  it("should create contact successfully", async () => {
    const mockCampaign = createMockCampaign();
    const mockUser = createMockUser({ id: "test-gm-id" });
    const mockContact = createMockContact();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(userStorage.getUserById).mockResolvedValue(mockUser);
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    vi.mocked(contactRules.validateContact).mockReturnValue({
      valid: true,
      errors: [],
      warnings: [],
    });
    vi.mocked(contactStorage.getCampaignContacts).mockResolvedValue([]);
    vi.mocked(contactStorage.createCampaignContact).mockResolvedValue(mockContact);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/contacts",
      { name: "New Contact", archetype: "fixer", connection: 3, loyalty: 2 },
      "POST"
    );
    const response = await POST(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    const data = await response.json();
    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.contact).toBeDefined();
  });

  it("should return 400 when validation fails", async () => {
    const mockCampaign = createMockCampaign();
    const mockUser = createMockUser({ id: "test-gm-id" });
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(userStorage.getUserById).mockResolvedValue(mockUser);
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    vi.mocked(contactRules.validateContact).mockReturnValue({
      valid: false,
      errors: ["Invalid connection rating"],
      warnings: [],
    });
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/contacts",
      { name: "Bad Contact", archetype: "fixer", connection: 100, loyalty: 2 },
      "POST"
    );
    const response = await POST(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(400);
  });

  it("should return 400 when duplicate name exists", async () => {
    const mockCampaign = createMockCampaign();
    const mockUser = createMockUser({ id: "test-gm-id" });
    const existingContact = createMockContact({ name: "existing contact" });
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(userStorage.getUserById).mockResolvedValue(mockUser);
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    vi.mocked(contactRules.validateContact).mockReturnValue({
      valid: true,
      errors: [],
      warnings: [],
    });
    vi.mocked(contactStorage.getCampaignContacts).mockResolvedValue([existingContact]);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/contacts",
      { name: "Existing Contact", archetype: "fixer", connection: 3, loyalty: 2 },
      "POST"
    );
    const response = await POST(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toContain("already exists");
  });

  it("should return 403 when not GM", async () => {
    const mockCampaign = createMockCampaign();
    const mockUser = createMockUser({ id: "player-1" });
    vi.mocked(sessionModule.getSession).mockResolvedValue("player-1");
    vi.mocked(userStorage.getUserById).mockResolvedValue(mockUser);
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/contacts",
      { name: "New Contact", archetype: "fixer", connection: 3, loyalty: 2 },
      "POST"
    );
    const response = await POST(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(403);
  });

  it("should return 500 on error", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(userStorage.getUserById).mockRejectedValue(new Error("Error"));
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/contacts",
      { name: "New Contact", archetype: "fixer", connection: 3, loyalty: 2 },
      "POST"
    );
    const response = await POST(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(500);
    consoleErrorSpy.mockRestore();
  });
});
