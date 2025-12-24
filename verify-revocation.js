
import { incrementSessionVersion, getUserById } from "./lib/storage/users.js";

async function testRevocation() {
  const userId = "test-user-revocation";
  // This assumes the user exists or we create one
  console.log("Testing Global Revocation...");
  
  try {
    const user1 = await getUserById(userId);
    if (!user1) {
      console.log("User not found, skipping manual check.");
      return;
    }
    
    console.log("Current version:", user1.sessionVersion);
    await incrementSessionVersion(userId);
    const user2 = await getUserById(userId);
    console.log("New version:", user2.sessionVersion);
    
    if (user2.sessionVersion === user1.sessionVersion + 1) {
      console.log("SUCCESS: Session version incremented.");
    } else {
      console.log("FAILURE: Session version did not increment correctly.");
    }
  } catch (e) {
    console.error("Test failed:", e);
  }
}

testRevocation();
