export type UserRole = 'user' | 'administrator' | 'gamemaster';

export interface User {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  createdAt: string;
  lastLogin: string | null;
  characters: string[];
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface SignupData {
  email: string;
  username: string;
  password: string;
}

export interface SigninData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

