/**
 * EffectsSummaryDisplay Component Tests
 *
 * Tests the effects summary panel rendering. Verifies grouping by source type,
 * effect rows with type badges, value pills, and wireless indicators.
 *
 * @see Issue #113
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { LUCIDE_MOCK } from "./test-helpers";
import type { Effect, EffectSource } from "@/lib/types/effects";
import type { SourcedEffect } from "@/lib/rules/effects";

vi.mock("../DisplayCard", () => ({
  DisplayCard: ({
    title,
    children,
    collapsedSummary,
  }: {
    title: string;
    children: React.ReactNode;
    collapsedSummary?: React.ReactNode;
  }) => (
    <div data-testid="display-card">
      <h2>{title}</h2>
      {collapsedSummary && <div data-testid="collapsed-summary">{collapsedSummary}</div>}
      {children}
    </div>
  ),
}));

vi.mock("lucide-react", () => LUCIDE_MOCK);

import { EffectsSummaryDisplay } from "../EffectsSummaryDisplay";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeEffect(overrides: Partial<Effect> = {}): Effect {
  return {
    id: "test-effect",
    type: "dice-pool-modifier",
    triggers: ["always"],
    target: {},
    value: 1,
    ...overrides,
  };
}

function makeSource(overrides: Partial<EffectSource> = {}): EffectSource {
  return {
    type: "quality",
    id: "test-source",
    name: "Test Source",
    ...overrides,
  };
}

function makeSourced(
  effectOverrides: Partial<Effect> = {},
  sourceOverrides: Partial<EffectSource> = {}
): SourcedEffect {
  return {
    effect: makeEffect(effectOverrides),
    source: makeSource(sourceOverrides),
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("EffectsSummaryDisplay", () => {
  it("renders nothing when sources array is empty", () => {
    const { container } = render(<EffectsSummaryDisplay sources={[]} />);
    expect(container.innerHTML).toBe("");
  });

  it("renders the card with correct title", () => {
    const sources = [makeSourced()];
    render(<EffectsSummaryDisplay sources={sources} />);
    expect(screen.getByText("Active Effects")).toBeInTheDocument();
  });

  it("renders multiple effects from different source types", () => {
    const sources = [
      makeSourced({}, { name: "Catlike" }),
      makeSourced({ id: "eff-2" }, { name: "Audio Enhancement", type: "gear" }),
    ];
    render(<EffectsSummaryDisplay sources={sources} />);
    expect(screen.getByText("Catlike")).toBeInTheDocument();
    expect(screen.getByText("Audio Enhancement")).toBeInTheDocument();
  });

  it("renders source names", () => {
    const sources = [
      makeSourced({}, { name: "Catlike" }),
      makeSourced({ id: "eff-2" }, { name: "Cybereyes Rating 3", type: "cyberware" }),
    ];
    render(<EffectsSummaryDisplay sources={sources} />);
    expect(screen.getByText("Catlike")).toBeInTheDocument();
    expect(screen.getByText("Cybereyes Rating 3")).toBeInTheDocument();
  });

  it("renders effect type badges", () => {
    const sources = [
      makeSourced({ type: "dice-pool-modifier" }, { name: "Catlike" }),
      makeSourced(
        { id: "eff-2", type: "limit-modifier" },
        { name: "Cybereyes", type: "cyberware" }
      ),
    ];
    render(<EffectsSummaryDisplay sources={sources} />);
    expect(screen.getByText("dice pool modifier")).toBeInTheDocument();
    expect(screen.getByText("limit modifier")).toBeInTheDocument();
  });

  it("renders positive value pills with plus sign", () => {
    const sources = [makeSourced({ value: 2 }, { name: "Catlike" })];
    render(<EffectsSummaryDisplay sources={sources} />);
    expect(screen.getByText("+2")).toBeInTheDocument();
  });

  it("renders negative value pills without plus sign", () => {
    const sources = [makeSourced({ value: -1 }, { name: "Bad Quality" })];
    render(<EffectsSummaryDisplay sources={sources} />);
    expect(screen.getByText("-1")).toBeInTheDocument();
  });

  it("groups effects by source type", () => {
    const sources = [
      makeSourced({}, { name: "Quality A", type: "quality" }),
      makeSourced({ id: "eff-2" }, { name: "Cyberware A", type: "cyberware" }),
      makeSourced({ id: "eff-3" }, { name: "Quality B", type: "quality" }),
    ];
    render(<EffectsSummaryDisplay sources={sources} />);

    // Should see section headers
    expect(screen.getByText("Qualities")).toBeInTheDocument();
    expect(screen.getByText("Cyberware")).toBeInTheDocument();
  });

  it("does not render section headers for source types with no effects", () => {
    const sources = [makeSourced({}, { name: "Quality A", type: "quality" })];
    render(<EffectsSummaryDisplay sources={sources} />);

    expect(screen.getByText("Qualities")).toBeInTheDocument();
    expect(screen.queryByText("Cyberware")).not.toBeInTheDocument();
    expect(screen.queryByText("Bioware")).not.toBeInTheDocument();
    expect(screen.queryByText("Gear")).not.toBeInTheDocument();
  });

  it("resolves per-rating values for display", () => {
    const sources = [
      makeSourced({ value: { perRating: 1 } }, { name: "Wired Reflexes", rating: 3 }),
    ];
    render(<EffectsSummaryDisplay sources={sources} />);
    expect(screen.getByText("+3")).toBeInTheDocument();
  });

  it("shows wireless bonus value when source has wireless enabled and wirelessOverride", () => {
    const sources = [
      makeSourced(
        { value: 1, wirelessOverride: { bonusValue: 1 } },
        { name: "Cybereyes", wirelessEnabled: true, type: "cyberware" }
      ),
    ];
    render(<EffectsSummaryDisplay sources={sources} />);
    // 1 base + 1 wireless bonus = 2
    expect(screen.getByText("+2")).toBeInTheDocument();
  });
});
