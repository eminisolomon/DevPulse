import { AuthConfig } from '@/features/auth/AuthConfig';

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  uid: string;
}

export const AuthService = {
  /**
   * Exchanges an authorization code for an access token.
   */
  exchangeCodeForToken: async (code: string): Promise<TokenResponse> => {
    const response = await fetch(AuthConfig.discovery.tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json, application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: AuthConfig.clientId,
        client_secret: AuthConfig.clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: AuthConfig.redirectUri,
      }).toString(),
    });

    const responseText = await response.text();
    let data;

    const contentType = response.headers.get('content-type');
    if (
      contentType?.includes('application/json') ||
      responseText.trim().startsWith('{')
    ) {
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        data = Object.fromEntries(new URLSearchParams(responseText).entries());
      }
    } else {
      data = Object.fromEntries(new URLSearchParams(responseText).entries());
    }

    if (!response.ok) {
      throw new Error(
        data.error_description ||
          data.error ||
          `Failed to exchange token (${response.status})`,
      );
    }

    return data as TokenResponse;
  },

  /**
   * Refreshes the access token using a refresh token.
   */
  refreshToken: async (refreshToken: string): Promise<TokenResponse> => {
    const response = await fetch(AuthConfig.discovery.tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json, application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: AuthConfig.clientId,
        client_secret: AuthConfig.clientSecret,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        redirect_uri: AuthConfig.redirectUri,
      }).toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error_description ||
          data.error ||
          `Failed to refresh token (${response.status})`,
      );
    }

    return data as TokenResponse;
  },

  /**
   * Validates an API key by making a simple request.
   */
  validateApiKey: async (key: string): Promise<boolean> => {
    try {
      const { encodeBase64 } = require('@/utilities/base64');
      const response = await fetch(
        `${AuthConfig.discovery.authorizationEndpoint.replace('/oauth/authorize', '/api/v1/users/current')}`,
        {
          headers: {
            Authorization: `Basic ${encodeBase64(key)}`,
          },
        },
      );
      return response.ok;
    } catch {
      return false;
    }
  },
};
