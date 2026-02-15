import { WakaTimeStats } from '@/interfaces/stats';
import { WakaTimeSummaries } from '@/interfaces/summary';
import { User } from '@/interfaces/user';
import { useAuthStore } from '@/stores/useAuthStore';
import { format } from 'date-fns';

const getAuth = () => {
  const { apiKey, apiUrl } = useAuthStore.getState();
  if (!apiKey) {
    throw new Error('No API Key found');
  }
  return { apiKey, apiUrl };
};

const getHeaders = (apiKey: string) => {
  // Use btoa for Base64 encoding (available in Hermes/RN)
  const encodedKey = btoa(apiKey);
  return {
    Authorization: `Basic ${encodedKey}`,
    'User-Agent': 'DevPulse/1.0 (React Native)',
  };
};

// Generic fetch wrapper with error handling
async function fetchWithAuth<T>(endpoint: string): Promise<T> {
  const { apiKey, apiUrl } = getAuth();
  // Ensure no double slashes if apiUrl ends with /
  const baseUrl = apiUrl.replace(/\/$/, '');
  const url = `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    headers: getHeaders(apiKey),
  });

  if (response.status === 401) {
    // Optional: Trigger logout or specific error code
    throw new Error('Unauthorized: Invalid API Key');
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error ${response.status}: ${errorText}`);
  }

  return response.json();
}

export const api = {
  getUser: () => fetchWithAuth<User>('/users/current'),

  getStats: (range: string = 'last_7_days') =>
    fetchWithAuth<WakaTimeStats>(`/users/current/stats/${range}`),

  getSummaries: (start: Date, end: Date) => {
    const startStr = format(start, 'yyyy-MM-dd');
    const endStr = format(end, 'yyyy-MM-dd');
    return fetchWithAuth<WakaTimeSummaries>(
      `/users/current/summaries?start=${startStr}&end=${endStr}`,
    );
  },
};
