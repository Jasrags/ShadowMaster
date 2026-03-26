/**
 * Tests for /api/campaigns/[id]/contacts/[contactId]/betrayal endpoint
 *
 * Tests GM-only betrayal planning state management including:
 * - Authentication and authorization (GM-only)
 * - Setting betrayal planning with betrayal type
 * - Clearing betrayal planning
 * - Revealing and hiding warning signals
 * - Contact not found handling
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, PATCH } from "../route";
import { NextRequest } from "next/server";
import * as sessionModule from "@/lib/auth/session";
import * as campaignAuthModule from "@/lib/auth/campaign";
import * as contactStorage from "@/lib/storage/contacts";
import type { SocialContact, BetrayalPlanningState } from "@/lib/types";

vi.mock("@/lib/auth/session");
vi.mock("@/lib/auth/campaign", () => ({
  authorizeGM: vi.fn(),
}));
vi.mock("@/lib/storage/contacts");

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

function createMockContact(overrides?: Partial<SocialContact>): SocialContact {
  return {
    id: "test-contact-id",
    campaignId: "test-campaign-id",
    name: "Mr. Johnson",
    archetype: "Mr. Johnson",
    connection: 5,
    loyalty: 2,
    favorBalance: 0,
    status: "active",
    factionId: "aztechnology",
    group: "campaign",
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

const BASE_URL =
  "http://localhost:3000/api/campaigns/test-campaign-id/contacts/test-contact-id/betrayal";
const ROUTE_PARAMS = {
  params: Promise.resolve({ id: "test-campaign-id", contactId: "test-contact-id" }),
};

describe("GET /api/campaigns/[id]/contacts/[contactId]/betrayal", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);
    const request = createMockRequest(BASE_URL);
    const response = await GET(request, ROUTE_PARAMS);
    expect(response.status).toBe(401);
  });

  it("should return 403 when not GM", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("player-id");
    vi.mocked(campaignAuthModule.authorizeGM).mockResolvedValue({
      authorized: false,
      campaign: null,
      role: null,
      error: "Not authorized",
      status: 403,
    });
    const request = createMockRequest(BASE_URL);
    const response = await GET(request, ROUTE_PARAMS);
    expect(response.status).toBe(403);
  });

  it("should return 404 when contact not found", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("gm-id");
    vi.mocked(campaignAuthModule.authorizeGM).mockResolvedValue({
      authorized: true,
      role: "gm",
      campaign: {} as never,
      status: 200,
    });
    vi.mocked(contactStorage.getCampaignContact).mockResolvedValue(null);
    const request = createMockRequest(BASE_URL);
    const response = await GET(request, ROUTE_PARAMS);
    expect(response.status).toBe(404);
  });

  it("should return null betrayal planning when none set", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("gm-id");
    vi.mocked(campaignAuthModule.authorizeGM).mockResolvedValue({
      authorized: true,
      role: "gm",
      campaign: {} as never,
      status: 200,
    });
    vi.mocked(contactStorage.getCampaignContact).mockResolvedValue(createMockContact());
    const request = createMockRequest(BASE_URL);
    const response = await GET(request, ROUTE_PARAMS);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.betrayalPlanning).toBeNull();
  });

  it("should return active betrayal planning", async () => {
    const planning: BetrayalPlanningState = {
      betrayalTypeId: "non-payment",
      revealedSignals: ["Payment terms are unusually complex"],
      markedAt: new Date().toISOString(),
    };
    vi.mocked(sessionModule.getSession).mockResolvedValue("gm-id");
    vi.mocked(campaignAuthModule.authorizeGM).mockResolvedValue({
      authorized: true,
      role: "gm",
      campaign: {} as never,
      status: 200,
    });
    vi.mocked(contactStorage.getCampaignContact).mockResolvedValue(
      createMockContact({ betrayalPlanning: planning })
    );
    const request = createMockRequest(BASE_URL);
    const response = await GET(request, ROUTE_PARAMS);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.betrayalPlanning).toEqual(planning);
  });
});

describe("PATCH /api/campaigns/[id]/contacts/[contactId]/betrayal", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);
    const request = createMockRequest(BASE_URL, { action: "set" }, "PATCH");
    const response = await PATCH(request, ROUTE_PARAMS);
    expect(response.status).toBe(401);
  });

  it("should return 403 when not GM", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("player-id");
    vi.mocked(campaignAuthModule.authorizeGM).mockResolvedValue({
      authorized: false,
      campaign: null,
      role: null,
      error: "Not authorized",
      status: 403,
    });
    const request = createMockRequest(BASE_URL, { action: "set" }, "PATCH");
    const response = await PATCH(request, ROUTE_PARAMS);
    expect(response.status).toBe(403);
  });

  it("should set betrayal planning with valid betrayal type", async () => {
    const contact = createMockContact();
    const updatedContact = createMockContact({
      betrayalPlanning: {
        betrayalTypeId: "liquidation",
        revealedSignals: [],
        markedAt: new Date().toISOString(),
      },
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue("gm-id");
    vi.mocked(campaignAuthModule.authorizeGM).mockResolvedValue({
      authorized: true,
      role: "gm",
      campaign: {} as never,
      status: 200,
    });
    vi.mocked(contactStorage.getCampaignContact).mockResolvedValue(contact);
    vi.mocked(contactStorage.updateCampaignContactBetrayalPlanning).mockResolvedValue(
      updatedContact
    );

    const request = createMockRequest(
      BASE_URL,
      { action: "set", betrayalTypeId: "liquidation" },
      "PATCH"
    );
    const response = await PATCH(request, ROUTE_PARAMS);
    const data = await response.json();

    expect(data.success).toBe(true);
    expect(contactStorage.updateCampaignContactBetrayalPlanning).toHaveBeenCalledWith(
      "test-campaign-id",
      "test-contact-id",
      expect.objectContaining({
        betrayalTypeId: "liquidation",
        revealedSignals: [],
      })
    );
  });

  it("should reject set without betrayalTypeId", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("gm-id");
    vi.mocked(campaignAuthModule.authorizeGM).mockResolvedValue({
      authorized: true,
      role: "gm",
      campaign: {} as never,
      status: 200,
    });
    vi.mocked(contactStorage.getCampaignContact).mockResolvedValue(createMockContact());

    const request = createMockRequest(BASE_URL, { action: "set" }, "PATCH");
    const response = await PATCH(request, ROUTE_PARAMS);
    expect(response.status).toBe(400);
  });

  it("should clear betrayal planning", async () => {
    const contact = createMockContact({
      betrayalPlanning: {
        betrayalTypeId: "non-payment",
        revealedSignals: [],
        markedAt: new Date().toISOString(),
      },
    });
    const clearedContact = createMockContact({ betrayalPlanning: undefined });

    vi.mocked(sessionModule.getSession).mockResolvedValue("gm-id");
    vi.mocked(campaignAuthModule.authorizeGM).mockResolvedValue({
      authorized: true,
      role: "gm",
      campaign: {} as never,
      status: 200,
    });
    vi.mocked(contactStorage.getCampaignContact).mockResolvedValue(contact);
    vi.mocked(contactStorage.updateCampaignContactBetrayalPlanning).mockResolvedValue(
      clearedContact
    );

    const request = createMockRequest(BASE_URL, { action: "clear" }, "PATCH");
    const response = await PATCH(request, ROUTE_PARAMS);
    const data = await response.json();

    expect(data.success).toBe(true);
    expect(contactStorage.updateCampaignContactBetrayalPlanning).toHaveBeenCalledWith(
      "test-campaign-id",
      "test-contact-id",
      null
    );
  });

  it("should reveal a warning signal", async () => {
    const planning: BetrayalPlanningState = {
      betrayalTypeId: "non-payment",
      revealedSignals: [],
      markedAt: new Date().toISOString(),
    };
    const contact = createMockContact({ betrayalPlanning: planning });
    const updatedContact = createMockContact({
      betrayalPlanning: {
        ...planning,
        revealedSignals: ["Johnson is evasive about payment details"],
      },
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue("gm-id");
    vi.mocked(campaignAuthModule.authorizeGM).mockResolvedValue({
      authorized: true,
      role: "gm",
      campaign: {} as never,
      status: 200,
    });
    vi.mocked(contactStorage.getCampaignContact).mockResolvedValue(contact);
    vi.mocked(contactStorage.updateCampaignContactBetrayalPlanning).mockResolvedValue(
      updatedContact
    );

    const request = createMockRequest(
      BASE_URL,
      {
        action: "reveal-signal",
        signal: "Johnson is evasive about payment details",
      },
      "PATCH"
    );
    const response = await PATCH(request, ROUTE_PARAMS);
    const data = await response.json();

    expect(data.success).toBe(true);
    expect(contactStorage.updateCampaignContactBetrayalPlanning).toHaveBeenCalledWith(
      "test-campaign-id",
      "test-contact-id",
      expect.objectContaining({
        revealedSignals: ["Johnson is evasive about payment details"],
      })
    );
  });

  it("should hide a previously revealed signal", async () => {
    const planning: BetrayalPlanningState = {
      betrayalTypeId: "non-payment",
      revealedSignals: ["signal-a", "signal-b"],
      markedAt: new Date().toISOString(),
    };
    const contact = createMockContact({ betrayalPlanning: planning });
    const updatedContact = createMockContact({
      betrayalPlanning: { ...planning, revealedSignals: ["signal-b"] },
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue("gm-id");
    vi.mocked(campaignAuthModule.authorizeGM).mockResolvedValue({
      authorized: true,
      role: "gm",
      campaign: {} as never,
      status: 200,
    });
    vi.mocked(contactStorage.getCampaignContact).mockResolvedValue(contact);
    vi.mocked(contactStorage.updateCampaignContactBetrayalPlanning).mockResolvedValue(
      updatedContact
    );

    const request = createMockRequest(
      BASE_URL,
      { action: "hide-signal", signal: "signal-a" },
      "PATCH"
    );
    const response = await PATCH(request, ROUTE_PARAMS);
    const data = await response.json();

    expect(data.success).toBe(true);
    expect(contactStorage.updateCampaignContactBetrayalPlanning).toHaveBeenCalledWith(
      "test-campaign-id",
      "test-contact-id",
      expect.objectContaining({
        revealedSignals: ["signal-b"],
      })
    );
  });

  it("should reject reveal-signal when no active planning", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("gm-id");
    vi.mocked(campaignAuthModule.authorizeGM).mockResolvedValue({
      authorized: true,
      role: "gm",
      campaign: {} as never,
      status: 200,
    });
    vi.mocked(contactStorage.getCampaignContact).mockResolvedValue(
      createMockContact({ betrayalPlanning: undefined })
    );

    const request = createMockRequest(
      BASE_URL,
      { action: "reveal-signal", signal: "test" },
      "PATCH"
    );
    const response = await PATCH(request, ROUTE_PARAMS);
    expect(response.status).toBe(400);
  });

  it("should reject invalid action", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("gm-id");
    vi.mocked(campaignAuthModule.authorizeGM).mockResolvedValue({
      authorized: true,
      role: "gm",
      campaign: {} as never,
      status: 200,
    });
    vi.mocked(contactStorage.getCampaignContact).mockResolvedValue(createMockContact());

    const request = createMockRequest(BASE_URL, { action: "invalid" }, "PATCH");
    const response = await PATCH(request, ROUTE_PARAMS);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toContain("Invalid action");
  });

  it("should not duplicate already-revealed signals", async () => {
    const planning: BetrayalPlanningState = {
      betrayalTypeId: "non-payment",
      revealedSignals: ["already-revealed"],
      markedAt: new Date().toISOString(),
    };
    const contact = createMockContact({ betrayalPlanning: planning });
    const updatedContact = createMockContact({ betrayalPlanning: planning });

    vi.mocked(sessionModule.getSession).mockResolvedValue("gm-id");
    vi.mocked(campaignAuthModule.authorizeGM).mockResolvedValue({
      authorized: true,
      role: "gm",
      campaign: {} as never,
      status: 200,
    });
    vi.mocked(contactStorage.getCampaignContact).mockResolvedValue(contact);
    vi.mocked(contactStorage.updateCampaignContactBetrayalPlanning).mockResolvedValue(
      updatedContact
    );

    const request = createMockRequest(
      BASE_URL,
      { action: "reveal-signal", signal: "already-revealed" },
      "PATCH"
    );
    const response = await PATCH(request, ROUTE_PARAMS);
    const data = await response.json();

    expect(data.success).toBe(true);
    // Should pass the same signals array (no duplicate)
    expect(contactStorage.updateCampaignContactBetrayalPlanning).toHaveBeenCalledWith(
      "test-campaign-id",
      "test-contact-id",
      expect.objectContaining({
        revealedSignals: ["already-revealed"],
      })
    );
  });
});
