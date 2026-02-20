import { z } from 'zod';

/**
 * Schema for environment variables.
 * Ensures the app has all required configuration at startup.
 */
const configSchema = z.object({
  WAKATIME_API_BASE_URL: z.url(),
  WAKATIME_APP_ID: z.string().min(1),
  WAKATIME_APP_SECRET: z.string().min(1),
  WAKATIME_AUTH_ENDPOINT: z.url(),
  WAKATIME_TOKEN_ENDPOINT: z.url(),
  WAKATIME_REVOCATION_ENDPOINT: z.url(),
});

/**
 * Validate and export configuration.
 * Uses process.env values prefixed with EXPO_PUBLIC_ for client-side access.
 */
const validatedConfig = configSchema.safeParse({
  WAKATIME_API_BASE_URL: process.env.EXPO_PUBLIC_WAKATIME_API_BASE_URL,
  WAKATIME_APP_ID: process.env.EXPO_PUBLIC_WAKATIME_APP_ID,
  WAKATIME_APP_SECRET: process.env.EXPO_PUBLIC_WAKATIME_APP_SECRET,
  WAKATIME_AUTH_ENDPOINT: process.env.EXPO_PUBLIC_WAKATIME_AUTH_ENDPOINT,
  WAKATIME_TOKEN_ENDPOINT: process.env.EXPO_PUBLIC_WAKATIME_TOKEN_ENDPOINT,
  WAKATIME_REVOCATION_ENDPOINT:
    process.env.EXPO_PUBLIC_WAKATIME_REVOCATION_ENDPOINT,
});

if (!validatedConfig.success) {
  const errorItems = validatedConfig.error.issues.map(
    (issue) => `${issue.path.join('.')}: ${issue.message}`,
  );
  throw new Error(
    `❌ Invalid or missing environment variables:\n${errorItems.join('\n')}\nCheck your .env file.`,
  );
}

export const config = validatedConfig.data;
