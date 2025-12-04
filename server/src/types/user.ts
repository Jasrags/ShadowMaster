export type UserRole = 'user' | 'administrator' | 'gamemaster';

export interface User {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  role: UserRole;
  createdAt: string;
  lastLogin: string | null;
  characters: string[];
}

export interface CreateUserData {
  email: string;
  username: string;
  password: string;
}

export interface UserResponse {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  createdAt: string;
  lastLogin: string | null;
  characters: string[];
}

export interface UpdateUserData {
  email?: string;
  username?: string;
  role?: UserRole;
}

