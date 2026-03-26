/**
 * Tests for /api/campaigns/[id]/contacts/[contactId] endpoint
 *
 * Tests campaign contact PATCH (update) functionality including
 * visibility toggle and loyalty overrides.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { PATCH } from "../route";
import { NextRequest } from "next/server";
import * as sessionModule from "@/lib/auth/session";
import * as campaignAuthModule from "@/lib/auth/campaign";
import * as contactStorage from "@/lib/storage/contacts";
import type { SocialContact } from "@/lib/types";

vi.mock("@/lib/auth/session");
vi.mock("@/lib/auth/campaign", () => ({
  authorizeGM: vi.fn(),
}));
vi.mock("@/lib/storage/contacts");

function createMockRequest(url: string, body: unknown): NextRequest {
  const headers = new Headers({ "Content-Type": "application/json" });
  const urlObj = new URL(url);
  const request = new NextRequest(urlObj, {
    method: "PATCH",
    body: JSON.stringify(body),
    headers,
  });
  (request as { json: () => Promise<unknown> }).json = async () => body;
  return request;
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
    group: "campaign",
    visibility: {
      playerVisible: false,
      showConnection: false,
      showLoyalty: false,
      showFavorBalance: false,
      showSpecializations: false,
    },
    createdAt: new Date().toISOString(),
    ...overrides,
  } as SocialContact;
}

const makeParams = (id = "test-campaign-id", contactId = "test-contact-id") =>
  Promise.resolve({ id, contactId });

describe("PATCH /api/campaigns/[id]/contacts/[contactId]", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/contacts/test-contact-id",
      { visibility: { playerVisible: true } }
    );
    const response = await PATCH(request, { params: makeParams() });
    expect(response.status).toBe(401);
  });

  it("should return 403 when not GM", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("player-1");
    vi.mocked(campaignAuthModule.authorizeGM).mockResolvedValue({
      authorized: false,
      campaign: null,
      role: "player",
      error: "Only the GM can perform this action",
      status: 403,
    });
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/contacts/test-contact-id",
      { visibility: { playerVisible: true } }
    );
    const response = await PATCH(request, { params: makeParams() });
    expect(response.status).toBe(403);
  });

  it("should return 404 when contact not found", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignAuthModule.authorizeGM).mockResolvedValue({
      authorized: true,
      campaign: {} as never,
      role: "gm",
      status: 200,
    });
    vi.mocked(contactStorage.getCampaignContact).mockResolvedValue(null);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/contacts/nonexistent",
      { visibility: { playerVisible: true } }
    );
    const response = await PATCH(request, {
      params: makeParams("test-campaign-id", "nonexistent"),
    });
    expect(response.status).toBe(404);
  });

  it("should toggle visibility successfully", async () => {
    const contact = createMockContact();
    const updatedContact = createMockContact({
      visibility: {
        playerVisible: true,
        showConnection: true,
        showLoyalty: true,
        showFavorBalance: false,
        showSpecializations: true,
      },
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignAuthModule.authorizeGM).mockResolvedValue({
      authorized: true,
      campaign: {} as never,
      role: "gm",
      status: 200,
    });
    vi.mocked(contactStorage.getCampaignContact).mockResolvedValue(contact);
    vi.mocked(contactStorage.updateCampaignContact).mockResolvedValue(updatedContact);

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/contacts/test-contact-id",
      {
        visibility: {
          playerVisible: true,
          showConnection: true,
          showLoyalty: true,
          showSpecializations: true,
        },
      }
    );
    const response = await PATCH(request, { params: makeParams() });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.contact.visibility.playerVisible).toBe(true);
  });

  it("should update loyalty overrides", async () => {
    const contact = createMockContact();
    const updatedContact = createMockContact({
      loyaltyOverrides: { "char-1": 5, "char-2": 1 },
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignAuthModule.authorizeGM).mockResolvedValue({
      authorized: true,
      campaign: {} as never,
      role: "gm",
      status: 200,
    });
    vi.mocked(contactStorage.getCampaignContact).mockResolvedValue(contact);
    vi.mocked(contactStorage.updateCampaignContact).mockResolvedValue(updatedContact);

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/contacts/test-contact-id",
      { loyaltyOverrides: { "char-1": 5, "char-2": 1 } }
    );
    const response = await PATCH(request, { params: makeParams() });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.contact.loyaltyOverrides).toEqual({ "char-1": 5, "char-2": 1 });
  });

  it("should reject loyalty override out of range", async () => {
    const contact = createMockContact();

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignAuthModule.authorizeGM).mockResolvedValue({
      authorized: true,
      campaign: {} as never,
      role: "gm",
      status: 200,
    });
    vi.mocked(contactStorage.getCampaignContact).mockResolvedValue(contact);

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/contacts/test-contact-id",
      { loyaltyOverrides: { "char-1": 10 } }
    );
    const response = await PATCH(request, { params: makeParams() });
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toContain("between 1 and 6");
  });

  it("should reject name exceeding max length", async () => {
    const contact = createMockContact();

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignAuthModule.authorizeGM).mockResolvedValue({
      authorized: true,
      campaign: {} as never,
      role: "gm",
      status: 200,
    });
    vi.mocked(contactStorage.getCampaignContact).mockResolvedValue(contact);

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/contacts/test-contact-id",
      { name: "x".repeat(201) }
    );
    const response = await PATCH(request, { params: makeParams() });
    expect(response.status).toBe(400);
  });

  it("should reject connection out of range", async () => {
    const contact = createMockContact();

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignAuthModule.authorizeGM).mockResolvedValue({
      authorized: true,
      campaign: {} as never,
      role: "gm",
      status: 200,
    });
    vi.mocked(contactStorage.getCampaignContact).mockResolvedValue(contact);

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/contacts/test-contact-id",
      { connection: 15 }
    );
    const response = await PATCH(request, { params: makeParams() });
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toContain("between 1 and 12");
  });

  it("should return 500 on internal error", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignAuthModule.authorizeGM).mockRejectedValue(new Error("DB error"));

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/contacts/test-contact-id",
      { loyalty: 3 }
    );
    const response = await PATCH(request, { params: makeParams() });
    expect(response.status).toBe(500);
    consoleErrorSpy.mockRestore();
  });
});
