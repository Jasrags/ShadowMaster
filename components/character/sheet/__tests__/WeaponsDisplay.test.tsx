/**
 * WeaponsDisplay Component Tests
 *
 * Tests the weapons display with ranged/melee split tables.
 * Returns null when no weapons. Tests damage, AP, mode columns,
 * dice pool calculation, and onSelect callback.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { createSheetCharacter, MOCK_RANGED_WEAPON, MOCK_MELEE_WEAPON } from "./test-helpers";

vi.mock("../DisplayCard", () => ({
  DisplayCard: ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div data-testid="display-card">
      <h2>{title}</h2>
      {children}
    </div>
  ),
}));

vi.mock("lucide-react", () => ({
  Activity: (props: Record<string, unknown>) => <span data-testid="icon-Activity" {...props} />,
  Shield: (props: Record<string, unknown>) => <span data-testid="icon-Shield" {...props} />,
  Heart: (props: Record<string, unknown>) => <span data-testid="icon-Heart" {...props} />,
  Brain: (props: Record<string, unknown>) => <span data-testid="icon-Brain" {...props} />,
  Footprints: (props: Record<string, unknown>) => <span data-testid="icon-Footprints" {...props} />,
  ShieldCheck: (props: Record<string, unknown>) => (
    <span data-testid="icon-ShieldCheck" {...props} />
  ),
  BarChart3: (props: Record<string, unknown>) => <span data-testid="icon-BarChart3" {...props} />,
  Crosshair: (props: Record<string, unknown>) => <span data-testid="icon-Crosshair" {...props} />,
  Swords: (props: Record<string, unknown>) => <span data-testid="icon-Swords" {...props} />,
  Package: (props: Record<string, unknown>) => <span data-testid="icon-Package" {...props} />,
  Pill: (props: Record<string, unknown>) => <span data-testid="icon-Pill" {...props} />,
  Sparkles: (props: Record<string, unknown>) => <span data-testid="icon-Sparkles" {...props} />,
  Braces: (props: Record<string, unknown>) => <span data-testid="icon-Braces" {...props} />,
  Cpu: (props: Record<string, unknown>) => <span data-testid="icon-Cpu" {...props} />,
  BookOpen: (props: Record<string, unknown>) => <span data-testid="icon-BookOpen" {...props} />,
  Users: (props: Record<string, unknown>) => <span data-testid="icon-Users" {...props} />,
  Fingerprint: (props: Record<string, unknown>) => (
    <span data-testid="icon-Fingerprint" {...props} />
  ),
  Zap: (props: Record<string, unknown>) => <span data-testid="icon-Zap" {...props} />,
  Car: (props: Record<string, unknown>) => <span data-testid="icon-Car" {...props} />,
  Home: (props: Record<string, unknown>) => <span data-testid="icon-Home" {...props} />,
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

  it("renders damage value", () => {
    const character = createSheetCharacter({ weapons: [MOCK_RANGED_WEAPON] });
    render(<WeaponsDisplay character={character} />);
    expect(screen.getByText("8P")).toBeInTheDocument();
  });

  it("renders AP value", () => {
    const character = createSheetCharacter({ weapons: [MOCK_RANGED_WEAPON] });
    render(<WeaponsDisplay character={character} />);
    expect(screen.getByText("-1")).toBeInTheDocument();
  });

  it("renders mode for ranged weapons", () => {
    const character = createSheetCharacter({ weapons: [MOCK_RANGED_WEAPON] });
    render(<WeaponsDisplay character={character} />);
    expect(screen.getByText("SA")).toBeInTheDocument();
  });

  it("renders accuracy for ranged weapons", () => {
    const character = createSheetCharacter({ weapons: [MOCK_RANGED_WEAPON] });
    render(<WeaponsDisplay character={character} />);
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("renders reach for melee weapons", () => {
    // A melee weapon with reach 2
    const meleeWithReach = { ...MOCK_MELEE_WEAPON, reach: 2 };
    const character = createSheetCharacter({ weapons: [meleeWithReach] });
    render(<WeaponsDisplay character={character} />);
    expect(screen.getByText("2")).toBeInTheDocument();
  });

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
    expect(screen.getByText("11")).toBeInTheDocument();
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
    expect(screen.getByText("8")).toBeInTheDocument();
  });

  it("calls onSelect with pool and label when weapon is clicked", () => {
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

    fireEvent.click(screen.getByText("Ares Predator V"));
    expect(onSelect).toHaveBeenCalled();
    expect(onSelect.mock.calls[0][0]).toBe(11); // pool = agility(6) + pistols(5)
  });

  it("renders subcategory text", () => {
    const character = createSheetCharacter({ weapons: [MOCK_RANGED_WEAPON] });
    render(<WeaponsDisplay character={character} />);
    expect(screen.getByText("Heavy Pistols")).toBeInTheDocument();
  });
});
