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
        borderRadius: 24,
        backgroundColor: stats.theme.surface,
        borderColor: stats.theme.border,
        borderWidth: 1,
        width: '100%',
        height: '100%',
      }}
    >
      <VoltraAndroid.Row
        style={{
          alignItems: 'center',
          marginBottom: 12,
          width: '100%',
        }}
      >
        <VoltraAndroid.Box
          style={{
            width: 16,
            height: 16,
            borderRadius: 5,
            backgroundColor: stats.theme.primary,
            marginRight: 12,
          }}
        />
        <VoltraAndroid.Text
          maxLines={1}
          style={{
            color: stats.theme.text,
            fontSize: 14,
            fontWeight: '700',
          }}
        >
          DevPulse
        </VoltraAndroid.Text>
      </VoltraAndroid.Row>

      <VoltraAndroid.Column
        style={{
          flex: 1,
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <VoltraAndroid.Text
          maxLines={1}
          style={{
            color: stats.theme.text,
            fontSize: 28,
            fontWeight: 'bold',
            letterSpacing: -1,
          }}
        >
          {stats.todayTotalText}
        </VoltraAndroid.Text>
        <VoltraAndroid.Text
          maxLines={1}
          style={{
            color: stats.theme.textSecondary,
            fontSize: 13,
            marginTop: 4,
          }}
        >
          {stats.todayPercent}% of daily average
        </VoltraAndroid.Text>
      </VoltraAndroid.Column>

      <VoltraAndroid.Column
        style={{
          width: '100%',
          marginTop: 16,
        }}
      >
        {stats.topProject && (
          <VoltraAndroid.Row
            style={{
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
              width: '100%',
            }}
          >
            <VoltraAndroid.Row style={{ alignItems: 'center' }}>
              <VoltraAndroid.Box
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor:
                    stats.topProject.color || stats.theme.primary,
                  marginRight: 8,
                }}
              />
              <VoltraAndroid.Text
                maxLines={1}
                style={{
                  color: stats.theme.text,
                  fontSize: 14,
                  fontWeight: '600',
                }}
              >
                {stats.topProject.name}
              </VoltraAndroid.Text>
            </VoltraAndroid.Row>
            <VoltraAndroid.Text
              style={{
                color: stats.theme.text,
                fontSize: 14,
                fontWeight: 'bold',
              }}
            >
              {stats.topProject.text}
            </VoltraAndroid.Text>
          </VoltraAndroid.Row>
        )}

        {stats.topLanguage && (
          <VoltraAndroid.Column style={{ width: '100%' }}>
            <VoltraAndroid.Row
              style={{
                justifyContent: 'space-between',
                marginBottom: 6,
                width: '100%',
              }}
            >
              <VoltraAndroid.Text
                maxLines={1}
                style={{ color: stats.theme.textSecondary, fontSize: 12 }}
              >
                {stats.topLanguage.name}
              </VoltraAndroid.Text>
              <VoltraAndroid.Text
                style={{ color: stats.theme.textSecondary, fontSize: 12 }}
              >
                {Math.round(stats.topLanguage.percent)}%
              </VoltraAndroid.Text>
            </VoltraAndroid.Row>
            <VoltraAndroid.LinearProgressIndicator
              progress={stats.topLanguage.percent / 100}
              color={stats.topLanguage.color || stats.theme.primary}
              backgroundColor={stats.theme.surfaceSubtle}
              style={{
                borderRadius: 4,
                height: 6,
                width: '100%',
              }}
            />
          </VoltraAndroid.Column>
        )}
      </VoltraAndroid.Column>
    </VoltraAndroid.Column>
  );
};
