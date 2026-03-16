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
          borderRadius: 24,
          backgroundColor: stats.theme.surface,
          borderColor: stats.theme.border,
          borderWidth: 1,
          width: '100%',
          height: '100%',
          justifyContent: 'space-between',
        }}
      >
        <Voltra.HStack style={{ alignItems: 'center', marginBottom: 12 }}>
          <Voltra.Image
            source={{ assetName: 'logo.png' }}
            style={{ width: 16, height: 16, borderRadius: 5, marginRight: 12 }}
          />
          <Voltra.Text
            numberOfLines={1}
            style={{
              color: stats.theme.text,
              fontSize: 14,
              fontWeight: '700',
            }}
          >
            DevPulse
          </Voltra.Text>
        </Voltra.HStack>

        <Voltra.VStack style={{ flex: 1, justifyContent: 'center' }}>
          <Voltra.Text
            numberOfLines={1}
            style={{
              color: stats.theme.text,
              fontSize: 28,
              fontWeight: 'bold',
              letterSpacing: -1,
            }}
          >
            {stats.todayTotalText}
          </Voltra.Text>
          <Voltra.Text
            numberOfLines={1}
            style={{
              color: stats.theme.textSecondary,
              fontSize: 13,
              marginTop: 4,
            }}
          >
            {stats.todayPercent}% of daily average
          </Voltra.Text>
        </Voltra.VStack>

        <Voltra.VStack style={{ marginTop: 16 }}>
          {stats.topProject && (
            <Voltra.HStack
              style={{
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16,
              }}
            >
              <Voltra.HStack style={{ alignItems: 'center' }}>
                <Voltra.View
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor:
                      stats.topProject.color || stats.theme.primary,
                    marginRight: 8,
                  }}
                />
                <Voltra.Text
                  numberOfLines={1}
                  style={{
                    color: stats.theme.text,
                    fontSize: 14,
                    fontWeight: '600',
                  }}
                >
                  {stats.topProject.name}
                </Voltra.Text>
              </Voltra.HStack>
              <Voltra.Text
                style={{
                  color: stats.theme.text,
                  fontSize: 14,
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
                style={{ justifyContent: 'space-between', marginBottom: 6 }}
              >
                <Voltra.Text
                  numberOfLines={1}
                  style={{ color: stats.theme.textSecondary, fontSize: 12 }}
                >
                  {stats.topLanguage.name}
                </Voltra.Text>
                <Voltra.Text
                  style={{ color: stats.theme.textSecondary, fontSize: 12 }}
                >
                  {Math.round(stats.topLanguage.percent)}%
                </Voltra.Text>
              </Voltra.HStack>
              <Voltra.View
                style={{
                  height: 6,
                  backgroundColor: stats.theme.surfaceSubtle,
                  borderRadius: 3,
                  overflow: 'hidden',
                }}
              >
                <Voltra.View
                  style={{
                    width: `${stats.topLanguage.percent}%`,
                    height: '100%',
                    backgroundColor:
                      stats.topLanguage.color || stats.theme.primary,
                    borderRadius: 3,
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
