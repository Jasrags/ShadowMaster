#!/usr/bin/env npx tsx

/**
 * User administration utility for Shadow Master
 *
 * Usage:
 *   npx tsx scripts/user-admin.ts list [--json]
 *   npx tsx scripts/user-admin.ts info <email>
 *   npx tsx scripts/user-admin.ts create <email> <username> <password> [--role <role>]
 *   npx tsx scripts/user-admin.ts delete <email> [--force]
 *   npx tsx scripts/user-admin.ts change-password <email> <new-password>
 *   npx tsx scripts/user-admin.ts set-role <email> <roles...>
 *   npx tsx scripts/user-admin.ts suspend <email> [--reason <reason>]
 *   npx tsx scripts/user-admin.ts reactivate <email>
 *   npx tsx scripts/user-admin.ts --help
 *
 * Examples:
 *   npx tsx scripts/user-admin.ts list
 *   npx tsx scripts/user-admin.ts info admin@example.com
 *   npx tsx scripts/user-admin.ts create newuser@example.com newuser SecurePass123
 *   npx tsx scripts/user-admin.ts delete olduser@example.com --force
 *   npx tsx scripts/user-admin.ts change-password user@example.com NewPassword123
 *   npx tsx scripts/user-admin.ts set-role user@example.com user gamemaster
 */

import {
  getAllUsers,
  getUserByEmail,
  createUser,
  deleteUser,
  updateUser,
  suspendUser,
  reactivateUser,
  updateUserRoles,
} from "../lib/storage/users";
import { hashPassword } from "../lib/auth/password";
import type { User, UserRole } from "../lib/types/user";

const USAGE = `
Shadow Master User Administration

Usage:
  npx tsx scripts/user-admin.ts <command> [options]

Commands:
  list                           List all users
  info <email>                   Show detailed info for a user
  create <email> <user> <pass>   Create a new user
  delete <email>                 Delete a user
  change-password <email> <pass> Change a user's password
  set-role <email> <roles...>    Set user roles (user, gamemaster, administrator)
  suspend <email>                Suspend a user account
  reactivate <email>             Reactivate a suspended user

Options:
  --json               Output in JSON format (list, info commands)
  --force              Skip confirmation prompts (delete command)
  --role <role>        Initial role for new user (create command)
  --reason <reason>    Reason for suspension (suspend command)
  --help, -h           Show this help message

Examples:
  npx tsx scripts/user-admin.ts list
  npx tsx scripts/user-admin.ts list --json
  npx tsx scripts/user-admin.ts info admin@example.com
  npx tsx scripts/user-admin.ts create player@example.com player SecureP@ss123
  npx tsx scripts/user-admin.ts create gm@example.com gm SecureP@ss123 --role gamemaster
  npx tsx scripts/user-admin.ts delete olduser@example.com --force
  npx tsx scripts/user-admin.ts change-password user@example.com NewP@ssw0rd!
  npx tsx scripts/user-admin.ts set-role user@example.com user gamemaster
  npx tsx scripts/user-admin.ts suspend baduser@example.com --reason "Terms violation"
  npx tsx scripts/user-admin.ts reactivate user@example.com

Valid roles: user, gamemaster, administrator
`;

/**
 * Format date for display
 */
function formatDate(date: string | null): string {
  if (!date) return "Never";
  return new Date(date).toLocaleString();
}

/**
 * List all users
 */
async function listUsers(jsonOutput: boolean): Promise<void> {
  const users = await getAllUsers();

  if (jsonOutput) {
    const output = users.map((u) => ({
      id: u.id,
      email: u.email,
      username: u.username,
      roles: u.role,
      status: u.accountStatus,
      characterCount: u.characters?.length || 0,
      createdAt: u.createdAt,
      lastLogin: u.lastLogin,
    }));
    console.log(JSON.stringify(output, null, 2));
    return;
  }

  if (users.length === 0) {
    console.log("\nNo users found");
    return;
  }

  console.log(`\nFound ${users.length} user(s):\n`);
  console.log("EMAIL                              USERNAME         ROLES                STATUS    CHARS  LAST LOGIN");
  console.log("-".repeat(110));

  for (const user of users) {
    const roles = user.role.join(", ");
    const charCount = user.characters?.length || 0;
    const lastLogin = user.lastLogin
      ? new Date(user.lastLogin).toLocaleDateString()
      : "Never";

    console.log(
      `${user.email.padEnd(35)}${user.username.padEnd(17)}${roles.padEnd(21)}${(user.accountStatus || "active").padEnd(10)}${String(charCount).padEnd(7)}${lastLogin}`
    );
  }

  console.log();
}

/**
 * Show user info
 */
