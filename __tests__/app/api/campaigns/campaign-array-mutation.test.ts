/**
 * Tests for campaign array immutability (#681)
 *
 * Verifies that updating notes and sessions in campaign route handlers
 * does not mutate the original campaign arrays in place.
 */

import { describe, test, expect, vi, beforeEach } from "vitest";
import type { Campaign } from "@/lib/types/campaign";
import type { CampaignNote, CampaignSession } from "@/lib/types/campaign";

// Track what updateCampaign receives
let capturedUpdates: Partial<Campaign> | undefined;
let mockCampaign: Campaign;

vi.mock("@/lib/auth/session", () => ({
  getSession: vi.fn().mockResolvedValue("gm-user-1"),
}));

vi.mock("@/lib/storage/campaigns", () => ({
  getCampaignById: vi.fn(async () => mockCampaign),
  updateCampaign: vi.fn(async (_id: string, updates: Partial<Campaign>) => {
    capturedUpdates = updates;
    return { ...mockCampaign, ...updates };
  }),
}));

function makeNote(overrides: Partial<CampaignNote> = {}): CampaignNote {
  return {
    id: "note-1",
    title: "Original Title",
    content: "Original Content",
    playerVisible: false,
    authorId: "gm-user-1",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    ...overrides,
  };
}

function makeSession(overrides: Partial<CampaignSession> = {}): CampaignSession {
  return {
    id: "session-1",
    title: "Original Session",
    scheduledAt: "2024-06-01T18:00:00Z",
    status: "scheduled",
    attendeeIds: ["player-1"],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    ...overrides,
  };
}

function makeCampaign(overrides: Partial<Campaign> = {}): Campaign {
  return {
    id: "campaign-1",
    gmId: "gm-user-1",
    title: "Test Campaign",
    status: "active",
    editionId: "sr5",
    editionCode: "sr5",
    enabledBookIds: ["core-rulebook"],
    enabledCreationMethodIds: ["priority"],
    gameplayLevel: "street",
    visibility: "private",
    playerIds: [],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    ...overrides,
  } as Campaign;
}

describe("Campaign array mutation guards (#681)", () => {
  beforeEach(() => {
    capturedUpdates = undefined;
    vi.clearAllMocks();
  });

  describe("PUT /api/campaigns/[id]/notes/[noteId]", () => {
    test("should not mutate the original notes array when updating a note", async () => {
      const originalNote = makeNote({ id: "note-1", title: "Original Title" });
      const otherNote = makeNote({ id: "note-2", title: "Other Note" });
      const originalNotes = [originalNote, otherNote];
      mockCampaign = makeCampaign({ notes: originalNotes });

      // Snapshot the original array state
      const notesBefore = [...originalNotes];
      const note1Before = { ...originalNotes[0] };

      const { PUT } = await import("@/app/api/campaigns/[id]/notes/[noteId]/route");

      const { NextRequest } = await import("next/server");
      const nextRequest = new NextRequest(
        "http://localhost/api/campaigns/campaign-1/notes/note-1",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: "Updated Title" }),
        }
      );

      await PUT(nextRequest, {
        params: Promise.resolve({ id: "campaign-1", noteId: "note-1" }),
      });

      // The original array must not have been mutated
      expect(originalNotes).toEqual(notesBefore);
      expect(originalNotes[0]).toEqual(note1Before);
      expect(originalNotes[0].title).toBe("Original Title");

      // The update passed to updateCampaign should use a new array
      expect(capturedUpdates).toBeDefined();
      expect(capturedUpdates!.notes).toBeDefined();
      expect(capturedUpdates!.notes).not.toBe(originalNotes);

      // The updated note should have the new title
      const updatedNote = capturedUpdates!.notes!.find((n) => n.id === "note-1");
      expect(updatedNote?.title).toBe("Updated Title");

      // The other note should be unchanged
      const otherNoteResult = capturedUpdates!.notes!.find((n) => n.id === "note-2");
      expect(otherNoteResult?.title).toBe("Other Note");
    });
  });

  describe("PUT /api/campaigns/[id]/sessions/[sessionId]", () => {
    test("should not mutate the original sessions array when updating a session", async () => {
      const originalSession = makeSession({ id: "session-1", title: "Original Session" });
      const otherSession = makeSession({ id: "session-2", title: "Other Session" });
      const originalSessions = [originalSession, otherSession];
      mockCampaign = makeCampaign({ sessions: originalSessions });

      // Snapshot the original array state
      const sessionsBefore = [...originalSessions];
      const session1Before = { ...originalSessions[0] };

      const { PUT } = await import("@/app/api/campaigns/[id]/sessions/[sessionId]/route");

      const { NextRequest } = await import("next/server");
      const nextRequest = new NextRequest(
        "http://localhost/api/campaigns/campaign-1/sessions/session-1",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: "Updated Session" }),
        }
      );

      await PUT(nextRequest, {
        params: Promise.resolve({ id: "campaign-1", sessionId: "session-1" }),
      });

      // The original array must not have been mutated
      expect(originalSessions).toEqual(sessionsBefore);
      expect(originalSessions[0]).toEqual(session1Before);
      expect(originalSessions[0].title).toBe("Original Session");

      // The update passed to updateCampaign should use a new array
      expect(capturedUpdates).toBeDefined();
      expect(capturedUpdates!.sessions).toBeDefined();
      expect(capturedUpdates!.sessions).not.toBe(originalSessions);

      // The updated session should have the new title
      const updatedSession = capturedUpdates!.sessions!.find((s) => s.id === "session-1");
      expect(updatedSession?.title).toBe("Updated Session");

      // The other session should be unchanged
      const otherSessionResult = capturedUpdates!.sessions!.find((s) => s.id === "session-2");
      expect(otherSessionResult?.title).toBe("Other Session");
    });
  });
});
