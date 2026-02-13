/**
 * QualitiesDisplay Component Tests
 *
 * Tests the qualities display with expandable rows showing name-only
 * in collapsed state, with details (karma, extra info, summary, effects,
 * dynamic state, settings) revealed on expand.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  setupDisplayCardMock,
  LUCIDE_MOCK,
  createSheetCharacter,
  MOCK_POSITIVE_QUALITIES,
  MOCK_NEGATIVE_QUALITIES,
} from "./test-helpers";

setupDisplayCardMock();
vi.mock("lucide-react", () => LUCIDE_MOCK);
vi.mock("@/lib/rules", () => ({
  useQualities: () => ({
    positive: MOCK_POSITIVE_QUALITIES,
    negative: MOCK_NEGATIVE_QUALITIES,
  }),
}));
vi.mock("@/app/characters/[id]/components/DynamicStateModal", () => ({
  DynamicStateModal: () => <div data-testid="dynamic-state-modal" />,
}));

import { QualitiesDisplay } from "../QualitiesDisplay";
import type { QualitySelection } from "@/lib/types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderWith(overrides: {
  positiveQualities?: QualitySelection[];
  negativeQualities?: QualitySelection[];
}) {
  const character = createSheetCharacter(overrides);
  return render(<QualitiesDisplay character={character} />);
}

function expandFirstRow() {
  const btn = screen.getAllByTestId("expand-button")[0];
  fireEvent.click(btn);
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("QualitiesDisplay", () => {
  // --- Empty state ---

  it("renders empty state when no qualities", () => {
    renderWith({ positiveQualities: [], negativeQualities: [] });
    expect(screen.getByText("No qualities selected")).toBeInTheDocument();
  });

  // --- Section headers ---

  it("renders Positive Qualities section header", () => {
    renderWith({
      positiveQualities: [{ qualityId: "ambidextrous", source: "creation" }],
      negativeQualities: [],
    });
    expect(screen.getByText("Positive Qualities")).toBeInTheDocument();
  });

  it("renders Negative Qualities section header", () => {
    renderWith({
      positiveQualities: [],
      negativeQualities: [{ qualityId: "bad-luck", source: "creation" }],
    });
    expect(screen.getByText("Negative Qualities")).toBeInTheDocument();
  });

  it("renders both section headers when both types present", () => {
    renderWith({
      positiveQualities: [{ qualityId: "ambidextrous", source: "creation" }],
      negativeQualities: [{ qualityId: "bad-luck", source: "creation" }],
    });
    expect(screen.getByText("Positive Qualities")).toBeInTheDocument();
    expect(screen.getByText("Negative Qualities")).toBeInTheDocument();
  });

  it("hides Negative section when no negative qualities", () => {
    renderWith({
      positiveQualities: [{ qualityId: "ambidextrous", source: "creation" }],
      negativeQualities: [],
    });
    expect(screen.queryByText("Negative Qualities")).not.toBeInTheDocument();
  });

  // --- Quality names ---

  it("renders quality name from catalog", () => {
    renderWith({
      positiveQualities: [{ qualityId: "ambidextrous", source: "creation" }],
    });
    expect(screen.getByText("Ambidextrous")).toBeInTheDocument();
  });

  it("uses fallback name for unknown quality", () => {
    renderWith({
      positiveQualities: [{ qualityId: "some-unknown-quality", source: "creation" }],
    });
    expect(screen.getByText("some unknown quality")).toBeInTheDocument();
  });

  // --- Expand/collapse behavior ---

  it("collapsed row does not show karma pill, summary, or effects", () => {
    renderWith({
      positiveQualities: [{ qualityId: "high-pain-tolerance", source: "creation", rating: 1 }],
    });
    expect(screen.queryByTestId("karma-pill")).not.toBeInTheDocument();
    expect(screen.queryByTestId("expanded-content")).not.toBeInTheDocument();
    expect(screen.queryByText("Ignore wound modifiers up to rating.")).not.toBeInTheDocument();
    expect(screen.queryByTestId("effect-badge")).not.toBeInTheDocument();
  });

  it("click expand button shows expanded content", () => {
    renderWith({
      positiveQualities: [{ qualityId: "ambidextrous", source: "creation" }],
    });
    expect(screen.queryByTestId("expanded-content")).not.toBeInTheDocument();
    expandFirstRow();
    expect(screen.getByTestId("expanded-content")).toBeInTheDocument();
  });

  it("click expand button again collapses content", () => {
    renderWith({
      positiveQualities: [{ qualityId: "ambidextrous", source: "creation" }],
    });
    expandFirstRow();
    expect(screen.getByTestId("expanded-content")).toBeInTheDocument();
    expandFirstRow();
    expect(screen.queryByTestId("expanded-content")).not.toBeInTheDocument();
  });

  it("chevron icon changes on expand/collapse", () => {
    renderWith({
      positiveQualities: [{ qualityId: "ambidextrous", source: "creation" }],
    });
    expect(screen.getByTestId("icon-ChevronRight")).toBeInTheDocument();
    expect(screen.queryByTestId("icon-ChevronDown")).not.toBeInTheDocument();
    expandFirstRow();
    expect(screen.getByTestId("icon-ChevronDown")).toBeInTheDocument();
    expect(screen.queryByTestId("icon-ChevronRight")).not.toBeInTheDocument();
  });

  // --- Karma pills (expanded) ---

  it("renders positive karma pill with emerald styling", () => {
    renderWith({
      positiveQualities: [{ qualityId: "ambidextrous", source: "creation" }],
    });
    expandFirstRow();
    const pill = screen.getByTestId("karma-pill");
    expect(pill).toHaveTextContent("4");
    expect(pill.className).toContain("emerald");
  });

  it("renders negative karma pill with rose styling", () => {
    renderWith({
      negativeQualities: [{ qualityId: "bad-luck", source: "creation" }],
    });
    expandFirstRow();
    const pill = screen.getByTestId("karma-pill");
    expect(pill).toHaveTextContent("12");
    expect(pill.className).toContain("rose");
  });

  // --- Summary (expanded) ---

  it("renders summary text when expanded", () => {
    renderWith({
      positiveQualities: [{ qualityId: "ambidextrous", source: "creation" }],
    });
    expandFirstRow();
    expect(screen.getByText("No off-hand penalty for using either hand.")).toBeInTheDocument();
  });

  // --- Extra info (expanded) ---

  it("renders rating level name in extra info when expanded", () => {
    renderWith({
      positiveQualities: [{ qualityId: "high-pain-tolerance", source: "creation", rating: 2 }],
    });
    expandFirstRow();
    const extraInfo = screen.getByTestId("extra-info");
    expect(extraInfo).toHaveTextContent("Rating 2");
  });

  it("renders specification in extra info when expanded", () => {
    renderWith({
      positiveQualities: [
        { qualityId: "ambidextrous", source: "creation", specification: "Pistols" },
      ],
    });
    expandFirstRow();
    const extraInfo = screen.getByTestId("extra-info");
    expect(extraInfo).toHaveTextContent("Pistols");
  });

  // --- Pending badge (visible in collapsed row) ---

  it("shows pending badge when gmApproved is false", () => {
    renderWith({
      positiveQualities: [{ qualityId: "ambidextrous", source: "creation", gmApproved: false }],
    });
    expect(screen.getByTestId("pending-badge")).toBeInTheDocument();
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  it("does not show pending badge when gmApproved is true", () => {
    renderWith({
      positiveQualities: [{ qualityId: "ambidextrous", source: "creation", gmApproved: true }],
    });
    expect(screen.queryByTestId("pending-badge")).not.toBeInTheDocument();
  });

  // --- Effect badges (expanded) ---

  it("renders effect badges for qualities with effects when expanded", () => {
    renderWith({
      positiveQualities: [{ qualityId: "high-pain-tolerance", source: "creation", rating: 1 }],
    });
    expandFirstRow();
    const badges = screen.getAllByTestId("effect-badge");
    expect(badges.length).toBe(1);
    expect(badges[0]).toHaveTextContent("wound modifier");
  });

  it("does not render effect badges when no effects", () => {
    renderWith({
      positiveQualities: [{ qualityId: "ambidextrous", source: "creation" }],
    });
    expandFirstRow();
    expect(screen.queryByTestId("effect-badge")).not.toBeInTheDocument();
  });

  // --- Dynamic state (expanded) ---

  it("renders dynamic state text for addiction when expanded", () => {
    renderWith({
      negativeQualities: [
        {
          qualityId: "addiction",
          source: "creation",
          dynamicState: {
            type: "addiction",
            state: {
              severity: "moderate",
              originalSeverity: "moderate",
              substance: "Novacoke",
              substanceType: "physiological",
              lastDose: "2080-01-01",
              nextCravingCheck: "2080-01-08",
              cravingActive: false,
              withdrawalActive: false,
              withdrawalPenalty: 0,
              daysClean: 0,
              recoveryAttempts: 0,
            },
          },
        },
      ],
    });
    expandFirstRow();
    const stateText = screen.getByTestId("dynamic-state-text");
    expect(stateText).toHaveTextContent("MODERATE");
    expect(stateText).toHaveTextContent("Novacoke");
  });

  it("renders settings button for quality with dynamic state when expanded", () => {
    renderWith({
      negativeQualities: [
        {
          qualityId: "addiction",
          source: "creation",
          dynamicState: {
            type: "addiction",
            state: {
              severity: "moderate",
              originalSeverity: "moderate",
              substance: "Novacoke",
              substanceType: "physiological",
              lastDose: "2080-01-01",
              nextCravingCheck: "2080-01-08",
              cravingActive: false,
              withdrawalActive: false,
              withdrawalPenalty: 0,
              daysClean: 0,
              recoveryAttempts: 0,
            },
          },
        },
      ],
    });
    expandFirstRow();
    expect(screen.getByTestId("settings-button")).toBeInTheDocument();
  });

  it("does not render settings button without dynamic state", () => {
    renderWith({
      positiveQualities: [{ qualityId: "ambidextrous", source: "creation" }],
    });
    expandFirstRow();
    expect(screen.queryByTestId("settings-button")).not.toBeInTheDocument();
  });

  // --- Multiple qualities ---

  it("renders multiple qualities with correct row count", () => {
    renderWith({
      positiveQualities: [
        { qualityId: "ambidextrous", source: "creation" },
        { qualityId: "high-pain-tolerance", source: "creation", rating: 1 },
      ],
      negativeQualities: [{ qualityId: "bad-luck", source: "creation" }],
    });
    expect(screen.getByText("Ambidextrous")).toBeInTheDocument();
    expect(screen.getByText("High Pain Tolerance")).toBeInTheDocument();
    expect(screen.getByText("Bad Luck")).toBeInTheDocument();
    const rows = screen.getAllByTestId("quality-row");
    expect(rows).toHaveLength(3);
  });
});
