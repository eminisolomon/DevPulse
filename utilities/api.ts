import { AuthConfig } from '@/features/auth/AuthConfig';
import { useAuthStore } from '@/stores/useAuthStore';

export const getAuthToken = () => {
  const { accessToken } = useAuthStore.getState();
  if (!accessToken) {
    throw new Error('No Access Token found');
  }
  return accessToken;
};

export const getHeaders = (token: string) => {
  return {
    Authorization: `Bearer ${token}`,
    'User-Agent': 'DevPulse/1.0 (React Native)',
  };
};

export async function fetchWithAuth<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  let token = getAuthToken();
  const baseUrl = process.env.EXPO_PUBLIC_WAKATIME_API_BASE_URL!;
  const url = `${baseUrl}${endpoint}`;

  const headers = {
    ...getHeaders(token),
    ...(options.headers || {}),
    'Content-Type': 'application/json',
  };

  let response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    const { refreshToken, setTokens, logout } = useAuthStore.getState();

    if (!refreshToken) {
      logout();
      throw new Error('Unauthorized: No refresh token available');
    }

    try {
      const refreshResponse = await fetch(AuthConfig.discovery.tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: AuthConfig.clientId,
          client_secret: AuthConfig.clientSecret,
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          redirect_uri: AuthConfig.redirectUri,
        }).toString(),
      });

      const refreshData = await refreshResponse.json();

      if (!refreshResponse.ok) {
        throw new Error(
          refreshData.error_description || 'Failed to refresh token',
        );
      }

      setTokens(
        refreshData.access_token,
        refreshData.refresh_token,
        refreshData.expires_in,
      );

      token = refreshData.access_token;
      response = await fetch(url, {
        headers: getHeaders(token),
      });

      if (response.status === 401) {
        logout();
        throw new Error('Unauthorized: Session expired after refresh');
      }
    } catch (error) {
      logout();
      throw new Error('Unauthorized: Session expired');
    }
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error ${response.status}: ${errorText}`);
  }

  return response.json();
}
