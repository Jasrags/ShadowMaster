/**
 * Shared test helpers for character sheet display component tests.
 *
 * Provides mock data factories and common setup utilities that
 * mirror the patterns in components/creation/__tests__/.
 */

import { vi } from "vitest";
import { createMockCharacter } from "@/__tests__/mocks/storage";
import type { Character, Vehicle, CharacterDrone, CharacterRCC } from "@/lib/types";
import type { CharacterCyberdeck, CharacterCommlink } from "@/lib/types/matrix";
import type { CharacterProgram } from "@/lib/types/programs";
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
  Wifi: createIconMock("Wifi"),
  Fingerprint: createIconMock("Fingerprint"),
  Zap: createIconMock("Zap"),
  Car: createIconMock("Car"),
  Dna: createIconMock("Dna"),
  Home: createIconMock("Home"),
  Star: createIconMock("Star"),
  CirclePlus: createIconMock("CirclePlus"),
  ArrowUp: createIconMock("ArrowUp"),
  ArrowDown: createIconMock("ArrowDown"),
  Info: createIconMock("Info"),
  Clock: createIconMock("Clock"),
  AlertCircle: createIconMock("AlertCircle"),
  Settings2: createIconMock("Settings2"),
  ChevronDown: createIconMock("ChevronDown"),
  ChevronRight: createIconMock("ChevronRight"),
  WifiOff: createIconMock("WifiOff"),
  Weight: createIconMock("Weight"),
  AlertTriangle: createIconMock("AlertTriangle"),
  Monitor: createIconMock("Monitor"),
  ArrowUpDown: createIconMock("ArrowUpDown"),
  Smartphone: createIconMock("Smartphone"),
  Minus: createIconMock("Minus"),
  Plus: createIconMock("Plus"),
  Trash2: createIconMock("Trash2"),
  X: createIconMock("X"),
  // Modifier icons
  Sliders: createIconMock("Sliders"),
  // Rigging icons
  Gamepad2: createIconMock("Gamepad2"),
  Radio: createIconMock("Radio"),
  PlugZap: createIconMock("PlugZap"),
  Signal: createIconMock("Signal"),
  Unplug: createIconMock("Unplug"),
  // Loadout/container icons
  Pencil: createIconMock("Pencil"),
  MapPin: createIconMock("MapPin"),
  CheckCircle2: createIconMock("CheckCircle2"),
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
  state: { readiness: "worn" as const, wirelessEnabled: true },
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
  state: { readiness: "stored" as const, wirelessEnabled: false },
};

export const MOCK_ARMOR_WITH_MODS = {
  name: "Full Body Armor",
  category: "armor",
  subcategory: "full-body-armor",
  armorRating: 15,
  equipped: true,
  cost: 8000,
  quantity: 1,
  readiness: "ready" as const,
  state: { readiness: "worn" as const, wirelessEnabled: true },
  availability: 14,
  legality: "restricted" as const,
  capacity: 15,
  capacityUsed: 7,
  weight: 8,
  modifications: [
    {
      catalogId: "fire-resistance",
      name: "Fire Resistance",
      rating: 3,
      capacityUsed: 3,
      cost: 750,
      availability: 6,
    },
    {
      catalogId: "chemical-protection",
      name: "Chemical Protection",
      rating: 4,
      capacityUsed: 4,
      cost: 1000,
      availability: 6,
    },
  ],
};

export const MOCK_ARMOR_ACCESSORY = {
  name: "Ballistic Shield",
  category: "armor",
  subcategory: "shields",
  armorRating: 6,
  armorModifier: true,
  equipped: true,
  cost: 1200,
  quantity: 1,
  readiness: "ready" as const,
  state: { readiness: "worn" as const, wirelessEnabled: false },
};

