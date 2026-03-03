/**
 * WirelessDisplay Component Tests
 *
 * Tests the wireless status card showing global toggle state,
 * catalog-aware equipment counts, active bonus summary, and toggle interaction.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { setupDisplayCardMock, LUCIDE_MOCK, createSheetCharacter } from "./test-helpers";
import type { Character, Weapon, ArmorItem, CyberwareItem, BiowareItem } from "@/lib/types";

setupDisplayCardMock();
vi.mock("lucide-react", () => LUCIDE_MOCK);

vi.mock("@/lib/rules/wireless", () => ({
  isGlobalWirelessEnabled: vi.fn(),
}));

vi.mock("@/lib/rules/inventory", () => ({
  setAllWireless: vi.fn(),
}));

vi.mock("@/lib/rules", () => ({
  useGear: vi.fn(),
}));

vi.mock("@/lib/rules/RulesetContext", () => ({
  useCyberwareCatalog: vi.fn(),
  useBiowareCatalog: vi.fn(),
}));

import { WirelessDisplay } from "../WirelessDisplay";
import { isGlobalWirelessEnabled } from "@/lib/rules/wireless";
import { setAllWireless } from "@/lib/rules/inventory";
import { useGear } from "@/lib/rules";
import { useCyberwareCatalog, useBiowareCatalog } from "@/lib/rules/RulesetContext";

const mockIsGlobalWirelessEnabled = vi.mocked(isGlobalWirelessEnabled);
const mockSetAllWireless = vi.mocked(setAllWireless);
const mockUseGear = vi.mocked(useGear);
const mockUseCyberwareCatalog = vi.mocked(useCyberwareCatalog);
const mockUseBiowareCatalog = vi.mocked(useBiowareCatalog);

// ---------------------------------------------------------------------------
// Mock catalog data
// ---------------------------------------------------------------------------

const MOCK_WEAPON_CATALOG = {
  melee: [{ id: "katana", name: "Katana", wirelessBonus: "Readying is a Free Action." }],
  pistols: [],
  smgs: [],
  rifles: [],
  shotguns: [],
  sniperRifles: [],
  throwingWeapons: [],
  grenades: [],
};

const MOCK_ARMOR_CATALOG = [
  { id: "berwick-suit", name: "Berwick Suit", wirelessBonus: "+1 Social limit." },
];

const MOCK_GEAR_CATALOG = {
  categories: [],
  weapons: MOCK_WEAPON_CATALOG,
  armor: MOCK_ARMOR_CATALOG,
  commlinks: [],
  cyberdecks: [],
  electronics: [],
  tools: [],
  survival: [],
  medical: [{ id: "medkit", name: "Medkit", wirelessBonus: "Provides +1 to First Aid." }],
  security: [],
  miscellaneous: [],
  ammunition: [],
  rfidTags: [],
  industrialChemicals: [],
};

const MOCK_CYBERWARE_CATALOG = [
  {
    id: "wired-reflexes",
    name: "Wired Reflexes",
    category: "bodyware",
    essenceCost: 2,
    cost: 39000,
    availability: 8,
    effects: [
      {
        id: "wired-reflexes-initiative",
        type: "initiative-modifier",
        triggers: ["always"],
        target: {},
        value: { perRating: 1 },
        description: "+[Rating]D6 Initiative",
        wirelessOverride: {
          bonusValue: 1,
          description: "+1 additional Initiative Die when wireless active",
        },
      },
    ],
  },
];

const MOCK_BIOWARE_CATALOG = [
  {
    id: "muscle-toner",
    name: "Muscle Toner",
    category: "basic",
    essenceCost: 0.2,
    cost: 32000,
    availability: 12,
    effects: [
      {
        id: "muscle-toner-agility",
        type: "attribute-modifier",
        triggers: ["always"],
        target: { attribute: "agility" },
        value: { perRating: 1 },
        description: "+[Rating] Agility",
        wirelessOverride: {
          bonusValue: 1,
          description: "+1 additional Agility when wireless active",
        },
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function setupMocks({ enabled = true }: { enabled?: boolean } = {}) {
  mockIsGlobalWirelessEnabled.mockReturnValue(enabled);
  mockUseGear.mockReturnValue(MOCK_GEAR_CATALOG as unknown as ReturnType<typeof useGear>);
  mockUseCyberwareCatalog.mockReturnValue(
    MOCK_CYBERWARE_CATALOG as unknown as ReturnType<typeof useCyberwareCatalog>
  );
  mockUseBiowareCatalog.mockReturnValue(
    MOCK_BIOWARE_CATALOG as unknown as ReturnType<typeof useBiowareCatalog>
  );
  mockSetAllWireless.mockImplementation((char, en) => ({
    ...char,
    wirelessBonusesEnabled: en,
  }));
}

/** Character with wireless-capable items (catalog has wirelessBonus for these). */
function createWirelessCharacter(overrides?: Partial<Character>): Character {
  return createSheetCharacter({
    weapons: [
      {
        id: "w1",
        catalogId: "katana",
        name: "Katana",
        category: "melee",
        subcategory: "blades",
        damage: "5P",
        ap: -3,
        mode: [],
        quantity: 1,
        cost: 500,
        state: { readiness: "readied", wirelessEnabled: true },
      } as Weapon,
    ],
    armor: [
      {
        id: "a1",
        catalogId: "berwick-suit",
        name: "Berwick Suit",
        armorRating: 8,
        equipped: true,
        category: "armor",
        quantity: 1,
        cost: 2600,
        state: { readiness: "worn", wirelessEnabled: true },
      } as ArmorItem,
    ],
    cyberware: [
      {
        id: "c1",
        catalogId: "wired-reflexes",
        name: "Wired Reflexes",
        category: "bodyware",
        grade: "standard",
        baseEssenceCost: 2,
        essenceCost: 2,
        cost: 39000,
        availability: 8,
        wirelessEnabled: true,
      } as CyberwareItem,
    ],
    bioware: [
      {
        catalogId: "muscle-toner",
        name: "Muscle Toner (Rating 1)",
        category: "basic",
        grade: "standard",
        baseEssenceCost: 0.2,
        essenceCost: 0.2,
        rating: 1,
        cost: 32000,
        availability: 12,
        wirelessEnabled: true,
      } as BiowareItem,
    ],
    ...overrides,
  });
}

