/**
 * WeaponsDisplay Component Tests
 *
 * Tests the weapons display with ranged/melee expandable rows,
 * stat pills, pool calculations, catalog integration, and onSelect callback.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import {
  setupDisplayCardMock,
  LUCIDE_MOCK,
  createSheetCharacter,
  MOCK_RANGED_WEAPON,
  MOCK_MELEE_WEAPON,
} from "./test-helpers";

setupDisplayCardMock();
vi.mock("lucide-react", () => LUCIDE_MOCK);

// ---------------------------------------------------------------------------
// Catalog mock
// ---------------------------------------------------------------------------

const MOCK_GEAR_CATALOG = {
  categories: [],
  weapons: {
    melee: [
      {
        id: "combat-knife",
        name: "Combat Knife",
        category: "blades",
        subcategory: "blades",
        damage: "6P",
        ap: -3,
        reach: 0,
        cost: 300,
        availability: 4,
        legality: "restricted",
        weight: 0.5,
        description: "A sturdy combat blade for close encounters.",
      },
      {
        id: "extendable-baton",
        name: "Extendable Baton",
        category: "clubs",
        subcategory: "clubs",
        damage: "5P",
        ap: 0,
        reach: 1,
        cost: 100,
        availability: 4,
        description: "A collapsible baton with wireless readout.",
        wirelessBonus: "The baton displays its current extend/retract status via AR.",
      },
    ],
    pistols: [
      {
        id: "ares-predator-v",
        name: "Ares Predator V",
        category: "pistols",
        subcategory: "heavy-pistols",
        damage: "8P",
        ap: -1,
        mode: ["SA"],
        accuracy: 5,
        cost: 725,
        availability: 5,
        legality: "restricted",
        weight: 1.5,
        description: "The quintessential shadowrunner sidearm.",
        wirelessBonus: "Smartgun system provides +1 accuracy via wireless.",
      },
    ],
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

import { WeaponsDisplay } from "../WeaponsDisplay";

describe("WeaponsDisplay", () => {
  it("returns null when no weapons", () => {
    const character = createSheetCharacter({ weapons: [] });
    const { container } = render(<WeaponsDisplay character={character} />);
    expect(container.innerHTML).toBe("");
  });

  it("returns null when weapons is undefined", () => {
    const character = createSheetCharacter({ weapons: undefined });
    const { container } = render(<WeaponsDisplay character={character} />);
    expect(container.innerHTML).toBe("");
  });

  it("renders ranged weapons section", () => {
    const character = createSheetCharacter({ weapons: [MOCK_RANGED_WEAPON] });
    render(<WeaponsDisplay character={character} />);
    expect(screen.getByText("Ranged Weapons")).toBeInTheDocument();
    expect(screen.getByText("Ares Predator V")).toBeInTheDocument();
  });

  it("renders melee weapons section", () => {
    const character = createSheetCharacter({ weapons: [MOCK_MELEE_WEAPON] });
    render(<WeaponsDisplay character={character} />);
    expect(screen.getByText("Melee Weapons")).toBeInTheDocument();
    expect(screen.getByText("Combat Knife")).toBeInTheDocument();
  });

  it("renders both sections when mixed weapons", () => {
    const character = createSheetCharacter({
      weapons: [MOCK_RANGED_WEAPON, MOCK_MELEE_WEAPON],
    });
    render(<WeaponsDisplay character={character} />);
    expect(screen.getByText("Ranged Weapons")).toBeInTheDocument();
    expect(screen.getByText("Melee Weapons")).toBeInTheDocument();
  });

  // --- Title tooltip ---

  it("renders title tooltip on weapon name", () => {
    const character = createSheetCharacter({ weapons: [MOCK_RANGED_WEAPON] });
    render(<WeaponsDisplay character={character} />);
    expect(screen.getByTitle("Ares Predator V")).toBeInTheDocument();
  });

  // --- Expand/collapse behavior ---

  it("hides expanded content by default", () => {
    const character = createSheetCharacter({ weapons: [MOCK_RANGED_WEAPON] });
    render(<WeaponsDisplay character={character} />);
    expect(screen.queryByTestId("expanded-content")).not.toBeInTheDocument();
  });

  it("expand button toggles expanded content", () => {
    const character = createSheetCharacter({ weapons: [MOCK_RANGED_WEAPON] });
    render(<WeaponsDisplay character={character} />);

    fireEvent.click(screen.getByTestId("expand-button"));
    expect(screen.getByTestId("expanded-content")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("expand-button"));
    expect(screen.queryByTestId("expanded-content")).not.toBeInTheDocument();
  });

  it("chevron icon switches between ChevronRight and ChevronDown", () => {
    const character = createSheetCharacter({ weapons: [MOCK_RANGED_WEAPON] });
    render(<WeaponsDisplay character={character} />);

    const expandBtn = screen.getByTestId("expand-button");
    expect(within(expandBtn).getByTestId("icon-ChevronRight")).toBeInTheDocument();

    fireEvent.click(expandBtn);
    expect(within(expandBtn).getByTestId("icon-ChevronDown")).toBeInTheDocument();
  });

  // --- Catalog description ---

  it("renders catalog description when expanded and catalogId matches", () => {
    const rangedWithCatalogId = { ...MOCK_RANGED_WEAPON, catalogId: "ares-predator-v" };
    const character = createSheetCharacter({ weapons: [rangedWithCatalogId] });
    render(<WeaponsDisplay character={character} />);
    fireEvent.click(screen.getByTestId("expand-button"));
    expect(screen.getByTestId("weapon-description")).toHaveTextContent(
      "The quintessential shadowrunner sidearm."
    );
  });

  it("hides description when no catalogId match", () => {
    const character = createSheetCharacter({ weapons: [MOCK_RANGED_WEAPON] });
    render(<WeaponsDisplay character={character} />);
    fireEvent.click(screen.getByTestId("expand-button"));
    expect(screen.queryByTestId("weapon-description")).not.toBeInTheDocument();
  });

  // --- Wireless indicator ---

  it("shows wireless icon for weapons with wirelessBonus in catalog", () => {
    const rangedWithCatalogId = { ...MOCK_RANGED_WEAPON, catalogId: "ares-predator-v" };
    const character = createSheetCharacter({ weapons: [rangedWithCatalogId] });
    render(<WeaponsDisplay character={character} />);
    expect(screen.getByTestId("wireless-icon")).toBeInTheDocument();
  });

  it("shows wireless icon for weapons with wirelessBonus on character data", () => {
    const rangedWithWireless = {
      ...MOCK_RANGED_WEAPON,
      wirelessBonus: "Provides +1 accuracy.",
    };
    const character = createSheetCharacter({ weapons: [rangedWithWireless] });
    render(<WeaponsDisplay character={character} />);
    expect(screen.getByTestId("wireless-icon")).toBeInTheDocument();
  });

  it("hides wireless icon for weapons without wirelessBonus", () => {
    const character = createSheetCharacter({ weapons: [MOCK_MELEE_WEAPON] });
    render(<WeaponsDisplay character={character} />);
    expect(screen.queryByTestId("wireless-icon")).not.toBeInTheDocument();
  });

  // --- Expanded stats (require expanding) ---

  it("renders damage stat when expanded", () => {
    const character = createSheetCharacter({ weapons: [MOCK_RANGED_WEAPON] });
    render(<WeaponsDisplay character={character} />);
    fireEvent.click(screen.getByTestId("expand-button"));
    expect(screen.getByTestId("stat-damage")).toHaveTextContent("Damage 8P");
  });

  it("renders AP stat when expanded", () => {
    const character = createSheetCharacter({ weapons: [MOCK_RANGED_WEAPON] });
    render(<WeaponsDisplay character={character} />);
    fireEvent.click(screen.getByTestId("expand-button"));
    expect(screen.getByTestId("stat-ap")).toHaveTextContent("AP -1");
  });

  it("renders mode for ranged weapons when expanded", () => {
    const character = createSheetCharacter({ weapons: [MOCK_RANGED_WEAPON] });
    render(<WeaponsDisplay character={character} />);
    fireEvent.click(screen.getByTestId("expand-button"));
    expect(screen.getByTestId("stat-mode")).toHaveTextContent("Mode SA");
  });

  it("renders accuracy for ranged weapons when expanded", () => {
    const character = createSheetCharacter({ weapons: [MOCK_RANGED_WEAPON] });
    render(<WeaponsDisplay character={character} />);
    fireEvent.click(screen.getByTestId("expand-button"));
    expect(screen.getByTestId("stat-accuracy")).toHaveTextContent("Accuracy 5");
  });

  it("renders reach for melee weapons with non-zero reach", () => {
    const meleeWithReach = { ...MOCK_MELEE_WEAPON, reach: 2 };
    const character = createSheetCharacter({ weapons: [meleeWithReach] });
    render(<WeaponsDisplay character={character} />);
    fireEvent.click(screen.getByTestId("expand-button"));
    expect(screen.getByTestId("stat-reach")).toHaveTextContent("Reach 2");
  });

  it("hides reach stat when reach is 0", () => {
    const character = createSheetCharacter({ weapons: [MOCK_MELEE_WEAPON] });
    render(<WeaponsDisplay character={character} />);
    fireEvent.click(screen.getByTestId("expand-button"));
    expect(screen.queryByTestId("stat-reach")).not.toBeInTheDocument();
  });

  it("does not render accuracy stat for melee weapons", () => {
    const character = createSheetCharacter({ weapons: [MOCK_MELEE_WEAPON] });
    render(<WeaponsDisplay character={character} />);
    fireEvent.click(screen.getByTestId("expand-button"));
    expect(screen.queryByTestId("stat-accuracy")).not.toBeInTheDocument();
  });

  it("does not render mode stat for melee weapons", () => {
    const character = createSheetCharacter({ weapons: [MOCK_MELEE_WEAPON] });
    render(<WeaponsDisplay character={character} />);
    fireEvent.click(screen.getByTestId("expand-button"));
    expect(screen.queryByTestId("stat-mode")).not.toBeInTheDocument();
  });

  // --- Avail + Cost row ---

  it("renders availability with legality letter when expanded", () => {
    const rangedWithAvail = {
      ...MOCK_RANGED_WEAPON,
      availability: 5,
      legality: "restricted" as const,
    };
    const character = createSheetCharacter({ weapons: [rangedWithAvail] });
    render(<WeaponsDisplay character={character} />);
    fireEvent.click(screen.getByTestId("expand-button"));
    expect(screen.getByTestId("stat-availability")).toHaveTextContent("Avail 5R");
  });

  it("renders cost in avail+cost row when expanded", () => {
    const character = createSheetCharacter({ weapons: [MOCK_RANGED_WEAPON] });
    render(<WeaponsDisplay character={character} />);
    fireEvent.click(screen.getByTestId("expand-button"));
    expect(screen.getByTestId("stat-cost")).toHaveTextContent("Cost ¥725");
  });

  it("falls back to catalog availability and legality when not on character weapon", () => {
    const weaponNoCatalogStats = {
      ...MOCK_RANGED_WEAPON,
      availability: undefined,
      legality: undefined,
      catalogId: "ares-predator-v",
    };
    const character = createSheetCharacter({ weapons: [weaponNoCatalogStats] });
    render(<WeaponsDisplay character={character} />);
    fireEvent.click(screen.getByTestId("expand-button"));
    expect(screen.getByTestId("stat-availability")).toHaveTextContent("Avail 5R");
  });

  it("renders weight from catalog when expanded", () => {
    const weaponWithCatalog = { ...MOCK_RANGED_WEAPON, catalogId: "ares-predator-v" };
    const character = createSheetCharacter({ weapons: [weaponWithCatalog] });
    render(<WeaponsDisplay character={character} />);
    fireEvent.click(screen.getByTestId("expand-button"));
    expect(screen.getByTestId("stat-weight")).toHaveTextContent("Weight 1.5kg");
  });

  it("prefers character weight over catalog weight", () => {
    const weaponWithWeight = { ...MOCK_RANGED_WEAPON, catalogId: "ares-predator-v", weight: 2 };
    const character = createSheetCharacter({ weapons: [weaponWithWeight] });
    render(<WeaponsDisplay character={character} />);
    fireEvent.click(screen.getByTestId("expand-button"));
    expect(screen.getByTestId("stat-weight")).toHaveTextContent("Weight 2kg");
  });

  it("hides weight when not available from either source", () => {
    const character = createSheetCharacter({ weapons: [MOCK_RANGED_WEAPON] });
    render(<WeaponsDisplay character={character} />);
    fireEvent.click(screen.getByTestId("expand-button"));
    expect(screen.queryByTestId("stat-weight")).not.toBeInTheDocument();
  });

  it("renders weapon type after name on collapsed row", () => {
    const character = createSheetCharacter({ weapons: [MOCK_RANGED_WEAPON] });
    render(<WeaponsDisplay character={character} />);
    const weaponType = screen.getByTestId("weapon-type");
    expect(weaponType).toHaveTextContent("(Heavy Pistols)");
  });

  // --- Notes ---

  it("renders notes in expanded view when present", () => {
    const rangedWithNotes = {
      ...MOCK_RANGED_WEAPON,
      notes: "Primary sidearm, always loaded.",
    };
    const character = createSheetCharacter({ weapons: [rangedWithNotes] });
    render(<WeaponsDisplay character={character} />);
    fireEvent.click(screen.getByTestId("expand-button"));
    expect(screen.getByTestId("notes")).toHaveTextContent("Primary sidearm, always loaded.");
  });

  it("hides notes when not present", () => {
    const character = createSheetCharacter({ weapons: [MOCK_RANGED_WEAPON] });
    render(<WeaponsDisplay character={character} />);
    fireEvent.click(screen.getByTestId("expand-button"));
    expect(screen.queryByTestId("notes")).not.toBeInTheDocument();
  });

  // --- Pool calculation ---

  it("calculates dice pool for ranged weapon (agility based)", () => {
    const character = createSheetCharacter({
      attributes: {
        body: 5,
        agility: 6,
        reaction: 5,
        strength: 4,
        willpower: 3,
        logic: 3,
        intuition: 4,
        charisma: 2,
      },
      skills: { pistols: 5 },
      weapons: [MOCK_RANGED_WEAPON],
    });
    render(<WeaponsDisplay character={character} />);
    // Pool = agility(6) + pistols(5) = 11
    expect(screen.getByTestId("dice-pool-pill")).toHaveTextContent("11");
  });

  it("calculates dice pool for melee weapon (strength based)", () => {
    const character = createSheetCharacter({
      attributes: {
        body: 5,
        agility: 6,
        reaction: 5,
        strength: 4,
        willpower: 3,
        logic: 3,
        intuition: 4,
        charisma: 2,
      },
      skills: { blades: 4 },
      weapons: [MOCK_MELEE_WEAPON],
    });
    render(<WeaponsDisplay character={character} />);
    // Pool = strength(4) + blades(4) = 8
    expect(screen.getByTestId("dice-pool-pill")).toHaveTextContent("8");
  });

  it("pool pill has emerald styling", () => {
    const character = createSheetCharacter({ weapons: [MOCK_RANGED_WEAPON] });
    render(<WeaponsDisplay character={character} />);
    const poolPill = screen.getByTestId("dice-pool-pill");
    expect(poolPill.className).toContain("emerald");
  });

  // --- onSelect behavior ---

  it("calls onSelect with pool and label when dice pool pill is clicked", () => {
    const onSelect = vi.fn();
    const character = createSheetCharacter({
      attributes: {
        body: 5,
        agility: 6,
        reaction: 5,
        strength: 4,
        willpower: 3,
        logic: 3,
        intuition: 4,
        charisma: 2,
      },
      skills: { pistols: 5 },
      weapons: [MOCK_RANGED_WEAPON],
    });
    render(<WeaponsDisplay character={character} onSelect={onSelect} />);

    fireEvent.click(screen.getByTestId("dice-pool-pill"));
    expect(onSelect).toHaveBeenCalled();
    expect(onSelect.mock.calls[0][0]).toBe(11); // pool = agility(6) + pistols(5)
  });

  it("clicking row expands instead of triggering onSelect", () => {
    const onSelect = vi.fn();
    const character = createSheetCharacter({ weapons: [MOCK_RANGED_WEAPON] });
    render(<WeaponsDisplay character={character} onSelect={onSelect} />);

    fireEvent.click(screen.getByText("Ares Predator V"));
    expect(onSelect).not.toHaveBeenCalled();
    expect(screen.getByTestId("expanded-content")).toBeInTheDocument();
  });

  it("clicking expanded content does not trigger onSelect", () => {
    const onSelect = vi.fn();
    const character = createSheetCharacter({ weapons: [MOCK_RANGED_WEAPON] });
    render(<WeaponsDisplay character={character} onSelect={onSelect} />);

    fireEvent.click(screen.getByTestId("expand-button"));
    fireEvent.click(screen.getByTestId("expanded-content"));
    expect(onSelect).not.toHaveBeenCalled();
  });

  // --- Recoil compensation ---

  it("renders RC stat for ranged weapons with recoil", () => {
    const rangedWithRC = { ...MOCK_RANGED_WEAPON, recoil: 2 };
    const character = createSheetCharacter({ weapons: [rangedWithRC] });
    render(<WeaponsDisplay character={character} />);
    fireEvent.click(screen.getByTestId("expand-button"));
    expect(screen.getByTestId("stat-rc")).toHaveTextContent("RC 2");
  });

  it("hides RC stat when recoil is 0 or absent", () => {
    const character = createSheetCharacter({ weapons: [MOCK_RANGED_WEAPON] });
    render(<WeaponsDisplay character={character} />);
    fireEvent.click(screen.getByTestId("expand-button"));
    expect(screen.queryByTestId("stat-rc")).not.toBeInTheDocument();
  });

  // --- Ammo state ---

  it("renders ammo section when weapon has ammoState", () => {
    const rangedWithAmmo = {
      ...MOCK_RANGED_WEAPON,
      ammoState: { loadedAmmoTypeId: "regular", currentRounds: 10, magazineCapacity: 15 },
    };
    const character = createSheetCharacter({ weapons: [rangedWithAmmo] });
    render(<WeaponsDisplay character={character} />);
    fireEvent.click(screen.getByTestId("expand-button"));
    const ammoSection = screen.getByTestId("ammo-section");
    expect(ammoSection).toHaveTextContent("10/15");
    expect(ammoSection).toHaveTextContent("regular");
  });

  it("hides ammo section when no ammoState", () => {
    const character = createSheetCharacter({ weapons: [MOCK_RANGED_WEAPON] });
    render(<WeaponsDisplay character={character} />);
    fireEvent.click(screen.getByTestId("expand-button"));
    expect(screen.queryByTestId("ammo-section")).not.toBeInTheDocument();
  });

  // --- Modifications ---

  it("renders modifications section when weapon has mods", () => {
    const rangedWithMods = {
      ...MOCK_RANGED_WEAPON,
      modifications: [
        {
          catalogId: "smartgun-internal",
          name: "Smartgun System (Internal)",
          mount: "internal" as const,
          capacityUsed: 2,
          cost: 200,
          availability: 4,
        },
        {
          catalogId: "silencer",
          name: "Silencer",
          mount: "barrel" as const,
          capacityUsed: 1,
          cost: 500,
          availability: 8,
          legality: "restricted" as const,
        },
      ],
    };
    const character = createSheetCharacter({ weapons: [rangedWithMods] });
    render(<WeaponsDisplay character={character} />);
    fireEvent.click(screen.getByTestId("expand-button"));

    expect(screen.getByTestId("modifications-section")).toBeInTheDocument();
    const modRows = screen.getAllByTestId("mod-row");
    expect(modRows).toHaveLength(2);
    expect(modRows[0]).toHaveTextContent("Smartgun System (Internal)");
    expect(modRows[0]).toHaveTextContent("internal");
    expect(modRows[1]).toHaveTextContent("Silencer");
    expect(modRows[1]).toHaveTextContent("barrel");
  });

  it("hides modifications section when no mods", () => {
    const character = createSheetCharacter({ weapons: [MOCK_RANGED_WEAPON] });
    render(<WeaponsDisplay character={character} />);
    fireEvent.click(screen.getByTestId("expand-button"));
    expect(screen.queryByTestId("modifications-section")).not.toBeInTheDocument();
  });
});
