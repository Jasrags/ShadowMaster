import apiRequest from '../api.js';
import { AuthResponse, SignupData, SigninData, User } from '../../types/auth.js';

/**
 * Sign up a new user
 */
export async function signup(data: SignupData): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Sign in an existing user
 */
export async function signin(data: SigninData): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/api/auth/signin', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Sign out current user
 */
export async function signout(): Promise<void> {
  return apiRequest<void>('/api/auth/signout', {
    method: 'POST',
  });
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<User> {
  return apiRequest<User>('/api/auth/me');
}

