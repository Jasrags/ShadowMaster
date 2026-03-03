/**
 * GearLocationView Tests
 *
 * Tests tier grouping, stash sub-groups, empty sections hidden, container nesting.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LUCIDE_MOCK, createSheetCharacter } from "./test-helpers";
import type { Character } from "@/lib/types";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

vi.mock("lucide-react", () => LUCIDE_MOCK);

const mockIsContainer = vi.fn();
const mockGetContainerContents = vi.fn();
const mockGetContainerContentWeight = vi.fn();

vi.mock("@/lib/rules/inventory", () => ({
  isContainer: (...args: unknown[]) => mockIsContainer(...args),
  getContainerContents: (...args: unknown[]) => mockGetContainerContents(...args),
  getContainerContentWeight: (...args: unknown[]) => mockGetContainerContentWeight(...args),
}));

vi.mock("../readiness-helpers", () => ({
  getReadinessLabel: (r: string) => r.charAt(0).toUpperCase() + r.slice(1),
  getReadinessColor: () => "text-zinc-400 border-zinc-300",
}));

vi.mock("../ContainerContentsDisplay", () => ({
  ContainerContentsDisplay: ({ containerId }: { containerId: string }) => (
    <div data-testid={`container-contents-${containerId}`}>Container Contents</div>
  ),
}));

import { GearLocationView } from "../GearLocationView";

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("GearLocationView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsContainer.mockReturnValue(false);
    mockGetContainerContents.mockReturnValue([]);
    mockGetContainerContentWeight.mockReturnValue(0);
  });

  it("groups readied weapon into Active tier", () => {
    const char = createSheetCharacter({
      weapons: [
        {
          name: "Ares Predator V",
          category: "Pistols",
          subcategory: "Heavy Pistols",
          damage: "8P",
          ap: -1,
          mode: ["SA"],
          accuracy: 5,
          cost: 725,
          quantity: 1,

          state: { readiness: "readied", wirelessEnabled: true },
        },
      ],
      armor: [],
      gear: [],
    } as Partial<Character>);

    render(<GearLocationView character={char} />);

    const activeTier = screen.getByTestId("tier-active");
    expect(activeTier).toHaveTextContent("Active");
    expect(activeTier).toHaveTextContent("Ares Predator V");
  });

  it("groups holstered/worn/pocketed items into On Body tier", () => {
    const char = createSheetCharacter({
      weapons: [
        {
          name: "Hold-Out Pistol",
          category: "Pistols",
          subcategory: "Hold-Outs",
          damage: "6P",
          ap: 0,
          mode: ["SA"],
          accuracy: 4,
          cost: 200,
          quantity: 1,

          state: { readiness: "holstered", wirelessEnabled: false },
        },
      ],
      armor: [
        {
          name: "Armor Jacket",
          category: "armor",
          subcategory: "armor",
          armorRating: 12,
          equipped: true,
          cost: 1000,
          quantity: 1,

          state: { readiness: "worn", wirelessEnabled: true },
        },
      ],
      gear: [],
    } as Partial<Character>);

    render(<GearLocationView character={char} />);

    const onBodyTier = screen.getByTestId("tier-on-body");
    expect(onBodyTier).toHaveTextContent("On Body");
    expect(onBodyTier).toHaveTextContent("Hold-Out Pistol");
    expect(onBodyTier).toHaveTextContent("Armor Jacket");
  });

  it("groups carried items into Carried tier", () => {
    const char = createSheetCharacter({
      weapons: [],
      armor: [],
      gear: [
        {
          name: "Medkit",
          category: "medical",
          quantity: 1,
          cost: 500,
          state: { readiness: "carried", wirelessEnabled: false },
        },
      ],
    } as Partial<Character>);

    render(<GearLocationView character={char} />);

    const carriedTier = screen.getByTestId("tier-carried");
    expect(carriedTier).toHaveTextContent("Carried");
    expect(carriedTier).toHaveTextContent("Medkit");
  });

  it("groups stashed items into Stash tier with sub-groups", () => {
    const char = createSheetCharacter({
      weapons: [],
      armor: [],
      gear: [
        {
          name: "Spare Ammo",
          category: "ammunition",
          quantity: 5,
          cost: 100,
          state: {
            readiness: "stashed",
            wirelessEnabled: false,
            stashLocation: { type: "home" },
          },
        },
        {
          name: "Climbing Gear",
          category: "survival",
          quantity: 1,
          cost: 300,
          state: {
            readiness: "stashed",
            wirelessEnabled: false,
            stashLocation: { type: "vehicle" },
          },
        },
      ],
    } as Partial<Character>);

    render(<GearLocationView character={char} />);

    // Stash tier is collapsed by default — expand it
    fireEvent.click(screen.getByTestId("tier-toggle-stash"));

    const stashTier = screen.getByTestId("tier-stash");
    expect(stashTier).toHaveTextContent("Stash");
    expect(stashTier).toHaveTextContent("Home");
    expect(stashTier).toHaveTextContent("Vehicle");
    expect(stashTier).toHaveTextContent("Spare Ammo");
    expect(stashTier).toHaveTextContent("Climbing Gear");
  });

  it("hides empty tiers", () => {
    const char = createSheetCharacter({
      weapons: [],
      armor: [],
      gear: [
        {
          name: "Medkit",
          category: "medical",
          quantity: 1,
          cost: 500,
          state: { readiness: "carried", wirelessEnabled: false },
        },
      ],
    } as Partial<Character>);

    render(<GearLocationView character={char} />);

    expect(screen.queryByTestId("tier-active")).not.toBeInTheDocument();
    expect(screen.queryByTestId("tier-on-body")).not.toBeInTheDocument();
    expect(screen.getByTestId("tier-carried")).toBeInTheDocument();
    expect(screen.queryByTestId("tier-stash")).not.toBeInTheDocument();
  });

  it("excludes contained items from tier grouping", () => {
    const char = createSheetCharacter({
      weapons: [],
      armor: [],
      gear: [
        {
          name: "Backpack",
          id: "container-1",
          category: "miscellaneous",
          quantity: 1,
          cost: 50,
          state: { readiness: "carried", wirelessEnabled: false },
          containerProperties: { weightCapacity: 10, slotCapacity: 10 },
        },
        {
          name: "Medkit",
          category: "medical",
          quantity: 1,
          cost: 500,
          state: { readiness: "carried", wirelessEnabled: false, containedIn: "container-1" },
        },
      ],
    } as Partial<Character>);

    mockIsContainer.mockImplementation(
      (item: { containerProperties?: unknown }) => !!item.containerProperties
    );

    render(<GearLocationView character={char} />);

    const items = screen.getAllByTestId("location-item-row");
    // Should only show Backpack at top level, not Medkit (it's inside the container)
    expect(items).toHaveLength(1);
    expect(items[0]).toHaveTextContent("Backpack");
  });

  it("renders container contents for container items", () => {
    const char = createSheetCharacter({
      weapons: [],
      armor: [],
      gear: [
        {
          name: "Backpack",
          id: "container-1",
          category: "miscellaneous",
          quantity: 1,
          cost: 50,
          state: { readiness: "carried", wirelessEnabled: false },
          containerProperties: { weightCapacity: 10, slotCapacity: 10 },
        },
      ],
    } as Partial<Character>);

    mockIsContainer.mockReturnValue(true);

    render(<GearLocationView character={char} />);

    expect(screen.getByTestId("container-contents-container-1")).toBeInTheDocument();
  });

  it("collapses and expands tiers on toggle click", () => {
    const char = createSheetCharacter({
      weapons: [],
      armor: [],
      gear: [
        {
          name: "Medkit",
          category: "medical",
          quantity: 1,
          cost: 500,
          state: { readiness: "carried", wirelessEnabled: false },
        },
      ],
    } as Partial<Character>);

    render(<GearLocationView character={char} />);

    // Carried is expanded by default
    expect(screen.getByText("Medkit")).toBeInTheDocument();

    // Collapse
    fireEvent.click(screen.getByTestId("tier-toggle-carried"));
    expect(screen.queryByText("Medkit")).not.toBeInTheDocument();

    // Expand again
    fireEvent.click(screen.getByTestId("tier-toggle-carried"));
    expect(screen.getByText("Medkit")).toBeInTheDocument();
  });

  it("uses default readiness when state is missing", () => {
    const char = createSheetCharacter({
      weapons: [
        {
          name: "Katana",
          category: "Blades",
          subcategory: "Blades",
          damage: "8P",
          ap: -3,
          mode: [],
          reach: 1,
          cost: 1000,
          quantity: 1,
          // No state — weapon defaults to holstered → on-body tier
        },
      ],
      armor: [],
      gear: [],
    } as Partial<Character>);

    render(<GearLocationView character={char} />);

    // Weapon with no state should default to holstered → on-body tier
    const onBodyTier = screen.getByTestId("tier-on-body");
    expect(onBodyTier).toHaveTextContent("Katana");
  });

  it("shows item count in tier header", () => {
    const char = createSheetCharacter({
      weapons: [],
      armor: [],
      gear: [
        {
          name: "Item A",
          category: "medical",
          quantity: 1,
          cost: 100,
          state: { readiness: "carried", wirelessEnabled: false },
        },
        {
          name: "Item B",
          category: "tools",
          quantity: 1,
          cost: 200,
          state: { readiness: "carried", wirelessEnabled: false },
        },
      ],
    } as Partial<Character>);

    render(<GearLocationView character={char} />);

    const carriedTier = screen.getByTestId("tier-carried");
    expect(carriedTier).toHaveTextContent("(2)");
  });
});
