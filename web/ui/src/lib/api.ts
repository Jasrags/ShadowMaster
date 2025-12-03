import type { User, RegisterRequest, LoginRequest, ChangePasswordRequest, Character } from './types';

const API_BASE = '/api';

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    credentials: 'include', // Include cookies for session management
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const error = await response.json();
      errorMessage = error.error || errorMessage;
    } catch {
      // If response isn't JSON, try to get text
      try {
        const text = await response.text();
        errorMessage = text || errorMessage;
      } catch {
        // Fallback to status code message
        errorMessage = `HTTP ${response.status} ${response.statusText}`;
      }
    }
    throw new Error(errorMessage);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const authApi = {
  register: async (data: RegisterRequest): Promise<User> => {
    return request<User>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  login: async (data: LoginRequest): Promise<User> => {
    return request<User>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  logout: async (): Promise<void> => {
    return request<void>('/auth/logout', {
      method: 'POST',
    });
  },

  getCurrentUser: async (): Promise<User> => {
    return request<User>('/auth/me');
  },

  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    return request<void>('/auth/password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

export interface UpdateUserRequest {
  username?: string;
  roles?: string[];
}

export const usersApi = {
  getUsers: async (): Promise<User[]> => {
    return request<User[]>('/users');
  },

  getUser: async (userId: string): Promise<User> => {
    return request<User>(`/users/${userId}`);
  },

  deleteUser: async (userId: string): Promise<void> => {
    return request<void>(`/users/${userId}`, {
      method: 'DELETE',
    });
  },

  updateUser: async (userId: string, data: UpdateUserRequest): Promise<User> => {
    return request<User>(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

export interface CreateCharacterRequest {
  name: string;
  edition: string;
  creation_method: string;
  play_level: string;
}

export interface UpdateCharacterRequest {
  name?: string;
  description?: string;
  age?: string;
  gender?: string;
  height?: string;
  weight?: string;
  priority_assignment?: {
    metatype?: string;
    selected_metatype?: string;
    attributes?: string;
    magic_resonance?: string;
    skills?: string;
    resources?: string;
  };
}

export const charactersApi = {
  createCharacter: async (data: CreateCharacterRequest): Promise<Character> => {
    return request<Character>('/characters', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getCharacters: async (): Promise<Character[]> => {
    return request<Character[]>('/characters');
  },

  getCharacter: async (characterId: string): Promise<Character> => {
    return request<Character>(`/characters/${characterId}`);
  },

  updateCharacter: async (characterId: string, data: UpdateCharacterRequest): Promise<Character> => {
    return request<Character>(`/characters/${characterId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteCharacter: async (characterId: string): Promise<void> => {
    return request<void>(`/characters/${characterId}`, {
      method: 'DELETE',
    });
  },
};

export const priorityApi = {
  getPriorityTables: async (playLevel: string = 'experienced'): Promise<any> => {
    return request(`/priority-tables?play_level=${playLevel}`);
  },
};

