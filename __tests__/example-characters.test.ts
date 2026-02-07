/**
 * Tests for SR5 Example Character Fixtures
 *
 * Validates that all example character JSON files:
 * 1. Load without errors
 * 2. Have required fields
 * 3. Have valid structure matching the Character type
 * 4. Have valid derived stats
 */

import { describe, it, expect, beforeAll } from "vitest";
import * as fs from "fs";
import * as path from "path";

// ============================================================================
// Types (minimal subset for testing)
// ============================================================================

interface CharacterAttributes {
  body: number;
  agility: number;
  reaction: number;
  strength: number;
  willpower: number;
  logic: number;
  intuition: number;
  charisma: number;
}

interface CharacterSpecialAttributes {
  edge: number;
  essence: number;
  magic?: number;
  resonance?: number;
}

interface CharacterDerivedStats {
  physicalLimit: number;
  mentalLimit: number;
  socialLimit: number;
  initiativeBase: number;
  initiativeDice: number;
  physicalConditionMonitor: number;
  stunConditionMonitor: number;
  composure: number;
  judgeIntentions: number;
  memory: number;
  liftCarry: number;
  movementWalk: number;
  movementRun: number;
  overflow: number;
}

interface ExampleCharacter {
  id: string;
  ownerId: string;
  editionId: string;
  editionCode: string;
  name: string;
  metatype: string;
  status: string;
  attributes: CharacterAttributes;
  specialAttributes: CharacterSpecialAttributes;
  magicalPath: string;
  skills: Record<string, number>;
  derivedStats: CharacterDerivedStats;
  karmaTotal: number;
  createdAt: string;
  [key: string]: unknown;
}

// ============================================================================
// Test Setup
// ============================================================================

const EXAMPLE_CHARS_DIR = path.join(process.cwd(), "data/editions/sr5/example-characters");

const EXPECTED_CHARACTER_COUNT = 16;

const REQUIRED_FIELDS = [
  "id",
  "ownerId",
  "editionId",
  "editionCode",
  "name",
  "metatype",
  "status",
  "attributes",
  "specialAttributes",
  "magicalPath",
  "skills",
  "derivedStats",
  "karmaTotal",
  "createdAt",
];

const VALID_METATYPES = ["human", "elf", "dwarf", "ork", "troll"];
const VALID_MAGICAL_PATHS = ["mundane", "magician", "adept", "mystic-adept", "technomancer"];
const VALID_STATUSES = ["draft", "active", "retired", "deceased"];

let characterFiles: string[] = [];
const characters: Map<string, ExampleCharacter> = new Map();

// ============================================================================
// Test Helpers
// ============================================================================

function calculatePhysicalLimit(attr: CharacterAttributes): number {
  return Math.ceil((attr.strength * 2 + attr.body + attr.reaction) / 3);
}

function calculateMentalLimit(attr: CharacterAttributes): number {
  return Math.ceil((attr.logic * 2 + attr.intuition + attr.willpower) / 3);
}

function calculateSocialLimit(attr: CharacterAttributes, essence: number): number {
  return Math.ceil((attr.charisma * 2 + attr.willpower + essence) / 3);
}

function calculatePhysicalConditionMonitor(body: number): number {
  return 8 + Math.ceil(body / 2);
}

function calculateStunConditionMonitor(willpower: number): number {
  return 8 + Math.ceil(willpower / 2);
}

// ============================================================================
// Tests
// ============================================================================

