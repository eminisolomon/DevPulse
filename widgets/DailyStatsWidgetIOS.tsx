'use no memo';

import React from 'react';
import { Voltra } from 'voltra';
import type { StatsData } from './interface';

export const DailyStatsWidgetIOS = ({ stats }: { stats: StatsData }) => {
  const bgColor = stats.themeColor || '#0A0A0A';

  return (
    <Voltra.Link destination="devpulse://">
      <Voltra.VStack
        style={{
          padding: 16,
          borderRadius: 22,
          backgroundColor: bgColor,
          minWidth: 160,
          justifyContent: 'space-between',
        }}
      >
        <Voltra.VStack>
          <Voltra.HStack style={{ alignItems: 'center', marginBottom: 8 }}>
            <Voltra.Symbol
              name="pulse.circle.fill"
              type="hierarchical"
              tintColor="#38BDF8"
              scale="medium"
            />
            <Voltra.Text
              style={{
                color: '#F8FAFC',
                fontSize: 14,
                fontWeight: '700',
                marginLeft: 6,
              }}
            >
              Today
            </Voltra.Text>
          </Voltra.HStack>
          <Voltra.VStack>
            <Voltra.Text
              style={{
                color: '#F8FAFC',
                fontSize: 22,
                fontWeight: 'bold',
              }}
            >
              {stats.todayTotalText}
            </Voltra.Text>
            <Voltra.Text
              style={{
                color: '#94A3B8',
                fontSize: 11,
                marginTop: 2,
              }}
            >
              {stats.todayPercent}% of daily average
            </Voltra.Text>
          </Voltra.VStack>
        </Voltra.VStack>

        <Voltra.VStack>
          {stats.topProject && (
            <Voltra.HStack
              style={{
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 8,
              }}
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
          )}
          {stats.topLanguage && (
            <Voltra.VStack>
              <Voltra.HStack
                style={{ justifyContent: 'space-between', marginBottom: 4 }}
              >
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
      </Voltra.VStack>
    </Voltra.Link>
  );
};
