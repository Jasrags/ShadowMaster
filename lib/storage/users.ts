import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import type { User, UserRole } from "../types/user";

const DATA_DIR = path.join(process.cwd(), "data", "users");

/**
 * Ensures the data directory exists, creating it if necessary
 */
async function ensureDataDirectory(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    // Directory might already exist, which is fine
    if ((error as NodeJS.ErrnoException).code !== "EEXIST") {
      throw error;
    }
  }
}

/**
 * Get the file path for a user by ID
 */
function getUserFilePath(userId: string): string {
  return path.join(DATA_DIR, `${userId}.json`);
}

/**
 * Get user by ID
 */
export async function getUserById(userId: string): Promise<User | null> {
  try {
    const filePath = getUserFilePath(userId);
    const fileContent = await fs.readFile(filePath, "utf-8");
    return JSON.parse(fileContent) as User;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const users = await getAllUsers();
    return users.find((user) => user.email.toLowerCase() === email.toLowerCase()) || null;
  } catch (error) {
    // If directory doesn't exist, return null
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

/**
 * Get all users (for checking if first user)
 */
export async function getAllUsers(): Promise<User[]> {
  try {
    await ensureDataDirectory();
    const files = await fs.readdir(DATA_DIR);
    const jsonFiles = files.filter((file) => file.endsWith(".json"));
    
    const users: User[] = [];
    for (const file of jsonFiles) {
      try {
        const filePath = path.join(DATA_DIR, file);
        const fileContent = await fs.readFile(filePath, "utf-8");
        const user = JSON.parse(fileContent) as User;
        users.push(user);
      } catch (error) {
        // Skip invalid files
        console.error(`Error reading user file ${file}:`, error);
      }
    }
    return users;
  } catch (error) {
    // If directory doesn't exist, return empty array
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

/**
 * Check if this is the first user (for role assignment)
 */
async function isFirstUser(): Promise<boolean> {
  const users = await getAllUsers();
  return users.length === 0;
}

/**
 * Create a new user
 */
export async function createUser(
  userData: Omit<User, "id" | "createdAt" | "lastLogin" | "characters">
): Promise<User> {
  await ensureDataDirectory();
  
  const isFirst = await isFirstUser();
  const role: UserRole = isFirst ? "administrator" : "user";
  
  const user: User = {
    id: uuidv4(),
    ...userData,
    role,
    createdAt: new Date().toISOString(),
    lastLogin: null,
    characters: [],
  };
  
  // Atomic write: write to temp file, then rename
  const filePath = getUserFilePath(user.id);
  const tempFilePath = `${filePath}.tmp`;
  
  try {
    await fs.writeFile(tempFilePath, JSON.stringify(user, null, 2), "utf-8");
    await fs.rename(tempFilePath, filePath);
  } catch (error) {
    // Clean up temp file if rename fails
    try {
      await fs.unlink(tempFilePath);
    } catch {
      // Ignore cleanup errors
    }
    throw error;
  }
  
  return user;
}

/**
 * Update user
 */
export async function updateUser(
  userId: string,
  updates: Partial<User>
): Promise<User> {
  const user = await getUserById(userId);
  if (!user) {
    throw new Error(`User with ID ${userId} not found`);
  }
  
  const updatedUser: User = {
    ...user,
    ...updates,
    id: user.id, // Ensure ID cannot be changed
  };
  
  // Atomic write: write to temp file, then rename
  const filePath = getUserFilePath(userId);
  const tempFilePath = `${filePath}.tmp`;
  
  try {
    await fs.writeFile(tempFilePath, JSON.stringify(updatedUser, null, 2), "utf-8");
    await fs.rename(tempFilePath, filePath);
  } catch (error) {
    // Clean up temp file if rename fails
    try {
      await fs.unlink(tempFilePath);
    } catch {
      // Ignore cleanup errors
    }
    throw error;
  }
  
  return updatedUser;
}

