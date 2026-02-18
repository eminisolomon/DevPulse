import { useTheme } from '@/hooks/useTheme';
import { Feather } from '@expo/vector-icons';
import React, { forwardRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ShareCardWrapper } from './ShareCardWrapper';

interface LeaderboardShareCardProps {
  rank: number;
  displayName: string;
  totalTime: string;
  country?: string;
  scope: string;
}

export const LeaderboardShareCard = forwardRef<View, LeaderboardShareCardProps>(
  ({ rank, displayName, totalTime, country, scope }, ref) => {
    const { isDark, theme } = useTheme();

    const textColor = isDark ? '#FFFFFF' : '#111111';
    const mutedColor = isDark ? '#888888' : '#666666';
    const surfaceColor = isDark ? '#1A1A1A' : '#F3F4F6';
    const accent = theme.colors.primary;

    const getMedalColor = () => {
      switch (rank) {
        case 1:
          return '#FFD700';
        case 2:
          return '#C0C0C0';
        case 3:
          return '#CD7F32';
        default:
          return accent;
      }
    };

    const getRankLabel = () => {
      const suffix =
        rank === 1 ? 'st' : rank === 2 ? 'nd' : rank === 3 ? 'rd' : 'th';
      return `${rank}${suffix}`;
    };

    return (
      <ShareCardWrapper ref={ref}>
        {/* Scope label */}
        <Text style={[styles.scopeLabel, { color: mutedColor }]}>{scope}</Text>

        {/* Rank + Name hero */}
        <View style={styles.heroSection}>
          <View
            style={[
              styles.rankBadge,
              {
                backgroundColor: getMedalColor() + '20',
                borderColor: getMedalColor() + '40',
              },
            ]}
          >
            {rank <= 3 ? (
              <Text style={[styles.rankEmoji]}>
                {rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}
              </Text>
            ) : (
              <Text style={[styles.rankNumber, { color: accent }]}>
                #{rank}
              </Text>
            )}
          </View>
          <View style={styles.nameCol}>
            <Text
              style={[styles.displayName, { color: textColor }]}
              numberOfLines={1}
            >
              {displayName}
            </Text>
            {country && (
              <Text style={[styles.countryText, { color: mutedColor }]}>
                {country}
              </Text>
            )}
          </View>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={[styles.statBox, { backgroundColor: surfaceColor }]}>
            <Feather name="award" size={16} color={getMedalColor()} />
            <Text style={[styles.statValue, { color: textColor }]}>
              {getRankLabel()}
            </Text>
            <Text style={[styles.statLabel, { color: mutedColor }]}>RANK</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: surfaceColor }]}>
            <Feather name="clock" size={16} color={accent} />
            <Text style={[styles.statValue, { color: textColor }]}>
              {totalTime}
            </Text>
            <Text style={[styles.statLabel, { color: mutedColor }]}>
              TOTAL TIME
            </Text>
          </View>
        </View>
      </ShareCardWrapper>
    );
  },
);

LeaderboardShareCard.displayName = 'LeaderboardShareCard';

const styles = StyleSheet.create({
  scopeLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  heroSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  rankBadge: {
    width: 52,
    height: 52,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankEmoji: {
    fontSize: 24,
  },
  rankNumber: {
    fontSize: 18,
    fontWeight: '800',
  },
  nameCol: {
    flex: 1,
    gap: 2,
  },
  displayName: {
    fontSize: 20,
    fontWeight: '700',
  },
  countryText: {
    fontSize: 13,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statBox: {
    flex: 1,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    gap: 6,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
