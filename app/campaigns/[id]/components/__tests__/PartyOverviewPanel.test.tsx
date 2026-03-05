import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Character } from "@/lib/types";
import PartyOverviewPanel from "../PartyOverviewPanel";
import {
  getHighestArmor,
  getDefensePool,
  getSoakPool,
  getInitiativeDisplay,
  getEdge,
  getCondition,
  getStatusBadge,
} from "../PartyCharacterCard";

// Mock lucide-react with explicit named exports
vi.mock("lucide-react", () => ({
  User: (props: Record<string, unknown>) => <span data-testid="icon-user" {...props} />,
  Users: (props: Record<string, unknown>) => <span data-testid="icon-users" {...props} />,
  Shield: (props: Record<string, unknown>) => <span data-testid="icon-shield" {...props} />,
  Swords: (props: Record<string, unknown>) => <span data-testid="icon-swords" {...props} />,
  Zap: (props: Record<string, unknown>) => <span data-testid="icon-zap" {...props} />,
  Gem: (props: Record<string, unknown>) => <span data-testid="icon-gem" {...props} />,
  AlertTriangle: (props: Record<string, unknown>) => <span data-testid="icon-alert" {...props} />,
  Heart: (props: Record<string, unknown>) => <span data-testid="icon-heart" {...props} />,
  Brain: (props: Record<string, unknown>) => <span data-testid="icon-brain" {...props} />,
  Skull: (props: Record<string, unknown>) => <span data-testid="icon-skull" {...props} />,
  Moon: (props: Record<string, unknown>) => <span data-testid="icon-moon" {...props} />,
}));

function makeCharacter(overrides: Partial<Character> = {}): Character {
  return {
    id: "char-1",
    ownerId: "owner-1",
    editionId: "ed-1",
    editionCode: "sr5",
    creationMethodId: "priority",
    rulesetSnapshotId: "snap-1",
    attachedBookIds: [],
    name: "Test Runner",
    metatype: "Human",
    status: "active",
    magicalPath: "mundane",
    attributes: {
      body: 4,
      agility: 5,
      reaction: 3,
      strength: 3,
      charisma: 3,
      intuition: 4,
      logic: 3,
      willpower: 3,
    },
    specialAttributes: { edge: 3, essence: 6 },
    skills: {},
    positiveQualities: [],
    negativeQualities: [],
    nuyen: 0,
    startingNuyen: 0,
    gear: [],
    contacts: [],
    derivedStats: {},
    condition: { physicalDamage: 0, stunDamage: 0 },
    karmaTotal: 0,
    karmaCurrent: 0,
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
    ...overrides,
  } as Character;
}

// =============================================================================
// UNIT: Stat computation helpers
// =============================================================================

describe("getHighestArmor", () => {
  it("returns 0 when no armor", () => {
    expect(getHighestArmor(makeCharacter())).toBe(0);
  });

  it("returns 0 when armor array is empty", () => {
    expect(getHighestArmor(makeCharacter({ armor: [] }))).toBe(0);
  });

  it("returns highest non-accessory rating", () => {
    const char = makeCharacter({
      armor: [
        { id: "a1", name: "Jacket", armorRating: 12, quantity: 1 },
        { id: "a2", name: "Vest", armorRating: 9, quantity: 1 },
      ] as Character["armor"],
    });
    expect(getHighestArmor(char)).toBe(12);
  });

  it("excludes accessories", () => {
    const char = makeCharacter({
      armor: [
        { id: "a1", name: "Jacket", armorRating: 12, quantity: 1 },
        { id: "a2", name: "Helmet", armorRating: 2, armorModifier: true, quantity: 1 },
      ] as Character["armor"],
    });
    expect(getHighestArmor(char)).toBe(12);
  });

  it("returns 0 when all armor is accessories", () => {
    const char = makeCharacter({
      armor: [
        { id: "a1", name: "Helmet", armorRating: 2, armorModifier: true, quantity: 1 },
      ] as Character["armor"],
    });
    expect(getHighestArmor(char)).toBe(0);
  });
});

describe("getDefensePool", () => {
  it("returns REA + INT", () => {
    const char = makeCharacter({ attributes: { reaction: 4, intuition: 5 } });
    expect(getDefensePool(char)).toBe(9);
  });
});

describe("getSoakPool", () => {
  it("returns BOD + highest armor", () => {
    const char = makeCharacter({
      attributes: { body: 5, reaction: 3, intuition: 3 },
      armor: [{ id: "a1", name: "Jacket", armorRating: 12, quantity: 1 }] as Character["armor"],
    });
    expect(getSoakPool(char)).toBe(17);
  });

  it("returns BOD alone with no armor", () => {
    const char = makeCharacter({ attributes: { body: 5, reaction: 3, intuition: 3 } });
    expect(getSoakPool(char)).toBe(5);
  });
});

describe("getInitiativeDisplay", () => {
  it("uses derivedStats when available", () => {
    const char = makeCharacter({ derivedStats: { initiative: 10, initiativeDice: 2 } });
    expect(getInitiativeDisplay(char)).toBe("10+2d6");
  });

  it("falls back to REA+INT with 1d6", () => {
    const char = makeCharacter({
      attributes: { reaction: 3, intuition: 4 },
      derivedStats: {},
    });
    expect(getInitiativeDisplay(char)).toBe("7+1d6");
  });
});

