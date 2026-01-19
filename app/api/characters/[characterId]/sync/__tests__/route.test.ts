/**
 * Tests for /api/characters/[characterId]/sync endpoint
 *
 * Tests sync status retrieval (GET) and drift analysis (POST)
 * including authentication, character lookup, and sync status reporting.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { GET, POST } from "../route";
import { NextRequest } from "next/server";
import * as sessionModule from "@/lib/auth/session";
import * as characterStorageModule from "@/lib/storage/characters";
import * as driftAnalyzerModule from "@/lib/rules/sync/drift-analyzer";
import * as legalityValidatorModule from "@/lib/rules/sync/legality-validator";
import * as migrationEngineModule from "@/lib/rules/sync/migration-engine";

import type {
  Character,
  DriftReport,
  MigrationPlan,
  StabilityShield,
  RulesetVersionRef,
  SyncStatus,
  LegalityStatus,
} from "@/lib/types";
import { createMockCharacter } from "@/__tests__/mocks/storage";

// Mock dependencies
vi.mock("@/lib/auth/session");
vi.mock("@/lib/storage/characters");
vi.mock("@/lib/rules/sync/drift-analyzer");
vi.mock("@/lib/rules/sync/legality-validator");
vi.mock("@/lib/rules/sync/migration-engine");
vi.mock("@/lib/storage/snapshot-cache", () => ({
  SnapshotCache: vi.fn().mockImplementation(function (this: Record<string, unknown>) {
    this.getRulesetSnapshot = vi.fn();
    this.getCurrentSnapshot = vi.fn();
    return this;
  }),
}));

// Helper to create a NextRequest
function createMockRequest(url: string, body?: unknown, method = "GET"): NextRequest {
  const request = new NextRequest(url, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: body ? { "Content-Type": "application/json" } : undefined,
  });

  if (body) {
    (request as { json: () => Promise<unknown> }).json = async () => body;
  }

  return request;
}

// Mock data factories
function createMockVersionRef(overrides?: Partial<RulesetVersionRef>): RulesetVersionRef {
  return {
    editionCode: "sr5",
    editionVersion: "1.0.0",
    bookVersions: { "sr5-core": "1.0.0" },
    snapshotId: "snapshot-123",
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

function createMockDriftReport(overrides?: Partial<DriftReport>): DriftReport {
  return {
    id: "report-123",
    characterId: "test-character-id",
    generatedAt: new Date().toISOString(),
    currentVersion: createMockVersionRef(),
    targetVersion: createMockVersionRef({ snapshotId: "snapshot-456" }),
    overallSeverity: "none",
    changes: [],
    recommendations: [],
    ...overrides,
  };
}

function createMockMigrationPlan(overrides?: Partial<MigrationPlan>): MigrationPlan {
  return {
    id: "plan-123",
    characterId: "test-character-id",
    sourceVersion: createMockVersionRef(),
    targetVersion: createMockVersionRef({ snapshotId: "snapshot-456" }),
    steps: [],
    isComplete: true,
    estimatedKarmaDelta: 0,
    ...overrides,
  };
}

function createMockShield(overrides?: Partial<StabilityShield>): StabilityShield {
  return {
    status: "green",
    label: "Synchronized",
    tooltip: "Character is synchronized with current ruleset",
    ...overrides,
  };
}

describe("GET /api/characters/[characterId]/sync", () => {
  const userId = "test-user-id";
  const characterId = "test-character-id";
  let mockCharacter: Character;
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();

    mockCharacter = createMockCharacter({
      id: characterId,
      ownerId: userId,
      status: "active",
      lastSyncCheck: new Date().toISOString(),
      lastSyncAt: new Date().toISOString(),
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue(userId);
    vi.mocked(characterStorageModule.getCharacter).mockResolvedValue(mockCharacter);
    vi.mocked(legalityValidatorModule.getQuickSyncStatus).mockReturnValue("synchronized");
    vi.mocked(legalityValidatorModule.getQuickLegalityStatus).mockReturnValue("rules-legal");
    vi.mocked(legalityValidatorModule.getLegalityShield).mockResolvedValue(createMockShield());
  });

  afterEach(() => {
    if (consoleSpy) {
      consoleSpy.mockRestore();
    }
  });

  it("should return 401 when unauthenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);

    const request = createMockRequest(`/api/characters/${characterId}/sync`);
    const response = await GET(request, { params: Promise.resolve({ characterId }) });

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.error).toBe("Unauthorized");
  });

  it("should return 404 when character not found", async () => {
    vi.mocked(characterStorageModule.getCharacter).mockResolvedValue(null);

    const request = createMockRequest(`/api/characters/${characterId}/sync`);
    const response = await GET(request, { params: Promise.resolve({ characterId }) });

    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data.error).toBe("Character not found");
  });

  it("should return sync status for synchronized character", async () => {
    const request = createMockRequest(`/api/characters/${characterId}/sync`);
    const response = await GET(request, { params: Promise.resolve({ characterId }) });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.syncStatus).toBe("synchronized");
  });

  it("should return sync status for outdated character", async () => {
    const outdatedCharacter = {
      ...mockCharacter,
      pendingMigration: "pending-migration-123",
    };
    vi.mocked(characterStorageModule.getCharacter).mockResolvedValue(outdatedCharacter);
    vi.mocked(legalityValidatorModule.getQuickSyncStatus).mockReturnValue("outdated");

    const request = createMockRequest(`/api/characters/${characterId}/sync`);
    const response = await GET(request, { params: Promise.resolve({ characterId }) });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.syncStatus).toBe("outdated");
    expect(data.pendingMigration).toBeDefined();
  });

  it("should return legality status", async () => {
    const request = createMockRequest(`/api/characters/${characterId}/sync`);
    const response = await GET(request, { params: Promise.resolve({ characterId }) });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.legalityStatus).toBe("rules-legal");
  });

  it("should return shield object", async () => {
    const request = createMockRequest(`/api/characters/${characterId}/sync`);
    const response = await GET(request, { params: Promise.resolve({ characterId }) });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.shield).toBeDefined();
    expect(data.shield.status).toBe("green");
  });

  it("should return lastSyncCheck and lastSyncAt", async () => {
    const request = createMockRequest(`/api/characters/${characterId}/sync`);
    const response = await GET(request, { params: Promise.resolve({ characterId }) });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.lastSyncCheck).toBeDefined();
    expect(data.lastSyncAt).toBeDefined();
  });

  it("should return 500 on internal error", async () => {
    consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(characterStorageModule.getCharacter).mockRejectedValue(new Error("Database error"));

    const request = createMockRequest(`/api/characters/${characterId}/sync`);
    const response = await GET(request, { params: Promise.resolve({ characterId }) });

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error).toBe("Failed to get sync status");
  });
});

describe("POST /api/characters/[characterId]/sync", () => {
  const userId = "test-user-id";
  const characterId = "test-character-id";
  let mockCharacter: Character;
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();

    mockCharacter = createMockCharacter({
      id: characterId,
      ownerId: userId,
      status: "active",
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue(userId);
    vi.mocked(characterStorageModule.getCharacter).mockResolvedValue(mockCharacter);
    vi.mocked(driftAnalyzerModule.analyzeCharacterDrift).mockResolvedValue(createMockDriftReport());
    vi.mocked(migrationEngineModule.generateMigrationPlan).mockReturnValue(
      createMockMigrationPlan()
    );
  });

  afterEach(() => {
    if (consoleSpy) {
      consoleSpy.mockRestore();
    }
  });

  it("should return 401 when unauthenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);

    const request = createMockRequest(`/api/characters/${characterId}/sync`, {}, "POST");
    const response = await POST(request, { params: Promise.resolve({ characterId }) });

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.error).toBe("Unauthorized");
  });

  it("should return 404 when character not found", async () => {
    vi.mocked(characterStorageModule.getCharacter).mockResolvedValue(null);

    const request = createMockRequest(`/api/characters/${characterId}/sync`, {}, "POST");
    const response = await POST(request, { params: Promise.resolve({ characterId }) });

    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data.error).toBe("Character not found");
  });

  it("should return drift report with no changes", async () => {
    const request = createMockRequest(`/api/characters/${characterId}/sync`, {}, "POST");
    const response = await POST(request, { params: Promise.resolve({ characterId }) });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.syncStatus).toBe("synchronized");
    expect(data.report.changes).toHaveLength(0);
  });

  it("should return drift report with changes", async () => {
    const reportWithChanges = createMockDriftReport({
      overallSeverity: "non-breaking",
      changes: [
        {
          id: "change-1",
          module: "skills",
          changeType: "modified",
          severity: "non-breaking",
          affectedItems: [],
          description: "Skill cost updated",
        },
      ],
    });
    vi.mocked(driftAnalyzerModule.analyzeCharacterDrift).mockResolvedValue(reportWithChanges);

    const request = createMockRequest(`/api/characters/${characterId}/sync`, {}, "POST");
    const response = await POST(request, { params: Promise.resolve({ characterId }) });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.syncStatus).toBe("outdated");
    expect(data.report.changes).toHaveLength(1);
  });

  it("should return migration plan", async () => {
    const request = createMockRequest(`/api/characters/${characterId}/sync`, {}, "POST");
    const response = await POST(request, { params: Promise.resolve({ characterId }) });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.plan).toBeDefined();
    expect(data.plan.id).toBe("plan-123");
  });

  it("should return 500 on internal error", async () => {
    consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(driftAnalyzerModule.analyzeCharacterDrift).mockRejectedValue(
      new Error("Analysis error")
    );

    const request = createMockRequest(`/api/characters/${characterId}/sync`, {}, "POST");
    const response = await POST(request, { params: Promise.resolve({ characterId }) });

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error).toBe("Failed to analyze drift");
  });
});
