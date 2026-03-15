import { Voltra } from 'voltra';
import { startLiveActivity } from 'voltra/client';
import { updateAndroidWidget } from 'voltra/android/client';
import React from 'react';

/**
 * Data structure for the Daily Stats Widget.
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
 * DailyStatsWidget: Displays today's coding activity.
 */
export const DailyStatsWidget = ({ stats }: { stats: StatsData }) => {
  return (
    <Voltra.VStack
      style={{
        padding: 16,
        borderRadius: 22,
        backgroundColor: '#0A0A0A',
        minWidth: 160,
      }}
    >
      <Voltra.HStack style={{ alignItems: 'center', marginBottom: 12 }}>
        <Voltra.Symbol
          name="pulse.circle.fill"
          type="hierarchical"
          tintColor="#38BDF8"
          scale="medium"
        />
        <Voltra.Text
          style={{
            color: '#F8FAFC',
            fontSize: 16,
            fontWeight: '700',
            marginLeft: 8,
          }}
        >
          Today
        </Voltra.Text>
      </Voltra.HStack>

      <Voltra.VStack style={{ marginBottom: 16 }}>
        <Voltra.Text
          style={{
            color: '#F8FAFC',
            fontSize: 24,
            fontWeight: 'bold',
          }}
        >
          {stats.todayTotalText}
        </Voltra.Text>
        <Voltra.Text
          style={{
            color: '#94A3B8',
            fontSize: 12,
            marginTop: 2,
          }}
        >
          {stats.todayPercent}% of daily average
        </Voltra.Text>
      </Voltra.VStack>

      {stats.topProject && (
        <Voltra.VStack style={{ marginTop: 4 }}>
          <Voltra.HStack
            style={{ justifyContent: 'space-between', alignItems: 'center' }}
          >
            <Voltra.Text
              style={{ color: '#E2E8F0', fontSize: 13, fontWeight: '600' }}
            >
              {stats.topProject.name}
            </Voltra.Text>
            <Voltra.Text style={{ color: '#64748B', fontSize: 11 }}>
              {stats.topProject.text}
            </Voltra.Text>
          </Voltra.HStack>
        </Voltra.VStack>
      )}

      {stats.topLanguage && (
        <Voltra.VStack style={{ marginTop: 8 }}>
          <Voltra.HStack style={{ justifyContent: 'space-between' }}>
            <Voltra.Text style={{ color: '#94A3B8', fontSize: 11 }}>
              {stats.topLanguage.name}
            </Voltra.Text>
            <Voltra.Text style={{ color: '#94A3B8', fontSize: 11 }}>
              {Math.round(stats.topLanguage.percent)}%
            </Voltra.Text>
          </Voltra.HStack>
          <Voltra.View
            style={{
              height: 4,
              backgroundColor: '#1E293B',
              borderRadius: 2,
              marginTop: 4,
              overflow: 'hidden',
            }}
          >
            <Voltra.View
              style={{
                height: 4,
                width: `${stats.topLanguage.percent}%`,
                backgroundColor: '#38BDF8',
                borderRadius: 2,
              }}
            />
          </Voltra.View>
        </Voltra.VStack>
      )}
    </Voltra.VStack>
  );
};

/**
 * Helper to update the Android widget and iOS Live Activity with real stats.
 *
 * @param stats - The stats data to sync.
 */
export const syncDailyStats = async (stats: StatsData) => {
  try {
    await updateAndroidWidget('devpulse_widget', [
      {
        size: { width: 150, height: 150 },
        content: <DailyStatsWidget stats={stats} />,
      },
    ]);

    await startLiveActivity({
      lockScreen: <DailyStatsWidget stats={stats} />,
    });
  } catch (error) {
    console.warn('Failed to sync daily stats to widgets:', error);
  }
};
