/**
 * Tests for /api/campaigns/[id]/posts endpoint
 *
 * Tests post listing (GET) and creation (POST) functionality.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST } from "../route";
import { NextRequest } from "next/server";
import * as sessionModule from "@/lib/auth/session";
import * as campaignStorage from "@/lib/storage/campaigns";
import type { Campaign, CampaignPost } from "@/lib/types";

vi.mock("@/lib/auth/session");
vi.mock("@/lib/storage/campaigns");
vi.mock("@/lib/storage/users", () => ({
  getUserById: vi.fn().mockResolvedValue({ id: "test-gm-id", username: "testgm" }),
}));
vi.mock("@/lib/storage/activity", () => ({
  logActivity: vi.fn().mockResolvedValue(undefined),
}));
vi.mock("@/lib/storage/notifications", () => ({
  createNotification: vi.fn().mockResolvedValue(undefined),
}));

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

function createMockPost(overrides?: Partial<CampaignPost>): CampaignPost {
  return {
    id: "test-post-id",
    title: "Test Post",
    content: "Test content",
    authorId: "test-gm-id",
    isPinned: false,
    type: "announcement",
    playerVisible: true,
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
    posts: [],
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

describe("GET /api/campaigns/[id]/posts", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);
    const request = createMockRequest("http://localhost:3000/api/campaigns/test-campaign-id/posts");
    const response = await GET(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(401);
  });

  it("should return all posts for GM", async () => {
    const posts = [
      createMockPost({ id: "post-1", playerVisible: false }),
      createMockPost({ id: "post-2", playerVisible: true }),
    ];
    const mockCampaign = createMockCampaign();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    vi.mocked(campaignStorage.getCampaignPosts).mockResolvedValue(posts);
    const request = createMockRequest("http://localhost:3000/api/campaigns/test-campaign-id/posts");
    const response = await GET(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.posts).toHaveLength(2);
  });

  it("should return only playerVisible posts for players", async () => {
    const posts = [
      createMockPost({ id: "post-1", playerVisible: false }),
      createMockPost({ id: "post-2", playerVisible: true }),
    ];
    const mockCampaign = createMockCampaign();
    vi.mocked(sessionModule.getSession).mockResolvedValue("player-1");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    vi.mocked(campaignStorage.getCampaignPosts).mockResolvedValue(posts);
    const request = createMockRequest("http://localhost:3000/api/campaigns/test-campaign-id/posts");
    const response = await GET(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.posts).toHaveLength(1);
    expect(data.posts[0].playerVisible).toBe(true);
  });

  it("should return 403 when not a member", async () => {
    const mockCampaign = createMockCampaign();
    vi.mocked(sessionModule.getSession).mockResolvedValue("non-member");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    const request = createMockRequest("http://localhost:3000/api/campaigns/test-campaign-id/posts");
    const response = await GET(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(403);
  });

  it("should return 404 when campaign not found", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(null);
    const request = createMockRequest("http://localhost:3000/api/campaigns/nonexistent/posts");
    const response = await GET(request, { params: Promise.resolve({ id: "nonexistent" }) });
    expect(response.status).toBe(404);
  });

  it("should return 500 on error", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockRejectedValue(new Error("Error"));
    const request = createMockRequest("http://localhost:3000/api/campaigns/test-campaign-id/posts");
    const response = await GET(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(500);
    consoleErrorSpy.mockRestore();
  });
});

describe("POST /api/campaigns/[id]/posts", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/posts",
      { title: "Test", content: "Content", type: "announcement" },
      "POST"
    );
    const response = await POST(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(401);
  });

  it("should create post successfully for GM", async () => {
    const mockCampaign = createMockCampaign();
    const mockPost = createMockPost();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    vi.mocked(campaignStorage.createCampaignPost).mockResolvedValue(mockPost);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/posts",
      { title: "Test Post", content: "Content", type: "announcement" },
      "POST"
    );
    const response = await POST(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.post).toBeDefined();
  });

  it("should create post successfully for player", async () => {
    const mockCampaign = createMockCampaign();
    const mockPost = createMockPost({ authorId: "player-1" });
    vi.mocked(sessionModule.getSession).mockResolvedValue("player-1");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    vi.mocked(campaignStorage.createCampaignPost).mockResolvedValue(mockPost);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/posts",
      { title: "Test Post", content: "Content", type: "rumor" },
      "POST"
    );
    const response = await POST(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.post).toBeDefined();
  });

  it("should return 400 when title is missing", async () => {
    const mockCampaign = createMockCampaign();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/posts",
      { content: "Content", type: "announcement" },
      "POST"
    );
    const response = await POST(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(400);
  });

  it("should return 400 when content is missing", async () => {
    const mockCampaign = createMockCampaign();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/posts",
      { title: "Test", type: "announcement" },
      "POST"
    );
    const response = await POST(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(400);
  });

  it("should return 400 when type is missing", async () => {
    const mockCampaign = createMockCampaign();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/posts",
      { title: "Test", content: "Content" },
      "POST"
    );
    const response = await POST(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(400);
  });

  it("should return 403 when not a member", async () => {
    const mockCampaign = createMockCampaign();
    vi.mocked(sessionModule.getSession).mockResolvedValue("non-member");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/posts",
      { title: "Test", content: "Content", type: "announcement" },
      "POST"
    );
    const response = await POST(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(403);
  });

  it("should return 500 on error", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockRejectedValue(new Error("Error"));
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/posts",
      { title: "Test", content: "Content", type: "announcement" },
      "POST"
    );
    const response = await POST(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(500);
    consoleErrorSpy.mockRestore();
  });
});
