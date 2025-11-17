import type {
  UserResponse,
  CampaignResponse,
  LoginRequest,
  RegisterRequest,
  ApiError,
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
};

