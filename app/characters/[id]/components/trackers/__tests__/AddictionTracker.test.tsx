import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AddictionTracker } from "../AddictionTracker";
import type { Character, QualitySelection, AddictionState } from "@/lib/types";

// Mock dice engine
const mockExecuteRoll = vi.fn();
vi.mock("@/lib/rules/action-resolution/dice-engine", () => ({
  executeRoll: (...args: unknown[]) => mockExecuteRoll(...args),
}));

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  AlertCircle: () => <span data-testid="alert-circle-icon" />,
  Calendar: () => <span data-testid="calendar-icon" />,
  History: () => <span data-testid="history-icon" />,
  Activity: () => <span data-testid="activity-icon" />,
  Plus: () => <span data-testid="plus-icon" />,
  Dice5: () => <span data-testid="dice5-icon" />,
}));

const mockCharacter = {
  id: "char-1",
  ownerId: "user-1",
  name: "Test Runner",
  editionCode: "sr5",
  creationMethod: "priority",
  metatype: "human",
  state: "active",
  attributes: {
    body: 4,
    agility: 5,
    reaction: 4,
    strength: 3,
    willpower: 3,
    logic: 4,
    intuition: 4,
    charisma: 3,
    edge: 3,
  },
  skills: {},
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
} as unknown as Character;

const mockSelection: QualitySelection = {
  qualityId: "addiction-bliss",
  name: "Addiction (Bliss)",
  category: "negative",
  karmaCost: -4,
  source: "core",
  dynamicState: {
    type: "addiction",
    state: {
      substance: "Bliss",
      substanceType: "physiological",
      severity: "moderate",
      originalSeverity: "moderate",
      lastDose: "2024-06-01T10:00:00Z",
      nextCravingCheck: "2024-06-02T10:00:00Z",
      cravingActive: false,
      withdrawalActive: false,
      withdrawalPenalty: 2,
      daysClean: 5,
      dosesLogged: 12,
    },
  },
} as unknown as QualitySelection;

describe("AddictionTracker", () => {
  let mockOnUpdate: ReturnType<typeof vi.fn<(updates: Partial<AddictionState>) => Promise<void>>>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockOnUpdate = vi.fn().mockResolvedValue(undefined);
  });

  it("calls onUpdate with cravingActive: true on failed roll", async () => {
    // 1 hit vs threshold 3 (moderate) = fail
    mockExecuteRoll.mockReturnValue({
      hits: 1,
      dice: [],
      rawHits: 1,
      ones: 0,
      isGlitch: false,
      isCriticalGlitch: false,
      limitApplied: false,
      limitExceeded: false,
      limitEnforcement: "on" as const,
      poolSize: 7,
    });

    render(
      <AddictionTracker
        selection={mockSelection}
        onUpdate={mockOnUpdate}
        character={mockCharacter}
      />
    );

    fireEvent.click(screen.getByText("Craving Test"));

    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalledWith({ cravingActive: true });
    });

    // Pool should be body(4) + willpower(3) = 7
    expect(mockExecuteRoll).toHaveBeenCalledWith(7);
  });

  it("calls onUpdate with cravingActive: false on successful roll", async () => {
    // 4 hits vs threshold 3 (moderate) = success
    mockExecuteRoll.mockReturnValue({
      hits: 4,
      dice: [],
      rawHits: 4,
      ones: 0,
      isGlitch: false,
      isCriticalGlitch: false,
      limitApplied: false,
      limitExceeded: false,
      limitEnforcement: "on" as const,
      poolSize: 7,
    });

    render(
      <AddictionTracker
        selection={mockSelection}
        onUpdate={mockOnUpdate}
        character={mockCharacter}
      />
    );

    fireEvent.click(screen.getByText("Craving Test"));

    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalledWith({ cravingActive: false });
    });
  });

  it("disables button while isUpdating", async () => {
    // Make onUpdate hang to keep isUpdating true
    mockOnUpdate = vi.fn().mockReturnValue(new Promise(() => {}));
    mockExecuteRoll.mockReturnValue({
      hits: 1,
      dice: [],
      rawHits: 1,
      ones: 0,
      isGlitch: false,
      isCriticalGlitch: false,
      limitApplied: false,
      limitExceeded: false,
      limitEnforcement: "on" as const,
      poolSize: 7,
    });

    render(
      <AddictionTracker
        selection={mockSelection}
        onUpdate={mockOnUpdate}
        character={mockCharacter}
      />
    );

    const button = screen.getByText("Craving Test");
    fireEvent.click(button);

    await waitFor(() => {
      expect(button).toBeDisabled();
    });
  });

  it("shows roll result UI after clicking", async () => {
    mockExecuteRoll.mockReturnValue({
      hits: 1,
      dice: [],
      rawHits: 1,
      ones: 0,
      isGlitch: false,
      isCriticalGlitch: false,
      limitApplied: false,
      limitExceeded: false,
      limitEnforcement: "on" as const,
      poolSize: 7,
    });

    render(
      <AddictionTracker
        selection={mockSelection}
        onUpdate={mockOnUpdate}
        character={mockCharacter}
      />
    );

    fireEvent.click(screen.getByText("Craving Test"));

    await waitFor(() => {
      expect(screen.getByText("Failed!")).toBeInTheDocument();
      expect(screen.getByText("1 hits vs 3 threshold")).toBeInTheDocument();
    });
  });

  it("shows Resisted for successful roll result", async () => {
    mockExecuteRoll.mockReturnValue({
      hits: 4,
      dice: [],
      rawHits: 4,
      ones: 0,
      isGlitch: false,
      isCriticalGlitch: false,
      limitApplied: false,
      limitExceeded: false,
      limitEnforcement: "on" as const,
      poolSize: 7,
    });

    render(
      <AddictionTracker
        selection={mockSelection}
        onUpdate={mockOnUpdate}
        character={mockCharacter}
      />
    );

    fireEvent.click(screen.getByText("Craving Test"));

    await waitFor(() => {
      expect(screen.getByText("Resisted!")).toBeInTheDocument();
      expect(screen.getByText("4 hits vs 3 threshold")).toBeInTheDocument();
    });
  });
});