async function showUserInfo(email: string, jsonOutput: boolean): Promise<void> {
  const user = await getUserByEmail(email);

  if (!user) {
    console.error(`Error: User with email "${email}" not found`);
    process.exit(1);
  }

  if (jsonOutput) {
    console.log(JSON.stringify(user, null, 2));
    return;
  }

  console.log(`\nUser Information`);
  console.log("=".repeat(50));
  console.log(`  ID:              ${user.id}`);
  console.log(`  Email:           ${user.email}`);
  console.log(`  Username:        ${user.username}`);
  console.log(`  Roles:           ${user.role.join(", ")}`);
  console.log(`  Account Status:  ${user.accountStatus || "active"}`);
  console.log(`  Created:         ${formatDate(user.createdAt)}`);
  console.log(`  Last Login:      ${formatDate(user.lastLogin)}`);
  console.log(`  Characters:      ${user.characters?.length || 0}`);
  console.log(`  Session Version: ${user.sessionVersion || 1}`);

  if (user.lockoutUntil) {
    console.log(`  Locked Until:    ${formatDate(user.lockoutUntil)}`);
    console.log(`  Failed Attempts: ${user.failedLoginAttempts}`);
  }

  if (user.statusReason) {
    console.log(`  Status Reason:   ${user.statusReason}`);
    console.log(`  Status Changed:  ${formatDate(user.statusChangedAt)}`);
  }

  console.log();
}

/**
 * Create a new user
 */
async function createNewUser(
  email: string,
  username: string,
  password: string,
  role?: string
): Promise<void> {
  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.error(`Error: "${email}" is not a valid email address`);
    process.exit(1);
  }

  // Validate password
  if (password.length < 8) {
    console.error("Error: Password must be at least 8 characters long");
    process.exit(1);
  }

  // Check if user already exists
  const existing = await getUserByEmail(email);
  if (existing) {
    console.error(`Error: User with email "${email}" already exists`);
    process.exit(1);
  }

  // Hash password and create user
  console.log(`Creating user "${username}" (${email})...`);
  const passwordHash = await hashPassword(password);

  const user = await createUser({
    email,
    username,
    passwordHash,
  });

  // Set role if specified (and not default)
  if (role && role !== "user") {
    const validRoles: UserRole[] = ["user", "gamemaster", "administrator"];
    if (!validRoles.includes(role as UserRole)) {
      console.error(`Error: Invalid role "${role}". Valid roles: ${validRoles.join(", ")}`);
      process.exit(1);
    }

    await updateUser(user.id, { role: [role as UserRole] });
  }

  console.log(`
User created successfully!
  ID:       ${user.id}
  Email:    ${email}
  Username: ${username}
  Role:     ${role || "user"}
`);
}

/**
 * Delete a user
 */
async function deleteUserByEmail(email: string, force: boolean): Promise<void> {
  const user = await getUserByEmail(email);

  if (!user) {
    console.error(`Error: User with email "${email}" not found`);
    process.exit(1);
  }

  console.log(`\nUser to delete:`);
  console.log(`  Email:      ${user.email}`);
  console.log(`  Username:   ${user.username}`);
  console.log(`  Characters: ${user.characters?.length || 0}`);

  if (!force) {
    console.log(`
WARNING: This will permanently delete the user and ALL their characters!
Use --force to confirm deletion.

To proceed, run:
  npx tsx scripts/user-admin.ts delete ${email} --force
`);
    process.exit(0);
  }

  console.log(`\nDeleting user...`);
  await deleteUser(user.id);
  console.log(`User "${user.username}" (${email}) has been deleted.`);
}

/**
 * Change user password
 */
async function changePassword(email: string, newPassword: string): Promise<void> {
  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.error(`Error: "${email}" is not a valid email address`);
    process.exit(1);
  }

  // Validate password
  if (newPassword.length < 8) {
    console.error("Error: Password must be at least 8 characters long");
    process.exit(1);
  }

  // Find user
  const user = await getUserByEmail(email);
  if (!user) {
    console.error(`Error: User with email "${email}" not found`);
    process.exit(1);
  }

  console.log(`Changing password for user "${user.username}" (${email})...`);

  // Hash and update
  const passwordHash = await hashPassword(newPassword);
  await updateUser(user.id, { passwordHash });

  console.log(`Password changed successfully for "${user.username}".`);
}

/**
 * Set user roles
 */
