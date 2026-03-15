'use no memo';

import React from 'react';
import { Voltra } from 'voltra';
import type { StatsData } from './interface';

export const DailyStatsWidgetIOS = ({ stats }: { stats: StatsData }) => {
  return (
    <Voltra.Link destination="devpulse://">
      <Voltra.VStack
        style={{
          padding: 16,
          borderRadius: 22,
          backgroundColor: stats.theme.surface,
          borderColor: stats.theme.border,
          borderWidth: 1,
          minWidth: 160,
          justifyContent: 'space-between',
        }}
      >
        {/* Header Row: App Logo & App Name */}
        <Voltra.HStack style={{ alignItems: 'center', marginBottom: 12 }}>
          <Voltra.Image
            source={{ assetName: 'logo.png' }}
            style={{ width: 16, height: 16, borderRadius: 4, marginRight: 6 }}
          />
          <Voltra.Text
            style={{
              color: stats.theme.text,
              fontSize: 14,
              fontWeight: '700',
            }}
          >
            DevPulse
          </Voltra.Text>
        </Voltra.HStack>

        {/* Center Content: Big Total Time */}
        <Voltra.VStack>
          <Voltra.Text
            style={{
              color: stats.theme.text,
              fontSize: 26,
              fontWeight: 'bold',
              letterSpacing: -0.5,
            }}
          >
            {stats.todayTotalText}
          </Voltra.Text>
          <Voltra.Text
            style={{
              color: stats.theme.textSecondary,
              fontSize: 12,
              marginTop: 2,
            }}
          >
            {stats.todayPercent}% of daily average
          </Voltra.Text>
        </Voltra.VStack>

        {/* Bottom Content: Breakdowns (with spacing to push to bottom) */}
        <Voltra.VStack
          style={{ flex: 1, justifyContent: 'flex-end', marginTop: 16 }}
        >
          {stats.topProject && (
            <Voltra.HStack
              style={{
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 8,
              }}
            >
              <Voltra.HStack style={{ alignItems: 'center' }}>
                <Voltra.View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: stats.topProject.color || '#38BDF8',
                    marginRight: 6,
                  }}
                />
                <Voltra.Text
                  style={{
                    color: stats.theme.text,
                    fontSize: 13,
                    fontWeight: '600',
                  }}
                >
                  {stats.topProject.name}
                </Voltra.Text>
              </Voltra.HStack>
              <Voltra.Text
                style={{
                  color: stats.theme.text,
                  fontSize: 13,
                  fontWeight: 'bold',
                }}
              >
                {stats.topProject.text}
              </Voltra.Text>
            </Voltra.HStack>
          )}

          {stats.topLanguage && (
            <Voltra.VStack>
              <Voltra.HStack
                style={{ justifyContent: 'space-between', marginBottom: 4 }}
              >
                <Voltra.Text
                  style={{ color: stats.theme.textSecondary, fontSize: 11 }}
                >
                  {stats.topLanguage.name}
                </Voltra.Text>
                <Voltra.Text
                  style={{ color: stats.theme.textSecondary, fontSize: 11 }}
                >
                  {Math.round(stats.topLanguage.percent)}%
                </Voltra.Text>
              </Voltra.HStack>
              <Voltra.View
                style={{
                  height: 4,
                  backgroundColor: stats.theme.surfaceSubtle,
                  borderRadius: 2,
                  overflow: 'hidden',
                }}
              >
                <Voltra.View
                  style={{
                    width: `${stats.topLanguage.percent}%`,
                    height: '100%',
                    backgroundColor: stats.topLanguage.color || '#38BDF8',
                    borderRadius: 2,
                  }}
                />
              </Voltra.View>
            </Voltra.VStack>
          )}
        </Voltra.VStack>
      </Voltra.VStack>
    </Voltra.Link>
  );
};