export const MOCK_ARMOR_WITH_WIRELESS = {
  name: "Berwick Suit",
  category: "armor",
  subcategory: "armor-clothing",
  armorRating: 8,
  equipped: true,
  cost: 2600,
  quantity: 1,
  readiness: "ready" as const,
  state: { readiness: "worn" as const, wirelessEnabled: true },
  wirelessBonus: "+1 to Social limit while wireless is active.",
  catalogId: "berwick-suit",
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
  wirelessBonus: "Gain +1 Reaction while wireless is active",
  wirelessEnabled: true,
  wirelessEffects: [{ type: "attribute" as const, modifier: 1, attribute: "reaction" as const }],
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
  wirelessBonus: "Gain +1 Agility while wireless is active",
  wirelessEnabled: true,
  wirelessEffects: [{ type: "attribute" as const, modifier: 1, attribute: "agility" as const }],
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
    {
      id: "powerbolt",
      name: "Powerbolt",
      category: "combat" as const,
      type: "physical" as const,
      range: "LOS",
      duration: "Instant",
      drain: "F-2",
      damage: "physical",
      description: "A bolt of destructive energy",
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
  illusion: [
    {
      id: "invisibility",
      name: "Invisibility",
      category: "illusion" as const,
      type: "mana" as const,
      range: "LOS",
      duration: "Sustained",
      drain: "F-1",
      description: "Makes the subject invisible to normal vision",
    },
  ],
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

// ---------------------------------------------------------------------------
// Mock vehicle data
// ---------------------------------------------------------------------------
export const MOCK_VEHICLE: Vehicle = {
  catalogId: "dodge-scoot",
  name: "Dodge Scoot",
  type: "ground",
  handling: 4,
  speed: 3,
  acceleration: 1,
  body: 4,
  armor: 4,
  pilot: 1,
  sensor: 1,
  seats: 1,
  cost: 3000,
  availability: 4,
};

export const MOCK_VEHICLE_WITH_OPTIONS: Vehicle = {
  catalogId: "ares-roadmaster",
  name: "Ares Roadmaster",
  type: "ground",
  handling: 3,
  speed: 4,
  acceleration: 2,
  body: 18,
  armor: 14,
  pilot: 3,
  sensor: 3,
  seats: 6,
  cost: 52000,
  availability: 12,
  legality: "restricted",
  notes: "Armored transport vehicle",
};

// ---------------------------------------------------------------------------
// Mock drone data
// ---------------------------------------------------------------------------
export const MOCK_DRONE: CharacterDrone = {
  catalogId: "fly-spy",
  name: "MCT Fly-Spy",
  size: "mini",
  handling: 4,
  speed: 3,
  acceleration: 2,
  body: 1,
  armor: 0,
  pilot: 3,
  sensor: 3,
  cost: 2000,
  availability: 4,
};

export const MOCK_DRONE_WITH_AUTOSOFTS: CharacterDrone = {
  catalogId: "gm-nissan-doberman",
  name: "GM-Nissan Doberman",
  customName: "Rex",
  size: "medium",
  handling: 5,
  speed: 4,
  acceleration: 2,
  body: 4,
  armor: 4,
  pilot: 3,
  sensor: 3,
  cost: 5000,
  availability: 4,
  installedAutosofts: ["Clearsight", "Targeting (Automatics)"],
  notes: "Guard drone with targeting software",
};

// ---------------------------------------------------------------------------
// Mock RCC data
// ---------------------------------------------------------------------------
export const MOCK_RCC: CharacterRCC = {
  catalogId: "rcc-standard",
  name: "RCC-Standard",
  deviceRating: 5,
  dataProcessing: 4,
  firewall: 3,
  cost: 11000,
  availability: 6,
};

export const MOCK_RCC_WITH_OPTIONS: CharacterRCC = {
  catalogId: "vulcan-liegelord",
  name: "Vulcan Liegelord",
  customName: "Command Node",
  deviceRating: 7,
  dataProcessing: 6,
  firewall: 6,
  cost: 68500,
  availability: 14,
  legality: "restricted",
  runningAutosofts: ["Electronic Warfare", "Stealth"],
  notes: "High-end rigger command console",
};

// ---------------------------------------------------------------------------
// Mock vehicle/drone/RCC data with state variants
// ---------------------------------------------------------------------------
export const MOCK_VEHICLE_BRICKED: Vehicle = {
  ...MOCK_VEHICLE,
  name: "Bricked Scoot",
  state: { readiness: "stored", wirelessEnabled: false, condition: "bricked" },
};

export const MOCK_VEHICLE_DESTROYED: Vehicle = {
  ...MOCK_VEHICLE,
  name: "Destroyed Scoot",
  state: { readiness: "stored", wirelessEnabled: false, condition: "destroyed" },
};

export const MOCK_DRONE_BRICKED: CharacterDrone = {
  ...MOCK_DRONE,
  name: "Bricked Fly-Spy",
  state: { readiness: "stored", wirelessEnabled: false, condition: "bricked" },
};

export const MOCK_DRONE_DESTROYED: CharacterDrone = {
  ...MOCK_DRONE,
  name: "Destroyed Fly-Spy",
  state: { readiness: "stored", wirelessEnabled: false, condition: "destroyed" },
};

export const MOCK_DRONE_WIRELESS: CharacterDrone = {
  ...MOCK_DRONE,
  name: "Wireless Fly-Spy",
  state: { readiness: "stored", wirelessEnabled: true },
};

export const MOCK_RCC_BRICKED: CharacterRCC = {
  ...MOCK_RCC,
  name: "Bricked RCC",
  state: { readiness: "stored", wirelessEnabled: false, condition: "bricked" },
};

export const MOCK_RCC_WIRELESS: CharacterRCC = {
  ...MOCK_RCC,
  name: "Wireless RCC",
  state: { readiness: "stored", wirelessEnabled: true },
};

// ---------------------------------------------------------------------------
// Mock cyberdeck data
// ---------------------------------------------------------------------------
export const MOCK_CYBERDECK: CharacterCyberdeck = {
  id: "deck-1",
  catalogId: "novatech-navigator",
  name: "Novatech Navigator",
  deviceRating: 4,
  attributeArray: [6, 5, 4, 3],
  currentConfig: {
    attack: 3,
    sleaze: 4,
    dataProcessing: 6,
    firewall: 5,
  },
  programSlots: 5,
  loadedPrograms: ["exploit", "stealth"],
  cost: 40750,
  availability: 6,
};

export const MOCK_CYBERDECK_OFFENSIVE: CharacterCyberdeck = {
  ...MOCK_CYBERDECK,
  id: "deck-2",
  name: "Shiawase Cyber-5",
  currentConfig: {
    attack: 6,
    sleaze: 5,
    dataProcessing: 4,
    firewall: 3,
  },
};

// ---------------------------------------------------------------------------
// Mock commlink data
// ---------------------------------------------------------------------------
export const MOCK_COMMLINK: CharacterCommlink = {
  id: "comm-1",
  catalogId: "hermes-ikon",
  name: "Hermes Ikon",
  deviceRating: 5,
  dataProcessing: 5,
  firewall: 5,
  cost: 3000,
  availability: 4,
};

// ---------------------------------------------------------------------------
// Mock program data
// ---------------------------------------------------------------------------
export const MOCK_PROGRAMS: CharacterProgram[] = [
  {
    id: "prog-1",
    catalogId: "exploit",
    name: "Exploit",
    category: "hacking",
    cost: 250,
    availability: 4,
    loaded: true,
  },
  {
    id: "prog-2",
    catalogId: "stealth",
    name: "Stealth",
    category: "hacking",
    cost: 250,
    availability: 4,
    loaded: true,
  },
  {
    id: "prog-3",
    catalogId: "toolbox",
    name: "Toolbox",
    category: "common",
    cost: 250,
    availability: 4,
    loaded: false,
  },
  {
    id: "prog-4",
    catalogId: "armor",
    name: "Armor",
    category: "common",
    cost: 250,
    availability: 4,
    loaded: false,
  },
  {
    id: "prog-5",
    catalogId: "agent",
    name: "Agent",
    category: "agent",
    rating: 3,
    cost: 3000,
    availability: 8,
    loaded: false,
  },
];

// ---------------------------------------------------------------------------
// Mock program catalog data (from ruleset, includes effects)
// ---------------------------------------------------------------------------
export const MOCK_PROGRAM_CATALOG = [
  {
    id: "exploit",
    name: "Exploit",
    category: "hacking" as const,
    cost: 250,
    availability: 4,
    legality: "restricted" as const,
    effects: "+2 to Hack on the Fly and Brute Force",
    page: 245,
    source: "Core",
  },
  {
    id: "stealth",
    name: "Stealth",
    category: "hacking" as const,
    cost: 250,
    availability: 4,
    legality: "restricted" as const,
    effects: "+2 to defend against Matrix Perception",
    page: 245,
    source: "Core",
  },
  {
    id: "toolbox",
    name: "Toolbox",
    category: "common" as const,
    cost: 80,
    availability: 0,
    effects: "+1 Data Processing",
    page: 245,
    source: "Core",
  },
  {
    id: "armor",
    name: "Armor",
    category: "hacking" as const,
    cost: 250,
    availability: 6,
    legality: "restricted" as const,
    effects: "+2 dice pool modifier to resist Matrix damage",
    page: 245,
    source: "Core",
  },
  {
    id: "agent",
    name: "Agent",
    category: "agent" as const,
    cost: 1000,
    availability: 8,
    costPerRating: 1000,
    minRating: 1,
    maxRating: 6,
    effects: "Autonomous program that can perform matrix actions",
    page: 246,
    source: "Core",
  },
];

// ---------------------------------------------------------------------------
// Matrix character factories
// ---------------------------------------------------------------------------

/** Character with a cyberdeck - a full decker */
export function createDeckerCharacter(overrides?: Partial<Character>): Character {
  return createMockCharacter({
    name: "Console Cowboy",
    metatype: "Human",
    status: "active",
    magicalPath: "mundane",
    editionCode: "sr5",
    attributes: {
      body: 3,
      agility: 3,
      reaction: 4,
      strength: 2,
      willpower: 4,
      logic: 6,
      intuition: 5,
      charisma: 2,
    },
    specialAttributes: {
      edge: 3,
      essence: 6,
    },
    skills: {
      hacking: 6,
      cybercombat: 4,
      "electronic-warfare": 4,
      computer: 5,
      hardware: 3,
      software: 3,
    },
    cyberdecks: [MOCK_CYBERDECK],
    programs: MOCK_PROGRAMS,
    activeMatrixDeviceId: "deck-1",
    ...overrides,
  });
}

/** Character with only a commlink - basic matrix access */
export function createCommlinkCharacter(overrides?: Partial<Character>): Character {
  return createMockCharacter({
    name: "Street Sam Online",
    metatype: "Ork",
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
      computer: 2,
    },
    commlinks: [MOCK_COMMLINK],
    activeMatrixDeviceId: "comm-1",
    ...overrides,
  });
}

// ---------------------------------------------------------------------------
// Mock autosoft data
// ---------------------------------------------------------------------------
export const MOCK_AUTOSOFT_PERCEPTION: import("@/lib/types").CharacterAutosoft = {
  id: "soft-1",
  catalogId: "clearsight",
  name: "Clearsight",
  category: "perception",
  rating: 3,
  cost: 2500,
  availability: 4,
};

export const MOCK_AUTOSOFT_COMBAT: import("@/lib/types").CharacterAutosoft = {
  id: "soft-2",
  catalogId: "targeting-automatics",
  name: "Targeting (Automatics)",
  category: "combat",
  rating: 3,
  target: "automatics",
  cost: 2500,
  availability: 4,
};

export const MOCK_AUTOSOFT_MOVEMENT: import("@/lib/types").CharacterAutosoft = {
  id: "soft-3",
  catalogId: "maneuvering-ground",
  name: "Maneuvering (Ground Craft)",
  category: "movement",
  rating: 3,
  target: "ground",
  cost: 2500,
  availability: 4,
};

// ---------------------------------------------------------------------------
// Rigger character factory
// ---------------------------------------------------------------------------

/** Character with VCR, RCC, drones, and autosofts — a full rigger */
export function createRiggerCharacter(overrides?: Partial<Character>): Character {
  return createMockCharacter({
    name: "Chrome Wheelman",
    metatype: "Human",
    status: "active",
    magicalPath: "mundane",
    editionCode: "sr5",
    attributes: {
      body: 4,
      agility: 4,
      reaction: 5,
      strength: 3,
      willpower: 4,
      logic: 5,
      intuition: 5,
      charisma: 2,
    },
    specialAttributes: {
      edge: 3,
      essence: 3.8,
    },
    skills: {
      "pilot-ground-craft": 6,
      "pilot-aircraft": 4,
      gunnery: 5,
      perception: 4,
      "electronic-warfare": 3,
      computer: 3,
    },
    cyberware: [
      {
        catalogId: "control-rig",
        name: "Control Rig",
        category: "headware" as const,
        grade: "standard" as const,
        baseEssenceCost: 1.0,
        essenceCost: 1.0,
        rating: 2,
        cost: 97000,
        availability: 12,
      },
    ],
    rccs: [MOCK_RCC],
    drones: [MOCK_DRONE, MOCK_DRONE_WITH_AUTOSOFTS],
    vehicles: [MOCK_VEHICLE],
    autosofts: [MOCK_AUTOSOFT_PERCEPTION, MOCK_AUTOSOFT_COMBAT, MOCK_AUTOSOFT_MOVEMENT],
    ...overrides,
  });
}
