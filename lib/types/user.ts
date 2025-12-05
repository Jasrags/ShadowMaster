export type UserRole = "user" | "administrator" | "gamemaster";

export interface User {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  role: UserRole[]; // Array of roles - users can have multiple roles
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

export interface UpdateUserRequest {
  email?: string;
  username?: string;
  role?: UserRole[]; // Array of roles
}

export interface UpdateUserResponse {
  success: boolean;
  user?: PublicUser;
  error?: string;
}

export interface UsersListResponse {
  success: boolean;
  users: PublicUser[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error?: string;
}

export interface DeleteUserResponse {
  success: boolean;
  error?: string;
}

