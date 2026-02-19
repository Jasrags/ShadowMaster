/**
 * DrugsDisplay Component Tests
 *
 * Tests the drugs & toxins display with expandable rows showing name,
 * rating, and quantity in collapsed state, with catalog details
 * (description, delivery, effects, crash, addiction, cost) revealed on expand.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { setupDisplayCardMock, LUCIDE_MOCK } from "./test-helpers";
import type { GearItem } from "@/lib/types";
import type { DrugCatalogItemData } from "@/lib/rules/loader-types";

// ---------------------------------------------------------------------------
// Mock catalog data
// ---------------------------------------------------------------------------

const MOCK_JAZZ: DrugCatalogItemData = {
  id: "jazz",
  name: "Jazz",
  category: "drug",
  vector: ["inhalation", "injection"],
  speed: "Immediate",
  duration: "10 × 1D6 minutes",
  addictionType: "both",
  addictionRating: 8,
  addictionThreshold: 3,
  effects: {
    active: {
      reaction: 1,
      initiativeDice: 2,
    },
    crash: {
      description: "Flooded with despondent emotions",
      stunDamage: 6,
    },
  },
  cost: 75,
  availability: 2,
  legality: "restricted",
  description: "Extremely popular stimulant that heightens reflexes.",
};

const MOCK_LONG_HAUL: DrugCatalogItemData = {
  id: "long-haul",
  name: "Long Haul",
  category: "drug",
  vector: ["ingestion"],
  speed: "10 minutes",
  duration: "4 days",
  addictionType: "psychological",
  addictionRating: 2,
  addictionThreshold: 1,
  effects: {
    active: {
      eliminatesSleepNeed: true,
    },
    crash: null,
  },
  cost: 50,
  availability: 2,
  description: "Allows the user to go without sleep for four days.",
};

const MOCK_BLISS: DrugCatalogItemData = {
  id: "bliss",
  name: "Bliss",
  category: "drug",
  vector: ["inhalation", "injection"],
  speed: "1 Combat Turn",
  duration: "(6 - Body) hours, minimum 1 hour",
  addictionType: "both",
  addictionRating: 3,
  addictionThreshold: 2,
  effects: {
    active: {
      reaction: -1,
      highPainTolerance: 3,
    },
    crash: null,
  },
  cost: 15,
  availability: 3,
  legality: "forbidden",
  description: "A tranquilizing narcotic opiate.",
};

const MOCK_DRUG_CATALOG: DrugCatalogItemData[] = [MOCK_JAZZ, MOCK_LONG_HAUL, MOCK_BLISS];

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

setupDisplayCardMock();
vi.mock("lucide-react", () => LUCIDE_MOCK);
vi.mock("@/lib/rules", () => ({
  useDrugs: () => MOCK_DRUG_CATALOG,
}));

import { DrugsDisplay } from "../DrugsDisplay";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeDrug(overrides: Partial<GearItem> & { name: string }): GearItem {
  return {
    category: "drug",
    quantity: 1,
    cost: 75,
    ...overrides,
  };
}

function expandRow(index = 0) {
  const btn = screen.getAllByTestId("expand-button")[index];
  fireEvent.click(btn);
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("DrugsDisplay", () => {
  // --- Empty state ---

  it("returns null when drugs array is empty", () => {
    const { container } = render(<DrugsDisplay drugs={[]} />);
    expect(container.innerHTML).toBe("");
  });

  // --- Collapsed row ---

  it("renders drug name", () => {
    render(<DrugsDisplay drugs={[makeDrug({ name: "Jazz" })]} />);
    expect(screen.getByText("Jazz")).toBeInTheDocument();
  });

  it("renders multiple drug rows", () => {
    render(
      <DrugsDisplay drugs={[makeDrug({ name: "Jazz" }), makeDrug({ name: "Bliss", cost: 15 })]} />
    );
    expect(screen.getAllByTestId("drug-row")).toHaveLength(2);
    expect(screen.getByText("Jazz")).toBeInTheDocument();
    expect(screen.getByText("Bliss")).toBeInTheDocument();
  });

  it("renders rating badge when present", () => {
    render(<DrugsDisplay drugs={[makeDrug({ name: "Jazz", rating: 3 })]} />);
    const badge = screen.getByTestId("rating-badge");
    expect(badge).toHaveTextContent("R3");
    expect(badge.className).toContain("amber");
  });

  it("does not render rating badge when absent", () => {
    render(<DrugsDisplay drugs={[makeDrug({ name: "Jazz" })]} />);
    expect(screen.queryByTestId("rating-badge")).not.toBeInTheDocument();
  });

  it("renders quantity badge when greater than 1", () => {
    render(<DrugsDisplay drugs={[makeDrug({ name: "Jazz", quantity: 4 })]} />);
    const badge = screen.getByTestId("quantity-badge");
    expect(badge).toHaveTextContent("×4");
  });

  it("does not render quantity badge when 1", () => {
    render(<DrugsDisplay drugs={[makeDrug({ name: "Jazz", quantity: 1 })]} />);
    expect(screen.queryByTestId("quantity-badge")).not.toBeInTheDocument();
  });

  // --- Expand/collapse ---

  it("does not show expanded content initially", () => {
    render(<DrugsDisplay drugs={[makeDrug({ name: "Jazz" })]} />);
    expect(screen.queryByTestId("expanded-content")).not.toBeInTheDocument();
  });

  it("shows expanded content on click", () => {
    render(<DrugsDisplay drugs={[makeDrug({ name: "Jazz" })]} />);
    expandRow();
    expect(screen.getByTestId("expanded-content")).toBeInTheDocument();
  });

  it("collapses on second click", () => {
    render(<DrugsDisplay drugs={[makeDrug({ name: "Jazz" })]} />);
    expandRow();
    expect(screen.getByTestId("expanded-content")).toBeInTheDocument();
    expandRow();
    expect(screen.queryByTestId("expanded-content")).not.toBeInTheDocument();
  });

  it("toggles chevron icon on expand/collapse", () => {
    render(<DrugsDisplay drugs={[makeDrug({ name: "Jazz" })]} />);
    expect(screen.getByTestId("icon-ChevronRight")).toBeInTheDocument();
    expect(screen.queryByTestId("icon-ChevronDown")).not.toBeInTheDocument();
    expandRow();
    expect(screen.getByTestId("icon-ChevronDown")).toBeInTheDocument();
    expect(screen.queryByTestId("icon-ChevronRight")).not.toBeInTheDocument();
  });

  // --- Catalog detail (expanded) ---

  it("renders description from catalog", () => {
    render(<DrugsDisplay drugs={[makeDrug({ name: "Jazz" })]} />);
    expandRow();
    expect(screen.getByTestId("drug-description")).toHaveTextContent(
      "Extremely popular stimulant that heightens reflexes."
    );
  });

  it("renders delivery stats (vector, speed, duration)", () => {
    render(<DrugsDisplay drugs={[makeDrug({ name: "Jazz" })]} />);
    expandRow();
    const stats = screen.getByTestId("delivery-stats");
    expect(stats).toHaveTextContent("inhalation, injection");
    expect(stats).toHaveTextContent("Immediate");
    expect(stats).toHaveTextContent("10 × 1D6 minutes");
  });

  it("renders active effect badges with positive/negative coloring", () => {
    render(<DrugsDisplay drugs={[makeDrug({ name: "Jazz" })]} />);
    expandRow();
    const badges = screen.getAllByTestId("active-effect-badge");
    expect(badges).toHaveLength(2);
    // +1 Reaction → emerald
    const reactionBadge = badges.find((b) => b.textContent?.includes("Reaction"));
    expect(reactionBadge).toBeDefined();
    expect(reactionBadge!.textContent).toContain("+1");
    expect(reactionBadge!.className).toContain("emerald");
    // +2 Initiative Dice → emerald
    const initBadge = badges.find((b) => b.textContent?.includes("Initiative Dice"));
    expect(initBadge).toBeDefined();
    expect(initBadge!.textContent).toContain("+2");
  });

  it("renders negative active effects with rose coloring", () => {
    render(<DrugsDisplay drugs={[makeDrug({ name: "Bliss", cost: 15 })]} />);
    expandRow();
    const badges = screen.getAllByTestId("active-effect-badge");
    const reactionBadge = badges.find((b) => b.textContent?.includes("Reaction"));
    expect(reactionBadge).toBeDefined();
    expect(reactionBadge!.textContent).toContain("-1");
    expect(reactionBadge!.className).toContain("rose");
  });

  it("renders boolean active effects as label only", () => {
    render(<DrugsDisplay drugs={[makeDrug({ name: "Long Haul", cost: 50 })]} />);
    expandRow();
    const badges = screen.getAllByTestId("active-effect-badge");
    expect(badges).toHaveLength(1);
    expect(badges[0]).toHaveTextContent("Eliminates Sleep Need");
  });

  it("renders crash description text", () => {
    render(<DrugsDisplay drugs={[makeDrug({ name: "Jazz" })]} />);
    expandRow();
    expect(screen.getByTestId("crash-description")).toHaveTextContent(
      "Flooded with despondent emotions"
    );
  });

  it("renders crash effect badges with rose coloring", () => {
    render(<DrugsDisplay drugs={[makeDrug({ name: "Jazz" })]} />);
    expandRow();
    const badges = screen.getAllByTestId("crash-effect-badge");
    expect(badges).toHaveLength(1);
    expect(badges[0]).toHaveTextContent("6 Stun Damage");
    expect(badges[0].className).toContain("rose");
  });

  it("does not render crash section when crash is null", () => {
    render(<DrugsDisplay drugs={[makeDrug({ name: "Long Haul", cost: 50 })]} />);
    expandRow();
    expect(screen.queryByTestId("crash-effects-section")).not.toBeInTheDocument();
  });

  it("renders addiction stats", () => {
    render(<DrugsDisplay drugs={[makeDrug({ name: "Jazz" })]} />);
    expandRow();
    const stats = screen.getByTestId("addiction-stats");
    expect(stats).toHaveTextContent("both");
    expect(stats).toHaveTextContent("8");
    expect(stats).toHaveTextContent("3");
  });

  // --- Cost (expanded) ---

  it("renders cost in expanded section", () => {
    render(<DrugsDisplay drugs={[makeDrug({ name: "Jazz", cost: 75 })]} />);
    expandRow();
    const cost = screen.getByTestId("stat-cost");
    expect(cost).toHaveTextContent("¥75");
  });

  // --- Availability/legality ---

  it("renders availability with restricted suffix", () => {
    render(<DrugsDisplay drugs={[makeDrug({ name: "Jazz" })]} />);
    expandRow();
    const avail = screen.getByTestId("stat-availability");
    expect(avail).toHaveTextContent("2R");
  });

  it("renders availability with forbidden suffix", () => {
    render(<DrugsDisplay drugs={[makeDrug({ name: "Bliss", cost: 15 })]} />);
    expandRow();
    const avail = screen.getByTestId("stat-availability");
    expect(avail).toHaveTextContent("3F");
  });

  // --- Notes ---

  it("renders notes when present", () => {
    render(<DrugsDisplay drugs={[makeDrug({ name: "Jazz", notes: "Emergency stash" })]} />);
    expandRow();
    expect(screen.getByTestId("drug-notes")).toHaveTextContent("Emergency stash");
  });

  // --- Edge cases ---

  it("renders spacer when no expandable content", () => {
    render(<DrugsDisplay drugs={[makeDrug({ name: "Custom Brew" })]} />);
    // "Custom Brew" not in catalog, no availability, no notes → spacer
    expect(screen.queryByTestId("expand-button")).not.toBeInTheDocument();
    expect(screen.getByTestId("spacer")).toBeInTheDocument();
  });

  it("uses drug availability over catalog when both present", () => {
    render(
      <DrugsDisplay drugs={[makeDrug({ name: "Jazz", availability: 10, legality: "forbidden" })]} />
    );
    expandRow();
    const avail = screen.getByTestId("stat-availability");
    expect(avail).toHaveTextContent("10F");
  });
});