async function setUserRoles(email: string, roles: string[]): Promise<void> {
  const user = await getUserByEmail(email);

  if (!user) {
    console.error(`Error: User with email "${email}" not found`);
    process.exit(1);
  }

  // Validate roles
  const validRoles: UserRole[] = ["user", "gamemaster", "administrator"];
  for (const role of roles) {
    if (!validRoles.includes(role as UserRole)) {
      console.error(`Error: Invalid role "${role}". Valid roles: ${validRoles.join(", ")}`);
      process.exit(1);
    }
  }

  // Use updateUserRoles for audit logging
  console.log(`Setting roles for "${user.username}" to: ${roles.join(", ")}...`);
  await updateUserRoles(user.id, roles as UserRole[], "cli-admin");

  console.log(`Roles updated successfully.`);
}

/**
 * Suspend a user
 */
async function suspendUserAccount(email: string, reason: string): Promise<void> {
  const user = await getUserByEmail(email);

  if (!user) {
    console.error(`Error: User with email "${email}" not found`);
    process.exit(1);
  }

  if (user.accountStatus === "suspended") {
    console.error(`Error: User "${user.username}" is already suspended`);
    process.exit(1);
  }

  console.log(`Suspending user "${user.username}" (${email})...`);
  await suspendUser(user.id, "cli-admin", reason || "Suspended via CLI");

  console.log(`User "${user.username}" has been suspended.`);
}

/**
 * Reactivate a user
 */
async function reactivateUserAccount(email: string): Promise<void> {
  const user = await getUserByEmail(email);

  if (!user) {
    console.error(`Error: User with email "${email}" not found`);
    process.exit(1);
  }

  if (user.accountStatus === "active") {
    console.error(`Error: User "${user.username}" is already active`);
    process.exit(1);
  }

  console.log(`Reactivating user "${user.username}" (${email})...`);
  await reactivateUser(user.id, "cli-admin");

  console.log(`User "${user.username}" has been reactivated.`);
}

/**
 * Parse command line arguments
 */
function parseArgs(args: string[]): {
  command: string;
  params: string[];
  json: boolean;
  force: boolean;
  role?: string;
  reason?: string;
  help: boolean;
} {
  const result = {
    command: "",
    params: [] as string[],
    json: false,
    force: false,
    role: undefined as string | undefined,
    reason: undefined as string | undefined,
    help: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === "--help" || arg === "-h") {
      result.help = true;
    } else if (arg === "--json") {
      result.json = true;
    } else if (arg === "--force") {
      result.force = true;
    } else if (arg === "--role") {
      result.role = args[++i];
    } else if (arg === "--reason") {
      result.reason = args[++i];
    } else if (!result.command) {
      result.command = arg;
    } else {
      result.params.push(arg);
    }
  }

  return result;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const { command, params, json, force, role, reason, help } = parseArgs(args);

  if (help || !command) {
    console.log(USAGE);
    process.exit(help ? 0 : 1);
  }

  try {
    switch (command) {
      case "list":
        await listUsers(json);
        break;

      case "info":
        if (!params[0]) {
          console.error("Error: Email is required");
          console.log("\nUsage: npx tsx scripts/user-admin.ts info <email>");
          process.exit(1);
        }
        await showUserInfo(params[0], json);
        break;

      case "create":
        if (params.length < 3) {
          console.error("Error: Email, username, and password are required");
          console.log("\nUsage: npx tsx scripts/user-admin.ts create <email> <username> <password>");
          process.exit(1);
        }
        await createNewUser(params[0], params[1], params[2], role);
        break;

      case "delete":
        if (!params[0]) {
          console.error("Error: Email is required");
          console.log("\nUsage: npx tsx scripts/user-admin.ts delete <email>");
          process.exit(1);
        }
        await deleteUserByEmail(params[0], force);
        break;

      case "change-password":
        if (params.length < 2) {
          console.error("Error: Email and new password are required");
          console.log("\nUsage: npx tsx scripts/user-admin.ts change-password <email> <new-password>");
          process.exit(1);
        }
        await changePassword(params[0], params[1]);
        break;

      case "set-role":
        if (params.length < 2) {
          console.error("Error: Email and at least one role are required");
          console.log("\nUsage: npx tsx scripts/user-admin.ts set-role <email> <roles...>");
          process.exit(1);
        }
        await setUserRoles(params[0], params.slice(1));
        break;

      case "suspend":
        if (!params[0]) {
          console.error("Error: Email is required");
          console.log("\nUsage: npx tsx scripts/user-admin.ts suspend <email>");
          process.exit(1);
        }
        await suspendUserAccount(params[0], reason || "");
        break;

      case "reactivate":
        if (!params[0]) {
          console.error("Error: Email is required");
          console.log("\nUsage: npx tsx scripts/user-admin.ts reactivate <email>");
          process.exit(1);
        }
        await reactivateUserAccount(params[0]);
        break;

      default:
        console.error(`Error: Unknown command '${command}'`);
        console.log(USAGE);
        process.exit(1);
    }
  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
