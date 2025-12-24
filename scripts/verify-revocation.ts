#!/usr/bin/env npx tsx

/**
 * Diagnostic tool to verify session revocation
 * 
 * Usage:
 *   npx tsx scripts/verify-revocation.ts <userId>
 */

import { incrementSessionVersion, getUserById } from "../lib/storage/users";

async function testRevocation(userId: string): Promise<void> {
  console.log(`Testing Global Revocation for user: ${userId}...`);
  
  try {
    const user1 = await getUserById(userId);
    if (!user1) {
      console.log(`Error: User with ID "${userId}" not found.`);
      process.exit(1);
    }
    
    console.log("Current sessionVersion:", user1.sessionVersion);
    console.log("Incrementing sessionVersion...");
    
    await incrementSessionVersion(userId);
    
    const user2 = await getUserById(userId);
    if (!user2) {
      console.error("Error: User disappeared after update!");
      process.exit(1);
    }
    
    console.log("New sessionVersion:", user2.sessionVersion);
    
    if (user2.sessionVersion === (user1.sessionVersion || 0) + 1) {
      console.log("✓ SUCCESS: Session version incremented correctly.");
    } else {
      console.log("✗ FAILURE: Session version did not increment as expected.");
      process.exit(1);
    }
  } catch (error) {
    console.error("Test failed with error:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const userId = args[0] || "b93e21d4-0d8e-44e8-98f0-d4d7a2942e91"; // Default to user's ID from logs if not provided

  await testRevocation(userId);
}

main();
