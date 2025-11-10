export interface AuthUser {
  id: string;
  email: string;
  username: string;
  roles: string[];
}

export interface ShadowmasterAuthState {
  user: AuthUser | null;
  isAdministrator: boolean;
  isGamemaster: boolean;
  isPlayer: boolean;
}

