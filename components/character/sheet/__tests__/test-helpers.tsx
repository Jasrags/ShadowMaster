/**
 * Shared test helpers for character sheet display component tests.
 *
 * Provides mock data factories and common setup utilities that
 * mirror the patterns in components/creation/__tests__/.
 */

import { vi } from "vitest";
import { createMockCharacter } from "@/__tests__/mocks/storage";
import type { Character } from "@/lib/types";
import { SinnerQuality } from "@/lib/types";

// ---------------------------------------------------------------------------
// DisplayCard + BaseCard mock (simple pass-through)
// ---------------------------------------------------------------------------
export function setupDisplayCardMock() {
  vi.mock("../DisplayCard", () => ({
    DisplayCard: ({
      title,
      children,
      headerAction,
    }: {
      title: string;
      children: React.ReactNode;
      headerAction?: React.ReactNode;
    }) => (
      <div data-testid={`display-card-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
        <h2>{title}</h2>
        {headerAction}
        {children}
      </div>
    ),
  }));
}

export function setupBaseCardMock() {
  vi.mock("@/components/creation/shared/BaseCard", () => ({
    BaseCard: ({
      title,
      children,
      headerAction,
    }: {
      title: string;
      children: React.ReactNode;
      headerAction?: React.ReactNode;
    }) => (
      <div data-testid={`base-card-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
        <h2>{title}</h2>
        {headerAction}
        {children}
      </div>
    ),
  }));
}

// ---------------------------------------------------------------------------
// StabilityShield mock
// ---------------------------------------------------------------------------
export function setupStabilityShieldMock() {
  vi.mock("@/components/sync", () => ({
    StabilityShield: () => <span data-testid="stability-shield" />,
    CompactShield: () => <span data-testid="compact-shield" />,
  }));
}

// ---------------------------------------------------------------------------
// react-aria-components mock (Link as <a>)
// ---------------------------------------------------------------------------
export function setupReactAriaMock() {
  vi.mock("react-aria-components", () => ({
    Link: ({
      href,
      children,
      className,
    }: {
      href: string;
      children: React.ReactNode;
      className?: string;
    }) => (
      <a href={href} className={className}>
        {children}
      </a>
    ),
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
}

// ---------------------------------------------------------------------------
// lucide-react icon mock factory
// ---------------------------------------------------------------------------
function createIconMock(name: string) {
  const Icon = (props: Record<string, unknown>) => <span data-testid={`icon-${name}`} {...props} />;
  Icon.displayName = name;
  return Icon;
}

/**
 * All lucide-react icons used by sheet display components.
 * Use this object as the return value for vi.mock("lucide-react", () => LUCIDE_MOCK).
 */
export const LUCIDE_MOCK = {
  Activity: createIconMock("Activity"),
  Shield: createIconMock("Shield"),
  Heart: createIconMock("Heart"),
  Brain: createIconMock("Brain"),
  Footprints: createIconMock("Footprints"),
  ShieldCheck: createIconMock("ShieldCheck"),
  BarChart3: createIconMock("BarChart3"),
  Crosshair: createIconMock("Crosshair"),
  Swords: createIconMock("Swords"),
  Package: createIconMock("Package"),
  Pill: createIconMock("Pill"),
  Sparkles: createIconMock("Sparkles"),
  Braces: createIconMock("Braces"),
  Cpu: createIconMock("Cpu"),
  BookOpen: createIconMock("BookOpen"),
  Users: createIconMock("Users"),
  Fingerprint: createIconMock("Fingerprint"),
  Zap: createIconMock("Zap"),
  Car: createIconMock("Car"),
  Dna: createIconMock("Dna"),
  Home: createIconMock("Home"),
  Star: createIconMock("Star"),
  CirclePlus: createIconMock("CirclePlus"),
  ArrowUp: createIconMock("ArrowUp"),
  Info: createIconMock("Info"),
  Clock: createIconMock("Clock"),
  AlertCircle: createIconMock("AlertCircle"),
  Settings2: createIconMock("Settings2"),
};

// ---------------------------------------------------------------------------
// Character factory with sheet-friendly defaults
// ---------------------------------------------------------------------------
export function createSheetCharacter(overrides?: Partial<Character>): Character {
  return createMockCharacter({
    name: "Street Samurai",
    metatype: "Human",
    status: "active",
    magicalPath: "mundane",
    editionCode: "sr5",
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
    specialAttributes: {
      edge: 3,
      essence: 4.2,
    },
    skills: {
      pistols: 5,
      automatics: 4,
      "unarmed-combat": 3,
      blades: 4,
      sneaking: 3,
      perception: 4,
    },
    nuyen: 15000,
    karmaCurrent: 5,
    karmaTotal: 25,
    ...overrides,
  });
}

// ---------------------------------------------------------------------------
// Mock weapon data
// ---------------------------------------------------------------------------
export const MOCK_RANGED_WEAPON = {
  name: "Ares Predator V",
  category: "Pistols",
  subcategory: "Heavy Pistols",
  damage: "8P",
  ap: -1,
  mode: ["SA"],
  accuracy: 5,
  cost: 725,
  quantity: 1,
  equipped: true,
  readiness: "ready" as const,
};

export const MOCK_MELEE_WEAPON = {
  name: "Combat Knife",
  category: "Blades",
  subcategory: "Blades",
  damage: "6P",
  ap: -3,
  mode: [] as string[],
  reach: 0,
  cost: 300,
  quantity: 1,
  equipped: true,
  readiness: "ready" as const,
};

// ---------------------------------------------------------------------------
// Mock armor data
// ---------------------------------------------------------------------------
export const MOCK_ARMOR_EQUIPPED = {
  name: "Armor Jacket",
  category: "armor",
  subcategory: "armor",
  armorRating: 12,
  equipped: true,
  cost: 1000,
  quantity: 1,
  readiness: "ready" as const,
};

export const MOCK_ARMOR_STORED = {
  name: "Lined Coat",
  category: "armor",
  subcategory: "armor",
  armorRating: 9,
  equipped: false,
  cost: 900,
  quantity: 1,
  readiness: "stored" as const,
};

// ---------------------------------------------------------------------------
// Mock augmentation data
// ---------------------------------------------------------------------------
export const MOCK_CYBERWARE = {
  catalogId: "wired-reflexes",
  name: "Wired Reflexes",
  category: "bodyware" as const,
  grade: "standard" as const,
  baseEssenceCost: 2,
  essenceCost: 2,
  rating: 1,
  cost: 39000,
  availability: 8,
  attributeBonuses: { reaction: 1 },
};

export const MOCK_BIOWARE = {
  catalogId: "muscle-toner",
  name: "Muscle Toner",
  category: "basic" as const,
  grade: "standard" as const,
  baseEssenceCost: 0.2,
  essenceCost: 0.2,
  rating: 2,
  cost: 16000,
  availability: 8,
  attributeBonuses: { agility: 2 },
};

// ---------------------------------------------------------------------------
// Mock contact data
// ---------------------------------------------------------------------------
export const MOCK_CONTACTS = [
  { name: "Fixer", type: "Fixer", connection: 4, loyalty: 3 },
  { name: "Street Doc", type: "Street Doc", connection: 3, loyalty: 4 },
  { name: "Bartender", type: "Information", connection: 2, loyalty: 2 },
  { name: "Gang Leader", type: "Gang", connection: 5, loyalty: 1 },
  { name: "Corp Wage Slave", type: "Corporate", connection: 3, loyalty: 2 },
  { name: "Talismonger", type: "Magic", connection: 4, loyalty: 3 },
];

// ---------------------------------------------------------------------------
// Mock identity data
// ---------------------------------------------------------------------------
export const MOCK_IDENTITY_FAKE = {
  id: "id-fake-1",
  name: "John Smith",
  sin: { type: "fake" as const, rating: 4 },
  licenses: [
    { id: "lic-1", type: "fake" as const, rating: 4, name: "Firearms License" },
    { id: "lic-2", type: "fake" as const, rating: 4, name: "Driver's License" },
  ],
  notes: "Primary fake ID",
};

export const MOCK_IDENTITY_REAL = {
  id: "id-real-1",
  name: "Jane Doe",
  sin: { type: "real" as const, sinnerQuality: SinnerQuality.National },
  licenses: [],
};

// ---------------------------------------------------------------------------
// Mock metatype data for useMetatypes hook
// ---------------------------------------------------------------------------
export const MOCK_METATYPE_HUMAN = {
  id: "human",
  name: "Human",
  attributes: {
    body: { min: 1, max: 6 },
    agility: { min: 1, max: 6 },
    reaction: { min: 1, max: 6 },
    strength: { min: 1, max: 6 },
    willpower: { min: 1, max: 6 },
    logic: { min: 1, max: 6 },
    intuition: { min: 1, max: 6 },
    charisma: { min: 1, max: 6 },
    edge: { min: 2, max: 7 },
  },
};

// ---------------------------------------------------------------------------
// Mock skills catalog data for useSkills hook
// ---------------------------------------------------------------------------
export const MOCK_ACTIVE_SKILLS = [
  {
    id: "pistols",
    name: "Pistols",
    linkedAttribute: "Agility",
    group: "firearms",
    canDefault: true,
    category: "combat",
  },
  {
    id: "automatics",
    name: "Automatics",
    linkedAttribute: "Agility",
    group: "firearms",
    canDefault: true,
    category: "combat",
  },
  {
    id: "unarmed-combat",
    name: "Unarmed Combat",
    linkedAttribute: "Agility",
    group: null,
    canDefault: true,
    category: "combat",
  },
  {
    id: "blades",
    name: "Blades",
    linkedAttribute: "Agility",
    group: "close-combat",
    canDefault: true,
    category: "combat",
  },
  {
    id: "sneaking",
    name: "Sneaking",
    linkedAttribute: "Agility",
    group: "stealth",
    canDefault: true,
    category: "physical",
  },
  {
    id: "perception",
    name: "Perception",
    linkedAttribute: "Intuition",
    group: null,
    canDefault: true,
    category: "physical",
  },
];

// ---------------------------------------------------------------------------
// Mock spell data for useSpells hook
// ---------------------------------------------------------------------------
export const MOCK_SPELLS_CATALOG = {
  combat: [
    {
      id: "manabolt",
      name: "Manabolt",
      category: "combat" as const,
      type: "mana" as const,
      range: "LOS",
      duration: "Instant",
      drain: "F-3",
      description: "A bolt of mana energy",
    },
  ],
  detection: [],
  health: [
    {
      id: "heal",
      name: "Heal",
      category: "health" as const,
      type: "mana" as const,
      range: "Touch",
      duration: "Permanent",
      drain: "F-4",
      description: "Heals physical damage",
    },
  ],
  illusion: [],
  manipulation: [],
};

// ---------------------------------------------------------------------------
// Mock complex forms data for useComplexForms hook
// ---------------------------------------------------------------------------
export const MOCK_COMPLEX_FORMS = [
  {
    id: "cleaner",
    name: "Cleaner",
    target: "Persona",
    duration: "Permanent",
    fading: "L+1",
    description: "Removes marks from a persona",
  },
  {
    id: "resonance-spike",
    name: "Resonance Spike",
    target: "Device",
    duration: "Instant",
    fading: "L+2",
    description: "Damages matrix devices",
  },
];

// ---------------------------------------------------------------------------
// Mock quality catalog data for useQualities hook
// ---------------------------------------------------------------------------
export const MOCK_POSITIVE_QUALITIES = [
  {
    id: "ambidextrous",
    name: "Ambidextrous",
    karmaCost: 4,
    summary: "No off-hand penalty for using either hand.",
    effects: [],
  },
  {
    id: "high-pain-tolerance",
    name: "High Pain Tolerance",
    karmaCost: 7,
    summary: "Ignore wound modifiers up to rating.",
    levels: [
      { level: 1, name: "Rating 1", karma: 7 },
      { level: 2, name: "Rating 2", karma: 14 },
      { level: 3, name: "Rating 3", karma: 21 },
    ],
    effects: [
      {
        id: "hpt-wound",
        type: "wound-modifier",
        trigger: "always",
        target: {},
        value: 1,
        description: "Ignore 1 box of wound modifiers per rating",
      },
    ],
  },
];

export const MOCK_NEGATIVE_QUALITIES = [
  {
    id: "bad-luck",
    name: "Bad Luck",
    karmaBonus: 12,
    summary: "Glitches happen more often.",
    effects: [],
  },
  {
    id: "addiction",
    name: "Addiction",
    karmaBonus: 9,
    summary: "Character is addicted to a substance.",
    dynamicState: "addiction",
    effects: [],
  },
];
