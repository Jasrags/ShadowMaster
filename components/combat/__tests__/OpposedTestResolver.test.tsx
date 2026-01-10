/**
 * OpposedTestResolver Component Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { OpposedTestResolver } from "../OpposedTestResolver";

// Mock timers for animation testing
beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

const mockAttackerPool = {
  name: "Street Samurai",
  totalDice: 12,
  limit: 7,
  breakdown: {
    attribute: { name: "Agility", value: 6 },
    skill: { name: "Automatics", value: 6 },
  },
};

const mockDefenderPool = {
  name: "Ganger",
  totalDice: 8,
  breakdown: {
    attribute: { name: "Reaction", value: 4 },
    skill: { name: "Intuition", value: 4 },
  },
};

const mockAttackerResult = {
  dice: [
    { value: 6, isHit: true, isOne: false },
    { value: 5, isHit: true, isOne: false },
    { value: 4, isHit: false, isOne: false },
    { value: 3, isHit: false, isOne: false },
    { value: 2, isHit: false, isOne: false },
    { value: 1, isHit: false, isOne: true },
  ],
  hits: 2,
  ones: 1,
  isGlitch: false,
  isCriticalGlitch: false,
};

const mockDefenderResult = {
  dice: [
    { value: 5, isHit: true, isOne: false },
    { value: 3, isHit: false, isOne: false },
    { value: 2, isHit: false, isOne: false },
    { value: 1, isHit: false, isOne: true },
  ],
  hits: 1,
  ones: 1,
  isGlitch: false,
  isCriticalGlitch: false,
};

describe("OpposedTestResolver", () => {
  describe("rendering", () => {
    it("renders attacker and defender pool info", () => {
      render(
        <OpposedTestResolver attackerPool={mockAttackerPool} defenderPool={mockDefenderPool} />
      );

      expect(screen.getByText("Street Samurai")).toBeInTheDocument();
      expect(screen.getByText("Ganger")).toBeInTheDocument();
    });

    it("shows dice pool totals", () => {
      render(
        <OpposedTestResolver attackerPool={mockAttackerPool} defenderPool={mockDefenderPool} />
      );

      expect(screen.getByText(/12d6/)).toBeInTheDocument();
      expect(screen.getByText(/8d6/)).toBeInTheDocument();
    });

    it("shows limit when provided", () => {
      render(
        <OpposedTestResolver attackerPool={mockAttackerPool} defenderPool={mockDefenderPool} />
      );

      expect(screen.getByText(/L7/)).toBeInTheDocument();
    });

    it("shows pool breakdown when provided", () => {
      render(
        <OpposedTestResolver attackerPool={mockAttackerPool} defenderPool={mockDefenderPool} />
      );

      expect(screen.getByText("Agility")).toBeInTheDocument();
      expect(screen.getByText("Automatics")).toBeInTheDocument();
    });

    it("shows Roll Both button when ready", () => {
      render(
        <OpposedTestResolver attackerPool={mockAttackerPool} defenderPool={mockDefenderPool} />
      );

      expect(screen.getByText("Roll Both")).toBeInTheDocument();
    });
  });

  describe("pre-rolled results", () => {
    it("shows pre-rolled results immediately", () => {
      render(
        <OpposedTestResolver
          attackerPool={mockAttackerPool}
          defenderPool={mockDefenderPool}
          attackerResult={mockAttackerResult}
          defenderResult={mockDefenderResult}
        />
      );

      // Result should be displayed (attacker wins with more hits)
      expect(screen.getByText(/Succeeds!/)).toBeInTheDocument();
    });

    it("shows net hits in result", () => {
      render(
        <OpposedTestResolver
          attackerPool={mockAttackerPool}
          defenderPool={mockDefenderPool}
          attackerResult={mockAttackerResult}
          defenderResult={mockDefenderResult}
        />
      );

      // Net hits should be attacker hits - defender hits = 2 - 1 = 1
      expect(screen.getByText("+1")).toBeInTheDocument();
    });
  });

  describe("rolling", () => {
    it("executes roll when Roll Both clicked", async () => {
      const onResolved = vi.fn();

      render(
        <OpposedTestResolver
          attackerPool={mockAttackerPool}
          defenderPool={mockDefenderPool}
          onResolved={onResolved}
        />
      );

      fireEvent.click(screen.getByText("Roll Both"));

      // Should show rolling status
      expect(screen.getByText("Rolling...")).toBeInTheDocument();

      // Fast forward through animation
      await act(async () => {
        vi.advanceTimersByTime(2000);
      });

      // Should have called onResolved
      expect(onResolved).toHaveBeenCalled();
      expect(onResolved).toHaveBeenCalledWith(
        expect.objectContaining({
          attackerHits: expect.any(Number),
          defenderHits: expect.any(Number),
          netHits: expect.any(Number),
          attackerGlitch: expect.any(Boolean),
          defenderGlitch: expect.any(Boolean),
        })
      );
    });

    it("disables Roll Both when isDisabled", () => {
      render(
        <OpposedTestResolver
          attackerPool={mockAttackerPool}
          defenderPool={mockDefenderPool}
          isDisabled
        />
      );

      const button = screen.getByText("Roll Both");
      expect(button).toHaveAttribute("data-disabled", "true");
    });
  });

  describe("auto-roll", () => {
    it("auto-rolls when autoRoll is true", async () => {
      const onResolved = vi.fn();

      render(
        <OpposedTestResolver
          attackerPool={mockAttackerPool}
          defenderPool={mockDefenderPool}
          onResolved={onResolved}
          autoRoll
        />
      );

      // Advance timers to trigger requestAnimationFrame callback
      await act(async () => {
        vi.advanceTimersByTime(16); // One frame (~16ms)
      });

      // Should now be in rolling state
      expect(screen.getByText("Rolling...")).toBeInTheDocument();

      // Fast forward through animation
      await act(async () => {
        vi.advanceTimersByTime(2000);
      });

      expect(onResolved).toHaveBeenCalled();
    });
  });

  describe("reroll", () => {
    it("shows Reroll button after resolution", async () => {
      const onReroll = vi.fn();

      render(
        <OpposedTestResolver
          attackerPool={mockAttackerPool}
          defenderPool={mockDefenderPool}
          attackerResult={mockAttackerResult}
          defenderResult={mockDefenderResult}
          onReroll={onReroll}
        />
      );

      expect(screen.getByText("Reroll")).toBeInTheDocument();
    });

    it("calls onReroll when Reroll clicked", async () => {
      const onReroll = vi.fn();

      render(
        <OpposedTestResolver
          attackerPool={mockAttackerPool}
          defenderPool={mockDefenderPool}
          attackerResult={mockAttackerResult}
          defenderResult={mockDefenderResult}
          onReroll={onReroll}
        />
      );

      fireEvent.click(screen.getByText("Reroll"));
      expect(onReroll).toHaveBeenCalled();
    });

    it("resets state when Reroll clicked", async () => {
      const onReroll = vi.fn();

      render(
        <OpposedTestResolver
          attackerPool={mockAttackerPool}
          defenderPool={mockDefenderPool}
          attackerResult={mockAttackerResult}
          defenderResult={mockDefenderResult}
          onReroll={onReroll}
        />
      );

      fireEvent.click(screen.getByText("Reroll"));

      // Should show Roll Both button again
      expect(screen.getByText("Roll Both")).toBeInTheDocument();
    });
  });

  describe("result outcomes", () => {
    it("shows attacker success when net hits positive", () => {
      render(
        <OpposedTestResolver
          attackerPool={mockAttackerPool}
          defenderPool={mockDefenderPool}
          attackerResult={{ ...mockAttackerResult, hits: 4 }}
          defenderResult={{ ...mockDefenderResult, hits: 2 }}
        />
      );

      expect(screen.getByText(/Succeeds!/)).toBeInTheDocument();
    });

    it("shows defender success when net hits negative", () => {
      render(
        <OpposedTestResolver
          attackerPool={mockAttackerPool}
          defenderPool={mockDefenderPool}
          attackerResult={{ ...mockAttackerResult, hits: 2 }}
          defenderResult={{ ...mockDefenderResult, hits: 4 }}
        />
      );

      expect(screen.getByText(/Defends!/)).toBeInTheDocument();
    });

    it("shows tie when net hits zero", () => {
      render(
        <OpposedTestResolver
          attackerPool={mockAttackerPool}
          defenderPool={mockDefenderPool}
          attackerResult={{ ...mockAttackerResult, hits: 3 }}
          defenderResult={{ ...mockDefenderResult, hits: 3 }}
        />
      );

      expect(screen.getByText(/Tie/)).toBeInTheDocument();
    });
  });

  describe("glitch handling", () => {
    it("shows glitch indicator for attacker", () => {
      render(
        <OpposedTestResolver
          attackerPool={mockAttackerPool}
          defenderPool={mockDefenderPool}
          attackerResult={{ ...mockAttackerResult, isGlitch: true, hits: 2 }}
          defenderResult={mockDefenderResult}
        />
      );

      expect(screen.getByText(/glitched/i)).toBeInTheDocument();
    });

    it("shows critical glitch outcome", () => {
      render(
        <OpposedTestResolver
          attackerPool={mockAttackerPool}
          defenderPool={mockDefenderPool}
          attackerResult={{
            ...mockAttackerResult,
            isGlitch: true,
            isCriticalGlitch: true,
            hits: 0,
          }}
          defenderResult={mockDefenderResult}
        />
      );

      // Should show critical glitch indicator and outcome text
      const criticalGlitchText = screen.getAllByText(/Critical Glitch/);
      expect(criticalGlitchText.length).toBeGreaterThan(0);
    });
  });

  describe("custom labels", () => {
    it("uses custom labels when provided", () => {
      render(
        <OpposedTestResolver
          attackerPool={mockAttackerPool}
          defenderPool={mockDefenderPool}
          labels={{
            attacker: "Hacker",
            defender: "IC",
          }}
        />
      );

      expect(screen.getByText("Hacker")).toBeInTheDocument();
      expect(screen.getByText("IC")).toBeInTheDocument();
    });
  });

  describe("size variants", () => {
    it("renders in small size", () => {
      const { container } = render(
        <OpposedTestResolver
          attackerPool={mockAttackerPool}
          defenderPool={mockDefenderPool}
          size="sm"
        />
      );

      expect(container.querySelector('[class*="text-xs"]')).toBeInTheDocument();
    });

    it("renders in large size", () => {
      const { container } = render(
        <OpposedTestResolver
          attackerPool={mockAttackerPool}
          defenderPool={mockDefenderPool}
          size="lg"
        />
      );

      expect(container.querySelector('[class*="text-base"]')).toBeInTheDocument();
    });
  });
});
