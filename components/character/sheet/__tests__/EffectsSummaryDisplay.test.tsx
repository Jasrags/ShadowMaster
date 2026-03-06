/**
 * EffectsSummaryDisplay Component Tests
 *
 * Tests the effects summary panel rendering. Verifies grouping by source type
 * and source ID, effect badge rendering via formatEffectBadge, value display,
 * wireless indicators, and parent attribution.
 *
 * @see Issue #113, #486
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { LUCIDE_MOCK } from "./test-helpers";
import type { Effect, EffectSource } from "@/lib/types/effects";
import type { SourcedEffect } from "@/lib/rules/effects";
import type { EffectBadge } from "@/lib/rules/effects";

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

vi.mock("@/lib/rules/effects", async () => {
  const actual = await vi.importActual<typeof import("@/lib/rules/effects")>("@/lib/rules/effects");
  return {
    ...actual,
    formatEffectBadge: vi.fn(
      (effect: Effect, context?: { resolvedValue?: number }): EffectBadge | null => {
        const value =
          context?.resolvedValue ?? (typeof effect.value === "number" ? effect.value : 0);
        const sign = value >= 0 ? "+" : "";
        return {
          label: `${sign}${value} Mock`,
          colorClass: "bg-emerald-100 text-emerald-700",
        };
      }
    ),
  };
});

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
      makeSourced({ id: "eff-2" }, { name: "Audio Enhancement", type: "gear", id: "audio-enh" }),
    ];
    render(<EffectsSummaryDisplay sources={sources} />);
    expect(screen.getByText("Catlike")).toBeInTheDocument();
    expect(screen.getByText("Audio Enhancement")).toBeInTheDocument();
  });

  it("renders source names", () => {
    const sources = [
      makeSourced({}, { name: "Catlike" }),
      makeSourced(
        { id: "eff-2" },
        { name: "Cybereyes Rating 3", type: "cyberware", id: "cybereyes" }
      ),
    ];
    render(<EffectsSummaryDisplay sources={sources} />);
    expect(screen.getByText("Catlike")).toBeInTheDocument();
    expect(screen.getByText("Cybereyes Rating 3")).toBeInTheDocument();
  });

  it("renders effect badges via formatEffectBadge", () => {
    const sources = [makeSourced({ type: "dice-pool-modifier", value: 2 }, { name: "Catlike" })];
    render(<EffectsSummaryDisplay sources={sources} />);
    const badges = screen.getAllByTestId("effect-badge");
    expect(badges).toHaveLength(1);
    expect(badges[0]).toHaveTextContent("+2 Mock");
  });

  it("renders positive value in badge with plus sign", () => {
    const sources = [makeSourced({ value: 2 }, { name: "Catlike" })];
    render(<EffectsSummaryDisplay sources={sources} />);
    expect(screen.getByTestId("effect-badge")).toHaveTextContent("+2");
  });

  it("renders negative value in badge without plus sign", () => {
    const sources = [makeSourced({ value: -1 }, { name: "Bad Quality" })];
    render(<EffectsSummaryDisplay sources={sources} />);
    expect(screen.getByTestId("effect-badge")).toHaveTextContent("-1");
  });

  it("groups effects by source type", () => {
    const sources = [
      makeSourced({}, { name: "Quality A", type: "quality" }),
      makeSourced({ id: "eff-2" }, { name: "Cyberware A", type: "cyberware", id: "cyber-a" }),
      makeSourced({ id: "eff-3" }, { name: "Quality B", type: "quality", id: "quality-b" }),
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
    expect(screen.getByTestId("effect-badge")).toHaveTextContent("+3");
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
    expect(screen.getByTestId("effect-badge")).toHaveTextContent("+2");
  });

  // --- New tests for #486 ---

  it("groups multiple effects from the same source under one name", () => {
    const sources = [
      makeSourced(
        { id: "eff-1", type: "dice-pool-modifier", value: -1 },
        { name: "Addiction", type: "quality", id: "addiction" }
      ),
      makeSourced(
        { id: "eff-2", type: "attribute-modifier", value: -2 },
        { name: "Addiction", type: "quality", id: "addiction" }
      ),
      makeSourced(
        { id: "eff-3", type: "limit-modifier", value: -1 },
        { name: "Addiction", type: "quality", id: "addiction" }
      ),
    ];
    render(<EffectsSummaryDisplay sources={sources} />);

    // Should only render the name once
    const nameElements = screen.getAllByText("Addiction");
    expect(nameElements).toHaveLength(1);

    // Should render 3 badges
    const badges = screen.getAllByTestId("effect-badge");
    expect(badges).toHaveLength(3);
  });

  it("renders parent attribution for mod effects", () => {
    const sources = [
      makeSourced(
        { id: "laser-sight-eff", type: "accuracy-modifier", value: 1 },
        {
          name: "Laser Sight",
          type: "gear",
          id: "laser-sight",
          parentName: "Ares Predator V",
          parentId: "ares-predator-v",
        }
      ),
    ];
    render(<EffectsSummaryDisplay sources={sources} />);

    expect(screen.getByText("Laser Sight")).toBeInTheDocument();
    expect(screen.getByText("(Ares Predator V)")).toBeInTheDocument();
  });

  it("renders badge with colorClass from formatEffectBadge", () => {
    const sources = [makeSourced({ value: 1 }, { name: "Test Quality" })];
    render(<EffectsSummaryDisplay sources={sources} />);

    const badge = screen.getByTestId("effect-badge");
    expect(badge.className).toContain("bg-emerald-100");
    expect(badge.className).toContain("text-emerald-700");
  });
});
