#!/usr/bin/env npx tsx

/**
 * Seed data utility for Shadow Master development
 *
 * Creates sample users, characters, and campaigns for testing and development.
 *
 * Usage:
 *   npx tsx scripts/seed-data.ts [--clean] [--dry-run]
 *   npx tsx scripts/seed-data.ts --help
 *
 * Examples:
 *   npx tsx scripts/seed-data.ts
 *   npx tsx scripts/seed-data.ts --clean
 *   npx tsx scripts/seed-data.ts --dry-run
 */

import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { hashPassword } from "../lib/auth/password";

const DATA_DIR = path.join(process.cwd(), "data");

const USAGE = `
Shadow Master Seed Data Utility

Creates sample data for development and testing.

Usage:
  npx tsx scripts/seed-data.ts [options]

Options:
  --clean             Remove existing user data before seeding
  --dry-run           Show what would be created without making changes
  --minimal           Create minimal seed data (1 user, 1 character)
  --help, -h          Show this help message

Examples:
  npx tsx scripts/seed-data.ts
  npx tsx scripts/seed-data.ts --clean
  npx tsx scripts/seed-data.ts --dry-run
  npx tsx scripts/seed-data.ts --minimal

Default seed data includes:
  - 3 users (admin, player, gm)
  - 6 characters (various metatypes and statuses)
  - 2 campaigns

All users have password: "password123"
`;

interface SeedUser {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  role: string[];
  createdAt: string;
  lastLogin: string | null;
  characters: string[];
  preferences: {
    theme: string;
    navigationCollapsed: boolean;
  };
  failedLoginAttempts: number;
  lockoutUntil: string | null;
  sessionVersion: number;
  accountStatus: string;
  statusChangedAt: string | null;
  statusChangedBy: string | null;
  statusReason: string | null;
  lastRoleChangeAt: string | null;
  lastRoleChangeBy: string | null;
}

interface SeedCharacter {
  id: string;
  ownerId: string;
  editionId: string;
  editionCode: string;
  creationMethodId: string;
  status: string;
  name: string;
  metatype?: string;
  magicalPath: string;
  createdAt: string;
  updatedAt: string;
  campaignId?: string;
  attributes: Record<string, number>;
  specialAttributes: {
    edge: number;
    essence: number;
    magic?: number;
    resonance?: number;
  };
  skills: Record<string, number>;
  positiveQualities: string[];
  negativeQualities: string[];
  nuyen: number;
  startingNuyen: number;
  gear: unknown[];
  contacts: unknown[];
  derivedStats: Record<string, unknown>;
  condition: {
    physicalDamage: number;
    stunDamage: number;
  };
  karmaTotal: number;
  karmaCurrent: number;
  karmaSpentAtCreation: number;
  attachedBookIds: string[];
}

interface SeedCampaign {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  gmIds: string[];
  playerIds: string[];
  characterIds: string[];
  status: string;
  editionCode: string;
  createdAt: string;
  updatedAt: string;
  settings: {
    allowedBooks: string[];
    houseRules: string[];
  };
}

/**
 * Write JSON file
 */
