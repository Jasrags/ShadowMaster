/**
 * CombatTracker Component Tests
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CombatTracker } from "../CombatTracker";
import type { CombatSession } from "@/lib/types";

// Mock combat session factory
function createMockSession(overrides: Partial<CombatSession> = {}): CombatSession {
  return {
    id: "session-1",
    ownerId: "user-1",
    editionCode: "sr5",
    name: "Test Combat",
    status: "active",
    round: 1,
    currentTurn: 0,
    currentPhase: "action",
    participants: [
      {
        id: "p1",
        name: "Street Samurai",
        type: "character",
        entityId: "char-1",
        initiativeScore: 15,
        initiativeDice: [5, 4, 3],
        status: "active",
        actionsRemaining: { free: 1, simple: 2, complex: 1, interrupt: true },
        interruptsPending: [],
        controlledBy: "user-1",
        woundModifier: 0,
        conditions: [],
        isGMControlled: false,
      },
      {
        id: "p2",
        name: "Combat Mage",
        type: "character",
        entityId: "char-2",
        initiativeScore: 12,
        initiativeDice: [4, 3],
        status: "active",
        actionsRemaining: { free: 1, simple: 2, complex: 1, interrupt: true },
        interruptsPending: [],
        controlledBy: "user-1",
        woundModifier: -1,
        conditions: [],
        isGMControlled: false,
      },
      {
        id: "p3",
        name: "Ganger",
        type: "npc",
        entityId: "npc-1",
        initiativeScore: 8,
        initiativeDice: [2],
        status: "active",
        actionsRemaining: { free: 1, simple: 2, complex: 1, interrupt: true },
        interruptsPending: [],
        controlledBy: "user-1",
        woundModifier: 0,
        conditions: [],
        isGMControlled: true,
      },
    ],
    initiativeOrder: ["p1", "p2", "p3"],
    environment: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

describe("CombatTracker", () => {
  describe("rendering", () => {
    it("renders session name", () => {
      const session = createMockSession({ name: "Warehouse Ambush" });
      render(<CombatTracker session={session} />);

      expect(screen.getByText("Warehouse Ambush")).toBeInTheDocument();
    });

    it("renders round number", () => {
      const session = createMockSession({ round: 3 });
      render(<CombatTracker session={session} />);

      expect(screen.getByText("Round 3")).toBeInTheDocument();
    });

    it("renders current phase", () => {
      const session = createMockSession({ currentPhase: "action" });
      render(<CombatTracker session={session} />);

      expect(screen.getByText("action")).toBeInTheDocument();
    });

    it("renders all participants", () => {
      const session = createMockSession();
      render(<CombatTracker session={session} />);

      expect(screen.getByText("Street Samurai")).toBeInTheDocument();
      expect(screen.getByText("Combat Mage")).toBeInTheDocument();
      expect(screen.getByText("Ganger")).toBeInTheDocument();
    });

    it("shows GM Controlled label for NPCs", () => {
      const session = createMockSession();
      render(<CombatTracker session={session} />);

      expect(screen.getByText("GM Controlled")).toBeInTheDocument();
    });

    it("renders initiative scores", () => {
      const session = createMockSession();
      render(<CombatTracker session={session} />);

      expect(screen.getByText("15")).toBeInTheDocument();
      expect(screen.getByText("12")).toBeInTheDocument();
      expect(screen.getByText("8")).toBeInTheDocument();
    });

    it("shows wound modifiers", () => {
      const session = createMockSession();
      render(<CombatTracker session={session} />);

      expect(screen.getByText("-1")).toBeInTheDocument();
    });

    it("shows participant count", () => {
      const session = createMockSession();
      render(<CombatTracker session={session} />);

      expect(screen.getByText("3 total")).toBeInTheDocument();
    });
  });

  describe("status indicators", () => {
    it("shows paused status when session is paused", () => {
      const session = createMockSession({ status: "paused" });
      render(<CombatTracker session={session} />);

      expect(screen.getByText("Paused")).toBeInTheDocument();
    });

    it("shows ended status when session is completed", () => {
      const session = createMockSession({ status: "completed" });
      render(<CombatTracker session={session} />);

      expect(screen.getByText("Ended")).toBeInTheDocument();
    });

    it("shows ended status when session is abandoned", () => {
      const session = createMockSession({ status: "abandoned" });
      render(<CombatTracker session={session} />);

      expect(screen.getByText("Ended")).toBeInTheDocument();
    });

    it("shows status counts by participant status", () => {
      const session = createMockSession({
        participants: [
          {
            id: "p1",
            name: "Active Fighter",
            type: "character",
            entityId: "char-1",
            initiativeScore: 15,
            initiativeDice: [5, 4, 3],
            status: "active",
            actionsRemaining: { free: 1, simple: 2, complex: 1, interrupt: true },
            interruptsPending: [],
            controlledBy: "user-1",
            woundModifier: 0,
            conditions: [],
            isGMControlled: false,
          },
          {
            id: "p2",
            name: "Delayed Fighter",
            type: "character",
            entityId: "char-2",
            initiativeScore: 12,
            initiativeDice: [4, 3],
            status: "delayed",
            actionsRemaining: { free: 1, simple: 2, complex: 1, interrupt: true },
            interruptsPending: [],
            controlledBy: "user-1",
            woundModifier: 0,
            conditions: [],
            isGMControlled: false,
          },
          {
            id: "p3",
            name: "Out Fighter",
            type: "character",
            entityId: "char-3",
            initiativeScore: 8,
            initiativeDice: [2],
            status: "out",
            actionsRemaining: { free: 0, simple: 0, complex: 0, interrupt: false },
            interruptsPending: [],
            controlledBy: "user-1",
            woundModifier: -3,
            conditions: [],
            isGMControlled: false,
          },
        ],
        initiativeOrder: ["p1", "p2", "p3"],
      });
      render(<CombatTracker session={session} />);

      // Should show total count and different status icons
      expect(screen.getByText("3 total")).toBeInTheDocument();
    });
  });

  describe("controls", () => {
    it("shows controls when canControl is true", () => {
      const session = createMockSession();
      render(<CombatTracker session={session} canControl />);

      expect(screen.getByText("Pause")).toBeInTheDocument();
      expect(screen.getByText("Next Turn")).toBeInTheDocument();
      expect(screen.getByText("New Round")).toBeInTheDocument();
    });

    it("hides controls when canControl is false", () => {
      const session = createMockSession();
      render(<CombatTracker session={session} canControl={false} />);

      expect(screen.queryByText("Pause")).not.toBeInTheDocument();
      expect(screen.queryByText("Next Turn")).not.toBeInTheDocument();
    });

    it("hides controls when session is completed", () => {
      const session = createMockSession({ status: "completed" });
      render(<CombatTracker session={session} canControl />);

      expect(screen.queryByText("Pause")).not.toBeInTheDocument();
    });

    it("shows Resume button when paused", () => {
      const session = createMockSession({ status: "paused" });
      render(<CombatTracker session={session} canControl />);

      expect(screen.getByText("Resume")).toBeInTheDocument();
    });

    it("calls onTogglePause when pause/resume clicked", () => {
      const onTogglePause = vi.fn();
      const session = createMockSession();
      render(<CombatTracker session={session} canControl onTogglePause={onTogglePause} />);

      fireEvent.click(screen.getByText("Pause"));
      expect(onTogglePause).toHaveBeenCalledTimes(1);
    });

    it("calls onAdvanceTurn when Next Turn clicked", () => {
      const onAdvanceTurn = vi.fn();
      const session = createMockSession();
      render(<CombatTracker session={session} canControl onAdvanceTurn={onAdvanceTurn} />);

      fireEvent.click(screen.getByText("Next Turn"));
      expect(onAdvanceTurn).toHaveBeenCalledTimes(1);
    });

    it("calls onAdvanceRound when New Round clicked", () => {
      const onAdvanceRound = vi.fn();
      const session = createMockSession();
      render(<CombatTracker session={session} canControl onAdvanceRound={onAdvanceRound} />);

      fireEvent.click(screen.getByText("New Round"));
      expect(onAdvanceRound).toHaveBeenCalledTimes(1);
    });
  });

  describe("participant selection", () => {
    it("calls onSelectParticipant when participant clicked", () => {
      const onSelectParticipant = vi.fn();
      const session = createMockSession();
      render(<CombatTracker session={session} onSelectParticipant={onSelectParticipant} />);

      fireEvent.click(screen.getByText("Combat Mage"));
      expect(onSelectParticipant).toHaveBeenCalledWith("p2");
    });

    it("highlights selected participant", () => {
      const session = createMockSession();
      const { container } = render(<CombatTracker session={session} selectedParticipantId="p2" />);

      // The selected participant should have different styling
      const selectedRow = container.querySelector('[class*="border-zinc-600"]');
      expect(selectedRow).toBeInTheDocument();
    });
  });

  describe("action economy", () => {
    it("shows action economy badges when showActionEconomy is true", () => {
      const session = createMockSession();
      render(<CombatTracker session={session} showActionEconomy />);

      // Should show action badges - looking for the text content "2" for simple actions
      const badges = screen.getAllByTitle(/actions/i);
      expect(badges.length).toBeGreaterThan(0);
    });

    it("hides action economy badges when showActionEconomy is false", () => {
      const session = createMockSession();
      render(<CombatTracker session={session} showActionEconomy={false} />);

      // Should not show action badges
      const badges = screen.queryAllByTitle(/actions/i);
      expect(badges.length).toBe(0);
    });
  });

  describe("environment display", () => {
    it("shows environment info when provided", () => {
      const session = createMockSession({
        environment: {
          terrain: "urban",
          visibility: "dim",
          weather: "rain",
        },
      });
      render(<CombatTracker session={session} />);

      expect(screen.getByText(/urban/i)).toBeInTheDocument();
      expect(screen.getByText(/dim/i)).toBeInTheDocument();
      expect(screen.getByText(/rain/i)).toBeInTheDocument();
    });
  });

  describe("size variants", () => {
    it("renders in small size", () => {
      const session = createMockSession();
      const { container } = render(<CombatTracker session={session} size="sm" />);

      expect(container.querySelector('[class*="text-xs"]')).toBeInTheDocument();
    });

    it("renders in large size", () => {
      const session = createMockSession();
      const { container } = render(<CombatTracker session={session} size="lg" />);

      expect(container.querySelector('[class*="text-base"]')).toBeInTheDocument();
    });
  });
});
