import { config } from '@/utilities/config';
import { makeRedirectUri } from 'expo-auth-session';

export const AuthConfig = {
  clientId: config.WAKATIME_APP_ID,
  clientSecret: config.WAKATIME_APP_SECRET,
  redirectUri: makeRedirectUri({
    scheme: 'devpulse',
    path: 'redirect',
  }),
  scopes: [
    'email',
    'read_stats',
    'read_summaries',
    'read_goals',
    'read_heartbeats',
  ],
  discovery: {
    authorizationEndpoint: config.WAKATIME_AUTH_ENDPOINT,
    tokenEndpoint: config.WAKATIME_TOKEN_ENDPOINT,
    revocationEndpoint: config.WAKATIME_REVOCATION_ENDPOINT,
  },
};
