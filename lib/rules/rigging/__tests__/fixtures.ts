/**
 * Test fixtures for rigging module tests
 *
 * Provides reusable test data factories for all rigging-related tests.
 */

import type {
  Character,
  CharacterRCC,
  CharacterDrone,
  CharacterAutosoft,
  CyberwareItem,
} from "@/lib/types/character";
import type {
  RiggingState,
  DroneNetwork,
  SlavedDrone,
  SharedAutosoft,
  InstalledAutosoft,
  VehicleControlRig,
  JumpedInState,
  RCCConfiguration,
  RiggerVRMode,
  RunningAutosoft,
} from "@/lib/types/rigging";
import type { AutosoftCategory } from "@/lib/types/vehicles";

// =============================================================================
// CHARACTER FIXTURES
// =============================================================================

/**
 * Create a minimal test character for rigging tests
 */
export function createTestCharacter(
  overrides: Partial<Character> & {
    reaction?: number;
    intuition?: number;
    willpower?: number;
    body?: number;
    hasVCR?: boolean;
    vcrRating?: number;
    hasDrones?: boolean;
    hasRCC?: boolean;
  } = {}
): Character {
  const {
    reaction = 4,
    intuition = 4,
    willpower = 4,
    body = 4,
    hasVCR = false,
    vcrRating = 2,
    hasDrones = false,
    hasRCC = false,
    ...rest
  } = overrides;

  const cyberware: CyberwareItem[] = [];
  if (hasVCR) {
    cyberware.push({
      id: "vcr-1",
      catalogId: "vehicle-control-rig-2",
      name: `Vehicle Control Rig Rating ${vcrRating}`,
      category: "bodyware",
      grade: "standard",
      rating: vcrRating,
      baseEssenceCost: vcrRating,
      essenceCost: vcrRating,
      cost: 43000 * vcrRating,
      availability: 8 + vcrRating * 4,
    });
  }

  const drones: CharacterDrone[] = [];
  if (hasDrones) {
    drones.push(
      createTestCharacterDrone("drone-1", { name: "Test Drone 1" }),
      createTestCharacterDrone("drone-2", { name: "Test Drone 2" })
    );
  }

  const rccs: CharacterRCC[] = [];
  if (hasRCC) {
    rccs.push(createTestCharacterRCC("rcc-1"));
  }

  return {
    id: "test-char-1",
    ownerId: "test-user-1",
    editionId: "sr5",
    editionCode: "sr5",
    creationMethodId: "priority",
    rulesetSnapshotId: "test-snapshot-id",
    attachedBookIds: ["core"],
    name: "Test Rigger",
    metatype: "Human",
    status: "active",
    attributes: {
      body,
      agility: 4,
      reaction,
      strength: 3,
      willpower,
      logic: 4,
      intuition,
      charisma: 3,
    },
    specialAttributes: {
      edge: 3,
      essence: hasVCR ? 6 - vcrRating : 6,
    },
    skills: {
      pilot_ground_craft: 4,
      pilot_aircraft: 3,
      gunnery: 3,
      perception: 4,
    },
    positiveQualities: [],
    negativeQualities: [],
    magicalPath: "mundane",
    nuyen: 5000,
    startingNuyen: 5000,
    gear: [],
    contacts: [],
    derivedStats: {},
    condition: { physicalDamage: 0, stunDamage: 0 },
    karmaTotal: 0,
    karmaCurrent: 0,
    karmaSpentAtCreation: 0,
    createdAt: new Date().toISOString(),
    cyberware,
    rccs,
    drones,
    autosofts: [],
    ...rest,
  } as Character;
}

// =============================================================================
// RCC FIXTURES
// =============================================================================

/**
 * Create a test CharacterRCC
 */
export function createTestCharacterRCC(
  id: string = "rcc-1",
  overrides: Partial<CharacterRCC> = {}
): CharacterRCC {
  return {
    id,
    catalogId: "mct-drone-web",
    name: "MCT Drone Web",
    deviceRating: 4,
    dataProcessing: 4,
    firewall: 3,
    cost: 23000,
    availability: 8,
    runningAutosofts: [],
    ...overrides,
  };
}

