/**
 * CombatQuickReference tests
 *
 * Verifies that wireless bonuses and encumbrance penalties appear as
 * labelled modifiers in the correct combat dice pools.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { CombatQuickReference } from "../CombatQuickReference";
import { createMockCharacter } from "@/__tests__/mocks/storage";
import type { Character, Weapon } from "@/lib/types";
import type { DicePoolDisplayProps } from "../DicePoolDisplay";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

// Mock DicePoolDisplay to expose props as data attributes for inspection
vi.mock("../DicePoolDisplay", () => ({
  DicePoolDisplay: (props: DicePoolDisplayProps) => (
    <div
      data-testid={`pool-${props.label}`}
      data-pool={props.basePool}
      data-wound={props.woundModifier}
      data-wireless={props.hasWirelessBonus ? "true" : "false"}
      data-modifiers={JSON.stringify(props.modifiers)}
    >
      {props.label}: {props.basePool}
    </div>
  ),
}));

vi.mock("lucide-react", () => ({
  Wifi: (props: Record<string, unknown>) => <span data-testid="wifi-icon" {...props} />,
  AlertTriangle: (props: Record<string, unknown>) => <span data-testid="alert-icon" {...props} />,
}));

// Default: wireless disabled, no bonuses
const mockIsGlobalWirelessEnabled = vi.fn().mockReturnValue(false);
const mockCalculateWirelessBonuses = vi.fn().mockReturnValue({
  initiative: 0,
  initiativeDice: 0,
  attributes: {},
  attackPool: 0,
  defensePool: 0,
  damageResist: 0,
  armor: 0,
  recoil: 0,
  limits: {},
  skills: {},
  noiseReduction: 0,
  perception: 0,
  specialEffects: [],
});

vi.mock("@/lib/rules/wireless", () => ({
  isGlobalWirelessEnabled: (...args: unknown[]) => mockIsGlobalWirelessEnabled(...args),
  calculateWirelessBonuses: (...args: unknown[]) => mockCalculateWirelessBonuses(...args),
}));

// Default: no armor encumbrance
const mockCalculateArmorTotal = vi.fn().mockReturnValue({
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
});

vi.mock("@/lib/rules/gameplay", () => ({
  calculateArmorTotal: (...args: unknown[]) => mockCalculateArmorTotal(...args),
}));

// Default: no weight encumbrance
const mockCalculateEncumbrance = vi.fn().mockReturnValue({
  currentWeight: 5,
  maxCapacity: 50,
  overweightPenalty: 0,
  isEncumbered: false,
});

vi.mock("@/lib/rules/encumbrance/calculator", () => ({
  calculateEncumbrance: (...args: unknown[]) => mockCalculateEncumbrance(...args),
}));

vi.mock("@/lib/themes", () => ({
  THEMES: {
    runner: {
      fonts: { mono: "font-mono" },
      colors: {
        accent: "text-emerald-400",
        card: "bg-card",
        border: "border-border",
        heading: "text-foreground",
      },
    },
  },
  DEFAULT_THEME: "runner",
}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getPoolProps(label: string) {
  const el = screen.getByTestId(`pool-${label}`);
  return {
    pool: Number(el.getAttribute("data-pool")),
    wireless: el.getAttribute("data-wireless") === "true",
    modifiers: JSON.parse(el.getAttribute("data-modifiers") || "[]") as Array<{
      label: string;
      value: number;
      type: string;
    }>,
  };
}

function hasModifier(
  modifiers: Array<{ label: string; value: number; type: string }>,
  label: string
) {
  return modifiers.find((m) => m.label === label);
}

function baseCharacter(overrides?: Partial<Character>): Character {
  return createMockCharacter({
    attributes: {
      body: 4,
      agility: 5,
      reaction: 4,
      strength: 5,
      charisma: 3,
      intuition: 4,
      logic: 3,
      willpower: 3,
    },
    skills: { gymnastics: 3, automatics: 4, pistols: 3 },
    gear: [],
    armor: [],
    ...overrides,
  });
}

function renderComponent(character: Character, woundModifier = 0) {
  return render(
    <CombatQuickReference character={character} woundModifier={woundModifier} physicalLimit={5} />
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("CombatQuickReference", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsGlobalWirelessEnabled.mockReturnValue(false);
    mockCalculateWirelessBonuses.mockReturnValue({
      initiative: 0,
      initiativeDice: 0,
      attributes: {},
      attackPool: 0,
      defensePool: 0,
      damageResist: 0,
      armor: 0,
      recoil: 0,
      limits: {},
      skills: {},
      noiseReduction: 0,
      perception: 0,
      specialEffects: [],
    });
    mockCalculateArmorTotal.mockReturnValue({
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
    });
    mockCalculateEncumbrance.mockReturnValue({
      currentWeight: 5,
      maxCapacity: 50,
      overweightPenalty: 0,
      isEncumbered: false,
    });
  });

  // -----------------------------------------------------------------------
  // Baseline (no bonuses, no penalties)
  // -----------------------------------------------------------------------

  describe("baseline pools (no wireless, no encumbrance)", () => {
    it("calculates defense pool from reaction + intuition", () => {
      renderComponent(baseCharacter());
      const defense = getPoolProps("Defense");
      // reaction(4) + intuition(4) = 8
      expect(defense.pool).toBe(8);
      expect(defense.wireless).toBe(false);
      expect(hasModifier(defense.modifiers, "Wireless Defense")).toBeUndefined();
      expect(hasModifier(defense.modifiers, "Armor Encumbrance")).toBeUndefined();
      expect(hasModifier(defense.modifiers, "Weight Encumbrance")).toBeUndefined();
    });

    it("calculates soak pool from body + armor", () => {
      renderComponent(baseCharacter());
      const soak = getPoolProps("Soak");
      // body(4) + armor(12) = 16
      expect(soak.pool).toBe(16);
      expect(soak.wireless).toBe(false);
      expect(hasModifier(soak.modifiers, "Wireless Soak")).toBeUndefined();
      expect(hasModifier(soak.modifiers, "Wireless Armor")).toBeUndefined();
    });
  });

  // -----------------------------------------------------------------------
  // Wireless bonuses
  // -----------------------------------------------------------------------

  describe("wireless bonuses", () => {
    beforeEach(() => {
      mockIsGlobalWirelessEnabled.mockReturnValue(true);
    });

    it("adds wireless defense bonus to Defense pool", () => {
      mockCalculateWirelessBonuses.mockReturnValue({
        initiative: 0,
        initiativeDice: 0,
        attributes: {},
        attackPool: 0,
        defensePool: 1,
        damageResist: 0,
        armor: 0,
        recoil: 0,
        limits: {},
        skills: {},
        noiseReduction: 0,
        perception: 0,
        specialEffects: [],
      });

      renderComponent(baseCharacter());
      const defense = getPoolProps("Defense");
      // 4 + 4 + 1 wireless = 9
      expect(defense.pool).toBe(9);
      expect(defense.wireless).toBe(true);
      const mod = hasModifier(defense.modifiers, "Wireless Defense");
      expect(mod).toBeDefined();
      expect(mod!.value).toBe(1);
      expect(mod!.type).toBe("wireless");
    });

    it("adds wireless defense bonus to Full Defense pool", () => {
      mockCalculateWirelessBonuses.mockReturnValue({
        initiative: 0,
        initiativeDice: 0,
        attributes: {},
        attackPool: 0,
        defensePool: 2,
        damageResist: 0,
        armor: 0,
        recoil: 0,
        limits: {},
        skills: {},
        noiseReduction: 0,
        perception: 0,
        specialEffects: [],
      });

      renderComponent(baseCharacter());
      const fullDefense = getPoolProps("Full Defense");
      // 4 + 4 + 3(gymnastics) + 2 wireless = 13
      expect(fullDefense.pool).toBe(13);
      expect(fullDefense.wireless).toBe(true);
    });

    it("adds wireless soak bonuses (damageResist + armor) to Soak pool", () => {
      mockCalculateWirelessBonuses.mockReturnValue({
        initiative: 0,
        initiativeDice: 0,
        attributes: {},
        attackPool: 0,
        defensePool: 0,
        damageResist: 1,
        armor: 2,
        recoil: 0,
        limits: {},
        skills: {},
        noiseReduction: 0,
        perception: 0,
        specialEffects: [],
      });

      renderComponent(baseCharacter());
      const soak = getPoolProps("Soak");
      // body(4) + armor(12) + damageResist(1) + wirelessArmor(2) = 19
      expect(soak.pool).toBe(19);
      expect(soak.wireless).toBe(true);
      expect(hasModifier(soak.modifiers, "Wireless Soak")).toBeDefined();
      expect(hasModifier(soak.modifiers, "Wireless Armor")).toBeDefined();
    });

    it("does not add wireless modifiers when global wireless is disabled", () => {
      mockIsGlobalWirelessEnabled.mockReturnValue(false);
      mockCalculateWirelessBonuses.mockReturnValue({
        initiative: 0,
        initiativeDice: 0,
        attributes: {},
        attackPool: 0,
        defensePool: 2,
        damageResist: 1,
        armor: 1,
        recoil: 0,
        limits: {},
        skills: {},
        noiseReduction: 0,
        perception: 0,
        specialEffects: [],
      });

      renderComponent(baseCharacter());
      const defense = getPoolProps("Defense");
      expect(defense.pool).toBe(8);
      expect(defense.wireless).toBe(false);

      const soak = getPoolProps("Soak");
      expect(soak.pool).toBe(16);
      expect(soak.wireless).toBe(false);
    });
  });

  // -----------------------------------------------------------------------
  // Armor encumbrance
  // -----------------------------------------------------------------------

  describe("armor encumbrance", () => {
    it("adds armor reaction penalty to Defense pool", () => {
      mockCalculateArmorTotal.mockReturnValue({
        totalArmor: 14,
        baseArmor: 12,
        rawAccessoryBonus: 4,
        effectiveAccessoryBonus: 2,
        excessOverStrength: 2,
        agilityPenalty: -1,
        reactionPenalty: -1,
        isEncumbered: true,
        baseArmorName: "Armor Jacket",
        accessoryNames: ["Helmet"],
      });

      renderComponent(baseCharacter());
      const defense = getPoolProps("Defense");
      // 4 + 4 - 1 = 7
      expect(defense.pool).toBe(7);
      const mod = hasModifier(defense.modifiers, "Armor Encumbrance");
      expect(mod).toBeDefined();
      expect(mod!.value).toBe(-1);
      expect(mod!.type).toBe("encumbrance");
    });

    it("does NOT add armor encumbrance to Soak pool", () => {
      mockCalculateArmorTotal.mockReturnValue({
        totalArmor: 14,
        baseArmor: 12,
        rawAccessoryBonus: 4,
        effectiveAccessoryBonus: 2,
        excessOverStrength: 2,
        agilityPenalty: -1,
        reactionPenalty: -1,
        isEncumbered: true,
        baseArmorName: "Armor Jacket",
        accessoryNames: ["Helmet"],
      });

      renderComponent(baseCharacter());
      const soak = getPoolProps("Soak");
      // body(4) + totalArmor(14) = 18, no penalty
      expect(soak.pool).toBe(18);
      expect(hasModifier(soak.modifiers, "Armor Encumbrance")).toBeUndefined();
    });
  });

  // -----------------------------------------------------------------------
  // Weight encumbrance
  // -----------------------------------------------------------------------

  describe("weight encumbrance", () => {
    it("adds weight penalty to Defense pool", () => {
      mockCalculateEncumbrance.mockReturnValue({
        currentWeight: 55,
        maxCapacity: 50,
        overweightPenalty: -5,
        isEncumbered: true,
      });

      renderComponent(baseCharacter());
      const defense = getPoolProps("Defense");
      // 4 + 4 - 5 = 3
      expect(defense.pool).toBe(3);
      const mod = hasModifier(defense.modifiers, "Weight Encumbrance");
      expect(mod).toBeDefined();
      expect(mod!.value).toBe(-5);
      expect(mod!.type).toBe("encumbrance");
    });

    it("adds weight penalty to Full Defense pool", () => {
      mockCalculateEncumbrance.mockReturnValue({
        currentWeight: 53,
        maxCapacity: 50,
        overweightPenalty: -3,
        isEncumbered: true,
      });

      renderComponent(baseCharacter());
      const fullDefense = getPoolProps("Full Defense");
      // 4 + 4 + 3(gymnastics) - 3 = 8
      expect(fullDefense.pool).toBe(8);
    });

    it("does NOT add weight encumbrance to Soak pool", () => {
      mockCalculateEncumbrance.mockReturnValue({
        currentWeight: 55,
        maxCapacity: 50,
        overweightPenalty: -5,
        isEncumbered: true,
      });

      renderComponent(baseCharacter());
      const soak = getPoolProps("Soak");
      expect(soak.pool).toBe(16);
      expect(hasModifier(soak.modifiers, "Weight Encumbrance")).toBeUndefined();
    });
  });

  // -----------------------------------------------------------------------
  // Combined modifiers
  // -----------------------------------------------------------------------

  describe("combined wireless + encumbrance", () => {
    it("applies all three modifiers to Defense pool", () => {
      mockIsGlobalWirelessEnabled.mockReturnValue(true);
      mockCalculateWirelessBonuses.mockReturnValue({
        initiative: 0,
        initiativeDice: 0,
        attributes: {},
        attackPool: 0,
        defensePool: 2,
        damageResist: 0,
        armor: 0,
        recoil: 0,
        limits: {},
        skills: {},
        noiseReduction: 0,
        perception: 0,
        specialEffects: [],
      });
      mockCalculateArmorTotal.mockReturnValue({
        totalArmor: 14,
        baseArmor: 12,
        rawAccessoryBonus: 4,
        effectiveAccessoryBonus: 2,
        excessOverStrength: 2,
        agilityPenalty: -1,
        reactionPenalty: -1,
        isEncumbered: true,
        baseArmorName: "Armor Jacket",
        accessoryNames: ["Helmet"],
      });
      mockCalculateEncumbrance.mockReturnValue({
        currentWeight: 52,
        maxCapacity: 50,
        overweightPenalty: -2,
        isEncumbered: true,
      });

      renderComponent(baseCharacter());
      const defense = getPoolProps("Defense");
      // 4 + 4 + 2(wireless) - 1(armor) - 2(weight) = 7
      expect(defense.pool).toBe(7);
      expect(defense.wireless).toBe(true);
      expect(hasModifier(defense.modifiers, "Wireless Defense")!.value).toBe(2);
      expect(hasModifier(defense.modifiers, "Armor Encumbrance")!.value).toBe(-1);
      expect(hasModifier(defense.modifiers, "Weight Encumbrance")!.value).toBe(-2);
    });
  });

  // -----------------------------------------------------------------------
  // Weapon pools
  // -----------------------------------------------------------------------

  describe("weapon pools with encumbrance", () => {
    it("adds both encumbrance types to weapon attack pools", () => {
      mockCalculateArmorTotal.mockReturnValue({
        totalArmor: 14,
        baseArmor: 12,
        rawAccessoryBonus: 4,
        effectiveAccessoryBonus: 2,
        excessOverStrength: 2,
        agilityPenalty: -1,
        reactionPenalty: -1,
        isEncumbered: true,
        baseArmorName: "Armor Jacket",
        accessoryNames: ["Helmet"],
      });
      mockCalculateEncumbrance.mockReturnValue({
        currentWeight: 52,
        maxCapacity: 50,
        overweightPenalty: -2,
        isEncumbered: true,
      });

      const char = baseCharacter({
        gear: [
          {
            id: "weapon-1",
            name: "Ares Predator V",
            category: "weapons",
            subcategory: "heavy-pistols",
            accuracy: 5,
            damage: "8P",
            ap: -1,
            mode: ["SA"],
            quantity: 1,
            availability: 5,
            cost: 725,
          } satisfies Weapon,
        ] as unknown as Character["gear"],
      });

      renderComponent(char);
      const weapon = getPoolProps("Ares Predator V");
      // agility(5) + pistols(3) - 1(armor) - 2(weight) = 5
      expect(weapon.pool).toBe(5);
      expect(hasModifier(weapon.modifiers, "Armor Encumbrance")!.value).toBe(-1);
      expect(hasModifier(weapon.modifiers, "Weight Encumbrance")!.value).toBe(-2);
    });
  });

  // -----------------------------------------------------------------------
  // Common Tests (no encumbrance/wireless)
  // -----------------------------------------------------------------------

  describe("common tests (composure, judge intentions, memory)", () => {
    it("does not receive encumbrance or wireless modifiers", () => {
      mockIsGlobalWirelessEnabled.mockReturnValue(true);
      mockCalculateWirelessBonuses.mockReturnValue({
        initiative: 0,
        initiativeDice: 0,
        attributes: {},
        attackPool: 0,
        defensePool: 2,
        damageResist: 1,
        armor: 1,
        recoil: 0,
        limits: {},
        skills: {},
        noiseReduction: 0,
        perception: 0,
        specialEffects: [],
      });
      mockCalculateEncumbrance.mockReturnValue({
        currentWeight: 55,
        maxCapacity: 50,
        overweightPenalty: -5,
        isEncumbered: true,
      });

      renderComponent(baseCharacter());

      // Common tests are rendered as buttons, not DicePoolDisplay
      // They show as button elements with pool values
      const composureBtn = screen.getByText("Composure");
      expect(composureBtn).toBeDefined();

      // The pool values are rendered inline — charisma(3) + willpower(3) = 6
      // They are displayed as the next sibling text
      const composureValue = composureBtn.closest("button")?.querySelector(".font-bold");
      expect(composureValue?.textContent).toBe("6");
    });
  });
});
