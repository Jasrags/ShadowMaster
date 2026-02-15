/**
 * WeaponsDisplay Component Tests
 *
 * Tests the weapons display with ranged/melee expandable rows,
 * stat pills, pool calculations, and onSelect callback.
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

  // --- Stat pills (require expanding) ---

  it("renders damage value in pill", () => {
    const character = createSheetCharacter({ weapons: [MOCK_RANGED_WEAPON] });
    render(<WeaponsDisplay character={character} />);
    fireEvent.click(screen.getByTestId("expand-button"));
    expect(screen.getByTestId("damage-pill")).toHaveTextContent("DMG 8P");
  });

  it("renders AP value in pill", () => {
    const character = createSheetCharacter({ weapons: [MOCK_RANGED_WEAPON] });
    render(<WeaponsDisplay character={character} />);
    fireEvent.click(screen.getByTestId("expand-button"));
    expect(screen.getByTestId("ap-pill")).toHaveTextContent("AP -1");
  });

  it("renders mode for ranged weapons in pill", () => {
    const character = createSheetCharacter({ weapons: [MOCK_RANGED_WEAPON] });
    render(<WeaponsDisplay character={character} />);
    fireEvent.click(screen.getByTestId("expand-button"));
    expect(screen.getByTestId("mode-pill")).toHaveTextContent("MODE SA");
  });

  it("renders accuracy for ranged weapons in pill", () => {
    const character = createSheetCharacter({ weapons: [MOCK_RANGED_WEAPON] });
    render(<WeaponsDisplay character={character} />);
    fireEvent.click(screen.getByTestId("expand-button"));
    expect(screen.getByTestId("accuracy-pill")).toHaveTextContent("ACC 5");
  });

  it("renders reach for melee weapons with non-zero reach", () => {
    const meleeWithReach = { ...MOCK_MELEE_WEAPON, reach: 2 };
    const character = createSheetCharacter({ weapons: [meleeWithReach] });
    render(<WeaponsDisplay character={character} />);
    fireEvent.click(screen.getByTestId("expand-button"));
    expect(screen.getByTestId("reach-pill")).toHaveTextContent("RCH 2");
  });

  it("hides reach pill when reach is 0", () => {
    const character = createSheetCharacter({ weapons: [MOCK_MELEE_WEAPON] });
    render(<WeaponsDisplay character={character} />);
    fireEvent.click(screen.getByTestId("expand-button"));
    expect(screen.queryByTestId("reach-pill")).not.toBeInTheDocument();
  });

  it("does not render accuracy pill for melee weapons", () => {
    const character = createSheetCharacter({ weapons: [MOCK_MELEE_WEAPON] });
    render(<WeaponsDisplay character={character} />);
    fireEvent.click(screen.getByTestId("expand-button"));
    expect(screen.queryByTestId("accuracy-pill")).not.toBeInTheDocument();
  });

  it("does not render mode pill for melee weapons", () => {
    const character = createSheetCharacter({ weapons: [MOCK_MELEE_WEAPON] });
    render(<WeaponsDisplay character={character} />);
    fireEvent.click(screen.getByTestId("expand-button"));
    expect(screen.queryByTestId("mode-pill")).not.toBeInTheDocument();
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
    expect(screen.getByTestId("pool-pill")).toHaveTextContent("11");
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
    expect(screen.getByTestId("pool-pill")).toHaveTextContent("8");
  });

  it("pool pill has emerald styling", () => {
    const character = createSheetCharacter({ weapons: [MOCK_RANGED_WEAPON] });
    render(<WeaponsDisplay character={character} />);
    const poolPill = screen.getByTestId("pool-pill");
    expect(poolPill.className).toContain("emerald");
  });

  // --- onSelect behavior ---

  it("calls onSelect with pool and label when weapon row is clicked", () => {
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

    fireEvent.click(screen.getByTestId("weapon-row"));
    expect(onSelect).toHaveBeenCalled();
    expect(onSelect.mock.calls[0][0]).toBe(11); // pool = agility(6) + pistols(5)
  });

  it("expand button does not trigger onSelect", () => {
    const onSelect = vi.fn();
    const character = createSheetCharacter({ weapons: [MOCK_RANGED_WEAPON] });
    render(<WeaponsDisplay character={character} onSelect={onSelect} />);

    fireEvent.click(screen.getByTestId("expand-button"));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("clicking expanded content does not trigger onSelect", () => {
    const onSelect = vi.fn();
    const character = createSheetCharacter({ weapons: [MOCK_RANGED_WEAPON] });
    render(<WeaponsDisplay character={character} onSelect={onSelect} />);

    fireEvent.click(screen.getByTestId("expand-button"));
    fireEvent.click(screen.getByTestId("expanded-content"));
    expect(onSelect).not.toHaveBeenCalled();
  });

  // --- Subcategory ---

  it("renders subcategory text when expanded", () => {
    const character = createSheetCharacter({ weapons: [MOCK_RANGED_WEAPON] });
    render(<WeaponsDisplay character={character} />);
    fireEvent.click(screen.getByTestId("expand-button"));
    expect(screen.getByText("Heavy Pistols")).toBeInTheDocument();
  });
});