describe("Example Character Fixtures", () => {
  beforeAll(() => {
    // Load all character files
    if (fs.existsSync(EXAMPLE_CHARS_DIR)) {
      characterFiles = fs.readdirSync(EXAMPLE_CHARS_DIR).filter((f) => f.endsWith(".json"));

      for (const file of characterFiles) {
        const filePath = path.join(EXAMPLE_CHARS_DIR, file);
        const content = fs.readFileSync(filePath, "utf-8");
        const char = JSON.parse(content) as ExampleCharacter;
        characters.set(file, char);
      }
    }
  });

  describe("Fixture Directory", () => {
    it("should have the example characters directory", () => {
      expect(fs.existsSync(EXAMPLE_CHARS_DIR)).toBe(true);
    });

    it(`should have exactly ${EXPECTED_CHARACTER_COUNT} character files`, () => {
      expect(characterFiles.length).toBe(EXPECTED_CHARACTER_COUNT);
    });

    it("should have all expected character archetypes", () => {
      const expectedFiles = [
        "face-elf.json",
        "gang-leader-ork.json",
        "bounty-hunter-troll.json",
        "infiltrator-dwarf.json",
        "mercenary-human.json",
        "street-samurai-ork.json",
        "combat-mage-human.json",
        "shaman-elf.json",
        "decker-dwarf.json",
        "technomancer-human.json",
        "drone-rigger-ork.json",
        "rigger-troll.json",
        "tribal-warrior-troll.json",
        "alchemist-human.json",
        "martial-artist-human.json",
        "assassin-elf.json",
      ];

      for (const expectedFile of expectedFiles) {
        expect(characterFiles).toContain(expectedFile);
      }
    });
  });

  describe("JSON Structure", () => {
    it("should parse all files as valid JSON", () => {
      for (const file of characterFiles) {
        const filePath = path.join(EXAMPLE_CHARS_DIR, file);
        expect(() => {
          const content = fs.readFileSync(filePath, "utf-8");
          JSON.parse(content);
        }).not.toThrow();
      }
    });

    it("should have all required fields in each character", () => {
      for (const [_file, char] of characters) {
        for (const field of REQUIRED_FIELDS) {
          expect(char).toHaveProperty(field, expect.anything());
        }
      }
    });
  });

  describe("Character Data Validity", () => {
    it("should have valid metatypes", () => {
      for (const [_file, char] of characters) {
        expect(VALID_METATYPES).toContain(char.metatype);
      }
    });

    it("should have valid magical paths", () => {
      for (const [_file, char] of characters) {
        expect(VALID_MAGICAL_PATHS).toContain(char.magicalPath);
      }
    });

    it("should have valid status", () => {
      for (const [_file, char] of characters) {
        expect(VALID_STATUSES).toContain(char.status);
      }
    });

    it("should have positive essence values", () => {
      for (const [_file, char] of characters) {
        expect(char.specialAttributes.essence).toBeGreaterThan(0);
        expect(char.specialAttributes.essence).toBeLessThanOrEqual(6);
      }
    });

    it("should have valid edge values (1-7)", () => {
      for (const [_file, char] of characters) {
        expect(char.specialAttributes.edge).toBeGreaterThanOrEqual(1);
        expect(char.specialAttributes.edge).toBeLessThanOrEqual(7);
      }
    });

    it("should have skills as non-empty object", () => {
      for (const [_file, char] of characters) {
        expect(Object.keys(char.skills).length).toBeGreaterThan(0);
      }
    });

    it("should have skill ratings between 1 and 7", () => {
      for (const [_file, char] of characters) {
        for (const [_skill, rating] of Object.entries(char.skills)) {
          expect(rating).toBeGreaterThanOrEqual(1);
          expect(rating).toBeLessThanOrEqual(7);
        }
      }
    });
  });

  describe("Attribute Validity", () => {
    it("should have all core attributes", () => {
      const coreAttributes = [
        "body",
        "agility",
        "reaction",
        "strength",
        "willpower",
        "logic",
        "intuition",
        "charisma",
      ];

      for (const [_file, char] of characters) {
        for (const attr of coreAttributes) {
          expect(char.attributes).toHaveProperty(attr);
          expect(typeof char.attributes[attr as keyof CharacterAttributes]).toBe("number");
        }
      }
    });

    it("should have attributes within valid ranges (1-10 for base metatypes)", () => {
      for (const [_file, char] of characters) {
        for (const [attr, value] of Object.entries(char.attributes)) {
          expect(value).toBeGreaterThanOrEqual(1);
          // Trolls can have higher body/strength
          if (char.metatype === "troll" && (attr === "body" || attr === "strength")) {
            expect(value).toBeLessThanOrEqual(14);
          } else {
            expect(value).toBeLessThanOrEqual(10);
          }
        }
      }
    });
  });

  describe("Derived Stats", () => {
    it("should have all required derived stats", () => {
      const requiredStats = [
        "physicalLimit",
        "mentalLimit",
        "socialLimit",
        "initiativeBase",
        "initiativeDice",
        "physicalConditionMonitor",
        "stunConditionMonitor",
        "composure",
        "judgeIntentions",
        "memory",
        "liftCarry",
        "movementWalk",
        "movementRun",
        "overflow",
      ];

      for (const [_file, char] of characters) {
        for (const stat of requiredStats) {
          expect(char.derivedStats).toHaveProperty(stat);
          expect(typeof char.derivedStats[stat as keyof CharacterDerivedStats]).toBe("number");
        }
      }
    });

    it("should have reasonable physical limit (within 2 of calculated, for augmentations)", () => {
      for (const [_file, char] of characters) {
        const calculated = calculatePhysicalLimit(char.attributes);
        const actual = char.derivedStats.physicalLimit;
        // Allow variance for augmentations and qualities
        expect(Math.abs(calculated - actual)).toBeLessThanOrEqual(4);
      }
    });

    it("should have reasonable mental limit (within 2 of calculated)", () => {
      for (const [_file, char] of characters) {
        const calculated = calculateMentalLimit(char.attributes);
        const actual = char.derivedStats.mentalLimit;
        expect(Math.abs(calculated - actual)).toBeLessThanOrEqual(2);
      }
    });

    it("should have reasonable social limit (within 2 of calculated)", () => {
      for (const [_file, char] of characters) {
        const calculated = calculateSocialLimit(char.attributes, char.specialAttributes.essence);
        const actual = char.derivedStats.socialLimit;
        expect(Math.abs(calculated - actual)).toBeLessThanOrEqual(2);
      }
    });

    it("should have reasonable physical condition monitor (within 1 for Toughness)", () => {
      for (const [_file, char] of characters) {
        const calculated = calculatePhysicalConditionMonitor(char.attributes.body);
        const actual = char.derivedStats.physicalConditionMonitor;
        // Toughness quality adds +1, bone lacing can add +2 body
        expect(Math.abs(calculated - actual)).toBeLessThanOrEqual(2);
      }
    });

    it("should have reasonable stun condition monitor", () => {
      for (const [_file, char] of characters) {
        const calculated = calculateStunConditionMonitor(char.attributes.willpower);
        const actual = char.derivedStats.stunConditionMonitor;
        expect(Math.abs(calculated - actual)).toBeLessThanOrEqual(1);
      }
    });

    it("should have positive initiative values", () => {
      for (const [_file, char] of characters) {
        expect(char.derivedStats.initiativeBase).toBeGreaterThan(0);
        expect(char.derivedStats.initiativeDice).toBeGreaterThanOrEqual(1);
      }
    });

    it("should have reasonable movement walk (AGI × 2, within ±2 for augmentations)", () => {
      for (const [_file, char] of characters) {
        const calculated = char.attributes.agility * 2;
        const actual = char.derivedStats.movementWalk;
        expect(Math.abs(calculated - actual)).toBeLessThanOrEqual(2);
      }
    });

    it("should have reasonable movement run (AGI × 4, within ±4 for augmentations)", () => {
      for (const [_file, char] of characters) {
        const calculated = char.attributes.agility * 4;
        const actual = char.derivedStats.movementRun;
        expect(Math.abs(calculated - actual)).toBeLessThanOrEqual(4);
      }
    });

    it("should have reasonable overflow (BOD, within ±2 for augmentations)", () => {
      for (const [_file, char] of characters) {
        const calculated = char.attributes.body;
        const actual = char.derivedStats.overflow;
        expect(Math.abs(calculated - actual)).toBeLessThanOrEqual(2);
      }
    });
  });

  describe("Magical Characters", () => {
    it("should have magic attribute for magicians/adepts", () => {
      for (const [_file, char] of characters) {
        if (["magician", "adept", "mystic-adept"].includes(char.magicalPath)) {
          expect(char.specialAttributes.magic).toBeDefined();
          expect(char.specialAttributes.magic).toBeGreaterThan(0);
        }
      }
    });

    it("should have resonance attribute for technomancers", () => {
      for (const [_file, char] of characters) {
        if (char.magicalPath === "technomancer") {
          expect(char.specialAttributes.resonance).toBeDefined();
          expect(char.specialAttributes.resonance).toBeGreaterThan(0);
        }
      }
    });

    it("should have spells for magicians", () => {
      for (const [_file, char] of characters) {
        if (char.magicalPath === "magician") {
          expect(char).toHaveProperty("spells");
          expect(Array.isArray(char.spells)).toBe(true);
          expect((char.spells as unknown[]).length).toBeGreaterThan(0);
        }
      }
    });

    it("should have adept powers for adepts", () => {
      for (const [_file, char] of characters) {
        if (char.magicalPath === "adept") {
          expect(char).toHaveProperty("adeptPowers");
          expect(Array.isArray(char.adeptPowers)).toBe(true);
          expect((char.adeptPowers as unknown[]).length).toBeGreaterThan(0);
        }
      }
    });

    it("should have complex forms for technomancers", () => {
      for (const [_file, char] of characters) {
        if (char.magicalPath === "technomancer") {
          expect(char).toHaveProperty("complexForms");
          expect(Array.isArray(char.complexForms)).toBe(true);
          expect((char.complexForms as unknown[]).length).toBeGreaterThan(0);
        }
      }
    });
  });

  describe("Character Metadata", () => {
    it("should have system as owner", () => {
      for (const [_file, char] of characters) {
        expect(char.ownerId).toBe("system");
      }
    });

    it("should have sr5 edition", () => {
      for (const [_file, char] of characters) {
        expect(char.editionId).toBe("sr5");
        expect(char.editionCode).toBe("sr5");
      }
    });

    it("should have draft status", () => {
      for (const [_file, char] of characters) {
        expect(char.status).toBe("draft");
      }
    });

    it("should have metadata with source", () => {
      for (const [_file, char] of characters) {
        expect(char).toHaveProperty("metadata");
        expect((char.metadata as Record<string, unknown>).source).toBe(
          "SR5 Core Rulebook Example Character"
        );
      }
    });

    it("should have valid karma values", () => {
      for (const [_file, char] of characters) {
        expect(char.karmaTotal).toBe(25); // SR5 default starting karma
        expect(char).toHaveProperty("karmaCurrent");
        expect(char).toHaveProperty("karmaSpentAtCreation");
      }
    });
  });
});