/**
 * Create a test RCCConfiguration
 */
export function createTestRCCConfiguration(
  overrides: Partial<RCCConfiguration> = {}
): RCCConfiguration {
  return {
    rccId: "rcc-1",
    name: "MCT Drone Web",
    deviceRating: 4,
    dataProcessing: 4,
    firewall: 3,
    maxSlavedDrones: 12, // DP 4 × 3 = 12
    slavedDroneIds: [],
    runningAutosofts: [],
    noiseReduction: 4,
    sharingBonus: 3,
    ...overrides,
  };
}

// =============================================================================
// VCR FIXTURES
// =============================================================================

/**
 * Create a test VehicleControlRig
 */
export function createTestVCR(rating: number = 2): VehicleControlRig {
  return {
    rating,
    controlBonus: rating,
    initiativeDiceBonus: rating,
    essenceCost: rating,
    grade: "standard",
    catalogId: `vehicle-control-rig-${rating}`,
  };
}

/**
 * Create a test cyberware item that is a VCR
 */
export function createTestVCRCyberware(
  rating: number = 2,
  overrides: Partial<CyberwareItem> = {}
): CyberwareItem {
  return {
    id: `vcr-${rating}`,
    catalogId: "vehicle-control-rig-2",
    name: `Vehicle Control Rig Rating ${rating}`,
    category: "bodyware",
    grade: "standard",
    rating,
    baseEssenceCost: rating,
    essenceCost: rating,
    cost: 43000 * rating,
    availability: 8 + rating * 4,
    ...overrides,
  };
}

// =============================================================================
// DRONE FIXTURES
// =============================================================================

/**
 * Create a test CharacterDrone
 */
export function createTestCharacterDrone(
  id: string = "drone-1",
  overrides: Partial<CharacterDrone> = {}
): CharacterDrone {
  return {
    id,
    catalogId: "mct-fly-spy",
    name: "MCT Fly-Spy",
    size: "mini",
    body: 1,
    handling: 4,
    pilot: 3,
    sensor: 3,
    speed: 3,
    acceleration: 2,
    armor: 0,
    cost: 2000,
    availability: 6,
    installedAutosofts: [],
    ...overrides,
  };
}

/**
 * Create a test SlavedDrone
 */
export function createTestSlavedDrone(
  droneId: string = "drone-1",
  overrides: Partial<SlavedDrone> = {}
): SlavedDrone {
  return {
    droneId,
    catalogId: "mct-fly-spy",
    name: "MCT Fly-Spy",
    pilotRating: 3,
    controlMode: "remote",
    isJumpedIn: false,
    conditionDamageTaken: 0,
    conditionMonitorMax: 9, // ceil(1/2) + 8 = 9 for Body 1
    distanceFromRigger: 0,
    noisePenalty: 0,
    installedAutosofts: [],
    ...overrides,
  };
}

/**
 * Create a test drone network
 */
export function createTestDroneNetwork(overrides: Partial<DroneNetwork> = {}): DroneNetwork {
  return {
    networkId: "network-1",
    rccId: "rcc-1",
    slavedDrones: [],
    maxDrones: 12,
    sharedAutosofts: [],
    baseNoise: 0,
    ...overrides,
  };
}

// =============================================================================
// AUTOSOFT FIXTURES
// =============================================================================

/**
 * Create a test CharacterAutosoft
 */
export function createTestCharacterAutosoft(
  id: string = "autosoft-1",
  overrides: Partial<CharacterAutosoft> = {}
): CharacterAutosoft {
  return {
    id,
    catalogId: "maneuvering-4",
    name: "Maneuvering",
    rating: 4,
    category: "movement" as AutosoftCategory,
    cost: 2000,
    availability: 8,
    ...overrides,
  };
}

/**
 * Create a test SharedAutosoft
 */
export function createTestSharedAutosoft(overrides: Partial<SharedAutosoft> = {}): SharedAutosoft {
  return {
    autosoftId: "maneuvering-4",
    name: "Maneuvering",
    rating: 4,
    category: "movement" as AutosoftCategory,
    ...overrides,
  };
}

