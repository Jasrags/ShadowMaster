/**
 * Tests for /api/campaigns/[id]/notes endpoint
 *
 * Tests note listing (GET) and creation (POST) functionality.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST } from "../route";
import { NextRequest } from "next/server";
import * as sessionModule from "@/lib/auth/session";
import * as campaignAuth from "@/lib/auth/campaign";
import * as campaignStorage from "@/lib/storage/campaigns";
import type { Campaign, CampaignNote } from "@/lib/types";

vi.mock("@/lib/auth/session");
vi.mock("@/lib/auth/campaign");
vi.mock("@/lib/storage/campaigns");
vi.mock("uuid", () => ({ v4: () => "new-note-id" }));

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

function createMockNote(overrides?: Partial<CampaignNote>): CampaignNote {
  return {
    id: "test-note-id",
    title: "Test Note",
    content: "Test content",
    category: "general",
    playerVisible: false,
    authorId: "test-gm-id",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
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
    notes: [],
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

describe("GET /api/campaigns/[id]/notes", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);
    const request = createMockRequest("http://localhost:3000/api/campaigns/test-campaign-id/notes");
    const response = await GET(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(401);
  });

  it("should return all notes for GM", async () => {
    const notes = [
      createMockNote({ id: "note-1", playerVisible: false }),
      createMockNote({ id: "note-2", playerVisible: true }),
    ];
    const mockCampaign = createMockCampaign({ notes });
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "gm",
      status: 200,
    });
    const request = createMockRequest("http://localhost:3000/api/campaigns/test-campaign-id/notes");
    const response = await GET(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.notes).toHaveLength(2);
  });

  it("should return only playerVisible notes for players", async () => {
    const notes = [
      createMockNote({ id: "note-1", playerVisible: false }),
      createMockNote({ id: "note-2", playerVisible: true }),
    ];
    const mockCampaign = createMockCampaign({ notes });
    vi.mocked(sessionModule.getSession).mockResolvedValue("player-1");
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "player",
      status: 200,
    });
    const request = createMockRequest("http://localhost:3000/api/campaigns/test-campaign-id/notes");
    const response = await GET(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.notes).toHaveLength(1);
    expect(data.notes[0].playerVisible).toBe(true);
  });

  it("should return 403 when not a member", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("non-member");
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: false,
      campaign: null,
      role: null,
      error: "Access denied",
      status: 403,
    });
    const request = createMockRequest("http://localhost:3000/api/campaigns/test-campaign-id/notes");
    const response = await GET(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(403);
  });

  it("should return 500 on error", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignAuth.authorizeCampaign).mockRejectedValue(new Error("Error"));
    const request = createMockRequest("http://localhost:3000/api/campaigns/test-campaign-id/notes");
    const response = await GET(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(500);
    consoleErrorSpy.mockRestore();
  });
});

describe("POST /api/campaigns/[id]/notes", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/notes",
      { title: "Test", content: "Content" },
      "POST"
    );
    const response = await POST(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(401);
  });

  it("should create note successfully", async () => {
    const mockCampaign = createMockCampaign();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "gm",
      status: 200,
    });
    vi.mocked(campaignStorage.updateCampaign).mockResolvedValue(mockCampaign);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/notes",
      { title: "Test Note", content: "Content" },
      "POST"
    );
    const response = await POST(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    const data = await response.json();
    expect(response.status).toBe(201);
    expect(data.note.title).toBe("Test Note");
  });

  it("should return 400 when title is missing", async () => {
    const mockCampaign = createMockCampaign();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "gm",
      status: 200,
    });
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/notes",
      { content: "Content" },
      "POST"
    );
    const response = await POST(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(400);
  });

  it("should return 400 when content is missing", async () => {
    const mockCampaign = createMockCampaign();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "gm",
      status: 200,
    });
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/notes",
      { title: "Test" },
      "POST"
    );
    const response = await POST(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(400);
  });

  it("should return 403 when not GM", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("player-1");
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: false,
      campaign: null,
      role: "player",
      error: "GM only",
      status: 403,
    });
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/notes",
      { title: "Test", content: "Content" },
      "POST"
    );
    const response = await POST(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(403);
  });

  it("should return 500 on error", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignAuth.authorizeCampaign).mockRejectedValue(new Error("Error"));
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/notes",
      { title: "Test", content: "Content" },
      "POST"
    );
    const response = await POST(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(500);
    consoleErrorSpy.mockRestore();
  });
});