async function writeJsonFile(filePath: string, data: unknown): Promise<void> {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

/**
 * Delete directory recursively
 */
async function deleteDirectory(dirPath: string): Promise<void> {
  try {
    await fs.rm(dirPath, { recursive: true, force: true });
  } catch {
    // Directory might not exist
  }
}

/**
 * Generate seed users
 */
async function generateUsers(passwordHash: string): Promise<SeedUser[]> {
  const now = new Date().toISOString();

  return [
    {
      id: uuidv4(),
      email: "admin@shadowmaster.test",
      username: "admin",
      passwordHash,
      role: ["administrator"],
      createdAt: now,
      lastLogin: now,
      characters: [],
      preferences: { theme: "system", navigationCollapsed: false },
      failedLoginAttempts: 0,
      lockoutUntil: null,
      sessionVersion: 1,
      accountStatus: "active",
      statusChangedAt: null,
      statusChangedBy: null,
      statusReason: null,
      lastRoleChangeAt: null,
      lastRoleChangeBy: null,
    },
    {
      id: uuidv4(),
      email: "player@shadowmaster.test",
      username: "player",
      passwordHash,
      role: ["user"],
      createdAt: now,
      lastLogin: null,
      characters: [],
      preferences: { theme: "system", navigationCollapsed: false },
      failedLoginAttempts: 0,
      lockoutUntil: null,
      sessionVersion: 1,
      accountStatus: "active",
      statusChangedAt: null,
      statusChangedBy: null,
      statusReason: null,
      lastRoleChangeAt: null,
      lastRoleChangeBy: null,
    },
    {
      id: uuidv4(),
      email: "gm@shadowmaster.test",
      username: "gamemaster",
      passwordHash,
      role: ["user", "gamemaster"],
      createdAt: now,
      lastLogin: null,
      characters: [],
      preferences: { theme: "system", navigationCollapsed: false },
      failedLoginAttempts: 0,
      lockoutUntil: null,
      sessionVersion: 1,
      accountStatus: "active",
      statusChangedAt: null,
      statusChangedBy: null,
      statusReason: null,
      lastRoleChangeAt: null,
      lastRoleChangeBy: null,
    },
  ];
}

/**
 * Generate seed characters
 */
function generateCharacters(users: SeedUser[], campaignIds: string[]): SeedCharacter[] {
  const now = new Date().toISOString();
  const adminId = users.find((u) => u.username === "admin")!.id;
  const playerId = users.find((u) => u.username === "player")!.id;

  const baseCharacter = {
    editionId: "sr5",
    editionCode: "sr5" as const,
    creationMethodId: "priority",
    createdAt: now,
    updatedAt: now,
    nuyen: 5000,
    startingNuyen: 50000,
    gear: [],
    contacts: [],
    derivedStats: {},
    condition: { physicalDamage: 0, stunDamage: 0 },
    karmaSpentAtCreation: 0,
    attachedBookIds: ["sr5-core"],
  };

  return [
    // Admin's characters
    {
      ...baseCharacter,
      id: uuidv4(),
      ownerId: adminId,
      status: "active",
      name: "Razor",
      metatype: "Human",
      magicalPath: "mundane",
      attributes: {
        body: 4,
        agility: 5,
        reaction: 4,
        strength: 3,
        willpower: 3,
        logic: 3,
        intuition: 4,
        charisma: 3,
      },
      specialAttributes: { edge: 4, essence: 6 },
      skills: { firearms: 5, sneaking: 4, perception: 3, athletics: 3 },
      positiveQualities: ["ambidextrous"],
      negativeQualities: ["sinner-national"],
      karmaTotal: 25,
      karmaCurrent: 10,
    },
    {
      ...baseCharacter,
      id: uuidv4(),
      ownerId: adminId,
      status: "active",
      name: "Mystic",
      metatype: "Elf",
      magicalPath: "magician",
      attributes: {
        body: 2,
        agility: 4,
        reaction: 3,
        strength: 2,
        willpower: 5,
        logic: 4,
        intuition: 5,
        charisma: 4,
      },
      specialAttributes: { edge: 2, essence: 6, magic: 6 },
      skills: { spellcasting: 6, counterspelling: 4, assensing: 5, arcana: 4 },
      positiveQualities: ["magician"],
      negativeQualities: ["elf-poser"],
      karmaTotal: 50,
      karmaCurrent: 20,
      campaignId: campaignIds[0],
    },

    // Player's characters
    {
      ...baseCharacter,
      id: uuidv4(),
      ownerId: playerId,
      status: "draft",
      name: "Street Samurai WIP",
      metatype: "Ork",
      magicalPath: "mundane",
      attributes: {
        body: 6,
        agility: 4,
        reaction: 4,
        strength: 5,
        willpower: 3,
        logic: 2,
        intuition: 3,
        charisma: 2,
      },
      specialAttributes: { edge: 2, essence: 3.5 },
      skills: { blades: 5, firearms: 4, unarmed: 4 },
      positiveQualities: [],
      negativeQualities: [],
      karmaTotal: 0,
      karmaCurrent: 0,
    },
    {
      ...baseCharacter,
      id: uuidv4(),
      ownerId: playerId,
      status: "active",
      name: "Decker Prime",
      metatype: "Human",
      magicalPath: "technomancer",
      attributes: {
        body: 2,
        agility: 3,
        reaction: 4,
        strength: 2,
        willpower: 4,
        logic: 6,
        intuition: 5,
        charisma: 2,
      },
      specialAttributes: { edge: 3, essence: 6, resonance: 5 },
      skills: { hacking: 6, cybercombat: 5, "electronic-warfare": 5, software: 4 },
      positiveQualities: ["technomancer"],
      negativeQualities: ["weak-immune-system"],
      karmaTotal: 30,
      karmaCurrent: 15,
      campaignId: campaignIds[0],
    },
    {
      ...baseCharacter,
      id: uuidv4(),
      ownerId: playerId,
      status: "retired",
      name: "Old Timer",
      metatype: "Dwarf",
      magicalPath: "mundane",
      attributes: {
        body: 5,
        agility: 3,
        reaction: 3,
        strength: 4,
        willpower: 5,
        logic: 4,
        intuition: 4,
        charisma: 3,
      },
      specialAttributes: { edge: 3, essence: 2.1 },
      skills: { negotiation: 5, etiquette: 4, leadership: 4, firearms: 3 },
      positiveQualities: ["toughness"],
      negativeQualities: ["addiction-mild"],
      karmaTotal: 150,
      karmaCurrent: 5,
    },
    {
      ...baseCharacter,
      id: uuidv4(),
      ownerId: playerId,
      status: "deceased",
      name: "Ghost",
      metatype: "Troll",
      magicalPath: "adept",
      attributes: {
        body: 7,
        agility: 3,
        reaction: 3,
        strength: 6,
        willpower: 3,
        logic: 2,
        intuition: 3,
        charisma: 2,
      },
      specialAttributes: { edge: 2, essence: 6, magic: 4 },
      skills: { sneaking: 6, perception: 5, unarmed: 5, athletics: 4 },
      positiveQualities: ["adept"],
      negativeQualities: ["distinctive-style"],
      karmaTotal: 75,
      karmaCurrent: 0,
    },
  ];
}

/**
 * Generate seed campaigns
 */
function generateCampaigns(users: SeedUser[]): SeedCampaign[] {
  const now = new Date().toISOString();
  const adminId = users.find((u) => u.username === "admin")!.id;
  const gmId = users.find((u) => u.username === "gamemaster")!.id;
  const playerId = users.find((u) => u.username === "player")!.id;

  return [
    {
      id: uuidv4(),
      name: "Seattle Shadows",
      description: "A classic Seattle campaign exploring the dark underbelly of the sprawl.",
      ownerId: gmId,
      gmIds: [gmId],
      playerIds: [adminId, playerId],
      characterIds: [],
      status: "active",
      editionCode: "sr5",
      createdAt: now,
      updatedAt: now,
      settings: {
        allowedBooks: ["sr5-core", "sr5-run-and-gun"],
        houseRules: ["No edge rerolls", "Threshold 5 for called shots"],
      },
    },
    {
      id: uuidv4(),
      name: "Corporate Extraction",
      description: "High-stakes corporate espionage in Neo-Tokyo.",
      ownerId: adminId,
      gmIds: [adminId],
      playerIds: [],
      characterIds: [],
      status: "planning",
      editionCode: "sr5",
      createdAt: now,
      updatedAt: now,
      settings: {
        allowedBooks: ["sr5-core"],
        houseRules: [],
      },
    },
  ];
}

/**
 * Generate minimal seed data
 */
async function generateMinimalData(passwordHash: string): Promise<{
  users: SeedUser[];
  characters: SeedCharacter[];
  campaigns: SeedCampaign[];
}> {
  const now = new Date().toISOString();

  const users: SeedUser[] = [
    {
      id: uuidv4(),
      email: "test@shadowmaster.test",
      username: "testuser",
      passwordHash,
      role: ["administrator"],
      createdAt: now,
      lastLogin: null,
      characters: [],
      preferences: { theme: "system", navigationCollapsed: false },
      failedLoginAttempts: 0,
      lockoutUntil: null,
      sessionVersion: 1,
      accountStatus: "active",
      statusChangedAt: null,
      statusChangedBy: null,
      statusReason: null,
      lastRoleChangeAt: null,
      lastRoleChangeBy: null,
    },
  ];

  const characters: SeedCharacter[] = [
    {
      id: uuidv4(),
      ownerId: users[0].id,
      editionId: "sr5",
      editionCode: "sr5",
      creationMethodId: "priority",
      status: "active",
      name: "Test Runner",
      metatype: "Human",
      magicalPath: "mundane",
      createdAt: now,
      updatedAt: now,
      attributes: {
        body: 3,
        agility: 3,
        reaction: 3,
        strength: 3,
        willpower: 3,
        logic: 3,
        intuition: 3,
        charisma: 3,
      },
      specialAttributes: { edge: 3, essence: 6 },
      skills: { firearms: 3, athletics: 3, perception: 3 },
      positiveQualities: [],
      negativeQualities: [],
      nuyen: 5000,
      startingNuyen: 50000,
      gear: [],
      contacts: [],
      derivedStats: {},
      condition: { physicalDamage: 0, stunDamage: 0 },
      karmaTotal: 0,
      karmaCurrent: 0,
      karmaSpentAtCreation: 0,
      attachedBookIds: ["sr5-core"],
    },
  ];

  return { users, characters, campaigns: [] };
}

/**
 * Seed the database
 */
async function seedData(clean: boolean, dryRun: boolean, minimal: boolean): Promise<void> {
  console.log("\nShadow Master Seed Data");
  console.log("=".repeat(50));

  if (dryRun) {
    console.log("\n[DRY RUN] No changes will be made\n");
  }

  // Clean existing data if requested
  if (clean) {
    console.log("Cleaning existing data...");
    if (!dryRun) {
      await deleteDirectory(path.join(DATA_DIR, "users"));
      await deleteDirectory(path.join(DATA_DIR, "characters"));
      await deleteDirectory(path.join(DATA_DIR, "campaigns"));
    }
    console.log("  Removed users, characters, and campaigns directories");
  }

  // Generate password hash (same for all seed users)
  console.log("\nGenerating seed data...");
  const passwordHash = await hashPassword("password123");

  let users: SeedUser[];
  let characters: SeedCharacter[];
  let campaigns: SeedCampaign[];

  if (minimal) {
    const data = await generateMinimalData(passwordHash);
    users = data.users;
    characters = data.characters;
    campaigns = data.campaigns;
  } else {
    users = await generateUsers(passwordHash);
    campaigns = generateCampaigns(users);
    characters = generateCharacters(
      users,
      campaigns.map((c) => c.id)
    );

    // Update campaign character IDs
    for (const char of characters) {
      if (char.campaignId) {
        const campaign = campaigns.find((c) => c.id === char.campaignId);
        if (campaign) {
          campaign.characterIds.push(char.id);
        }
      }
    }

    // Update user character arrays
    for (const char of characters) {
      const user = users.find((u) => u.id === char.ownerId);
      if (user) {
        user.characters.push(char.id);
      }
    }
  }

  // Print what will be created
  console.log("\nData to create:");
  console.log(`  Users: ${users.length}`);
  for (const user of users) {
    console.log(`    - ${user.username} (${user.email}) [${user.role.join(", ")}]`);
  }

  console.log(`  Characters: ${characters.length}`);
  for (const char of characters) {
    const owner = users.find((u) => u.id === char.ownerId);
    console.log(
      `    - ${char.name} (${char.metatype || "Unknown"}) [${char.status}] - Owner: ${owner?.username}`
    );
  }

  console.log(`  Campaigns: ${campaigns.length}`);
  for (const campaign of campaigns) {
    const owner = users.find((u) => u.id === campaign.ownerId);
    console.log(`    - ${campaign.name} [${campaign.status}] - GM: ${owner?.username}`);
  }

  if (dryRun) {
    console.log("\n[DRY RUN] No files were created");
    return;
  }

  // Create directories
  await fs.mkdir(path.join(DATA_DIR, "users"), { recursive: true });
  await fs.mkdir(path.join(DATA_DIR, "characters"), { recursive: true });
  await fs.mkdir(path.join(DATA_DIR, "campaigns"), { recursive: true });

  // Write users
  console.log("\nCreating users...");
  for (const user of users) {
    const filePath = path.join(DATA_DIR, "users", `${user.id}.json`);
    await writeJsonFile(filePath, user);
    console.log(`  Created: ${user.username}`);
  }

  // Write characters
  console.log("\nCreating characters...");
  for (const char of characters) {
    const charDir = path.join(DATA_DIR, "characters", char.ownerId);
    await fs.mkdir(charDir, { recursive: true });
    const filePath = path.join(charDir, `${char.id}.json`);
    await writeJsonFile(filePath, char);
    console.log(`  Created: ${char.name}`);
  }

  // Write campaigns
  console.log("\nCreating campaigns...");
  for (const campaign of campaigns) {
    const filePath = path.join(DATA_DIR, "campaigns", `${campaign.id}.json`);
    await writeJsonFile(filePath, campaign);
    console.log(`  Created: ${campaign.name}`);
  }

  console.log(`
Seed data created successfully!

Login credentials (all users):
  Password: password123

Users created:
${users.map((u) => `  - ${u.email}`).join("\n")}
`);
}

/**
 * Parse command line arguments
 */
function parseArgs(args: string[]): {
  clean: boolean;
  dryRun: boolean;
  minimal: boolean;
  help: boolean;
} {
  return {
    clean: args.includes("--clean"),
    dryRun: args.includes("--dry-run"),
    minimal: args.includes("--minimal"),
    help: args.includes("--help") || args.includes("-h"),
  };
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const { clean, dryRun, minimal, help } = parseArgs(args);

  if (help) {
    console.log(USAGE);
    process.exit(0);
  }

  try {
    await seedData(clean, dryRun, minimal);
  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
