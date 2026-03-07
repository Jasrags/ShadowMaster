/**
 * Tests for DynamicStateModal active effects preview (#492)
 *
 * Covers: effect badges render, reactive updates, no-effects case
 */

import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import type { Character, QualitySelection } from "@/lib/types";
import type { EffectBadge } from "@/lib/rules/effects";
import { DynamicStateModal } from "@/app/characters/[id]/components/DynamicStateModal";

// Track the mock's return values so we can change per-test
let mockEffectBadges: EffectBadge[] = [];

// Mock useQualities to return catalog data
vi.mock("@/lib/rules", () => ({
  useQualities: () => ({
    positive: [],
    negative: [
      {
        id: "addiction",
        name: "Addiction",
        karmaBonus: 4,
        summary: "Character is addicted to a substance",
        effects: [
          {
            type: "dice-pool-modifier",
            value: -2,
            triggers: ["withdrawal"],
            target: { attribute: "body" },
          },
        ],
      },
      {
        id: "code-of-honor",
        name: "Code of Honor",
        karmaBonus: 5,
        summary: "Character follows a code",
        effects: [],
      },
    ],
  }),
}));

// Mock effects module
vi.mock("@/lib/rules/effects", () => ({
  formatEffectBadge: vi.fn(() => {
    // Return from the shared array so tests can control output
    return mockEffectBadges.length > 0 ? mockEffectBadges.shift()! : null;
  }),
  isUnifiedEffect: (e: unknown) =>
    typeof e === "object" &&
    e !== null &&
    "triggers" in e &&
    Array.isArray((e as Record<string, unknown>).triggers),
  resolveRatingBasedValue: vi.fn(() => null),
  buildCharacterStateFlags: vi.fn(() => ({})),
}));

// Mock react-aria-components to render simple HTML
vi.mock("react-aria-components", () => ({
  ModalOverlay: ({ children, isOpen }: { children: React.ReactNode; isOpen: boolean }) =>
    isOpen ? <div data-testid="modal-overlay">{children}</div> : null,
  Modal: ({
    children,
  }: {
    children:
      | ((opts: { isEntering: boolean; isExiting: boolean }) => React.ReactNode)
      | React.ReactNode;
  }) =>
    typeof children === "function" ? (
      <div>{children({ isEntering: false, isExiting: false })}</div>
    ) : (
      <div>{children}</div>
    ),
  Dialog: ({
    children,
  }: {
    children: ((opts: { close: () => void }) => React.ReactNode) | React.ReactNode;
  }) =>
    typeof children === "function" ? (
      <div>{children({ close: vi.fn() })}</div>
    ) : (
      <div>{children}</div>
    ),
  Heading: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    slot?: string;
    className?: string;
  }) => <h2 {...props}>{children}</h2>,
  Button: ({
    children,
    onPress,
    ...props
  }: {
    children: React.ReactNode;
    onPress?: () => void;
    className?: string;
  }) => (
    <button onClick={onPress} {...props}>
      {children}
    </button>
  ),
}));

// Mock tracker components
vi.mock("@/app/characters/[id]/components/trackers/AddictionTracker", () => ({
  AddictionTracker: () => <div data-testid="addiction-tracker">Addiction Tracker</div>,
}));
vi.mock("@/app/characters/[id]/components/trackers/AllergyTracker", () => ({
  AllergyTracker: () => <div data-testid="allergy-tracker">Allergy Tracker</div>,
}));
vi.mock("@/app/characters/[id]/components/trackers/DependentTracker", () => ({
  DependentTracker: () => <div data-testid="dependent-tracker">Dependent Tracker</div>,
}));
vi.mock("@/app/characters/[id]/components/trackers/CodeOfHonorTracker", () => ({
  CodeOfHonorTracker: () => <div data-testid="code-of-honor-tracker">Code of Honor Tracker</div>,
}));

