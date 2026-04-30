import type { User } from '@/interfaces';
import type { PostHogEventProperties } from '@posthog/core';
import * as Sentry from '@sentry/react-native';
import { PostHog } from 'posthog-react-native';

import type { AppSettings } from './settings.service';
import { settingsService } from './settings.service';

type TelemetryConsent = Pick<
  AppSettings,
  'collectCrashes' | 'collectPerformance' | 'collectAnalytics'
>;

type TelemetryUser = User['data'];

const DEFAULT_CONSENT: TelemetryConsent = {
  collectCrashes: true,
  collectPerformance: true,
  collectAnalytics: true,
};

const TELEMETRY_ENV = {
  sentryDsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  posthogApiKey: process.env.EXPO_PUBLIC_POSTHOG_API_KEY,
  posthogHost:
    process.env.EXPO_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
};

class TelemetryService {
  private sentryInitialized = false;
  private posthog: PostHog | null = null;
  private initPromise: Promise<void> | null = null;
  private consent: TelemetryConsent = DEFAULT_CONSENT;

  async initTelemetry() {
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = (async () => {
      this.consent = await this.getConsentFromSettings();

      this.initSentry();
      await this.initPostHog();
      await this.applyTelemetryConsent(this.consent);
    })();

    return this.initPromise;
  }

  async applyTelemetryConsent(consent: TelemetryConsent) {
    this.consent = consent;

    if (!this.posthog && TELEMETRY_ENV.posthogApiKey) {
      await this.initPostHog();
    }

    if (this.posthog) {
      if (consent.collectAnalytics) {
        await this.posthog.optIn();
      } else {
        await this.posthog.optOut();
      }
    }
  }

  identifyUser(user: TelemetryUser) {
    const safeUser = {
      id: user.id,
      username: user.username,
      display_name: user.display_name,
      country_code: user.city?.country_code ?? null,
      city: user.city?.name ?? null,
      timezone: user.timezone,
      plan: user.plan,
    };

    if (this.sentryInitialized) {
      Sentry.setUser({
        id: safeUser.id,
        username: safeUser.username,
      });
      Sentry.setTag('country_code', safeUser.country_code ?? 'unknown');
      Sentry.setTag('plan', safeUser.plan);
    }

    this.posthog?.identify(safeUser.id, safeUser);
  }

  async clearTelemetryUser() {
    if (this.sentryInitialized) {
      Sentry.setUser(null);
    }

    if (this.posthog) {
      this.posthog.reset();
      if (!this.consent.collectAnalytics) {
        await this.posthog.optOut();
      }
    }
  }

  captureException(
    error: unknown,
    context?: {
      area?: string;
      extra?: Record<string, unknown>;
    },
  ) {
    if (!this.sentryInitialized || !this.consent.collectCrashes) {
      return;
    }

    Sentry.withScope((scope) => {
      if (context?.area) {
        scope.setTag('area', context.area);
      }

      if (context?.extra) {
        Object.entries(context.extra).forEach(([key, value]) => {
          scope.setExtra(key, value);
        });
      }

      Sentry.captureException(error);
    });
  }

  track(event: string, properties?: PostHogEventProperties) {
    if (!this.consent.collectAnalytics || !this.posthog) {
      return;
    }

    void this.posthog.capture(event, properties);
  }

  trackScreen(
    pathname: string,
    params?: Record<string, string | string[] | undefined>,
  ) {
    if (!pathname) {
      return;
    }

    if (this.sentryInitialized) {
      Sentry.addBreadcrumb({
        category: 'navigation',
        message: pathname,
        level: 'info',
        data: params,
      });
    }

    this.track('screen_view', {
      pathname,
      ...this.normalizeParams(params),
    });

    const routeEvent = this.mapRouteToEvent(pathname);
    if (routeEvent) {
      this.track(routeEvent, {
        pathname,
      });
    }

    if (this.consent.collectAnalytics && this.posthog) {
      void this.posthog.screen(pathname, this.normalizeParams(params));
    }
  }

  private initSentry() {
    if (this.sentryInitialized || !TELEMETRY_ENV.sentryDsn) {
      return;
    }

    Sentry.init({
      dsn: TELEMETRY_ENV.sentryDsn,
      enableAutoSessionTracking: true,
      tracesSampleRate: 0.1,
      beforeSend: (event) => {
        if (!this.consent.collectCrashes) {
          return null;
        }

        return event;
      },
      tracesSampler: () => {
        return this.consent.collectPerformance ? 0.1 : 0;
      },
    });

    this.sentryInitialized = true;
  }

  private async initPostHog() {
    if (this.posthog || !TELEMETRY_ENV.posthogApiKey) {
      return;
    }

    this.posthog = new PostHog(TELEMETRY_ENV.posthogApiKey, {
      host: TELEMETRY_ENV.posthogHost,
      persistence: 'file',
      captureAppLifecycleEvents: true,
      defaultOptIn: false,
      preloadFeatureFlags: false,
      disableSurveys: true,
      disableRemoteConfig: true,
      sendFeatureFlagEvent: false,
    });

    await this.posthog.ready();
  }

  private async getConsentFromSettings(): Promise<TelemetryConsent> {
    const settings = await settingsService.getSettings();

    return {
      collectCrashes: settings.collectCrashes,
      collectPerformance: settings.collectPerformance,
      collectAnalytics: settings.collectAnalytics,
    };
  }

  private normalizeParams(
    params?: Record<string, string | string[] | undefined>,
  ): PostHogEventProperties {
    if (!params) {
      return {};
    }

    return Object.fromEntries(
      Object.entries(params).map(([key, value]) => [
        key,
        Array.isArray(value) ? value.join(',') : (value ?? null),
      ]),
    );
  }

  private mapRouteToEvent(pathname: string) {
    if (pathname.includes('leaderboard')) {
      return 'leaderboard_opened';
    }

    if (pathname.includes('settings')) {
      return 'settings_opened';
    }

    if (pathname.includes('profile')) {
      return 'profile_opened';
    }

    return null;
  }
}

export const telemetryService = new TelemetryService();
