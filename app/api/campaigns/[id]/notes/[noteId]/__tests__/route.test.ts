/**
 * Tests for /api/campaigns/[id]/notes/[noteId] endpoint
 *
 * Tests note update (PUT) and deletion (DELETE) functionality.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { PUT, DELETE } from "../route";
import { NextRequest } from "next/server";
import * as sessionModule from "@/lib/auth/session";
import * as campaignStorage from "@/lib/storage/campaigns";
import type { Campaign, CampaignNote } from "@/lib/types";

vi.mock("@/lib/auth/session");
vi.mock("@/lib/storage/campaigns");

function createMockRequest(url: string, body?: unknown, method = "PUT"): NextRequest {
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
    notes: [createMockNote()],
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

describe("PUT /api/campaigns/[id]/notes/[noteId]", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/notes/test-note-id",
      { title: "Updated" }
    );
    const response = await PUT(request, {
      params: Promise.resolve({ id: "test-campaign-id", noteId: "test-note-id" }),
    });
    expect(response.status).toBe(401);
  });

  it("should update note successfully", async () => {
    const mockCampaign = createMockCampaign();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    vi.mocked(campaignStorage.updateCampaign).mockResolvedValue(mockCampaign);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/notes/test-note-id",
      { title: "Updated Title" }
    );
    const response = await PUT(request, {
      params: Promise.resolve({ id: "test-campaign-id", noteId: "test-note-id" }),
    });
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.note.title).toBe("Updated Title");
  });

  it("should return 403 when not GM", async () => {
    const mockCampaign = createMockCampaign({ gmId: "other-gm-id" });
    vi.mocked(sessionModule.getSession).mockResolvedValue("player-1");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/notes/test-note-id",
      { title: "Updated" }
    );
    const response = await PUT(request, {
      params: Promise.resolve({ id: "test-campaign-id", noteId: "test-note-id" }),
    });
    expect(response.status).toBe(403);
  });

  it("should return 404 when campaign not found", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(null);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/nonexistent/notes/test-note-id",
      { title: "Updated" }
    );
    const response = await PUT(request, {
      params: Promise.resolve({ id: "nonexistent", noteId: "test-note-id" }),
    });
    expect(response.status).toBe(404);
  });

  it("should return 404 when note not found", async () => {
    const mockCampaign = createMockCampaign({ notes: [] });
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/notes/nonexistent",
      { title: "Updated" }
    );
    const response = await PUT(request, {
      params: Promise.resolve({ id: "test-campaign-id", noteId: "nonexistent" }),
    });
    expect(response.status).toBe(404);
  });

  it("should return 500 on error", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockRejectedValue(new Error("Error"));
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/notes/test-note-id",
      { title: "Updated" }
    );
    const response = await PUT(request, {
      params: Promise.resolve({ id: "test-campaign-id", noteId: "test-note-id" }),
    });
    expect(response.status).toBe(500);
    consoleErrorSpy.mockRestore();
  });
});

describe("DELETE /api/campaigns/[id]/notes/[noteId]", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/notes/test-note-id",
      undefined,
      "DELETE"
    );
    const response = await DELETE(request, {
      params: Promise.resolve({ id: "test-campaign-id", noteId: "test-note-id" }),
    });
    expect(response.status).toBe(401);
  });

  it("should delete note successfully", async () => {
    const mockCampaign = createMockCampaign();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    vi.mocked(campaignStorage.updateCampaign).mockResolvedValue({
      ...mockCampaign,
      notes: [],
    });
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/notes/test-note-id",
      undefined,
      "DELETE"
    );
    const response = await DELETE(request, {
      params: Promise.resolve({ id: "test-campaign-id", noteId: "test-note-id" }),
    });
    expect(response.status).toBe(200);
  });

  it("should return 403 when not GM", async () => {
    const mockCampaign = createMockCampaign({ gmId: "other-gm-id" });
    vi.mocked(sessionModule.getSession).mockResolvedValue("player-1");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/notes/test-note-id",
      undefined,
      "DELETE"
    );
    const response = await DELETE(request, {
      params: Promise.resolve({ id: "test-campaign-id", noteId: "test-note-id" }),
    });
    expect(response.status).toBe(403);
  });

  it("should return 404 when note not found", async () => {
    const mockCampaign = createMockCampaign({ notes: [] });
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/notes/nonexistent",
      undefined,
      "DELETE"
    );
    const response = await DELETE(request, {
      params: Promise.resolve({ id: "test-campaign-id", noteId: "nonexistent" }),
    });
    expect(response.status).toBe(404);
  });
});
