export type UserRole = "user" | "administrator" | "gamemaster";

export interface User {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  role: UserRole;
  createdAt: string; // ISO 8601 date string
  lastLogin: string | null; // ISO 8601 date string or null
  characters: string[]; // Array of character IDs
}

export interface SignupRequest {
  email: string;
  username: string;
  password: string;
}

export interface SigninRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  success: boolean;
  user?: Omit<User, "passwordHash">;
  error?: string;
}

export type PublicUser = Omit<User, "passwordHash">;

