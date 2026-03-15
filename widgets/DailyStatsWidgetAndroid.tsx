'use no memo';

import React from 'react';
import { VoltraAndroid } from 'voltra/android';
import type { StatsData } from './interface';

export const DailyStatsWidgetAndroid = ({ stats }: { stats: StatsData }) => {
  return (
    <VoltraAndroid.Column
      deepLinkUrl="devpulse://"
      style={{
        padding: 16,
        borderRadius: 22,
        backgroundColor: stats.theme.surface,
        borderColor: stats.theme.border,
        borderWidth: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'space-between',
      }}
    >
          {/* Header Row: App Logo & App Name */}
        <VoltraAndroid.Row style={{ alignItems: 'center', marginBottom: 12 }}>
          <VoltraAndroid.Image
            source={{ assetName: 'logo' }}
            style={{ width: 16, height: 16, borderRadius: 4, marginRight: 6 }}
          />
          <VoltraAndroid.Text
            style={{
              color: stats.theme.text,
              fontSize: 14,
              fontWeight: '700',
            }}
          >
            DevPulse
          </VoltraAndroid.Text>
        </VoltraAndroid.Row>

        {/* Center Content: Big Total Time */}
        <VoltraAndroid.Column>
          <VoltraAndroid.Text
            style={{
              color: stats.theme.text,
              fontSize: 26,
              fontWeight: 'bold',
              letterSpacing: -0.5,
            }}
          >
            {stats.todayTotalText}
          </VoltraAndroid.Text>
          <VoltraAndroid.Text
            style={{
              color: stats.theme.textSecondary,
              fontSize: 12,
              marginTop: 2,
            }}
          >
            {stats.todayPercent}% of daily average
          </VoltraAndroid.Text>
        </VoltraAndroid.Column>

        {/* Bottom Content: Breakdowns (with spacing to push to bottom) */}
        <VoltraAndroid.Column style={{ flex: 1, justifyContent: 'flex-end', marginTop: 16 }}>
          {stats.topProject && (
            <VoltraAndroid.Row
              style={{
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 8,
              }}
            >
              <VoltraAndroid.Row style={{ alignItems: 'center' }}>
                <VoltraAndroid.Box
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: stats.topProject.color || '#38BDF8',
                    marginRight: 6,
                  }}
                />
                <VoltraAndroid.Text
                  style={{
                    color: stats.theme.text,
                    fontSize: 13,
                    fontWeight: '600',
                  }}
                >
                  {stats.topProject.name}
                </VoltraAndroid.Text>
              </VoltraAndroid.Row>
              <VoltraAndroid.Text
                style={{
                  color: stats.theme.text,
                  fontSize: 13,
                  fontWeight: 'bold',
                }}
              >
                {stats.topProject.text}
              </VoltraAndroid.Text>
            </VoltraAndroid.Row>
          )}

          {stats.topLanguage && (
            <VoltraAndroid.Column>
              <VoltraAndroid.Row
                style={{ justifyContent: 'space-between', marginBottom: 4 }}
              >
                <VoltraAndroid.Text
                  style={{ color: stats.theme.textSecondary, fontSize: 11 }}
                >
                  {stats.topLanguage.name}
                </VoltraAndroid.Text>
                <VoltraAndroid.Text
                  style={{ color: stats.theme.textSecondary, fontSize: 11 }}
                >
                  {Math.round(stats.topLanguage.percent)}%
                </VoltraAndroid.Text>
              </VoltraAndroid.Row>
              <VoltraAndroid.LinearProgressIndicator
                progress={stats.topLanguage.percent / 100}
                color={stats.topLanguage.color || '#38BDF8'}
                backgroundColor={stats.theme.surfaceSubtle}
                style={{ borderRadius: 2, height: 4 }}
              />
            </VoltraAndroid.Column>
          )}
        </VoltraAndroid.Column>
    </VoltraAndroid.Column>
  );
};
