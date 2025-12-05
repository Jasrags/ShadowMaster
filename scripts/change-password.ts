#!/usr/bin/env npx tsx

/**
 * CLI utility to change a user's password
 *
 * Usage:
 *   npx tsx scripts/change-password.ts <email> <new-password>
 *   npx tsx scripts/change-password.ts --help
 *
 * Examples:
 *   npx tsx scripts/change-password.ts user@example.com newSecurePassword123
 *   npx tsx scripts/change-password.ts admin@shadowrun.com MyNewP@ssw0rd!
 */

import { hashPassword } from "../lib/auth/password";
import { getUserByEmail, updateUser } from "../lib/storage/users";

const USAGE = `
Usage: npx tsx scripts/change-password.ts <email> <new-password>

Arguments:
  email           The email address of the user whose password you want to change
  new-password    The new password to set for the user

Options:
  --help, -h      Show this help message

Examples:
  npx tsx scripts/change-password.ts user@example.com newSecurePassword123
  npx tsx scripts/change-password.ts admin@shadowrun.com "My New P@ssw0rd!"

Note: If your password contains special characters or spaces, wrap it in quotes.
`;

async function changePassword(
  email: string,
  newPassword: string
): Promise<void> {
  // Validate inputs
  if (!email || !newPassword) {
    console.error("Error: Both email and new password are required.");
    console.log(USAGE);
    process.exit(1);
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.error(`Error: "${email}" does not appear to be a valid email address.`);
    process.exit(1);
  }

  // Password strength check (optional but recommended)
  if (newPassword.length < 8) {
    console.error("Error: Password must be at least 8 characters long.");
    process.exit(1);
  }

  console.log(`Looking up user with email: ${email}...`);

  // Find user by email
  const user = await getUserByEmail(email);

  if (!user) {
    console.error(`Error: No user found with email "${email}".`);
    process.exit(1);
  }

  console.log(`Found user: ${user.username} (ID: ${user.id})`);
  console.log("Hashing new password...");

  // Hash the new password using the same method as the app
  const passwordHash = await hashPassword(newPassword);

  console.log("Updating user record...");

  // Update the user with the new password hash
  await updateUser(user.id, { passwordHash });

  console.log(`✓ Password successfully changed for user "${user.username}" (${email}).`);
}

// Main execution
async function main(): Promise<void> {
  const args = process.argv.slice(2);

  // Check for help flag
  if (args.includes("--help") || args.includes("-h") || args.length === 0) {
    console.log(USAGE);
    process.exit(args.length === 0 ? 1 : 0);
  }

  const [email, newPassword] = args;

  if (!newPassword) {
    console.error("Error: Missing new password argument.");
    console.log(USAGE);
    process.exit(1);
  }

  try {
    await changePassword(email, newPassword);
  } catch (error) {
    console.error("Error changing password:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();

