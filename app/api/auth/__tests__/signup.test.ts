/**
 * Tests for /api/auth/signup endpoint
 * 
 * Tests user registration including validation, duplicate checking,
 * password hashing, and session creation.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../signup/route';
import { NextRequest } from 'next/server';
import * as storageModule from '@/lib/storage/users';
import * as passwordModule from '@/lib/auth/password';
import * as sessionModule from '@/lib/auth/session';
import * as validationModule from '@/lib/auth/validation';
import type { User } from '@/lib/types/user';

// Mock dependencies
vi.mock('@/lib/storage/users');
vi.mock('@/lib/auth/password');
vi.mock('@/lib/auth/session');
vi.mock('@/lib/auth/validation');

// Helper to create a NextRequest with JSON body
function createMockRequest(url: string, body?: unknown, method = 'GET'): NextRequest {
  const request = new NextRequest(url, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
  });
  
  // Mock json() method if body is provided
  if (body) {
    (request as { json: () => Promise<unknown> }).json = async () => body;
  }
  
  return request;
}

describe('POST /api/auth/signup', () => {
  const mockNewUser: User = {
    id: 'new-user-id',
    email: 'newuser@example.com',
    username: 'newuser',
    passwordHash: 'hashed-password',
    role: ['user'],
    createdAt: new Date().toISOString(),
    lastLogin: null,
    characters: [],
    failedLoginAttempts: 0,
    lockoutUntil: null,
    sessionVersion: 1,
    preferences: {
      theme: "system",
      navigationCollapsed: false,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create user successfully with valid data', async () => {
    const requestBody = {
      email: 'newuser@example.com',
      username: 'newuser',
      password: 'ValidPass123!',
    };

    vi.mocked(validationModule.isValidEmail).mockReturnValue(true);
    vi.mocked(validationModule.isStrongPassword).mockReturnValue(true);
    vi.mocked(storageModule.getUserByEmail).mockResolvedValue(null);
    vi.mocked(passwordModule.hashPassword).mockResolvedValue('hashed-password');
    vi.mocked(storageModule.createUser).mockResolvedValue(mockNewUser);

    const request = createMockRequest(
      'http://localhost:3000/api/auth/signup',
      requestBody,
      'POST'
    );

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.user).toBeDefined();
    expect(data.user.id).toBe(mockNewUser.id);
    expect(data.user.email).toBe(mockNewUser.email);
    expect(data.user.username).toBe(mockNewUser.username);
    expect(data.user.role).toEqual(mockNewUser.role);

    expect(validationModule.isValidEmail).toHaveBeenCalledWith('newuser@example.com');
    expect(validationModule.isStrongPassword).toHaveBeenCalledWith('ValidPass123!');
    expect(storageModule.getUserByEmail).toHaveBeenCalledWith('newuser@example.com');
    expect(passwordModule.hashPassword).toHaveBeenCalledWith('ValidPass123!');
    expect(storageModule.createUser).toHaveBeenCalledWith({
      email: 'newuser@example.com',
      username: 'newuser',
      passwordHash: 'hashed-password',
      role: ['user'],
    });
    expect(sessionModule.createSession).toHaveBeenCalledWith(
      mockNewUser.id,
      expect.any(Object)
    );
  });

  it('should return 400 when email is missing', async () => {
    const requestBody = {
      username: 'newuser',
      password: 'ValidPass123!',
    };

    const request = createMockRequest(
      'http://localhost:3000/api/auth/signup',
      requestBody,
      'POST'
    );

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Email, username, and password are required');
    expect(validationModule.isValidEmail).not.toHaveBeenCalled();
  });

  it('should return 400 when username is missing', async () => {
    const requestBody = {
      email: 'newuser@example.com',
      password: 'ValidPass123!',
    };

    const request = createMockRequest(
      'http://localhost:3000/api/auth/signup',
      requestBody,
      'POST'
    );

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Email, username, and password are required');
  });

  it('should return 400 when password is missing', async () => {
    const requestBody = {
      email: 'newuser@example.com',
      username: 'newuser',
    };

    const request = createMockRequest(
      'http://localhost:3000/api/auth/signup',
      requestBody,
      'POST'
    );

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Email, username, and password are required');
  });

  it('should return 400 when email format is invalid', async () => {
    const requestBody = {
      email: 'invalid-email',
      username: 'newuser',
      password: 'ValidPass123!',
    };

    vi.mocked(validationModule.isValidEmail).mockReturnValue(false);

    const request = createMockRequest(
      'http://localhost:3000/api/auth/signup',
      requestBody,
      'POST'
    );

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Invalid email format');
    expect(storageModule.getUserByEmail).not.toHaveBeenCalled();
  });

  it('should return 400 when password is too weak', async () => {
    const requestBody = {
      email: 'newuser@example.com',
      username: 'newuser',
      password: 'weak',
    };

    vi.mocked(validationModule.isValidEmail).mockReturnValue(true);
    vi.mocked(validationModule.isStrongPassword).mockReturnValue(false);
    vi.mocked(validationModule.getPasswordStrengthError).mockReturnValue(
      'Password must be at least 8 characters long'
    );

    const request = createMockRequest(
      'http://localhost:3000/api/auth/signup',
      requestBody,
      'POST'
    );

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Password must be at least 8 characters long');
    expect(storageModule.getUserByEmail).not.toHaveBeenCalled();
  });

  it('should return 409 when user already exists', async () => {
    const requestBody = {
      email: 'existing@example.com',
      username: 'existinguser',
      password: 'ValidPass123!',
    };

    const existingUser: User = {
      id: 'existing-user-id',
      email: 'existing@example.com',
      username: 'existinguser',
      passwordHash: 'hash',
      role: ['user'],
      createdAt: new Date().toISOString(),
      lastLogin: null,
      characters: [],
      failedLoginAttempts: 0,
      lockoutUntil: null,
      sessionVersion: 1,
      preferences: {
        theme: "system",
        navigationCollapsed: false,
      },
    };

    vi.mocked(validationModule.isValidEmail).mockReturnValue(true);
    vi.mocked(validationModule.isStrongPassword).mockReturnValue(true);
    vi.mocked(storageModule.getUserByEmail).mockResolvedValue(existingUser);

    const request = createMockRequest(
      'http://localhost:3000/api/auth/signup',
      requestBody,
      'POST'
    );

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data.success).toBe(false);
    expect(data.error).toBe('User with this email already exists');
    expect(passwordModule.hashPassword).not.toHaveBeenCalled();
    expect(storageModule.createUser).not.toHaveBeenCalled();
  });

  it('should normalize email to lowercase and trim whitespace', async () => {
    const requestBody = {
      email: '  NewUser@Example.COM  ',
      username: 'newuser',
      password: 'ValidPass123!',
    };

    vi.mocked(validationModule.isValidEmail).mockReturnValue(true);
    vi.mocked(validationModule.isStrongPassword).mockReturnValue(true);
    vi.mocked(storageModule.getUserByEmail).mockResolvedValue(null);
    vi.mocked(passwordModule.hashPassword).mockResolvedValue('hashed-password');
    vi.mocked(storageModule.createUser).mockResolvedValue(mockNewUser);

    const request = createMockRequest(
      'http://localhost:3000/api/auth/signup',
      requestBody,
      'POST'
    );

    await POST(request);

    expect(storageModule.createUser).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'newuser@example.com',
        username: 'newuser',
      })
    );
  });

  it('should return 500 when an error occurs', async () => {
    // Suppress console.error output for this test
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    const requestBody = {
      email: 'newuser@example.com',
      username: 'newuser',
      password: 'ValidPass123!',
    };

    vi.mocked(validationModule.isValidEmail).mockReturnValue(true);
    vi.mocked(validationModule.isStrongPassword).mockReturnValue(true);
    vi.mocked(storageModule.getUserByEmail).mockRejectedValue(
      new Error('Database error')
    );

    const request = createMockRequest(
      'http://localhost:3000/api/auth/signup',
      requestBody,
      'POST'
    );

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe('An error occurred during signup');
    
    // Restore console.error
    consoleErrorSpy.mockRestore();
  });
});
