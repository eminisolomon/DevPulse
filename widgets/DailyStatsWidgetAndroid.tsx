import React from 'react';
import { VoltraAndroid } from 'voltra/android';

/**
 * Data structure for the Daily Stats Widget (shared with iOS).
 */
export interface StatsData {
  todayTotalText: string;
  todayPercent: number;
  topLanguage?: {
    name: string;
    percent: number;
  };
  topProject?: {
    name: string;
    text: string;
  };
}

/**
 * DailyStatsWidget for Android.
 * Uses Android-specific Voltra components (AndroidColumn, AndroidRow, AndroidText, etc.).
 */
export const DailyStatsWidgetAndroid = ({ stats }: { stats: StatsData }) => {
  return (
    <VoltraAndroid.Column
      style={{
        padding: 16,
        borderRadius: 22,
        backgroundColor: '#0A0A0A',
        width: '100%',
        height: '100%',
      }}
    >
      {/* Header row */}
      <VoltraAndroid.Row style={{ alignItems: 'center', marginBottom: 12 }}>
        <VoltraAndroid.Box
          style={{
            width: 16,
            height: 16,
            borderRadius: 8,
            backgroundColor: '#38BDF8',
          }}
        />
        <VoltraAndroid.Text
          style={{
            color: '#F8FAFC',
            fontSize: 16,
            fontWeight: '700',
            marginLeft: 8,
          }}
        >
          Today
        </VoltraAndroid.Text>
      </VoltraAndroid.Row>

      {/* Main stats */}
      <VoltraAndroid.Column style={{ marginBottom: 16 }}>
        <VoltraAndroid.Text
          style={{
            color: '#F8FAFC',
            fontSize: 24,
            fontWeight: 'bold',
          }}
        >
          {stats.todayTotalText}
        </VoltraAndroid.Text>
        <VoltraAndroid.Text
          style={{
            color: '#94A3B8',
            fontSize: 12,
            marginTop: 2,
          }}
        >
          {stats.todayPercent}% of daily average
        </VoltraAndroid.Text>
      </VoltraAndroid.Column>

      {/* Top project */}
      {stats.topProject && (
        <VoltraAndroid.Row
          style={{
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 4,
          }}
        >
          <VoltraAndroid.Text
            style={{ color: '#E2E8F0', fontSize: 13, fontWeight: '600' }}
          >
            {stats.topProject.name}
          </VoltraAndroid.Text>
          <VoltraAndroid.Text style={{ color: '#64748B', fontSize: 11 }}>
            {stats.topProject.text}
          </VoltraAndroid.Text>
        </VoltraAndroid.Row>
      )}

      {/* Top language with progress bar */}
      {stats.topLanguage && (
        <VoltraAndroid.Column style={{ marginTop: 8 }}>
          <VoltraAndroid.Row style={{ justifyContent: 'space-between' }}>
            <VoltraAndroid.Text style={{ color: '#94A3B8', fontSize: 11 }}>
              {stats.topLanguage.name}
            </VoltraAndroid.Text>
            <VoltraAndroid.Text style={{ color: '#94A3B8', fontSize: 11 }}>
              {Math.round(stats.topLanguage.percent)}%
            </VoltraAndroid.Text>
          </VoltraAndroid.Row>
          <VoltraAndroid.LinearProgressIndicator
            progress={stats.topLanguage.percent / 100}
            color="#38BDF8"
            backgroundColor="#1E293B"
            style={{ marginTop: 4, borderRadius: 2, height: 4 }}
          />
        </VoltraAndroid.Column>
      )}
    </VoltraAndroid.Column>
  );
};
