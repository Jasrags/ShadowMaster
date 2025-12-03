export type Role = 'administrator' | 'gamemaster' | 'player';

export interface User {
  id: string;
  email: string;
  username: string;
  roles: Role[];
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export type CharacterState = 'creation' | 'gm_review' | 'advancement';

export interface EditionData {
  edition: string;
  creation_method: string;
  play_level: string;
}

export interface PriorityAssignment {
  metatype: string;
  selected_metatype?: string;
  attributes: string;
  magic_resonance: string;
  skills: string;
  resources: string;
}

export interface Character {
  id: string;
  name: string;
  description?: string;
  age?: string;
  gender?: string;
  height?: string;
  weight?: string;
  state: CharacterState;
  user_id: string;
  edition_data: EditionData;
  priority_assignment?: PriorityAssignment;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

