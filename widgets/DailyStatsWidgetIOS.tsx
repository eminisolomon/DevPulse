'use no memo';

import React from 'react';
import { Voltra } from 'voltra';
import type { StatsData } from './interface';

export const DailyStatsWidgetIOS = ({
  stats,
  isSimple = false,
}: {
  stats: StatsData;
  isSimple?: boolean;
}) => {
  return (
    <Voltra.Link destination="devpulse://">
      <Voltra.VStack
        style={{
          flexDirection: isSimple ? 'row' : 'column',
          justifyContent: 'space-between',
          alignItems: isSimple ? 'center' : 'stretch',
        }}
      >
        <Voltra.HStack
          style={{
            alignItems: 'center',
            marginBottom: isSimple ? 0 : 12,
          }}
        >
          <Voltra.Symbol
            name="chart.bar.fill"
            size={18}
            tintColor={stats.theme.primary}
            style={{ marginRight: 10 }}
          />
          <Voltra.Text
            numberOfLines={1}
            style={{
              color: stats.theme.text,
              fontSize: 16,
              fontWeight: '700',
            }}
          >
            DevPulse
          </Voltra.Text>
        </Voltra.HStack>

        <Voltra.VStack
          style={{
            flex: isSimple ? 0 : 1,
            justifyContent: 'center',
            alignItems: isSimple ? 'flex-end' : 'flex-start',
          }}
        >
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
          {!isSimple && (
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
          )}
        </Voltra.VStack>

        {!isSimple && (
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
        )}
      </Voltra.VStack>
    </Voltra.Link>
  );
};
