import fs from 'fs-extra';
import path from 'path';
import { User, UserResponse } from '../types/user.js';

const USERS_DIR = path.join(process.cwd(), 'data', 'users');

// Ensure users directory exists
fs.ensureDirSync(USERS_DIR);

/**
 * Get user by ID
 */
export async function getUserById(userId: string): Promise<User | null> {
  try {
    const userPath = path.join(USERS_DIR, `${userId}.json`);
    if (!(await fs.pathExists(userPath))) {
      return null;
    }
    const userData = await fs.readJson(userPath);
    return userData as User;
  } catch (error) {
    console.error(`Error reading user ${userId}:`, error);
    return null;
  }
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const files = await fs.readdir(USERS_DIR);
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        const userPath = path.join(USERS_DIR, file);
        const userData = await fs.readJson(userPath) as User;
        if (userData.email.toLowerCase() === email.toLowerCase()) {
          return userData;
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error(`Error finding user by email ${email}:`, error);
    return null;
  }
}

/**
 * Create a new user
 */
export async function createUser(userData: User): Promise<User> {
  const userPath = path.join(USERS_DIR, `${userData.id}.json`);
  
  // Use atomic write: write to temp file first, then rename
  const tempPath = `${userPath}.tmp`;
  await fs.writeJson(tempPath, userData, { spaces: 2 });
  await fs.move(tempPath, userPath, { overwrite: false });
  
  return userData;
}

/**
 * Update user
 */
export async function updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
  const user = await getUserById(userId);
  if (!user) {
    return null;
  }
  
  const updatedUser: User = {
    ...user,
    ...updates,
    id: user.id, // Ensure ID cannot be changed
  };
  
  const userPath = path.join(USERS_DIR, `${userId}.json`);
  const tempPath = `${userPath}.tmp`;
  
  // Atomic write
  await fs.writeJson(tempPath, updatedUser, { spaces: 2 });
  await fs.move(tempPath, userPath, { overwrite: true });
  
  return updatedUser;
}

/**
 * Check if any users exist
 */
export async function userExists(): Promise<boolean> {
  try {
    const files = await fs.readdir(USERS_DIR);
    return files.some(file => file.endsWith('.json'));
  } catch (error) {
    // If directory doesn't exist or is empty, no users exist
    return false;
  }
}

/**
 * Get all users (for admin operations)
 */
export async function getAllUsers(): Promise<UserResponse[]> {
  try {
    const files = await fs.readdir(USERS_DIR);
    const users: UserResponse[] = [];
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        const userPath = path.join(USERS_DIR, file);
        const userData = await fs.readJson(userPath) as User;
        // Remove password hash from response
        const { passwordHash, ...userResponse } = userData;
        users.push(userResponse);
      }
    }
    
    return users;
  } catch (error) {
    console.error('Error getting all users:', error);
    return [];
  }
}

