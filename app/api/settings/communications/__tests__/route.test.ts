/**
 * Tests for /api/settings/communications endpoint
 *
 * Tests communication preferences GET and PATCH functionality.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, PATCH } from "../route";
import { NextRequest } from "next/server";
import * as sessionModule from "@/lib/auth/session";
import * as usersModule from "@/lib/storage/users";
import * as auditModule from "@/lib/security/audit-logger";
import type { User, CommunicationPreferences, UserSettings } from "@/lib/types/user";

// Mock dependencies
vi.mock("@/lib/auth/session");
vi.mock("@/lib/storage/users");
vi.mock("@/lib/security/audit-logger");

function createMockRequest(body: object): NextRequest {
  return {
    json: () => Promise.resolve(body),
  } as unknown as NextRequest;
}

/**
 * Helper to create a mock user with minimal required fields
 */
function createMockUser(
  id: string,
  communications?: Partial<CommunicationPreferences>,
  settings?: Partial<UserSettings>
): User {
  return {
    id,
    email: `${id}@test.example.com`,
    username: id,
    passwordHash: "hash",
    role: ["user"],
    preferences: {
      theme: settings?.theme ?? "dark",
      navigationCollapsed: settings?.navigationCollapsed ?? false,
      communications: communications
        ? {
            productUpdates: communications.productUpdates ?? false,
            campaignNotifications: communications.campaignNotifications ?? true,
          }
        : undefined,
    },
    createdAt: new Date().toISOString(),
    lastLogin: null,
    characters: [],
    failedLoginAttempts: 0,
    lockoutUntil: null,
    sessionVersion: 1,
    sessionSecretHash: null,
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
}

describe("GET /api/settings/communications", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Unauthorized");
  });

  it("should return 404 when user not found", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("user-1");
    vi.mocked(usersModule.getUserById).mockResolvedValue(null);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("User not found");
  });

  it("should return preferences with defaults applied", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("user-1");
    // Create user without communications preferences - should use defaults
    vi.mocked(usersModule.getUserById).mockResolvedValue(createMockUser("user-1"));

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.preferences).toEqual({
      productUpdates: false,
      campaignNotifications: true,
    });
  });

  it("should return user's actual preferences when set", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("user-1");
    vi.mocked(usersModule.getUserById).mockResolvedValue(
      createMockUser("user-1", { productUpdates: true, campaignNotifications: false })
    );

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.preferences).toEqual({
      productUpdates: true,
      campaignNotifications: false,
    });
  });
});

describe("PATCH /api/settings/communications", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(auditModule.AuditLogger.log).mockResolvedValue(undefined);
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);

    const req = createMockRequest({ productUpdates: true });
    const response = await PATCH(req);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Unauthorized");
  });

  it("should return 400 when no valid fields provided", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("user-1");

    const req = createMockRequest({ invalidField: true });
    const response = await PATCH(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("No valid preference fields provided");
  });

  it("should return 400 when field is not a boolean", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("user-1");

    const req = createMockRequest({ productUpdates: "yes" });
    const response = await PATCH(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("productUpdates must be a boolean");
  });

  it("should return 404 when user not found", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("user-1");
    vi.mocked(usersModule.getUserById).mockResolvedValue(null);

    const req = createMockRequest({ productUpdates: true });
    const response = await PATCH(req);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("User not found");
  });

  it("should update productUpdates preference", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("user-1");
    vi.mocked(usersModule.getUserById).mockResolvedValue(
      createMockUser("user-1", { productUpdates: false, campaignNotifications: true })
    );
    vi.mocked(usersModule.updateUser).mockResolvedValue(createMockUser("user-1"));

    const req = createMockRequest({ productUpdates: true });
    const response = await PATCH(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.preferences).toEqual({
      productUpdates: true,
      campaignNotifications: true,
    });

    expect(usersModule.updateUser).toHaveBeenCalledWith("user-1", {
      preferences: expect.objectContaining({
        communications: {
          productUpdates: true,
          campaignNotifications: true,
        },
      }),
    });
  });

  it("should update campaignNotifications preference", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("user-1");
    vi.mocked(usersModule.getUserById).mockResolvedValue(
      createMockUser("user-1", { productUpdates: false, campaignNotifications: true })
    );
    vi.mocked(usersModule.updateUser).mockResolvedValue(createMockUser("user-1"));

    const req = createMockRequest({ campaignNotifications: false });
    const response = await PATCH(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.preferences).toEqual({
      productUpdates: false,
      campaignNotifications: false,
    });
  });

  it("should update multiple preferences at once", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("user-1");
    vi.mocked(usersModule.getUserById).mockResolvedValue(
      createMockUser("user-1", { productUpdates: false, campaignNotifications: true })
    );
    vi.mocked(usersModule.updateUser).mockResolvedValue(createMockUser("user-1"));

    const req = createMockRequest({ productUpdates: true, campaignNotifications: false });
    const response = await PATCH(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.preferences).toEqual({
      productUpdates: true,
      campaignNotifications: false,
    });
  });

  it("should log preference changes to audit log", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("user-1");
    vi.mocked(usersModule.getUserById).mockResolvedValue(
      createMockUser("user-1", { productUpdates: false, campaignNotifications: true })
    );
    vi.mocked(usersModule.updateUser).mockResolvedValue(createMockUser("user-1"));

    const req = createMockRequest({ productUpdates: true });
    await PATCH(req);

    expect(auditModule.AuditLogger.log).toHaveBeenCalledWith({
      event: "preferences.communications_updated",
      userId: "user-1",
      metadata: {
        previousProductUpdates: false,
        previousCampaignNotifications: true,
        newProductUpdates: true,
        newCampaignNotifications: true,
      },
    });
  });

  it("should apply defaults when user has no existing communications preferences", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("user-1");
    // Create user without communications preferences
    vi.mocked(usersModule.getUserById).mockResolvedValue(createMockUser("user-1"));
    vi.mocked(usersModule.updateUser).mockResolvedValue(createMockUser("user-1"));

    const req = createMockRequest({ productUpdates: true });
    const response = await PATCH(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.preferences).toEqual({
      productUpdates: true,
      campaignNotifications: true, // Default value preserved
    });
  });
});
