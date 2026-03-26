/**
 * Tests for /api/campaigns/[id]/run-tracker endpoint
 *
 * Tests run tracker session listing (GET), creation (POST),
 * and phase advancement (PATCH) functionality.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST, PATCH } from "../route";
import { NextRequest } from "next/server";
import * as sessionModule from "@/lib/auth/session";
import * as campaignStorage from "@/lib/storage/campaigns";
import type { Campaign, RunTrackerSession } from "@/lib/types";

vi.mock("@/lib/auth/session");
vi.mock("@/lib/storage/campaigns");

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

function createMockRunTrackerSession(overrides?: Partial<RunTrackerSession>): RunTrackerSession {
  return {
    id: "test-session-id",
    label: "Run #1 — Wetwork",
    activePhaseId: "the-meet",
    phaseTransitions: [{ phaseId: "the-meet", enteredAt: "2026-03-25T00:00:00.000Z" }],
    status: "active",
    createdAt: "2026-03-25T00:00:00.000Z",
    updatedAt: "2026-03-25T00:00:00.000Z",
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
    runTrackerSessions: [],
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

const makeParams = (id: string) => ({ params: Promise.resolve({ id }) });

describe("GET /api/campaigns/[id]/run-tracker", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/run-tracker"
    );
    const response = await GET(request, makeParams("test-campaign-id"));
    expect(response.status).toBe(401);
  });

  it("should return 403 for non-GM users", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("player-1");
    const campaign = createMockCampaign();
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(campaign);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/run-tracker"
    );
    const response = await GET(request, makeParams("test-campaign-id"));
    expect(response.status).toBe(403);
  });

  it("should return empty array when no sessions exist", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    const campaign = createMockCampaign();
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(campaign);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/run-tracker"
    );
    const response = await GET(request, makeParams("test-campaign-id"));
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.runTrackerSessions).toEqual([]);
  });

  it("should return existing sessions", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    const session = createMockRunTrackerSession();
    const campaign = createMockCampaign({ runTrackerSessions: [session] });
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(campaign);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/run-tracker"
    );
    const response = await GET(request, makeParams("test-campaign-id"));
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.runTrackerSessions).toHaveLength(1);
    expect(data.runTrackerSessions[0].label).toBe("Run #1 — Wetwork");
  });
});

describe("POST /api/campaigns/[id]/run-tracker", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/run-tracker",
      { label: "Run #1", initialPhaseId: "the-meet" },
      "POST"
    );
    const response = await POST(request, makeParams("test-campaign-id"));
    expect(response.status).toBe(401);
  });

  it("should return 400 when label is missing", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    const campaign = createMockCampaign();
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(campaign);
    vi.mocked(campaignStorage.updateCampaign).mockResolvedValue(campaign);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/run-tracker",
      { initialPhaseId: "the-meet" },
      "POST"
    );
    const response = await POST(request, makeParams("test-campaign-id"));
    expect(response.status).toBe(400);
  });

  it("should return 400 when initialPhaseId is missing", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    const campaign = createMockCampaign();
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(campaign);
    vi.mocked(campaignStorage.updateCampaign).mockResolvedValue(campaign);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/run-tracker",
      { label: "Run #1" },
      "POST"
    );
    const response = await POST(request, makeParams("test-campaign-id"));
    expect(response.status).toBe(400);
  });

  it("should create a new run tracker session", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    const campaign = createMockCampaign();
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(campaign);
    vi.mocked(campaignStorage.updateCampaign).mockResolvedValue(campaign);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/run-tracker",
      { label: "Run #1 — Extraction", initialPhaseId: "the-meet" },
      "POST"
    );
    const response = await POST(request, makeParams("test-campaign-id"));
    const data = await response.json();
    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.session.label).toBe("Run #1 — Extraction");
    expect(data.session.activePhaseId).toBe("the-meet");
    expect(data.session.phaseTransitions).toHaveLength(1);
    expect(data.session.status).toBe("active");

    expect(campaignStorage.updateCampaign).toHaveBeenCalledWith(
      "test-campaign-id",
      expect.objectContaining({
        runTrackerSessions: expect.arrayContaining([
          expect.objectContaining({ label: "Run #1 — Extraction" }),
        ]),
      })
    );
  });
});

describe("PATCH /api/campaigns/[id]/run-tracker", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should return 400 when sessionId is missing", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    const campaign = createMockCampaign();
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(campaign);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/run-tracker",
      { activePhaseId: "the-run" },
      "PATCH"
    );
    const response = await PATCH(request, makeParams("test-campaign-id"));
    expect(response.status).toBe(400);
  });

  it("should return 404 when session not found", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    const campaign = createMockCampaign({ runTrackerSessions: [] });
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(campaign);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/run-tracker",
      { sessionId: "nonexistent", activePhaseId: "the-run" },
      "PATCH"
    );
    const response = await PATCH(request, makeParams("test-campaign-id"));
    expect(response.status).toBe(404);
  });

  it("should advance the phase and record transition", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    const existing = createMockRunTrackerSession();
    const campaign = createMockCampaign({ runTrackerSessions: [existing] });
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(campaign);
    vi.mocked(campaignStorage.updateCampaign).mockResolvedValue(campaign);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/run-tracker",
      { sessionId: "test-session-id", activePhaseId: "the-run" },
      "PATCH"
    );
    const response = await PATCH(request, makeParams("test-campaign-id"));
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.session.activePhaseId).toBe("the-run");
    expect(data.session.phaseTransitions).toHaveLength(2);
    expect(data.session.phaseTransitions[1].phaseId).toBe("the-run");
  });

  it("should not add duplicate transition when phase is unchanged", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    const existing = createMockRunTrackerSession();
    const campaign = createMockCampaign({ runTrackerSessions: [existing] });
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(campaign);
    vi.mocked(campaignStorage.updateCampaign).mockResolvedValue(campaign);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/run-tracker",
      { sessionId: "test-session-id", activePhaseId: "the-meet" },
      "PATCH"
    );
    const response = await PATCH(request, makeParams("test-campaign-id"));
    const data = await response.json();
    expect(data.session.phaseTransitions).toHaveLength(1);
  });

  it("should mark a session as completed", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    const existing = createMockRunTrackerSession({ activePhaseId: "the-handoff" });
    const campaign = createMockCampaign({ runTrackerSessions: [existing] });
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(campaign);
    vi.mocked(campaignStorage.updateCampaign).mockResolvedValue(campaign);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/run-tracker",
      { sessionId: "test-session-id", status: "completed" },
      "PATCH"
    );
    const response = await PATCH(request, makeParams("test-campaign-id"));
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.session.status).toBe("completed");
  });
});
