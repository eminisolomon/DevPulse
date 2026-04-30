# Telemetry Integration TODO

## Goal

Wire the existing Settings toggles for `Crashes`, `Performance`, and `Analytics` to real telemetry providers instead of local-only AsyncStorage state.

Current status:

- The toggles exist in [app/settings/index.tsx](/home/eminisolomon/Dev/TechX/DevPulse/app/settings/index.tsx)
- Settings persist locally in [services/settings.service.ts](/home/eminisolomon/Dev/TechX/DevPulse/services/settings.service.ts)
- No crash, performance, or analytics SDK is currently installed or initialized

## Recommended Stack

- Crashes: Sentry
- Performance: Sentry Tracing
- Analytics: PostHog

Reasoning:

- Sentry fits Expo and gives crash reporting plus performance in one integration
- PostHog is a practical product analytics option for React Native / Expo

## Implementation Plan

### 1. Add dependencies

- Install `@sentry/react-native`
- Install `posthog-react-native`
- Install any required Expo-compatible peer dependencies

## 2. Add environment/config values

- Add `SENTRY_DSN`
- Add `POSTHOG_API_KEY`
- Add `POSTHOG_HOST` if using non-default region
- Decide where these live:
  - Expo `extra`
  - EAS secrets
  - `.env` with config passthrough

## 3. Create a telemetry service

Create:

- [services/telemetry.service.ts](/home/eminisolomon/Dev/TechX/DevPulse/services/telemetry.service.ts)

Responsibilities:

- Initialize Sentry
- Initialize PostHog
- Respect saved user consent settings
- Expose app-level methods:
  - `initTelemetry()`
  - `applyTelemetryConsent(settings)`
  - `identifyUser(user)`
  - `clearTelemetryUser()`
  - `captureException(error, context?)`
  - `track(event, properties?)`
  - `trackScreen(pathname, params?)`

## 4. Initialize telemetry at app startup

Likely integration points:

- [components/Providers.tsx](/home/eminisolomon/Dev/TechX/DevPulse/components/Providers.tsx)
- [app/\_layout.tsx](/home/eminisolomon/Dev/TechX/DevPulse/app/_layout.tsx)

Tasks:

- Initialize telemetry once at startup
- Load saved settings before applying telemetry consent
- Avoid duplicate SDK initialization during rerenders

## 5. Wire consent toggles to real SDK behavior

Update flow in:

- [app/settings/index.tsx](/home/eminisolomon/Dev/TechX/DevPulse/app/settings/index.tsx)

Tasks:

- Keep local UI state
- Persist settings through `settingsService`
- After persistence, call telemetry consent updater

Expected behavior:

- `collectCrashes = false` disables Sentry error event sending
- `collectPerformance = false` disables Sentry tracing/performance collection
- `collectAnalytics = false` disables PostHog event capture

## 6. Identify signed-in users

Use:

- [hooks/useUser.ts](/home/eminisolomon/Dev/TechX/DevPulse/hooks/useUser.ts)

Tasks:

- Set telemetry user after successful user fetch
- Use stable identifiers like:
  - `id`
  - `username`
  - `country_code`
- Clear telemetry user on logout

Related logout flow:

- [app/settings/index.tsx](/home/eminisolomon/Dev/TechX/DevPulse/app/settings/index.tsx)
- [stores/useAuthStore.ts](/home/eminisolomon/Dev/TechX/DevPulse/stores/useAuthStore.ts)

## 7. Add screen tracking

Use Expo Router location tracking from root layout.

Likely file:

- [app/\_layout.tsx](/home/eminisolomon/Dev/TechX/DevPulse/app/_layout.tsx)

Tasks:

- Track pathname changes
- Send screen views to PostHog
- Optionally add breadcrumb/context to Sentry

Suggested events:

- `screen_view`
- `leaderboard_opened`
- `profile_opened`
- `settings_opened`
- `share_started`
- `share_completed`

## 8. Add manual error capture for non-fatal failures

Audit high-value async flows and capture meaningful failures.

Candidate areas:

- Auth
- Leaderboard fetches
- Share flow
- Notifications
- Background/widget sync

Possible files:

- [services/waka.service.ts](/home/eminisolomon/Dev/TechX/DevPulse/services/waka.service.ts)
- [hooks/useShareScreenshot.ts](/home/eminisolomon/Dev/TechX/DevPulse/hooks/useShareScreenshot.ts)
- [services/android-notification.service.ts](/home/eminisolomon/Dev/TechX/DevPulse/services/android-notification.service.ts)
- [hooks/useWidgetSync.ts](/home/eminisolomon/Dev/TechX/DevPulse/hooks/useWidgetSync.ts)

Tasks:

- Capture unexpected exceptions
- Add lightweight context, not sensitive payloads
- Avoid noisy duplicate reporting

## 9. Add performance instrumentation

Initial scope:

- App startup
- Leaderboard screen load
- Dashboard load
- Share generation flow

Tasks:

- Enable Sentry traces with a conservative sample rate
- Instrument slow user flows where automatic instrumentation is insufficient
- Keep sampling low in production to control volume/cost

## 10. Privacy and consent review

Tasks:

- Add a short privacy explanation for what each toggle means
- Decide whether telemetry should default to on or off
- Ensure no sensitive personal data is sent
- Avoid sending email unless explicitly justified
- Document retention and data handling

## 11. Release/build setup

Tasks:

- Configure Sentry sourcemaps for EAS Build / EAS Update
- Verify DSN/API keys are available in production builds
- Test with a development build, not only Expo Go

## 12. Verification checklist

- Toggle `Crashes` off and confirm crash events stop sending
- Toggle `Performance` off and confirm traces stop sending
- Toggle `Analytics` off and confirm events stop sending
- Trigger a test non-fatal error and verify it appears in Sentry
- Trigger a test crash in a dev/release-like build and verify it appears in Sentry
- Navigate between tabs and verify screen events arrive in PostHog
- Log in and confirm user identification works
- Log out and confirm telemetry user state clears

## Suggested delivery order

1. Add SDKs and config
2. Build `telemetry.service.ts`
3. Initialize telemetry on startup
4. Wire settings toggles to consent updates
5. Add user identification
6. Add screen tracking
7. Add manual error capture
8. Add performance instrumentation
9. Verify in development build
10. Verify in production/EAS build

## Notes

- Do not treat local toggle persistence as telemetry integration
- Do not send telemetry before consent logic is applied
- Prefer one telemetry abstraction in app code instead of scattering SDK calls everywhere