describe("getEdge", () => {
  it("uses edgeCurrent when defined", () => {
    const char = makeCharacter({
      specialAttributes: { edge: 5, essence: 6 },
      condition: { physicalDamage: 0, stunDamage: 0, edgeCurrent: 3 },
    });
    expect(getEdge(char)).toEqual({ current: 3, max: 5 });
  });

  it("defaults to max edge when edgeCurrent undefined", () => {
    const char = makeCharacter({
      specialAttributes: { edge: 4, essence: 6 },
      condition: { physicalDamage: 0, stunDamage: 0 },
    });
    expect(getEdge(char)).toEqual({ current: 4, max: 4 });
  });
});

describe("getCondition", () => {
  it("calculates CM max from attributes", () => {
    // bod=4 -> physical max = 8 + ceil(4/2) = 10
    // wil=3 -> stun max = 8 + ceil(3/2) = 10
    const char = makeCharacter({ attributes: { body: 4, willpower: 3 } });
    const result = getCondition(char);
    expect(result.physicalMax).toBe(10);
    expect(result.stunMax).toBe(10);
  });

  it("defaults damage to 0 for missing condition fields", () => {
    const char = makeCharacter();
    const result = getCondition(char);
    expect(result.physicalDamage).toBe(0);
    expect(result.stunDamage).toBe(0);
    expect(result.overflowDamage).toBe(0);
  });
});

describe("getStatusBadge", () => {
  it("returns Draft badge for draft characters", () => {
    const char = makeCharacter({ status: "draft" });
    expect(getStatusBadge(char)?.label).toBe("Draft");
  });

  it("returns Deceased badge", () => {
    const char = makeCharacter({ status: "deceased" });
    expect(getStatusBadge(char)?.label).toBe("Deceased");
  });

  it("returns Retired badge", () => {
    const char = makeCharacter({ status: "retired" });
    expect(getStatusBadge(char)?.label).toBe("Retired");
  });

  it("returns Incapacitated when physical damage >= max", () => {
    const char = makeCharacter({
      attributes: { body: 4, willpower: 3 },
      condition: { physicalDamage: 10, stunDamage: 0 },
    });
    expect(getStatusBadge(char)?.label).toBe("Incapacitated");
  });

  it("returns Unconscious when stun damage >= max", () => {
    const char = makeCharacter({
      attributes: { body: 4, willpower: 3 },
      condition: { physicalDamage: 0, stunDamage: 10 },
    });
    expect(getStatusBadge(char)?.label).toBe("Unconscious");
  });

  it("returns null for healthy active character", () => {
    const char = makeCharacter({ condition: { physicalDamage: 0, stunDamage: 0 } });
    expect(getStatusBadge(char)).toBeNull();
  });
});

// =============================================================================
// COMPONENT: PartyOverviewPanel
// =============================================================================

describe("PartyOverviewPanel", () => {
  it("renders empty state when no characters", () => {
    render(<PartyOverviewPanel characters={[]} onCharacterClick={vi.fn()} />);
    expect(screen.getByText("No characters in party")).toBeInTheDocument();
  });

  it("renders one card per character", () => {
    const chars = [
      makeCharacter({ id: "c1", name: "Alpha" }),
      makeCharacter({ id: "c2", name: "Beta" }),
    ];
    render(<PartyOverviewPanel characters={chars} onCharacterClick={vi.fn()} />);
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
    expect(screen.getByText("2 characters")).toBeInTheDocument();
  });

  it("shows alert count for incapacitated characters", () => {
    const chars = [
      makeCharacter({ id: "c1", name: "Healthy" }),
      makeCharacter({
        id: "c2",
        name: "Downed",
        attributes: { body: 4, willpower: 3 },
        condition: { physicalDamage: 10, stunDamage: 0 },
      }),
    ];
    render(<PartyOverviewPanel characters={chars} onCharacterClick={vi.fn()} />);
    expect(screen.getByText("1 down")).toBeInTheDocument();
  });

  it("does not count non-active characters in alerts", () => {
    const chars = [
      makeCharacter({
        id: "c1",
        name: "Dead",
        status: "deceased",
        attributes: { body: 4, willpower: 3 },
        condition: { physicalDamage: 10, stunDamage: 0 },
      }),
    ];
    render(<PartyOverviewPanel characters={chars} onCharacterClick={vi.fn()} />);
    expect(screen.queryByText(/down/)).not.toBeInTheDocument();
  });

  it("calls onCharacterClick with character id", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const chars = [makeCharacter({ id: "c1", name: "Clickable" })];
    render(<PartyOverviewPanel characters={chars} onCharacterClick={onClick} />);

    await user.click(screen.getByText("Clickable"));
    expect(onClick).toHaveBeenCalledWith("c1");
  });

  it("renders draft characters with muted style", () => {
    const chars = [makeCharacter({ id: "c1", name: "Drafty", status: "draft" })];
    render(<PartyOverviewPanel characters={chars} onCharacterClick={vi.fn()} />);
    expect(screen.getByText("Draft")).toBeInTheDocument();
  });

  it("shows character metatype and magical path", () => {
    const chars = [
      makeCharacter({
        id: "c1",
        name: "Mage",
        metatype: "Elf",
        magicalPath: "full-mage",
      }),
    ];
    render(<PartyOverviewPanel characters={chars} onCharacterClick={vi.fn()} />);
    expect(screen.getByText("Elf - full-mage")).toBeInTheDocument();
  });

  it("does not show mundane magical path", () => {
    const chars = [
      makeCharacter({
        id: "c1",
        name: "Norm",
        metatype: "Human",
        magicalPath: "mundane",
      }),
    ];
    render(<PartyOverviewPanel characters={chars} onCharacterClick={vi.fn()} />);
    expect(screen.queryByText(/mundane/)).not.toBeInTheDocument();
  });
});