/**
 * Create a test InstalledAutosoft
 */
export function createTestInstalledAutosoft(
  overrides: Partial<InstalledAutosoft> = {}
): InstalledAutosoft {
  return {
    autosoftId: "clearsight-3",
    name: "Clearsight",
    rating: 3,
    category: "perception" as AutosoftCategory,
    ...overrides,
  };
}

/**
 * Create a test RunningAutosoft
 */
export function createTestRunningAutosoft(
  overrides: Partial<RunningAutosoft> = {}
): RunningAutosoft {
  return {
    autosoftId: "maneuvering-4",
    name: "Maneuvering",
    rating: 4,
    category: "movement" as AutosoftCategory,
    ...overrides,
  };
}

// =============================================================================
// RIGGING STATE FIXTURES
// =============================================================================

/**
 * Create a test rigging state
 */
export function createTestRiggingState(
  overrides: Partial<RiggingState> & {
    vcrRating?: number;
    isJumpedIn?: boolean;
    vrMode?: RiggerVRMode;
    targetId?: string;
    targetType?: "vehicle" | "drone";
    targetName?: string;
  } = {}
): RiggingState {
  const {
    vcrRating = 2,
    isJumpedIn = false,
    vrMode = "cold-sim",
    targetId = "vehicle-1",
    targetType = "vehicle",
    targetName = "Test Vehicle",
    ...rest
  } = overrides;

  const vcr = createTestVCR(vcrRating);

  let jumpedInState: JumpedInState | undefined;
  if (isJumpedIn) {
    jumpedInState = createTestJumpedInState({
      targetId,
      targetType,
      targetName,
      vrMode,
      vcrRating,
    });
  }

  return {
    sessionId: "session-1",
    characterId: "test-char-1",
    startedAt: new Date().toISOString(),
    vcr,
    biofeedbackDamageTaken: 0,
    biofeedbackDamageType: vrMode === "hot-sim" ? "physical" : "stun",
    isActive: true,
    jumpedInState,
    ...rest,
  };
}

/**
 * Create a test JumpedInState
 */
export function createTestJumpedInState(
  overrides: Partial<JumpedInState> & {
    vcrRating?: number;
  } = {}
): JumpedInState {
  const { vcrRating = 2, ...rest } = overrides;

  return {
    isActive: true,
    targetId: "vehicle-1",
    targetType: "vehicle",
    targetName: "Test Vehicle",
    vrMode: "cold-sim",
    jumpedInAt: new Date().toISOString(),
    vcrRating,
    controlBonus: vcrRating,
    initiativeDiceBonus: vcrRating === 2 ? 1 : vcrRating, // hot-sim gets +2
    bodyVulnerable: true,
    ...rest,
  };
}

// =============================================================================
// NOISE CALCULATION FIXTURES
// =============================================================================

/**
 * Create test environment modifiers for noise calculation
 */
export function createTestEnvironment(
  spamZone: "none" | "light" | "medium" | "heavy" = "none",
  staticZone: "none" | "light" | "medium" | "heavy" = "none"
): {
  spamZone: "none" | "light" | "medium" | "heavy";
  staticZone: "none" | "light" | "medium" | "heavy";
} {
  return { spamZone, staticZone };
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Create multiple test drones for network tests
 */
export function createTestDroneSet(count: number): SlavedDrone[] {
  return Array.from({ length: count }, (_, i) =>
    createTestSlavedDrone(`drone-${i + 1}`, {
      name: `Test Drone ${i + 1}`,
      catalogId: `test-drone-${i + 1}`,
    })
  );
}

/**
 * Create a test drone with specific damage
 */
export function createTestDamagedDrone(damage: number, conditionMax: number = 10): SlavedDrone {
  return createTestSlavedDrone("damaged-drone", {
    conditionDamageTaken: damage,
    conditionMonitorMax: conditionMax,
  });
}

/**
 * Create a network with pre-slaved drones
 */
export function createNetworkWithDrones(droneCount: number, maxDrones: number = 12): DroneNetwork {
  return createTestDroneNetwork({
    slavedDrones: createTestDroneSet(droneCount),
    maxDrones,
  });
}