describe("WirelessDisplay", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders card with Wireless title", () => {
    setupMocks();
    render(<WirelessDisplay character={createSheetCharacter()} />);
    expect(screen.getByText("Wireless")).toBeInTheDocument();
  });

  it('shows "Wireless Active" when enabled', () => {
    setupMocks({ enabled: true });
    render(<WirelessDisplay character={createSheetCharacter()} />);
    expect(screen.getByText("Wireless Active")).toBeInTheDocument();
  });

  it('shows "Wireless Silent" when disabled', () => {
    setupMocks({ enabled: false });
    render(<WirelessDisplay character={createSheetCharacter()} />);
    expect(screen.getByText("Wireless Silent")).toBeInTheDocument();
  });

  it("counts wireless-capable items using catalog data", () => {
    setupMocks({ enabled: true });
    const character = createWirelessCharacter();
    render(<WirelessDisplay character={character} />);
    // 1 weapon (katana) + 1 armor (berwick) + 1 cyberware (wired reflexes) + 1 bioware (muscle toner) = 4 on
    expect(screen.getByText("4 on / 0 off")).toBeInTheDocument();
  });

  it("counts disabled items separately", () => {
    setupMocks({ enabled: true });
    const character = createWirelessCharacter({
      weapons: [
        {
          id: "w1",
          catalogId: "katana",
          name: "Katana",
          category: "melee",
          subcategory: "blades",
          damage: "5P",
          ap: -3,
          mode: [],
          quantity: 1,
          cost: 500,
          state: { readiness: "readied", wirelessEnabled: false },
        } as Weapon,
      ],
    });
    render(<WirelessDisplay character={character} />);
    // Katana disabled, berwick + wired reflexes + muscle toner enabled = 3 on / 1 off
    expect(screen.getByText("3 on / 1 off")).toBeInTheDocument();
  });

  it("shows 0 on / 0 off when no items have wireless capability", () => {
    setupMocks({ enabled: true });
    // Base character has no items with catalog wirelessBonus
    const character = createSheetCharacter();
    render(<WirelessDisplay character={character} />);
    expect(screen.getByText("0 on / 0 off")).toBeInTheDocument();
  });

  it("shows toggle switch only when editable", () => {
    setupMocks();
    const character = createSheetCharacter();
    const { rerender } = render(<WirelessDisplay character={character} editable={false} />);
    expect(screen.queryByRole("switch")).not.toBeInTheDocument();

    rerender(<WirelessDisplay character={character} editable={true} />);
    expect(screen.getByRole("switch")).toBeInTheDocument();
  });

  it("calls setAllWireless and onCharacterUpdate when toggling off", () => {
    setupMocks({ enabled: true });
    const character = createWirelessCharacter();
    const onUpdate = vi.fn();
    render(<WirelessDisplay character={character} onCharacterUpdate={onUpdate} editable={true} />);

    fireEvent.click(screen.getByRole("switch"));
    expect(mockSetAllWireless).toHaveBeenCalledWith(character, false);
    expect(onUpdate).toHaveBeenCalledTimes(1);
    const updated = onUpdate.mock.calls[0][0];
    expect(updated.wirelessBonusesEnabled).toBe(false);
  });

  it("calls setAllWireless and onCharacterUpdate when toggling on", () => {
    setupMocks({ enabled: false });
    const character = createWirelessCharacter({ wirelessBonusesEnabled: false });
    const onUpdate = vi.fn();
    render(<WirelessDisplay character={character} onCharacterUpdate={onUpdate} editable={true} />);

    fireEvent.click(screen.getByRole("switch"));
    expect(mockSetAllWireless).toHaveBeenCalledWith(character, true);
    expect(onUpdate).toHaveBeenCalledTimes(1);
    const updated = onUpdate.mock.calls[0][0];
    expect(updated.wirelessBonusesEnabled).toBe(true);
  });

  it("renders bonus descriptions from catalog when wireless ON", () => {
    setupMocks({ enabled: true });
    const character = createWirelessCharacter();
    render(<WirelessDisplay character={character} />);

    expect(screen.getByText("Active Bonuses")).toBeInTheDocument();
    // Weapon bonus
    expect(screen.getByText("Weapon")).toBeInTheDocument();
    expect(screen.getByText("Katana")).toBeInTheDocument();
    expect(screen.getByText("Readying is a Free Action.")).toBeInTheDocument();
    // Armor bonus
    expect(screen.getByText("Armor")).toBeInTheDocument();
    expect(screen.getByText("Berwick Suit")).toBeInTheDocument();
    expect(screen.getByText("+1 Social limit.")).toBeInTheDocument();
    // Cyberware bonus (from effects[].wirelessOverride)
    expect(screen.getByText("Cyberware")).toBeInTheDocument();
    expect(screen.getByText("Wired Reflexes")).toBeInTheDocument();
    expect(
      screen.getByText("+1 additional Initiative Die when wireless active")
    ).toBeInTheDocument();
    // Bioware bonus (from effects[].wirelessOverride)
    expect(screen.getByText("Bioware")).toBeInTheDocument();
    expect(screen.getByText("Muscle Toner (Rating 1)")).toBeInTheDocument();
    expect(screen.getByText("+1 additional Agility when wireless active")).toBeInTheDocument();
  });

  it("excludes bonuses for items with wireless disabled", () => {
    setupMocks({ enabled: true });
    const character = createWirelessCharacter({
      weapons: [
        {
          id: "w1",
          catalogId: "katana",
          name: "Katana",
          category: "melee",
          subcategory: "blades",
          damage: "5P",
          ap: -3,
          mode: [],
          quantity: 1,
          cost: 500,
          state: { readiness: "readied", wirelessEnabled: false },
        } as Weapon,
      ],
    });
    render(<WirelessDisplay character={character} />);

    expect(screen.getByText("Active Bonuses")).toBeInTheDocument();
    // Katana should NOT appear in bonuses (wireless disabled)
    expect(screen.queryByText("Readying is a Free Action.")).not.toBeInTheDocument();
    // Berwick, Wired Reflexes, Muscle Toner should still appear
    expect(screen.getByText("+1 Social limit.")).toBeInTheDocument();
    expect(
      screen.getByText("+1 additional Initiative Die when wireless active")
    ).toBeInTheDocument();
    expect(screen.getByText("+1 additional Agility when wireless active")).toBeInTheDocument();
  });

  it('shows "No active wireless bonuses" when no items and wireless ON', () => {
    setupMocks({ enabled: true });
    render(<WirelessDisplay character={createSheetCharacter()} />);
    expect(screen.getByText("Active Bonuses")).toBeInTheDocument();
    expect(screen.getByText("No active wireless bonuses")).toBeInTheDocument();
  });

  it("hides bonus section when wireless OFF", () => {
    setupMocks({ enabled: false });
    render(<WirelessDisplay character={createWirelessCharacter()} />);
    expect(screen.queryByText("Active Bonuses")).not.toBeInTheDocument();
  });

  it("does not call onCharacterUpdate when toggle clicked without handler", () => {
    setupMocks({ enabled: true });
    render(<WirelessDisplay character={createSheetCharacter()} editable={true} />);
    // Should not throw
    fireEvent.click(screen.getByRole("switch"));
  });

  it("resolves gear wireless from catalog medical category", () => {
    setupMocks({ enabled: true });
    const character = createSheetCharacter({
      gear: [
        {
          id: "medkit",
          name: "Medkit (Rating 3)",
          category: "medical",
          quantity: 1,
          cost: 1500,
          state: { readiness: "carried", wirelessEnabled: true },
        },
      ],
    });
    render(<WirelessDisplay character={character} />);
    expect(screen.getByText("1 on / 0 off")).toBeInTheDocument();
    expect(screen.getByText("Gear")).toBeInTheDocument();
    expect(screen.getByText("Medkit (Rating 3)")).toBeInTheDocument();
    expect(screen.getByText("Provides +1 to First Aid.")).toBeInTheDocument();
  });
});
