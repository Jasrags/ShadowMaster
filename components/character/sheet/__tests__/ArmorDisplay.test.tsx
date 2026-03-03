/**
 * ArmorDisplay Component Tests
 *
 * Tests the armor display with expandable rows grouped into Worn/Stored sections.
 * Validates section grouping, collapsed/expanded states, stats, capacity bar,
 * modifications, readiness controls, wireless toggle, and accessory badge rendering.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  setupDisplayCardMock,
  LUCIDE_MOCK,
  MOCK_ARMOR_EQUIPPED,
  MOCK_ARMOR_STORED,
  MOCK_ARMOR_WITH_MODS,
  MOCK_ARMOR_ACCESSORY,
  MOCK_ARMOR_WITH_WIRELESS,
  createSheetCharacter,
} from "./test-helpers";

setupDisplayCardMock();
vi.mock("lucide-react", () => LUCIDE_MOCK);

// ---------------------------------------------------------------------------
// Mock external components
// ---------------------------------------------------------------------------

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

vi.mock("@/lib/rules/wireless", () => ({
  isGlobalWirelessEnabled: vi.fn(() => true),
}));

vi.mock("react-aria-components", () => ({
  Button: ({
    children,
    className,
    ...props
  }: {
    children: React.ReactNode;
    className?: string;
    [key: string]: unknown;
  }) => (
    <button className={className} {...props}>
      {children}
    </button>
  ),
}));

vi.mock("@/components/ui", () => ({
  Tooltip: ({ content, children }: { content: React.ReactNode; children: React.ReactNode }) => (
    <div data-testid="tooltip-wrapper">
      {children}
      <div data-testid="tooltip-content">{content}</div>
    </div>
  ),
}));

vi.mock("@/lib/rules/gameplay", () => ({
  calculateArmorTotal: vi.fn(() => ({
    totalArmor: 12,
    baseArmor: 12,
    rawAccessoryBonus: 0,
    effectiveAccessoryBonus: 0,
    excessOverStrength: 0,
    agilityPenalty: 0,
    reactionPenalty: 0,
    isEncumbered: false,
    baseArmorName: "Armor Jacket",
    accessoryNames: [],
  })),
}));

// ---------------------------------------------------------------------------
// Catalog mock
// ---------------------------------------------------------------------------

const MOCK_GEAR_CATALOG = {
  categories: [],
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
  armor: [
    {
      id: "berwick-suit",
      name: "Berwick Suit",
      category: "armor",
      subcategory: "armor-clothing",
      armorRating: 8,
      cost: 2600,
      availability: 8,
      wirelessBonus: "+1 to Social limit while wireless is active.",
    },
  ],
  commlinks: [],
  cyberdecks: [],
  electronics: [],
  tools: [],
  survival: [],
  medical: [],
  security: [],
  miscellaneous: [],
  ammunition: [],
  rfidTags: [],
  industrialChemicals: [],
};

vi.mock("@/lib/rules", () => ({
  useGear: () => MOCK_GEAR_CATALOG,
}));

import { ArmorDisplay } from "../ArmorDisplay";
import { isGlobalWirelessEnabled } from "@/lib/rules/wireless";
import { calculateArmorTotal } from "@/lib/rules/gameplay";

beforeEach(() => {
  vi.clearAllMocks();
  (isGlobalWirelessEnabled as ReturnType<typeof vi.fn>).mockReturnValue(true);
});

describe("ArmorDisplay", () => {
  // --- Empty state ---

  it("returns null when armor array is empty", () => {
    const character = createSheetCharacter({ armor: [] });
    const { container } = render(<ArmorDisplay character={character} />);
    expect(container.innerHTML).toBe("");
  });

  it("returns null when armor is undefined", () => {
    const character = createSheetCharacter({ armor: undefined });
    const { container } = render(<ArmorDisplay character={character} />);
    expect(container.innerHTML).toBe("");
  });

  // --- Section grouping ---

  it("renders Worn section for worn armor", () => {
    const character = createSheetCharacter({ armor: [MOCK_ARMOR_EQUIPPED] });
    render(<ArmorDisplay character={character} />);
    // "Worn" appears as section header and readiness badge
    expect(screen.getAllByText("Worn").length).toBeGreaterThanOrEqual(1);
  });

  it("renders Stored section for stored armor", () => {
    const character = createSheetCharacter({ armor: [MOCK_ARMOR_STORED] });
    render(<ArmorDisplay character={character} />);
    // "Stored" appears as section header and readiness badge
    expect(screen.getAllByText("Stored").length).toBeGreaterThanOrEqual(1);
  });

  it("hides Stored section when all armor is worn", () => {
    const character = createSheetCharacter({ armor: [MOCK_ARMOR_EQUIPPED] });
    render(<ArmorDisplay character={character} />);
    // "Stored" should not appear anywhere (no section header, no badge)
    expect(screen.queryByText("Stored")).not.toBeInTheDocument();
  });

  it("hides Worn section when all armor is stored", () => {
    const character = createSheetCharacter({ armor: [MOCK_ARMOR_STORED] });
    render(<ArmorDisplay character={character} />);
    // "Worn" should not appear anywhere (no section header, no badge)
    expect(screen.queryByText("Worn")).not.toBeInTheDocument();
  });

  it("renders both sections when armor includes worn and stored", () => {
    const character = createSheetCharacter({ armor: [MOCK_ARMOR_EQUIPPED, MOCK_ARMOR_STORED] });
    render(<ArmorDisplay character={character} />);
    // Each appears as section header + readiness badge
    expect(screen.getAllByText("Worn").length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText("Stored").length).toBeGreaterThanOrEqual(2);
  });

  it("falls back to equipped field when state is absent", () => {
    const legacyEquipped = { ...MOCK_ARMOR_EQUIPPED, state: undefined, equipped: true };
    const legacyStored = { ...MOCK_ARMOR_STORED, state: undefined, equipped: false };
    const character = createSheetCharacter({ armor: [legacyEquipped, legacyStored] });
    render(<ArmorDisplay character={character} />);
    expect(screen.getAllByText("Worn").length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText("Stored").length).toBeGreaterThanOrEqual(2);
  });

  // --- Collapsed row ---

  it("renders armor name in collapsed row", () => {
    const character = createSheetCharacter({ armor: [MOCK_ARMOR_EQUIPPED] });
    render(<ArmorDisplay character={character} />);
    expect(screen.getAllByText("Armor Jacket").length).toBeGreaterThanOrEqual(1);
  });

  it("renders armor rating in sky-colored pill", () => {
    const character = createSheetCharacter({ armor: [MOCK_ARMOR_EQUIPPED] });
    render(<ArmorDisplay character={character} />);
    const pill = screen.getByTestId("rating-pill");
    expect(pill).toHaveTextContent("12");
    expect(pill.className).toContain("sky");
  });

  it("renders subcategory label when subcategory is present", () => {
    const character = createSheetCharacter({ armor: [MOCK_ARMOR_ACCESSORY] });
    render(<ArmorDisplay character={character} />);
    expect(screen.getByTestId("subcategory-label")).toBeInTheDocument();
  });

  it("does not show expanded content by default", () => {
    const character = createSheetCharacter({ armor: [MOCK_ARMOR_EQUIPPED] });
    render(<ArmorDisplay character={character} />);
    expect(screen.queryByTestId("expanded-content")).not.toBeInTheDocument();
  });

  // --- Readiness badge (collapsed row) ---

  it("shows Worn readiness badge for worn armor", () => {
    const character = createSheetCharacter({ armor: [MOCK_ARMOR_EQUIPPED] });
    render(<ArmorDisplay character={character} />);
    const badge = screen.getByTestId("readiness-badge");
    expect(badge).toHaveTextContent("Worn");
    expect(badge.className).toContain("blue");
  });

  it("shows Stored readiness badge for stored armor", () => {
    const character = createSheetCharacter({ armor: [MOCK_ARMOR_STORED] });
    render(<ArmorDisplay character={character} />);
    const badge = screen.getByTestId("readiness-badge");
    expect(badge).toHaveTextContent("Stored");
    expect(badge.className).toContain("zinc");
  });

  // --- Wireless icon (collapsed row) ---

  it("shows Wifi icon when armor has wireless and is active", () => {
    const character = createSheetCharacter({ armor: [MOCK_ARMOR_WITH_WIRELESS] });
    render(<ArmorDisplay character={character} />);
    expect(screen.getByTestId("wireless-icon")).toBeInTheDocument();
  });

  it("shows WifiOff icon when armor wireless is disabled", () => {
    const armorWirelessOff = {
      ...MOCK_ARMOR_WITH_WIRELESS,
      state: { readiness: "worn" as const, wirelessEnabled: false },
    };
    const character = createSheetCharacter({ armor: [armorWirelessOff] });
    render(<ArmorDisplay character={character} />);
    expect(screen.getByTestId("wireless-icon-off")).toBeInTheDocument();
    expect(screen.queryByTestId("wireless-icon")).not.toBeInTheDocument();
  });

  it("shows WifiOff icon when global wireless is disabled", () => {
    (isGlobalWirelessEnabled as ReturnType<typeof vi.fn>).mockReturnValue(false);
    const character = createSheetCharacter({ armor: [MOCK_ARMOR_WITH_WIRELESS] });
    render(<ArmorDisplay character={character} />);
    expect(screen.getByTestId("wireless-icon-off")).toBeInTheDocument();
  });

  it("shows wireless icon for armor without explicit wirelessBonus", () => {
    const character = createSheetCharacter({ armor: [MOCK_ARMOR_EQUIPPED] });
    render(<ArmorDisplay character={character} />);
    expect(screen.getByTestId("wireless-icon")).toBeInTheDocument();
  });

  // --- Expand/collapse ---

  it("expands row on chevron click", async () => {
    const user = userEvent.setup();
    const character = createSheetCharacter({ armor: [MOCK_ARMOR_EQUIPPED] });
    render(<ArmorDisplay character={character} />);

    await user.click(screen.getByTestId("expand-button"));
    expect(screen.getByTestId("expanded-content")).toBeInTheDocument();
  });

  it("collapses row on second chevron click", async () => {
    const user = userEvent.setup();
    const character = createSheetCharacter({ armor: [MOCK_ARMOR_EQUIPPED] });
    render(<ArmorDisplay character={character} />);

    await user.click(screen.getByTestId("expand-button"));
    expect(screen.getByTestId("expanded-content")).toBeInTheDocument();

    await user.click(screen.getByTestId("expand-button"));
    expect(screen.queryByTestId("expanded-content")).not.toBeInTheDocument();
  });

  // --- Expanded stats ---

  it("renders availability with legality suffix when expanded", async () => {
    const user = userEvent.setup();
    const character = createSheetCharacter({ armor: [MOCK_ARMOR_WITH_MODS] });
    render(<ArmorDisplay character={character} />);

    await user.click(screen.getAllByTestId("expand-button")[0]);

    const avail = screen.getByTestId("stat-availability");
    expect(avail).toHaveTextContent("14R");
  });

  it("renders weight when present and expanded", async () => {
    const user = userEvent.setup();
    const character = createSheetCharacter({ armor: [MOCK_ARMOR_WITH_MODS] });
    render(<ArmorDisplay character={character} />);

    await user.click(screen.getAllByTestId("expand-button")[0]);

    const weight = screen.getByTestId("stat-weight");
    expect(weight).toHaveTextContent("8kg");
  });

  it("does not render availability when absent", async () => {
    const user = userEvent.setup();
    const character = createSheetCharacter({ armor: [MOCK_ARMOR_EQUIPPED] });
    render(<ArmorDisplay character={character} />);

    await user.click(screen.getByTestId("expand-button"));
    expect(screen.queryByTestId("stat-availability")).not.toBeInTheDocument();
  });

  // --- Capacity ---

  it("renders capacity as used/total text for non-custom armor", async () => {
    const user = userEvent.setup();
    const character = createSheetCharacter({ armor: [MOCK_ARMOR_WITH_MODS] });
    render(<ArmorDisplay character={character} />);

    await user.click(screen.getAllByTestId("expand-button")[0]);
    const section = screen.getByTestId("capacity-section");
    expect(section).toHaveTextContent("Capacity 7/15");
  });

  it("hides capacity section for custom items", async () => {
    const user = userEvent.setup();
    const customArmor = { ...MOCK_ARMOR_EQUIPPED, isCustom: true };
    const character = createSheetCharacter({ armor: [customArmor] });
    render(<ArmorDisplay character={character} />);

    await user.click(screen.getByTestId("expand-button"));
    expect(screen.queryByTestId("capacity-section")).not.toBeInTheDocument();
  });

  // --- Modifications ---

  it("renders modifications section when mods exist", async () => {
    const user = userEvent.setup();
    const character = createSheetCharacter({ armor: [MOCK_ARMOR_WITH_MODS] });
    render(<ArmorDisplay character={character} />);

    await user.click(screen.getAllByTestId("expand-button")[0]);
    expect(screen.getByTestId("modifications-section")).toBeInTheDocument();
    expect(screen.getByText("Modifications")).toBeInTheDocument();
  });

  it("renders mod names and ratings", async () => {
    const user = userEvent.setup();
    const character = createSheetCharacter({ armor: [MOCK_ARMOR_WITH_MODS] });
    render(<ArmorDisplay character={character} />);

    await user.click(screen.getAllByTestId("expand-button")[0]);

    const modRows = screen.getAllByTestId("mod-row");
    expect(modRows).toHaveLength(2);

    expect(modRows[0]).toHaveTextContent("Fire Resistance");
    expect(modRows[0]).toHaveTextContent("3");
    expect(modRows[1]).toHaveTextContent("Chemical Protection");
    expect(modRows[1]).toHaveTextContent("4");
  });

  it("does not render modifications section when no mods", async () => {
    const user = userEvent.setup();
    const character = createSheetCharacter({ armor: [MOCK_ARMOR_EQUIPPED] });
    render(<ArmorDisplay character={character} />);

    await user.click(screen.getByTestId("expand-button"));
    expect(screen.queryByTestId("modifications-section")).not.toBeInTheDocument();
  });

  // --- Multiple items ---

  it("renders multiple armor items", () => {
    const character = createSheetCharacter({ armor: [MOCK_ARMOR_EQUIPPED, MOCK_ARMOR_STORED] });
    render(<ArmorDisplay character={character} />);
    expect(screen.getAllByText("Armor Jacket").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Lined Coat")).toBeInTheDocument();
  });

  // --- Readiness controls (expanded, editable) ---

  describe("readiness controls", () => {
    it("hidden when editable=false", () => {
      const character = createSheetCharacter({ armor: [MOCK_ARMOR_EQUIPPED] });
      render(<ArmorDisplay character={character} editable={false} onCharacterUpdate={vi.fn()} />);
      fireEvent.click(screen.getByTestId("expand-button"));
      expect(screen.queryByTestId("inventory-controls")).not.toBeInTheDocument();
    });

    it("hidden when no onCharacterUpdate", () => {
      const character = createSheetCharacter({ armor: [MOCK_ARMOR_EQUIPPED] });
      render(<ArmorDisplay character={character} editable={true} />);
      fireEvent.click(screen.getByTestId("expand-button"));
      expect(screen.queryByTestId("inventory-controls")).not.toBeInTheDocument();
    });

    it("shows Worn/Carried/Stashed buttons when editable", () => {
      const character = createSheetCharacter({ armor: [MOCK_ARMOR_EQUIPPED] });
      render(<ArmorDisplay character={character} editable={true} onCharacterUpdate={vi.fn()} />);
      fireEvent.click(screen.getByTestId("expand-button"));
      expect(screen.getByTestId("readiness-controls")).toBeInTheDocument();
      expect(screen.getByTestId("readiness-worn")).toBeInTheDocument();
      expect(screen.getByTestId("readiness-carried")).toBeInTheDocument();
      expect(screen.getByTestId("readiness-stashed")).toBeInTheDocument();
    });

    it("disables current readiness state button", () => {
      const character = createSheetCharacter({ armor: [MOCK_ARMOR_EQUIPPED] });
      render(<ArmorDisplay character={character} editable={true} onCharacterUpdate={vi.fn()} />);
      fireEvent.click(screen.getByTestId("expand-button"));
      expect(screen.getByTestId("readiness-worn")).toBeDisabled();
      expect(screen.getByTestId("readiness-carried")).not.toBeDisabled();
    });

    it("calls onCharacterUpdate when toggling readiness to carried", () => {
      const onUpdate = vi.fn();
      const character = createSheetCharacter({ armor: [MOCK_ARMOR_EQUIPPED] });
      render(<ArmorDisplay character={character} editable={true} onCharacterUpdate={onUpdate} />);
      fireEvent.click(screen.getByTestId("expand-button"));
      fireEvent.click(screen.getByTestId("readiness-carried"));
      expect(onUpdate).toHaveBeenCalledTimes(1);
      const updated = onUpdate.mock.calls[0][0];
      expect(updated.armor[0].state.readiness).toBe("carried");
      expect(updated.armor[0].equipped).toBe(false);
    });

    it("calls onCharacterUpdate when toggling readiness to worn", () => {
      const onUpdate = vi.fn();
      const character = createSheetCharacter({ armor: [MOCK_ARMOR_STORED] });
      render(<ArmorDisplay character={character} editable={true} onCharacterUpdate={onUpdate} />);
      fireEvent.click(screen.getByTestId("expand-button"));
      fireEvent.click(screen.getByTestId("readiness-worn"));
      expect(onUpdate).toHaveBeenCalledTimes(1);
      const updated = onUpdate.mock.calls[0][0];
      expect(updated.armor[0].state.readiness).toBe("worn");
      expect(updated.armor[0].equipped).toBe(true);
    });

    it("preserves wireless state during readiness change", () => {
      const onUpdate = vi.fn();
      const character = createSheetCharacter({ armor: [MOCK_ARMOR_WITH_WIRELESS] });
      render(<ArmorDisplay character={character} editable={true} onCharacterUpdate={onUpdate} />);
      fireEvent.click(screen.getByTestId("expand-button"));
      fireEvent.click(screen.getByTestId("readiness-carried"));
      const updated = onUpdate.mock.calls[0][0];
      expect(updated.armor[0].state.wirelessEnabled).toBe(true);
    });

    it("keeps row expanded after readiness change re-render", () => {
      const onUpdate = vi.fn();
      const character = createSheetCharacter({ armor: [MOCK_ARMOR_EQUIPPED] });
      const { rerender } = render(
        <ArmorDisplay character={character} editable={true} onCharacterUpdate={onUpdate} />
      );
      fireEvent.click(screen.getByTestId("expand-button"));
      expect(screen.getByTestId("expanded-content")).toBeInTheDocument();

      // Simulate parent re-rendering with updated character (worn -> carried)
      fireEvent.click(screen.getByTestId("readiness-carried"));
      const updated = onUpdate.mock.calls[0][0];
      rerender(<ArmorDisplay character={updated} editable={true} onCharacterUpdate={onUpdate} />);

      // Row should still be expanded after moving from Worn to Carried section
      expect(screen.getByTestId("expanded-content")).toBeInTheDocument();
    });
  });

  // --- Wireless toggle (expanded, editable) ---

  describe("wireless toggle", () => {
    it("shown when armor has no explicit wirelessBonus", () => {
      const onUpdate = vi.fn();
      const character = createSheetCharacter({ armor: [MOCK_ARMOR_EQUIPPED] });
      render(<ArmorDisplay character={character} editable={true} onCharacterUpdate={onUpdate} />);
      fireEvent.click(screen.getByTestId("expand-button"));
      expect(screen.getByTestId("wireless-toggle")).toBeInTheDocument();
    });

    it("hidden when not editable", () => {
      const character = createSheetCharacter({ armor: [MOCK_ARMOR_WITH_WIRELESS] });
      render(<ArmorDisplay character={character} editable={false} onCharacterUpdate={vi.fn()} />);
      fireEvent.click(screen.getByTestId("expand-button"));
      expect(screen.queryByTestId("wireless-toggle")).not.toBeInTheDocument();
    });

    it("shows WirelessIndicator when armor has wirelessBonus and editable", () => {
      const onUpdate = vi.fn();
      const character = createSheetCharacter({ armor: [MOCK_ARMOR_WITH_WIRELESS] });
      render(<ArmorDisplay character={character} editable={true} onCharacterUpdate={onUpdate} />);
      fireEvent.click(screen.getByTestId("expand-button"));
      expect(screen.getByTestId("wireless-toggle")).toBeInTheDocument();
      expect(screen.getByTestId("wireless-indicator")).toBeInTheDocument();
    });

    it("WirelessIndicator receives correct props", () => {
      const onUpdate = vi.fn();
      const armorOff = {
        ...MOCK_ARMOR_WITH_WIRELESS,
        state: { readiness: "worn" as const, wirelessEnabled: false },
      };
      const character = createSheetCharacter({ armor: [armorOff] });
      render(<ArmorDisplay character={character} editable={true} onCharacterUpdate={onUpdate} />);
      fireEvent.click(screen.getByTestId("expand-button"));
      const indicator = screen.getByTestId("wireless-indicator");
      expect(indicator).toHaveAttribute("data-enabled", "false");
      expect(indicator).toHaveAttribute("data-global-enabled", "true");
    });

    it("calls onCharacterUpdate when wireless is toggled", () => {
      const onUpdate = vi.fn();
      const character = createSheetCharacter({ armor: [MOCK_ARMOR_WITH_WIRELESS] });
      render(<ArmorDisplay character={character} editable={true} onCharacterUpdate={onUpdate} />);
      fireEvent.click(screen.getByTestId("expand-button"));
      fireEvent.click(screen.getByTestId("wireless-indicator-toggle"));
      expect(onUpdate).toHaveBeenCalledTimes(1);
      const updated = onUpdate.mock.calls[0][0];
      expect(updated.armor[0].state.wirelessEnabled).toBe(false);
    });

    it("passes globalEnabled from character wireless state", () => {
      (isGlobalWirelessEnabled as ReturnType<typeof vi.fn>).mockReturnValue(false);
      const onUpdate = vi.fn();
      const character = createSheetCharacter({ armor: [MOCK_ARMOR_WITH_WIRELESS] });
      render(<ArmorDisplay character={character} editable={true} onCharacterUpdate={onUpdate} />);
      fireEvent.click(screen.getByTestId("expand-button"));
      const indicator = screen.getByTestId("wireless-indicator");
      expect(indicator).toHaveAttribute("data-global-enabled", "false");
    });
  });

  // --- Armor total pill ---

  describe("armor total pill", () => {
    it("displays armor total pill when worn armor exists", () => {
      const character = createSheetCharacter({ armor: [MOCK_ARMOR_EQUIPPED] });
      render(<ArmorDisplay character={character} />);
      const pill = screen.getByTestId("armor-total-pill");
      expect(pill).toBeInTheDocument();
      expect(pill).toHaveTextContent("12");
    });

    it("does not display armor total pill when no worn armor", () => {
      const character = createSheetCharacter({ armor: [MOCK_ARMOR_STORED] });
      render(<ArmorDisplay character={character} />);
      expect(screen.queryByTestId("armor-total-pill")).not.toBeInTheDocument();
    });

    it("tooltip shows base armor name and rating", () => {
      const character = createSheetCharacter({ armor: [MOCK_ARMOR_EQUIPPED] });
      render(<ArmorDisplay character={character} />);
      const tooltip = screen.getByTestId("armor-total-tooltip");
      expect(tooltip).toHaveTextContent("Armor Jacket");
      expect(tooltip).toHaveTextContent("12");
    });

    it("tooltip shows accessories with individual ratings", () => {
      (calculateArmorTotal as ReturnType<typeof vi.fn>).mockReturnValue({
        totalArmor: 14,
        baseArmor: 12,
        rawAccessoryBonus: 6,
        effectiveAccessoryBonus: 4,
        excessOverStrength: 2,
        agilityPenalty: -1,
        reactionPenalty: -1,
        isEncumbered: true,
        baseArmorName: "Armor Jacket",
        accessoryNames: ["Ballistic Shield"],
      });
      const character = createSheetCharacter({
        armor: [MOCK_ARMOR_EQUIPPED, MOCK_ARMOR_ACCESSORY],
        attributes: { ...createSheetCharacter().attributes, strength: 4 },
      });
      render(<ArmorDisplay character={character} />);
      const tooltip = screen.getByTestId("armor-total-tooltip");
      expect(tooltip).toHaveTextContent("Armor Jacket");
      expect(tooltip).toHaveTextContent("Ballistic Shield");
      expect(tooltip).toHaveTextContent("14");
    });

    it("shows accessory capping note when raw > strength", () => {
      (calculateArmorTotal as ReturnType<typeof vi.fn>).mockReturnValue({
        totalArmor: 16,
        baseArmor: 12,
        rawAccessoryBonus: 8,
        effectiveAccessoryBonus: 4,
        excessOverStrength: 4,
        agilityPenalty: -2,
        reactionPenalty: -2,
        isEncumbered: true,
        baseArmorName: "Armor Jacket",
        accessoryNames: ["Helmet", "Ballistic Mask"],
      });
      const character = createSheetCharacter({
        armor: [
          MOCK_ARMOR_EQUIPPED,
          { ...MOCK_ARMOR_ACCESSORY, name: "Helmet", armorRating: 4 },
          { ...MOCK_ARMOR_ACCESSORY, name: "Ballistic Mask", armorRating: 4 },
        ],
        attributes: { ...createSheetCharacter().attributes, strength: 4 },
      });
      render(<ArmorDisplay character={character} />);
      const tooltip = screen.getByTestId("armor-total-tooltip");
      expect(tooltip).toHaveTextContent(/capped at STR 4/);
    });

    it("has correct aria-label for accessibility", () => {
      const character = createSheetCharacter({ armor: [MOCK_ARMOR_EQUIPPED] });
      render(<ArmorDisplay character={character} />);
      const pill = screen.getByTestId("armor-total-pill");
      expect(pill).toHaveAttribute("aria-label", "Armor total breakdown");
    });
  });
});
