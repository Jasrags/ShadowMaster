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
  Action,
  Cyberware,
  Bioware,
  ComplexForm,
  Mentor,
  Metatype,
  Power,
  Program,
  Spell,
  Tradition,
  VehicleModification,
  Vehicle,
  CharacterCreationData,
  Character,
  PrioritySelection,
  SumToTenSelection,
  KarmaSelection,
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

// Action API functions (admin only)
export const actionApi = {
  async getActions(): Promise<Action[]> {
    const response = await apiRequest<{ actions: Action[] }>('/equipment/actions');
    return response.actions || [];
  },
};

// Cyberware API functions (admin only)
export const cyberwareApi = {
  async getCyberware(): Promise<Cyberware[]> {
    const response = await apiRequest<{ cyberware: Cyberware[] }>('/equipment/cyberware');
    return response.cyberware || [];
  },
};

// Bioware API functions (admin only)
export const biowareApi = {
  async getBioware(): Promise<Bioware[]> {
    const response = await apiRequest<{ bioware: Bioware[] }>('/equipment/bioware');
    return response.bioware || [];
  },
};

// Complex Form API functions (admin only)
export const complexFormApi = {
  async getComplexForms(): Promise<ComplexForm[]> {
    const response = await apiRequest<{ complex_forms: ComplexForm[] }>('/equipment/complex-forms');
    return response.complex_forms || [];
  },
};

// Mentor API functions (admin only)
export const mentorApi = {
  async getMentors(): Promise<Mentor[]> {
    const response = await apiRequest<{ mentors: Mentor[] }>('/equipment/mentors');
    return response.mentors || [];
  },
};

// Metatype API functions (admin only)
export const metatypeApi = {
  async getMetatypes(): Promise<Metatype[]> {
    const response = await apiRequest<{ metatypes: Metatype[] }>('/equipment/metatypes');
    return response.metatypes || [];
  },
};

// Power API functions (admin only)
export const powerApi = {
  async getPowers(): Promise<Power[]> {
    const response = await apiRequest<{ powers: Power[] }>('/equipment/powers');
    return response.powers || [];
  },
};

// Program API functions (admin only)
export const programApi = {
  async getPrograms(): Promise<Program[]> {
    const response = await apiRequest<{ programs: Program[] }>('/equipment/programs');
    return response.programs || [];
  },
};

// Spell API functions (admin only)
export const spellApi = {
  async getSpells(): Promise<Spell[]> {
    const response = await apiRequest<{ spells: Spell[] }>('/equipment/spells');
    return response.spells || [];
  },
};

// Tradition API functions (admin only)
export const traditionApi = {
  async getTraditions(): Promise<Tradition[]> {
    const response = await apiRequest<{ traditions: Tradition[] }>('/equipment/traditions');
    return response.traditions || [];
  },
};

// Vehicle Modification API functions (admin only)
export const vehicleModificationApi = {
  async getVehicleModifications(): Promise<VehicleModification[]> {
    const response = await apiRequest<{ vehicle_modifications: VehicleModification[] }>('/equipment/vehicle-modifications');
    return response.vehicle_modifications || [];
  },
};

// Vehicle API functions (admin only)
export const vehicleApi = {
  async getVehicles(): Promise<Vehicle[]> {
    const response = await apiRequest<{ vehicles: Vehicle[] }>('/equipment/vehicles');
    return response.vehicles || [];
  },
};

// Character API functions
export const characterApi = {
  // Get character creation metadata
  async getCharacterCreationData(edition: string): Promise<CharacterCreationData> {
    const response = await apiRequest<{ character_creation: CharacterCreationData }>(`/editions/${edition}/character-creation`);
    return response.character_creation;
  },

  // Create character
  async createCharacter(data: {
    name: string;
    player_name: string;
    edition: string;
    creation_data: PrioritySelection | SumToTenSelection | KarmaSelection;
  }): Promise<Character> {
    return apiRequest<Character>('/characters', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Get character
  async getCharacter(id: string): Promise<Character> {
    return apiRequest<Character>(`/characters/${id}`);
  },

  // Get all characters
  async getCharacters(): Promise<Character[]> {
    return apiRequest<Character[]>('/characters');
  },

  // Delete character
  async deleteCharacter(id: string): Promise<void> {
    return apiRequest<void>(`/characters/${id}`, {
      method: 'DELETE',
    });
  },
};