function makeCharacter(overrides: Partial<Character> = {}): Character {
  return {
    id: "char-1",
    userId: "user-1",
    name: "Test Runner",
    edition: "sr5",
    creationMethod: "priority",
    status: "active",
    metatype: "human",
    magicalPath: "mundane",
    nuyen: 10000,
    startingNuyen: 50000,
    karmaCurrent: 10,
    karmaTotal: 25,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    attributes: {} as Character["attributes"],
    skills: [],
    positiveQualities: [],
    negativeQualities: [],
    gear: [],
    contacts: [],
    weapons: [],
    armor: [],
    lifestyles: [],
    identities: [],
    ...overrides,
  } as Character;
}

function makeAddictionSelection(overrides: Partial<QualitySelection> = {}): QualitySelection {
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
    ...overrides,
  } as QualitySelection;
}

describe("DynamicStateModal effect badges (#492)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockEffectBadges = [];
  });

  test("renders effect badges when quality has unified effects", () => {
    mockEffectBadges = [
      {
        label: "-2 Body",
        colorClass: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
        trigger: "withdrawal",
        triggerActive: false,
      },
    ];

    const selection = makeAddictionSelection();

    render(
      <DynamicStateModal
        character={makeCharacter({ negativeQualities: [selection] })}
        selection={selection}
        isOpen={true}
        onOpenChange={vi.fn()}
        onUpdate={vi.fn()}
      />
    );

    expect(screen.getByTestId("active-effects-section")).toBeTruthy();
    expect(screen.getByText("Active Effects")).toBeTruthy();
    expect(screen.getByText("-2 Body")).toBeTruthy();
    expect(screen.getByText("· withdrawal")).toBeTruthy();
  });

  test("shows trigger as active when character state matches", async () => {
    const { buildCharacterStateFlags } = await import("@/lib/rules/effects");
    vi.mocked(buildCharacterStateFlags).mockReturnValue({ withdrawalActive: true });

    mockEffectBadges = [
      {
        label: "-2 Body",
        colorClass: "bg-emerald-100 text-emerald-700",
        trigger: "withdrawal",
        triggerActive: true,
      },
    ];

    const selection = makeAddictionSelection({
      dynamicState: {
        type: "addiction" as const,
        state: {
          substance: "Psyche",
          substanceType: "psychological",
          severity: "mild",
          originalSeverity: "mild",
          withdrawalActive: true,
          lastDose: "2024-01-01T00:00:00Z",
          nextCravingCheck: "2024-01-02T00:00:00Z",
          cravingActive: false,
          withdrawalPenalty: 2,
          daysClean: 0,
          recoveryAttempts: 0,
        },
      },
    });

    render(
      <DynamicStateModal
        character={makeCharacter({ negativeQualities: [selection] })}
        selection={selection}
        isOpen={true}
        onOpenChange={vi.fn()}
        onUpdate={vi.fn()}
      />
    );

    const triggerSpan = screen.getByText("· withdrawal");
    expect(triggerSpan.className).toContain("font-semibold");
    expect(triggerSpan.className).toContain("text-red-400");
  });

  test("no effect badges section when quality has no effects", () => {
    mockEffectBadges = [];

    const selection: QualitySelection = {
      qualityId: "code-of-honor",
      source: "creation",
      dynamicState: {
        type: "code-of-honor",
        state: {
          codeName: "Warrior's Code",
          description: "Follow the warrior's path",
          violations: [],
          totalKarmaLost: 0,
        },
      },
    } as QualitySelection;

    render(
      <DynamicStateModal
        character={makeCharacter({ negativeQualities: [selection] })}
        selection={selection}
        isOpen={true}
        onOpenChange={vi.fn()}
        onUpdate={vi.fn()}
      />
    );

    expect(screen.queryByTestId("active-effects-section")).toBeNull();
    expect(screen.queryByText("Active Effects")).toBeNull();
  });

  test("does not render effect section when modal is closed", () => {
    mockEffectBadges = [
      {
        label: "-2 Body",
        colorClass: "bg-emerald-100 text-emerald-700",
        trigger: "withdrawal",
        triggerActive: false,
      },
    ];

    const selection = makeAddictionSelection();

    render(
      <DynamicStateModal
        character={makeCharacter({ negativeQualities: [selection] })}
        selection={selection}
        isOpen={false}
        onOpenChange={vi.fn()}
        onUpdate={vi.fn()}
      />
    );

    expect(screen.queryByTestId("active-effects-section")).toBeNull();
  });
});
