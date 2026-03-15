/**
 * Tests that the /api/users route validates sortBy against an allowlist.
 *
 * Covers issue #646: sortBy query parameter not validated against allowlist.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/auth/middleware", () => ({
  requireAdmin: vi.fn(),
  toPublicUser: vi.fn((user: Record<string, unknown>) => {
    const { passwordHash: _, ...rest } = user;
    return rest;
  }),
  handleAdminAuthError: vi.fn(() => null),
}));

vi.mock("@/lib/storage/users", () => ({
  getAllUsers: vi.fn(),
}));

import { getAllUsers } from "@/lib/storage/users";

const mockGetAllUsers = getAllUsers as ReturnType<typeof vi.fn>;

const sampleUsers = [
  {
    id: "u1",
    username: "alice",
    email: "alice@example.com",
    role: "user",
    createdAt: "2025-01-01T00:00:00Z",
  },
];

function makeRequest(params: Record<string, string> = {}) {
  const url = new URL("http://localhost:3000/api/users");
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  return {
    nextUrl: url,
  } as unknown as import("next/server").NextRequest;
}

describe("/api/users sortBy validation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetAllUsers.mockResolvedValue(sampleUsers);
  });

  it("accepts valid sortBy values", async () => {
    const { GET } = await import("@/app/api/users/route");
    for (const sortBy of ["email", "username", "role", "createdAt"]) {
      const response = await GET(makeRequest({ sortBy }));
      const body = await response.json();
      expect(body.success).toBe(true);
    }
  });

  it("rejects invalid sortBy with 400 status", async () => {
    const { GET } = await import("@/app/api/users/route");
    const response = await GET(makeRequest({ sortBy: "passwordHash" }));
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.error).toBeDefined();
  });

  it("rejects arbitrary sortBy strings", async () => {
    const { GET } = await import("@/app/api/users/route");
    const response = await GET(makeRequest({ sortBy: "someRandomField" }));
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.success).toBe(false);
  });

  it("uses default sortBy when not provided", async () => {
    const { GET } = await import("@/app/api/users/route");
    const response = await GET(makeRequest());
    const body = await response.json();
    expect(body.success).toBe(true);
  });

  it("rejects invalid sortOrder values", async () => {
    const { GET } = await import("@/app/api/users/route");
    const response = await GET(makeRequest({ sortOrder: "DROP TABLE" }));
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.success).toBe(false);
  });

  it("accepts valid sortOrder values", async () => {
    const { GET } = await import("@/app/api/users/route");
    for (const sortOrder of ["asc", "desc"]) {
      const response = await GET(makeRequest({ sortOrder }));
      const body = await response.json();
      expect(body.success).toBe(true);
    }
  });
});
