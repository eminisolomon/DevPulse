import { useAuthStore } from '@/stores/useAuthStore';

export const getAuth = () => {
  const { apiKey, apiUrl } = useAuthStore.getState();
  if (!apiKey) {
    throw new Error('No API Key found');
  }
  return { apiKey, apiUrl };
};

export const getHeaders = (apiKey: string) => {
  const encodedKey = btoa(apiKey);
  return {
    Authorization: `Basic ${encodedKey}`,
    'User-Agent': 'DevPulse/1.0 (React Native)',
  };
};

export async function fetchWithAuth<T>(endpoint: string): Promise<T> {
  const { apiKey, apiUrl } = getAuth();
  const baseUrl = apiUrl.replace(/\/$/, '');
  const url = `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    headers: getHeaders(apiKey),
  });

  if (response.status === 401) {
    throw new Error('Unauthorized: Invalid API Key');
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error ${response.status}: ${errorText}`);
  }

  return response.json();
}
