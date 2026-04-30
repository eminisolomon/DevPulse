import { z } from 'zod';

const optionalEnv = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((value) => {
    if (value === '') {
      return undefined;
    }

    return value;
  }, schema.optional());

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
  SENTRY_DSN: optionalEnv(z.url()),
  POSTHOG_API_KEY: optionalEnv(z.string().min(1)),
  POSTHOG_HOST: optionalEnv(z.url()),
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
  SENTRY_DSN: process.env.EXPO_PUBLIC_SENTRY_DSN,
  POSTHOG_API_KEY: process.env.EXPO_PUBLIC_POSTHOG_API_KEY,
  POSTHOG_HOST: process.env.EXPO_PUBLIC_POSTHOG_HOST,
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
