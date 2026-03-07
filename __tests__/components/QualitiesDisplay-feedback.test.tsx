/**
 * Tests for QualitiesDisplay visual feedback (#493)
 *
 * Covers: error surfacing, success flash, error banner auto-dismiss
 */

import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import type { Character, QualitySelection } from "@/lib/types";
import {
  setupDisplayCardMock,
  LUCIDE_MOCK,
  createSheetCharacter,
} from "@/components/character/sheet/__tests__/test-helpers";

// Setup mocks BEFORE imports
setupDisplayCardMock();
vi.mock("lucide-react", () => LUCIDE_MOCK);

// Mock with withdrawal-trigger effect so toggle pills render
vi.mock("@/lib/rules", () => ({
  useQualities: () => ({
    positive: [],
    negative: [
      {
        id: "addiction",
        name: "Addiction",
        karmaBonus: 9,
        summary: "Character is addicted to a substance.",
        dynamicState: "addiction",
        effects: [
          {
            type: "dice-pool-modifier",
            value: -2,
            triggers: ["withdrawal"],
            target: { attribute: "body" },
          },
        ],
      },
    ],
  }),
}));
vi.mock("@/app/characters/[id]/components/DynamicStateModal", () => ({
  DynamicStateModal: () => null,
}));
vi.mock("@/lib/rules/effects", () => ({
  formatEffectBadge: vi.fn(() => null),
  isUnifiedEffect: (e: unknown) =>
    typeof e === "object" &&
    e !== null &&
    "triggers" in e &&
    Array.isArray((e as Record<string, unknown>).triggers),
  resolveRatingBasedValue: vi.fn(() => null),
  buildCharacterStateFlags: vi.fn(() => ({})),
}));

import { QualitiesDisplay } from "@/components/character/sheet/QualitiesDisplay";

const mockFetch = vi.fn();
global.fetch = mockFetch;

function makeAddictionSelection(): QualitySelection {
  return {
    qualityId: "addiction",
    source: "creation",
    dynamicState: {
      type: "addiction" as const,
      state: {
        substance: "Psyche",
        substanceType: "psychological",
        severity: "mild",
        originalSeverity: "mild",
        withdrawalActive: false,
        lastDose: "2024-01-01T00:00:00Z",
        nextCravingCheck: "2024-01-02T00:00:00Z",
        cravingActive: false,
        withdrawalPenalty: 0,
        daysClean: 0,
        recoveryAttempts: 0,
      },
    },
  } as QualitySelection;
}

function renderWithAddiction(onUpdate: (c: Character) => void) {
  const character = createSheetCharacter({
    negativeQualities: [makeAddictionSelection()],
  });
  return render(<QualitiesDisplay character={character} onUpdate={onUpdate} />);
}

describe("QualitiesDisplay feedback (#493)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockReset();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("surfaces error when API returns non-ok response", async () => {
    const onUpdate = vi.fn();
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ error: "Server error occurred" }),
    });

    renderWithAddiction(onUpdate);

    // Click the withdrawal toggle pill (rendered because effect has withdrawal trigger)
    const pill = screen.getByTestId("state-toggle-pill");
    fireEvent.click(pill);

    // Wait for async fetch to resolve
    await act(async () => {
      await vi.advanceTimersByTimeAsync(10);
    });

    expect(screen.getByTestId("toggle-error-banner")).toBeInTheDocument();
    expect(screen.getByText("Server error occurred")).toBeInTheDocument();
  });

  test("surfaces error when fetch throws", async () => {
    const onUpdate = vi.fn();
    mockFetch.mockRejectedValue(new Error("Network failure"));

    renderWithAddiction(onUpdate);

    const pill = screen.getByTestId("state-toggle-pill");
    fireEvent.click(pill);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(10);
    });

    expect(screen.getByTestId("toggle-error-banner")).toBeInTheDocument();
    expect(screen.getByText("Network failure")).toBeInTheDocument();
  });

  test("clears error on successful toggle", async () => {
    const onUpdate = vi.fn();
    const character = createSheetCharacter({
      negativeQualities: [makeAddictionSelection()],
    });

    // First call fails
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ error: "Temporary error" }),
    });

    render(<QualitiesDisplay character={character} onUpdate={onUpdate} />);

    const pill = screen.getByTestId("state-toggle-pill");
    fireEvent.click(pill);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(10);
    });

    expect(screen.getByTestId("toggle-error-banner")).toBeInTheDocument();

    // Second call succeeds
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ character }),
    });

    fireEvent.click(pill);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(10);
    });

    expect(screen.queryByTestId("toggle-error-banner")).not.toBeInTheDocument();
  });

  test("error banner auto-dismisses after 4 seconds", async () => {
    const onUpdate = vi.fn();
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ error: "Temporary error" }),
    });

    renderWithAddiction(onUpdate);

    const pill = screen.getByTestId("state-toggle-pill");
    fireEvent.click(pill);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(10);
    });

    expect(screen.getByTestId("toggle-error-banner")).toBeInTheDocument();

    // Advance past the auto-dismiss timeout
    act(() => {
      vi.advanceTimersByTime(4100);
    });

    expect(screen.queryByTestId("toggle-error-banner")).not.toBeInTheDocument();
  });

  test("success flash is applied on successful toggle", async () => {
    const onUpdate = vi.fn();
    const character = createSheetCharacter({
      negativeQualities: [makeAddictionSelection()],
    });

    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ character }),
    });

    render(<QualitiesDisplay character={character} onUpdate={onUpdate} />);

    const pill = screen.getByTestId("state-toggle-pill");
    fireEvent.click(pill);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(10);
    });

    // The pill should have the ring-emerald class for the flash
    expect(pill.className).toContain("ring-emerald");

    // Flash clears after 600ms
    act(() => {
      vi.advanceTimersByTime(700);
    });

    expect(pill.className).not.toContain("ring-emerald");
  });

  test("fallback error message when response body has no error field", async () => {
    const onUpdate = vi.fn();
    mockFetch.mockResolvedValue({
      ok: false,
      status: 400,
      json: () => Promise.resolve({}),
    });

    renderWithAddiction(onUpdate);

    const pill = screen.getByTestId("state-toggle-pill");
    fireEvent.click(pill);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(10);
    });

    expect(screen.getByText("Failed to update state (400)")).toBeInTheDocument();
  });
});
