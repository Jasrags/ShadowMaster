/**
 * GearDisplay Component Tests
 *
 * Tests the general gear display with expandable rows showing name,
 * specification, rating, and quantity in collapsed state, with catalog
 * details (description, availability, cost, weight, modifications, notes)
 * revealed on expand. Items are grouped by category.
 *
 * Also tests readiness badges, readiness controls, wireless toggle,
 * and state-aware wireless icon rendering.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { setupDisplayCardMock, LUCIDE_MOCK, createSheetCharacter } from "./test-helpers";
import type { GearItem, Character } from "@/lib/types";
import type { GearCatalogData } from "@/lib/rules/RulesetContext";

// ---------------------------------------------------------------------------
// Mock catalog data
// ---------------------------------------------------------------------------

const MOCK_GEAR_CATALOG: GearCatalogData = {
  categories: [
    { id: "electronics", name: "Electronics" },
    { id: "tools", name: "Tools & Kits" },
    { id: "survival", name: "Survival Gear" },
    { id: "medical", name: "Medical Supplies" },
    { id: "security", name: "Security Devices" },
    { id: "miscellaneous", name: "Miscellaneous" },
  ],
  weapons: {
    melee: [],
    pistols: [],
    smgs: [],
    rifles: [],
    shotguns: [],
    sniperRifles: [],
    throwingWeapons: [],
    grenades: [],
  },
  armor: [],
  commlinks: [],
  cyberdecks: [],
  electronics: [
    {
      id: "micro-transceiver",
      name: "Micro-Transceiver",
      category: "electronics",
      cost: 100,
      availability: 2,
      description: "Tiny radio transceiver with 1km range.",
      page: 441,
      source: "Core",
    } as GearCatalogData["electronics"][number] & { page: number; source: string },
    {
      id: "headjammer",
      name: "Headjammer",
      category: "electronics",
      cost: 150,
      availability: 1,
      description: "Personal jammer worn as a headband.",
      wirelessBonus: "Generates noise equal to rating against devices within 100m.",
      page: 441,
      source: "Core",
    } as GearCatalogData["electronics"][number] & {
      wirelessBonus: string;
      page: number;
      source: string;
    },
  ],
  rfidTags: [],
  tools: [
    {
      id: "lockpick-set",
      name: "Lockpick Set",
      category: "tools",
      cost: 250,
      availability: 8,
      legality: "restricted",
      description: "Professional-grade set for physical locks.",
      requiresSpecification: true,
      specificationLabel: "Skill",
    },
  ],
  survival: [],
  industrialChemicals: [],
  medical: [],
  security: [],
  miscellaneous: [],
  ammunition: [],
};

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

setupDisplayCardMock();
vi.mock("lucide-react", () => LUCIDE_MOCK);
vi.mock("@/lib/rules", () => ({
  useGear: () => MOCK_GEAR_CATALOG,
}));

vi.mock("@/components/character/sheet/WirelessIndicator", () => ({
  WirelessIndicator: (props: {
    enabled: boolean;
    globalEnabled?: boolean;
    onToggle?: (v: boolean) => void;
  }) => (
    <div
      data-testid="wireless-indicator"
      data-enabled={String(props.enabled)}
      data-global-enabled={String(props.globalEnabled)}
    >
      {props.onToggle && (
        <button
          data-testid="wireless-indicator-toggle"
          onClick={() => props.onToggle!(!props.enabled)}
        >
          toggle
        </button>
      )}
    </div>
  ),
}));

const mockIsGlobalWirelessEnabled = vi.fn((_character: unknown) => true);
vi.mock("@/lib/rules/wireless", () => ({
  isGlobalWirelessEnabled: (character: unknown) => mockIsGlobalWirelessEnabled(character),
}));

import { GearDisplay } from "../GearDisplay";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeGear(overrides: Partial<GearItem> & { name: string }): GearItem {
  return {
    category: "miscellaneous",
    quantity: 1,
    cost: 100,
    ...overrides,
  };
}

function makeCharacter(gear: GearItem[], overrides?: Partial<Character>): Character {
  return createSheetCharacter({ gear, ...overrides });
}

function renderGear(
  gear: GearItem[],
  opts?: { editable?: boolean; onCharacterUpdate?: (c: Character) => void; character?: Character }
) {
  const character = opts?.character ?? makeCharacter(gear);
  return render(
    <GearDisplay
      character={character}
      gear={gear}
      onCharacterUpdate={opts?.onCharacterUpdate}
      editable={opts?.editable}
    />
  );
}

function expandRow(index = 0) {
  const btn = screen.getAllByTestId("expand-button")[index];
  fireEvent.click(btn);
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("GearDisplay", () => {
  beforeEach(() => {
    mockIsGlobalWirelessEnabled.mockReturnValue(true);
  });

  // --- Empty state ---

  it("renders empty state message when no gear", () => {
    renderGear([]);
    expect(screen.getByText("No gear acquired")).toBeInTheDocument();
  });

  // --- Category grouping ---

  it("groups items by category with human-readable labels", () => {
    renderGear([
      makeGear({ name: "Medkit", category: "medical", rating: 6 }),
      makeGear({ name: "Micro-Transceiver", category: "electronics" }),
    ]);
    const labels = screen.getAllByTestId("category-label");
    expect(labels).toHaveLength(2);
    // Electronics comes before medical in CATEGORY_ORDER
    expect(labels[0]).toHaveTextContent("Electronics");
    expect(labels[1]).toHaveTextContent("Medical Supplies");
  });

  it("renders single category correctly", () => {
    renderGear([
      makeGear({ name: "Item A", category: "tools" }),
      makeGear({ name: "Item B", category: "tools" }),
    ]);
    const labels = screen.getAllByTestId("category-label");
    expect(labels).toHaveLength(1);
    expect(labels[0]).toHaveTextContent("Tools & Kits");
  });

  it("sorts known categories before unknown and unknown alphabetically", () => {
    renderGear([
      makeGear({ name: "Zapper", category: "zzz-custom" }),
      makeGear({ name: "Widget", category: "aaa-custom" }),
      makeGear({ name: "Medkit", category: "medical" }),
    ]);
    const labels = screen.getAllByTestId("category-label");
    expect(labels).toHaveLength(3);
    // medical (known) first, then aaa-custom, then zzz-custom
    expect(labels[0]).toHaveTextContent("Medical Supplies");
    expect(labels[1]).toHaveTextContent("Aaa Custom");
    expect(labels[2]).toHaveTextContent("Zzz Custom");
  });

  // --- Collapsed row ---

  it("renders gear item name", () => {
    renderGear([makeGear({ name: "Climbing Gear", category: "survival" })]);
    expect(screen.getByText("Climbing Gear")).toBeInTheDocument();
  });

  it("renders specification annotation when present", () => {
    renderGear([makeGear({ name: "Lockpick Set", category: "tools", specification: "Locksmith" })]);
    expect(screen.getByTestId("specification-label")).toHaveTextContent("(Locksmith)");
  });

  it("renders rating badge when present", () => {
    renderGear([makeGear({ name: "Medkit", category: "medical", rating: 6 })]);
    const badge = screen.getByTestId("rating-badge");
    expect(badge).toHaveTextContent("R6");
    expect(badge.className).toContain("indigo");
  });

  it("does not render rating badge when absent", () => {
    renderGear([makeGear({ name: "Medkit", category: "medical" })]);
    expect(screen.queryByTestId("rating-badge")).not.toBeInTheDocument();
  });

  it("renders quantity badge when greater than 1", () => {
    renderGear([makeGear({ name: "Medkit", category: "medical", quantity: 3 })]);
    const badge = screen.getByTestId("quantity-badge");
    expect(badge).toHaveTextContent("×3");
  });

  it("renders multiple rows within a category", () => {
    renderGear([
      makeGear({ name: "Item A", category: "tools" }),
      makeGear({ name: "Item B", category: "tools" }),
    ]);
    const rows = screen.getAllByTestId("gear-row");
    expect(rows).toHaveLength(2);
    expect(screen.getByText("Item A")).toBeInTheDocument();
    expect(screen.getByText("Item B")).toBeInTheDocument();
  });

  // --- Expand/collapse ---

  it("does not show expanded content initially", () => {
    renderGear([makeGear({ name: "Micro-Transceiver", category: "electronics" })]);
    expect(screen.queryByTestId("expanded-content")).not.toBeInTheDocument();
  });

  it("shows expanded content on click", () => {
    renderGear([makeGear({ name: "Micro-Transceiver", category: "electronics" })]);
    expandRow();
    expect(screen.getByTestId("expanded-content")).toBeInTheDocument();
  });

  it("collapses on second click", () => {
    renderGear([makeGear({ name: "Micro-Transceiver", category: "electronics" })]);
    expandRow();
    expect(screen.getByTestId("expanded-content")).toBeInTheDocument();
    expandRow();
    expect(screen.queryByTestId("expanded-content")).not.toBeInTheDocument();
  });

  it("toggles chevron icon on expand/collapse", () => {
    renderGear([makeGear({ name: "Micro-Transceiver", category: "electronics" })]);
    expect(screen.getByTestId("icon-ChevronRight")).toBeInTheDocument();
    expect(screen.queryByTestId("icon-ChevronDown")).not.toBeInTheDocument();
    expandRow();
    expect(screen.getByTestId("icon-ChevronDown")).toBeInTheDocument();
    expect(screen.queryByTestId("icon-ChevronRight")).not.toBeInTheDocument();
  });

  // --- Expanded detail ---

  it("renders catalog description when found", () => {
    renderGear([makeGear({ name: "Micro-Transceiver", category: "electronics" })]);
    expandRow();
    expect(screen.getByTestId("gear-description")).toHaveTextContent(
      "Tiny radio transceiver with 1km range."
    );
  });

  it("renders availability with legality suffix", () => {
    renderGear([
      makeGear({
        name: "Restricted Widget",
        category: "tools",
        availability: 12,
        legality: "restricted",
      }),
    ]);
    expandRow();
    const avail = screen.getByTestId("stat-availability");
    expect(avail).toHaveTextContent("12R");
  });

  it("renders cost in expanded section", () => {
    renderGear([makeGear({ name: "Expensive Tool", category: "tools", cost: 5000 })]);
    expandRow();
    const cost = screen.getByTestId("stat-cost");
    expect(cost).toHaveTextContent("¥5000");
  });

  it("renders weight in expanded section", () => {
    renderGear([makeGear({ name: "Heavy Kit", category: "tools", weight: 2.5 })]);
    expandRow();
    const weight = screen.getByTestId("stat-weight");
    expect(weight).toHaveTextContent("2.5kg");
  });

  it("renders modifications list in expanded section", () => {
    renderGear([
      makeGear({
        name: "Modified Tool",
        category: "tools",
        modifications: [
          {
            catalogId: "enhanced-accuracy",
            name: "Enhanced Accuracy",
            rating: 2,
            capacityUsed: 2,
            cost: 500,
            availability: 6,
          },
          {
            catalogId: "quick-draw",
            name: "Quick-Draw Holster",
            capacityUsed: 1,
            cost: 175,
            availability: 4,
          },
        ],
      }),
    ]);
    expandRow();
    expect(screen.getByTestId("modifications-section")).toBeInTheDocument();
    const mods = screen.getAllByTestId("mod-row");
    expect(mods).toHaveLength(2);
    expect(mods[0]).toHaveTextContent("Enhanced Accuracy");
    expect(mods[0]).toHaveTextContent("2");
    expect(mods[1]).toHaveTextContent("Quick-Draw Holster");
  });

  // --- Catalog fallback ---

  it("falls back to catalog availability when character item has none", () => {
    // Micro-Transceiver catalog entry has availability: 2
    renderGear([makeGear({ name: "Micro-Transceiver", category: "electronics" })]);
    expandRow();
    const avail = screen.getByTestId("stat-availability");
    expect(avail).toHaveTextContent("2");
  });

  it("falls back to catalog legality when character item has none", () => {
    // Lockpick Set catalog entry has legality: "restricted"
    renderGear([makeGear({ name: "Lockpick Set", category: "tools" })]);
    expandRow();
    const avail = screen.getByTestId("stat-availability");
    expect(avail).toHaveTextContent("8R");
  });

  it("prefers character availability over catalog", () => {
    // Micro-Transceiver catalog has availability: 2, but character says 10
    renderGear([
      makeGear({
        name: "Micro-Transceiver",
        category: "electronics",
        availability: 10,
        legality: "forbidden",
      }),
    ]);
    expandRow();
    const avail = screen.getByTestId("stat-availability");
    expect(avail).toHaveTextContent("10F");
  });

  // --- Wireless bonus ---

  it("renders wireless bonus from catalog", () => {
    renderGear([makeGear({ name: "Headjammer", category: "electronics" })]);
    expandRow();
    const wb = screen.getByTestId("wireless-bonus");
    expect(wb).toHaveTextContent("Wireless:");
    expect(wb).toHaveTextContent("Generates noise equal to rating against devices within 100m.");
  });

  it("does not render wireless bonus when catalog item has none", () => {
    renderGear([makeGear({ name: "Micro-Transceiver", category: "electronics" })]);
    expandRow();
    expect(screen.queryByTestId("wireless-bonus")).not.toBeInTheDocument();
  });

  // --- Source reference ---

  it("renders source page reference from catalog", () => {
    renderGear([makeGear({ name: "Micro-Transceiver", category: "electronics" })]);
    expandRow();
    const ref = screen.getByTestId("source-reference");
    expect(ref).toHaveTextContent("Core p.441");
  });

  // --- Notes ---

  it("renders notes in expanded section", () => {
    renderGear([
      makeGear({
        name: "Toolkit",
        category: "tools",
        notes: "Custom-made titanium set",
      }),
    ]);
    expandRow();
    expect(screen.getByTestId("gear-notes")).toHaveTextContent("Custom-made titanium set");
  });

  // --- Capacity ---

  it("renders capacity when present", () => {
    renderGear([
      makeGear({
        name: "Sensor Array",
        category: "electronics",
        capacity: 8,
        capacityUsed: 3,
      }),
    ]);
    expandRow();
    const cap = screen.getByTestId("capacity-section");
    expect(cap).toHaveTextContent("3/8");
  });

  // --- Readiness badge (collapsed row) ---

  it('shows "Carried" badge for state.readiness === "worn"', () => {
    renderGear([
      makeGear({
        name: "Headjammer",
        category: "electronics",
        state: { readiness: "worn", wirelessEnabled: true },
      }),
    ]);
    const badge = screen.getByTestId("readiness-badge");
    expect(badge).toHaveTextContent("Carried");
    expect(badge.className).toContain("blue");
  });

  it('shows "Stored" badge for state.readiness === "stored"', () => {
    renderGear([
      makeGear({
        name: "Headjammer",
        category: "electronics",
        state: { readiness: "stored", wirelessEnabled: true },
      }),
    ]);
    const badge = screen.getByTestId("readiness-badge");
    expect(badge).toHaveTextContent("Stored");
    expect(badge.className).toContain("zinc");
  });

  it('shows "Stashed" badge for state.readiness === "stashed"', () => {
    renderGear([
      makeGear({
        name: "Headjammer",
        category: "electronics",
        state: { readiness: "stashed", wirelessEnabled: true },
      }),
    ]);
    const badge = screen.getByTestId("readiness-badge");
    expect(badge).toHaveTextContent("Stashed");
    expect(badge.className).toContain("violet");
  });

  it('defaults to "Stored" when no state present', () => {
    renderGear([makeGear({ name: "Headjammer", category: "electronics" })]);
    const badge = screen.getByTestId("readiness-badge");
    expect(badge).toHaveTextContent("Stored");
  });

  // --- Readiness controls (expanded, editable) ---

  it("hides inventory controls when editable=false", () => {
    renderGear([makeGear({ name: "Headjammer", category: "electronics" })], {
      editable: false,
      onCharacterUpdate: vi.fn(),
    });
    expandRow();
    expect(screen.queryByTestId("inventory-controls")).not.toBeInTheDocument();
  });

  it("hides inventory controls when no onCharacterUpdate", () => {
    renderGear([makeGear({ name: "Headjammer", category: "electronics" })], {
      editable: true,
    });
    expandRow();
    expect(screen.queryByTestId("inventory-controls")).not.toBeInTheDocument();
  });

  it("shows readiness controls with Carried/Stored/Stashed buttons when editable", () => {
    renderGear([makeGear({ name: "Headjammer", category: "electronics" })], {
      editable: true,
      onCharacterUpdate: vi.fn(),
    });
    expandRow();
    expect(screen.getByTestId("readiness-controls")).toBeInTheDocument();
    expect(screen.getByTestId("readiness-worn")).toHaveTextContent("Carried");
    expect(screen.getByTestId("readiness-stored")).toHaveTextContent("Stored");
    expect(screen.getByTestId("readiness-stashed")).toHaveTextContent("Stashed");
  });

  it("disables current readiness state button", () => {
    renderGear(
      [
        makeGear({
          name: "Headjammer",
          category: "electronics",
          state: { readiness: "worn", wirelessEnabled: true },
        }),
      ],
      { editable: true, onCharacterUpdate: vi.fn() }
    );
    expandRow();
    expect(screen.getByTestId("readiness-worn")).toBeDisabled();
    expect(screen.getByTestId("readiness-stored")).not.toBeDisabled();
    expect(screen.getByTestId("readiness-stashed")).not.toBeDisabled();
  });

  it("calls onCharacterUpdate with correct readiness on click", () => {
    const onUpdate = vi.fn();
    const gear = [
      makeGear({
        name: "Headjammer",
        category: "electronics",
        state: { readiness: "stored", wirelessEnabled: true },
      }),
    ];
    renderGear(gear, { editable: true, onCharacterUpdate: onUpdate });
    expandRow();
    fireEvent.click(screen.getByTestId("readiness-worn"));
    expect(onUpdate).toHaveBeenCalledTimes(1);
    const updated = onUpdate.mock.calls[0][0] as Character;
    const updatedItem = updated.gear?.find((g) => g.name === "Headjammer");
    expect(updatedItem?.state?.readiness).toBe("worn");
  });

  it("preserves wireless state during readiness change", () => {
    const onUpdate = vi.fn();
    const gear = [
      makeGear({
        name: "Headjammer",
        category: "electronics",
        state: { readiness: "stored", wirelessEnabled: false },
      }),
    ];
    renderGear(gear, { editable: true, onCharacterUpdate: onUpdate });
    expandRow();
    fireEvent.click(screen.getByTestId("readiness-worn"));
    const updated = onUpdate.mock.calls[0][0] as Character;
    const updatedItem = updated.gear?.find((g) => g.name === "Headjammer");
    expect(updatedItem?.state?.wirelessEnabled).toBe(false);
  });

  // --- Wireless toggle (expanded, editable) ---

  it("hides wireless toggle for gear without wireless bonus", () => {
    renderGear([makeGear({ name: "Micro-Transceiver", category: "electronics" })], {
      editable: true,
      onCharacterUpdate: vi.fn(),
    });
    expandRow();
    expect(screen.queryByTestId("wireless-toggle")).not.toBeInTheDocument();
  });

  it("hides wireless toggle when not editable", () => {
    renderGear([makeGear({ name: "Headjammer", category: "electronics" })], {
      editable: false,
      onCharacterUpdate: vi.fn(),
    });
    expandRow();
    expect(screen.queryByTestId("wireless-toggle")).not.toBeInTheDocument();
  });

  it("shows WirelessIndicator when gear has wireless and is editable", () => {
    renderGear([makeGear({ name: "Headjammer", category: "electronics" })], {
      editable: true,
      onCharacterUpdate: vi.fn(),
    });
    expandRow();
    expect(screen.getByTestId("wireless-toggle")).toBeInTheDocument();
    expect(screen.getByTestId("wireless-indicator")).toBeInTheDocument();
  });

  it("calls onCharacterUpdate when wireless is toggled", () => {
    const onUpdate = vi.fn();
    const gear = [
      makeGear({
        name: "Headjammer",
        category: "electronics",
        state: { readiness: "stored", wirelessEnabled: true },
      }),
    ];
    renderGear(gear, { editable: true, onCharacterUpdate: onUpdate });
    expandRow();
    fireEvent.click(screen.getByTestId("wireless-indicator-toggle"));
    expect(onUpdate).toHaveBeenCalledTimes(1);
    const updated = onUpdate.mock.calls[0][0] as Character;
    const updatedItem = updated.gear?.find((g) => g.name === "Headjammer");
    expect(updatedItem?.state?.wirelessEnabled).toBe(false);
  });

  // --- Wireless icon (collapsed row) state-aware ---

  it("shows Wifi icon when wireless is active", () => {
    renderGear([
      makeGear({
        name: "Headjammer",
        category: "electronics",
        state: { readiness: "stored", wirelessEnabled: true },
      }),
    ]);
    expect(screen.getByTestId("wireless-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("wireless-icon-off")).not.toBeInTheDocument();
  });

  it("shows WifiOff icon when item wireless is disabled", () => {
    renderGear([
      makeGear({
        name: "Headjammer",
        category: "electronics",
        state: { readiness: "stored", wirelessEnabled: false },
      }),
    ]);
    expect(screen.getByTestId("wireless-icon-off")).toBeInTheDocument();
    expect(screen.queryByTestId("wireless-icon")).not.toBeInTheDocument();
  });

  it("shows WifiOff icon when global wireless is disabled", () => {
    mockIsGlobalWirelessEnabled.mockReturnValue(false);
    renderGear([
      makeGear({
        name: "Headjammer",
        category: "electronics",
        state: { readiness: "stored", wirelessEnabled: true },
      }),
    ]);
    expect(screen.getByTestId("wireless-icon-off")).toBeInTheDocument();
    expect(screen.queryByTestId("wireless-icon")).not.toBeInTheDocument();
  });

  it("does not render wireless icon when no wireless bonus", () => {
    renderGear([makeGear({ name: "Micro-Transceiver", category: "electronics" })]);
    expect(screen.queryByTestId("wireless-icon")).not.toBeInTheDocument();
    expect(screen.queryByTestId("wireless-icon-off")).not.toBeInTheDocument();
  });

  // --- Edge cases ---

  it("renders spacer for non-expandable item", () => {
    // cost: 0, no availability, no notes, no mods, no specification, and not in catalog
    renderGear([makeGear({ name: "Unknown Widget", category: "miscellaneous", cost: 0 })]);
    expect(screen.queryByTestId("expand-button")).not.toBeInTheDocument();
    expect(screen.getByTestId("spacer")).toBeInTheDocument();
  });

  it("falls back to title-cased kebab string for unknown category", () => {
    renderGear([makeGear({ name: "Custom Thing", category: "b-and-e-gear" })]);
    const labels = screen.getAllByTestId("category-label");
    expect(labels[0]).toHaveTextContent("B And E Gear");
  });
});
