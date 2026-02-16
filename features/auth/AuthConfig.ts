import { makeRedirectUri } from 'expo-auth-session';

export const AuthConfig = {
  clientId: process.env.EXPO_PUBLIC_WAKATIME_APP_ID!,
  clientSecret: process.env.EXPO_PUBLIC_WAKATIME_APP_SECRET!,
  redirectUri: makeRedirectUri({
    scheme: 'devpulse',
  }),
  scopes: ['email', 'read_logged_time', 'read_stats'],
  discovery: {
    authorizationEndpoint: process.env.EXPO_PUBLIC_WAKATIME_AUTH_ENDPOINT!,
    tokenEndpoint: process.env.EXPO_PUBLIC_WAKATIME_TOKEN_ENDPOINT!,
    revocationEndpoint: process.env.EXPO_PUBLIC_WAKATIME_REVOCATION_ENDPOINT!,
  },
};
