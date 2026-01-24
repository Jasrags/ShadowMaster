/**
 * Tests for /api/editions/[editionCode]/favor-costs endpoint
 *
 * Tests favor cost table retrieval with authentication, filtering
 * by archetype, risk level, and minimum connection.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "../route";
import { NextRequest } from "next/server";
import * as sessionModule from "@/lib/auth/session";
import * as usersStorage from "@/lib/storage/users";
import * as mergeModule from "@/lib/rules/merge";
import type { FavorServiceDefinition, User, EditionCode } from "@/lib/types";

// Mock dependencies
vi.mock("@/lib/auth/session");
vi.mock("@/lib/storage/users");
vi.mock("@/lib/rules/merge");

// Helper to create mock request with nextUrl properly set
function createMockRequest(url: string): NextRequest {
  const request = new NextRequest(url);
  // NextRequest needs nextUrl to be properly set for searchParams access
  Object.defineProperty(request, "nextUrl", {
    value: new URL(url),
    writable: false,
  });
  return request;
}

describe("GET /api/editions/[editionCode]/favor-costs", () => {
  const mockUser: User = {
    id: "test-user-id",
    email: "test@example.com",
    username: "testuser",
    passwordHash: "hashed-password",
    role: ["user"],
    createdAt: new Date().toISOString(),
    lastLogin: null,
    characters: [],
    failedLoginAttempts: 0,
    lockoutUntil: null,
    sessionVersion: 1,
    sessionSecretHash: null,
    preferences: {
      theme: "system",
      navigationCollapsed: false,
    },
    accountStatus: "active",
    statusChangedAt: null,
    statusChangedBy: null,
    statusReason: null,
    lastRoleChangeAt: null,
    lastRoleChangeBy: null,
    emailVerified: true,
    emailVerifiedAt: null,
    emailVerificationTokenHash: null,
    emailVerificationTokenExpiresAt: null,
    emailVerificationTokenPrefix: null,
    passwordResetTokenHash: null,
    passwordResetTokenExpiresAt: null,
    passwordResetTokenPrefix: null,
    magicLinkTokenHash: null,
    magicLinkTokenExpiresAt: null,
    magicLinkTokenPrefix: null,
  };

  const mockFavorServices: FavorServiceDefinition[] = [
    {
      id: "basic-info",
      name: "Basic Information",
      description: "Get basic information about a topic",
      archetypeIds: ["fixer", "journalist"],
      minimumConnection: 1,
      minimumLoyalty: 1,
      favorCost: 1,
      riskLevel: "trivial",
      burnRiskOnFailure: false,
      opposedTest: false,
      typicalTime: "1 hour",
      canRush: true,
    },
    {
      id: "gear-acquisition",
      name: "Gear Acquisition",
      description: "Acquire hard-to-find gear",
      archetypeIds: ["fixer"],
      minimumConnection: 3,
      minimumLoyalty: 2,
      favorCost: 2,
      nuyenCost: 500,
      riskLevel: "low",
      burnRiskOnFailure: false,
      opposedTest: false,
      typicalTime: "1 day",
      canRush: true,
    },
    {
      id: "safehouse",
      name: "Safehouse",
      description: "Provide a temporary safehouse",
      archetypeIds: ["fixer", "gang-leader"],
      minimumConnection: 4,
      minimumLoyalty: 3,
      favorCost: 3,
      riskLevel: "medium",
      burnRiskOnFailure: true,
      opposedTest: false,
      typicalTime: "1 day",
      canRush: false,
    },
    {
      id: "wetwork-referral",
      name: "Wetwork Referral",
      description: "Connect with a professional assassin",
      archetypeIds: ["fixer"],
      minimumConnection: 5,
      minimumLoyalty: 4,
      favorCost: 5,
      riskLevel: "high",
      burnRiskOnFailure: true,
      opposedTest: true,
      typicalTime: "1 week",
      canRush: false,
    },
  ];

  const mockMergedRuleset = {
    snapshotId: "test-snapshot-id",
    editionId: "sr5",
    editionCode: "sr5" as EditionCode,
    bookIds: ["core-rulebook"],
    modules: {
      favorServices: {
        services: mockFavorServices,
      },
    },
    createdAt: new Date().toISOString(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return favor costs for authenticated user", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(usersStorage.getUserById).mockResolvedValue(mockUser);
    vi.mocked(mergeModule.loadAndMergeRuleset).mockResolvedValue({
      success: true,
      ruleset: mockMergedRuleset,
    });

    const request = createMockRequest("http://localhost:3000/api/editions/sr5/favor-costs");
    const response = await GET(request, {
      params: Promise.resolve({ editionCode: "sr5" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.editionCode).toBe("sr5");
    expect(data.services).toBeDefined();
    expect(data.services).toHaveLength(4);
    expect(data.servicesByArchetype).toBeDefined();
    expect(data.count).toBe(4);
  });

  it("should filter by archetype", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(usersStorage.getUserById).mockResolvedValue(mockUser);
    vi.mocked(mergeModule.loadAndMergeRuleset).mockResolvedValue({
      success: true,
      ruleset: mockMergedRuleset,
    });

    const request = createMockRequest(
      "http://localhost:3000/api/editions/sr5/favor-costs?archetype=journalist"
    );
    const response = await GET(request, {
      params: Promise.resolve({ editionCode: "sr5" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    // Only "basic-info" has journalist as an archetype
    expect(data.services).toHaveLength(1);
    expect(data.services[0].id).toBe("basic-info");
  });

  it("should filter by riskLevel", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(usersStorage.getUserById).mockResolvedValue(mockUser);
    vi.mocked(mergeModule.loadAndMergeRuleset).mockResolvedValue({
      success: true,
      ruleset: mockMergedRuleset,
    });

    const request = createMockRequest(
      "http://localhost:3000/api/editions/sr5/favor-costs?riskLevel=high"
    );
    const response = await GET(request, {
      params: Promise.resolve({ editionCode: "sr5" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    // Only "wetwork-referral" has high risk
    expect(data.services).toHaveLength(1);
    expect(data.services[0].id).toBe("wetwork-referral");
  });

  it("should filter by minConnection", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(usersStorage.getUserById).mockResolvedValue(mockUser);
    vi.mocked(mergeModule.loadAndMergeRuleset).mockResolvedValue({
      success: true,
      ruleset: mockMergedRuleset,
    });

    const request = createMockRequest(
      "http://localhost:3000/api/editions/sr5/favor-costs?minConnection=3"
    );
    const response = await GET(request, {
      params: Promise.resolve({ editionCode: "sr5" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    // Services with minimumConnection <= 3
    expect(data.services).toHaveLength(2);
    expect(data.services.map((s: FavorServiceDefinition) => s.id)).toContain("basic-info");
    expect(data.services.map((s: FavorServiceDefinition) => s.id)).toContain("gear-acquisition");
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);

    const request = createMockRequest("http://localhost:3000/api/editions/sr5/favor-costs");
    const response = await GET(request, {
      params: Promise.resolve({ editionCode: "sr5" }),
    });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Unauthorized");
  });

  it("should return 404 when user not found", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(usersStorage.getUserById).mockResolvedValue(null);

    const request = createMockRequest("http://localhost:3000/api/editions/sr5/favor-costs");
    const response = await GET(request, {
      params: Promise.resolve({ editionCode: "sr5" }),
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("User not found");
  });

  it("should return 404 when edition not found", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(usersStorage.getUserById).mockResolvedValue(mockUser);
    vi.mocked(mergeModule.loadAndMergeRuleset).mockResolvedValue({
      success: false,
      error: "Edition not found",
    });

    const request = createMockRequest("http://localhost:3000/api/editions/invalid/favor-costs");
    const response = await GET(request, {
      params: Promise.resolve({ editionCode: "invalid" }),
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Edition not found");
  });

  it("should return 500 on error", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(usersStorage.getUserById).mockRejectedValue(new Error("Storage error"));

    const request = createMockRequest("http://localhost:3000/api/editions/sr5/favor-costs");
    const response = await GET(request, {
      params: Promise.resolve({ editionCode: "sr5" }),
    });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Failed to get favor costs");

    consoleErrorSpy.mockRestore();
  });

  it("should handle empty favor services module", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(usersStorage.getUserById).mockResolvedValue(mockUser);
    vi.mocked(mergeModule.loadAndMergeRuleset).mockResolvedValue({
      success: true,
      ruleset: {
        ...mockMergedRuleset,
        modules: {},
      },
    });

    const request = createMockRequest("http://localhost:3000/api/editions/sr5/favor-costs");
    const response = await GET(request, {
      params: Promise.resolve({ editionCode: "sr5" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.services).toHaveLength(0);
    expect(data.count).toBe(0);
  });

  it("should group services by archetype", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(usersStorage.getUserById).mockResolvedValue(mockUser);
    vi.mocked(mergeModule.loadAndMergeRuleset).mockResolvedValue({
      success: true,
      ruleset: mockMergedRuleset,
    });

    const request = createMockRequest("http://localhost:3000/api/editions/sr5/favor-costs");
    const response = await GET(request, {
      params: Promise.resolve({ editionCode: "sr5" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.servicesByArchetype).toBeDefined();
    expect(data.servicesByArchetype.fixer).toBeDefined();
    expect(data.servicesByArchetype.fixer.length).toBe(4); // All services have fixer
    expect(data.servicesByArchetype.journalist).toBeDefined();
    expect(data.servicesByArchetype.journalist.length).toBe(1);
  });
});
