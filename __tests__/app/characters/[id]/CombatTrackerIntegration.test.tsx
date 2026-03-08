/**
 * Combat Tracker Integration Tests (#90)
 *
 * Verifies the CombatTrackerModal is properly wired into the character sheet:
 * - QuickCombatControls shows "Open Combat Tracker" button when callback provided
 * - QuickCombatControls hides tracker button when callback not provided
 * - Clicking the button invokes the onOpenCombatTracker callback
 */

import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import type { Character } from "@/lib/types";
import { createMockCharacter } from "@/__tests__/mocks/storage";

// Mock DisplayCard as pass-through
vi.mock("@/components/character/sheet/DisplayCard", () => ({
  DisplayCard: ({
    title,
    children,
    headerAction,
  }: {
    title: string;
    children: React.ReactNode;
    headerAction?: React.ReactNode;
  }) => (
    <div data-testid={`display-card-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
      <h2>{title}</h2>
      {headerAction}
      {children}
    </div>
  ),
}));

// Mock lucide-react icons
vi.mock("lucide-react", () => {
  const createIcon = (name: string) => {
    const Icon = (props: Record<string, unknown>) => <span data-icon={name} {...props} />;
    Icon.displayName = name;
    return Icon;
  };
  return {
    Swords: createIcon("Swords"),
    Play: createIcon("Play"),
    Square: createIcon("Square"),
    SkipForward: createIcon("SkipForward"),
    Clock: createIcon("Clock"),
    AlertCircle: createIcon("AlertCircle"),
    Loader2: createIcon("Loader2"),
    Shield: createIcon("Shield"),
    Zap: createIcon("Zap"),
    Users: createIcon("Users"),
    Maximize2: createIcon("Maximize2"),
  };
});

// Mock react-aria-components Button to render as plain HTML button
vi.mock("react-aria-components", () => ({
  Button: ({
    children,
    onPress,
    isDisabled,
    className,
    "aria-label": ariaLabel,
  }: {
    children: React.ReactNode;
    onPress?: () => void;
    isDisabled?: boolean;
    className?: string;
    "aria-label"?: string;
  }) => (
    <button
      onClick={onPress}
      disabled={isDisabled ?? false}
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  ),
}));

// Mock useCombatSession to simulate active combat
const mockUseCombatSession = vi.fn();
vi.mock("@/lib/combat", () => ({
  useCombatSession: () => mockUseCombatSession(),
  CombatSessionProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

import { QuickCombatControls } from "@/app/characters/[id]/components/QuickCombatControls";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeCharacter(overrides?: Partial<Character>): Character {
  return createMockCharacter({
    status: "active",
    attributes: { reaction: 4, intuition: 3 },
    ...overrides,
  });
}

function activeCombatSession() {
  return {
    session: {
      id: "session-1",
      round: 2,
      currentTurn: 0,
      participants: [
        {
          id: "p1",
          name: "Runner",
          initiativeScore: 12,
          actionsRemaining: { free: 1, simple: 2, complex: 1, interrupt: true },
        },
      ],
    },
    participant: {
      id: "p1",
      name: "Runner",
      initiativeScore: 12,
      actionsRemaining: { free: 1, simple: 2, complex: 1, interrupt: true },
    },
    isInCombat: true,
    isMyTurn: true,
    isLoading: false,
    error: null,
    endTurn: vi.fn(),
    delayTurn: vi.fn(),
    leaveSession: vi.fn(),
    joinSession: vi.fn(),
    refreshSession: vi.fn(),
  };
}

function noCombatSession() {
  return {
    session: null,
    participant: null,
    isInCombat: false,
    isMyTurn: false,
    isLoading: false,
    error: null,
    endTurn: vi.fn(),
    delayTurn: vi.fn(),
    leaveSession: vi.fn(),
    joinSession: vi.fn(),
    refreshSession: vi.fn(),
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("CombatTrackerIntegration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseCombatSession.mockReturnValue(noCombatSession());
  });

  describe("QuickCombatControls - Open Combat Tracker button", () => {
    test("shows Open Combat Tracker button when in combat with callback", () => {
      mockUseCombatSession.mockReturnValue(activeCombatSession());
      const onOpen = vi.fn();

      render(
        <QuickCombatControls
          character={makeCharacter()}
          editionCode="sr5"
          onOpenCombatTracker={onOpen}
        />
      );

      expect(screen.getByText("Open Combat Tracker")).toBeDefined();
    });

    test("clicking Open Combat Tracker invokes callback", () => {
      mockUseCombatSession.mockReturnValue(activeCombatSession());
      const onOpen = vi.fn();

      render(
        <QuickCombatControls
          character={makeCharacter()}
          editionCode="sr5"
          onOpenCombatTracker={onOpen}
        />
      );

      fireEvent.click(screen.getByText("Open Combat Tracker"));
      expect(onOpen).toHaveBeenCalledTimes(1);
    });

    test("hides Open Combat Tracker button when callback not provided", () => {
      mockUseCombatSession.mockReturnValue(activeCombatSession());

      render(<QuickCombatControls character={makeCharacter()} editionCode="sr5" />);

      expect(screen.queryByText("Open Combat Tracker")).toBeNull();
    });

    test("does not show Open Combat Tracker when not in combat", () => {
      mockUseCombatSession.mockReturnValue(noCombatSession());
      const onOpen = vi.fn();

      render(
        <QuickCombatControls
          character={makeCharacter()}
          editionCode="sr5"
          onOpenCombatTracker={onOpen}
        />
      );

      // When not in combat, the "Start Quick Combat" view is shown instead
      expect(screen.queryByText("Open Combat Tracker")).toBeNull();
      expect(screen.getByText("Start Quick Combat")).toBeDefined();
    });
  });
});
