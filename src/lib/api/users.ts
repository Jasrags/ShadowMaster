import apiRequest from '../api.js';
import { User } from '../../types/auth.js';

/**
 * Get all users (admin only)
 */
export async function getAllUsers(): Promise<User[]> {
  return apiRequest<User[]>('/api/users');
}

/**
 * Update user (admin only)
 */
export async function updateUser(
  userId: string,
  updates: { email?: string; username?: string; role?: string }
): Promise<User> {
  return apiRequest<User>(`/api/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

