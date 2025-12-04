import { useAuthStore } from '../stores/authStore.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface ApiError {
  error: string;
  details?: any;
}

/**
 * API client with automatic token attachment
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const { token } = useAuthStore.getState();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });
  } catch (error: any) {
    // Network error or CORS preflight failure
    if (error.message?.includes('Failed to fetch') || error.name === 'TypeError') {
      throw new Error(
        `Cannot connect to server at ${API_URL}. Make sure the backend server is running on port 3001.`
      );
    }
    throw error;
  }

  if (!response.ok) {
    const errorData: ApiError = await response.json().catch(() => ({
      error: `HTTP ${response.status}: ${response.statusText}`,
    }));

    // Handle 401 Unauthorized - clear auth
    if (response.status === 401) {
      useAuthStore.getState().clearAuth();
    }

    throw new Error(errorData.error || 'Request failed');
  }

  return response.json();
}

export default apiRequest;

