export type UserRole = "user" | "administrator" | "gamemaster";

/**
 * Account status for participant governance
 * - active: Normal operational state
 * - suspended: Administratively disabled (can be reactivated)
 * - locked: Automatically locked due to failed login attempts
 */
export type AccountStatus = "active" | "suspended" | "locked";

export interface UserSettings {
  theme: "light" | "dark" | "system";
  navigationCollapsed: boolean;
  defaultEdition?: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  role: UserRole[]; // Array of roles - users can have multiple roles
  preferences: UserSettings;
  createdAt: string; // ISO 8601 date string
  lastLogin: string | null; // ISO 8601 date string or null
  characters: string[]; // Array of character IDs
  // Security fields
  failedLoginAttempts: number;
  lockoutUntil: string | null; // ISO 8601 date string or null
  sessionVersion: number;
  // Account status and governance fields
  accountStatus: AccountStatus;
  statusChangedAt: string | null; // ISO 8601 date string
  statusChangedBy: string | null; // User ID of admin who changed status
  statusReason: string | null; // Reason for status change (e.g., suspension reason)
  lastRoleChangeAt: string | null; // ISO 8601 date string
  lastRoleChangeBy: string | null; // User ID of admin who changed roles
  // Email verification fields
  emailVerified: boolean;
  emailVerifiedAt: string | null; // ISO 8601 date string
  emailVerificationTokenHash: string | null;
  emailVerificationTokenExpiresAt: string | null; // ISO 8601 date string
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

// Participant Governance types

export interface SuspendUserRequest {
  reason: string;
}

export interface SuspendUserResponse {
  success: boolean;
  user?: PublicUser;
  error?: string;
}

export interface UserAuditLogResponse {
  success: boolean;
  entries?: import("./audit").UserAuditEntry[];
  total?: number;
  error?: string;
}
