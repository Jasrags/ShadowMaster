import type {
  UserResponse,
  CampaignResponse,
  CampaignPlayer,
  LoginRequest,
  RegisterRequest,
  ApiError,
  Gear,
  Armor,
  Weapon,
  WeaponAccessoryItem,
  Skill,
  Quality,
  Book,
  Lifestyle,
  WeaponConsumable,
  Contact,
} from './types';

const API_BASE = '/api';

// Base fetch wrapper with error handling and credentials
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const requestOptions: RequestInit = {
    ...options,
    credentials: 'include', // Include cookies for session-based auth
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const response = await fetch(url, requestOptions);

  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errorData: ApiError = await response.json();
      errorMessage = errorData.error || errorData.message || errorMessage;
    } catch {
      // If response is not JSON, use status text
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  // Handle empty responses (like logout)
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return {} as T;
  }

  return response.json();
}

// Auth API functions
export const authApi = {
  async login(credentials: LoginRequest): Promise<UserResponse> {
    const response = await apiRequest<{ user: UserResponse }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    return response.user;
  },

  async register(data: RegisterRequest): Promise<UserResponse> {
    const response = await apiRequest<{ user: UserResponse }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.user;
  },

  async logout(): Promise<void> {
    await apiRequest<void>('/auth/logout', {
      method: 'POST',
    });
  },

  async getCurrentUser(): Promise<UserResponse | null> {
    const response = await apiRequest<{ user: UserResponse | null }>('/auth/me');
    return response.user;
  },
};

// Campaign API functions
export const campaignApi = {
  async getCampaigns(): Promise<CampaignResponse[]> {
    return apiRequest<CampaignResponse[]>('/campaigns');
  },

  async getCampaign(id: string): Promise<CampaignResponse> {
    return apiRequest<CampaignResponse>(`/campaigns/${id}`);
  },

  async updateCampaign(id: string, data: Partial<CampaignResponse>): Promise<CampaignResponse> {
    return apiRequest<CampaignResponse>(`/campaigns/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async getEditionBooks(edition: string): Promise<Array<{ code: string; name: string; id?: string }>> {
    const response = await apiRequest<{ books: Array<{ code: string; name: string; id?: string }> }>(`/editions/${edition}/books`);
    return response.books || [];
  },

  async createCampaign(data: {
    name: string;
    description?: string;
    edition: string;
    creationMethod: string;
    status?: string;
    enabledBooks?: string[];
    automation?: Record<string, boolean>;
  }): Promise<CampaignResponse> {
    return apiRequest<CampaignResponse>('/campaigns', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async deleteCampaign(id: string): Promise<void> {
    return apiRequest<void>(`/campaigns/${id}`, {
      method: 'DELETE',
    });
  },

  async invitePlayer(campaignId: string, data: { email?: string; username?: string; user_id?: string }): Promise<CampaignPlayer> {
    return apiRequest<CampaignPlayer>(`/campaigns/${campaignId}/invitations`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getCampaignInvitations(campaignId: string): Promise<CampaignPlayer[]> {
    return apiRequest<CampaignPlayer[]>(`/campaigns/${campaignId}/invitations`, {
      method: 'GET',
    });
  },

  async getUserInvitations(): Promise<Array<{ campaign_id: string; campaign_name: string; player: CampaignPlayer }>> {
    return apiRequest<Array<{ campaign_id: string; campaign_name: string; player: CampaignPlayer }>>('/invitations', {
      method: 'GET',
    });
  },

  async acceptInvitation(playerId: string): Promise<void> {
    return apiRequest<void>(`/invitations/${playerId}/accept`, {
      method: 'POST',
    });
  },

  async declineInvitation(playerId: string): Promise<void> {
    return apiRequest<void>(`/invitations/${playerId}/decline`, {
      method: 'POST',
    });
  },

  async searchUsers(query: string): Promise<Array<{ id: string; username: string; email: string }>> {
    return apiRequest<Array<{ id: string; username: string; email: string }>>(`/users/search?q=${encodeURIComponent(query)}`, {
      method: 'GET',
    });
  },

  async removeInvitation(campaignId: string, playerId: string): Promise<void> {
    return apiRequest<void>(`/campaigns/${campaignId}/invitations/${playerId}`, {
      method: 'DELETE',
    });
  },

  async removePlayer(campaignId: string, playerId: string): Promise<void> {
    return apiRequest<void>(`/campaigns/${campaignId}/players/${playerId}`, {
      method: 'DELETE',
    });
  },
};

// Gear API functions (admin only)
export const gearApi = {
  async getGear(): Promise<Gear[]> {
    const response = await apiRequest<{ gear: Gear[] }>('/equipment/gear');
    return response.gear || [];
  },
};

// Armor API functions
export const armorApi = {
  async getArmor(): Promise<Armor[]> {
    const response = await apiRequest<{ armor: Armor[] }>('/equipment/armor');
    return response.armor || [];
  },
};

// Weapon API functions (admin only)
export const weaponApi = {
  async getWeapons(): Promise<Weapon[]> {
    const response = await apiRequest<{ weapons: Weapon[] }>('/equipment/weapons');
    return response.weapons || [];
  },
  async getWeaponAccessories(): Promise<WeaponAccessoryItem[]> {
    const response = await apiRequest<{ accessories: WeaponAccessoryItem[] }>('/equipment/weapon-accessories');
    return response.accessories || [];
  },
};

// Skill API functions (admin only)
export const skillApi = {
  async getSkills(): Promise<Skill[]> {
    const response = await apiRequest<{ skills: Skill[] }>('/equipment/skills');
    return response.skills || [];
  },
};

// Quality API functions (admin only)
export const qualityApi = {
  async getQualities(): Promise<Quality[]> {
    const response = await apiRequest<{ qualities: Quality[] }>('/equipment/qualities');
    return response.qualities || [];
  },
};

// Book API functions (admin only)
export const bookApi = {
  async getBooks(): Promise<Book[]> {
    const response = await apiRequest<{ books: Book[] }>('/equipment/books');
    return response.books || [];
  },
};

// Lifestyle API functions (admin only)
export const lifestyleApi = {
  async getLifestyles(): Promise<Lifestyle[]> {
    const response = await apiRequest<{ lifestyles: Lifestyle[] }>('/equipment/lifestyles');
    return response.lifestyles || [];
  },
};

// Weapon Consumable API functions (admin only)
export const weaponConsumableApi = {
  async getWeaponConsumables(): Promise<WeaponConsumable[]> {
    const response = await apiRequest<{ weapon_consumables: WeaponConsumable[] }>('/equipment/weapon-consumables');
    return response.weapon_consumables || [];
  },
};

// Contact API functions (admin only)
export const contactApi = {
  async getContacts(): Promise<Contact[]> {
    const response = await apiRequest<{ contacts: Contact[] }>('/equipment/contacts');
    return response.contacts || [];
  },
};

