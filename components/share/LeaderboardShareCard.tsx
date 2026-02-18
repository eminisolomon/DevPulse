import { useTheme } from '@/hooks';
import { LeaderboardUser } from '@/interfaces/leaderboard';
import { AntDesign, Feather } from '@expo/vector-icons';
import React, { forwardRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Avatar } from '../Avatar';
import { ShareCardWrapper } from './ShareCardWrapper';

interface LeaderboardShareCardProps {
  rank?: number | null;
  displayName: string;
  totalTime?: string | null;
  country?: string;
  scope?: string;
  photo?: string | null;
  top3Users?: LeaderboardUser[];
}

export const LeaderboardShareCard = forwardRef<View, LeaderboardShareCardProps>(
  ({ rank, displayName, totalTime, country, scope, photo, top3Users }, ref) => {
    const { isDark, theme } = useTheme();

    const textColor = isDark ? '#FFFFFF' : '#111111';
    const mutedColor = isDark ? '#888888' : '#666666';
    const surfaceColor = isDark ? '#1A1A1A' : '#F3F4F6';
    const goldColor = '#F59E0B';
    const silverColor = '#9CA3AF';
    const bronzeColor = '#B45309';

    const getRankColor = () => {
      if (!rank) return mutedColor;
      if (rank === 1) return goldColor;
      if (rank === 2) return silverColor;
      if (rank === 3) return bronzeColor;
      return theme.colors.primary;
    };

    const rankColor = getRankColor();

    return (
      <ShareCardWrapper ref={ref} outerPadding={24}>
        {/* Scope header */}
        <Text style={[styles.scopeStart, { color: mutedColor }]}>
          {scope || 'GLOBAL TOP DEVELOPERS'}
        </Text>

        {/* Hero Rank + User */}
        <View style={styles.heroSection}>
          <Avatar
            source={photo ? { uri: photo } : undefined}
            initials={displayName}
            size={56}
          />
          <View>
            <Text style={[styles.displayName, { color: textColor }]}>
              {displayName}
            </Text>
            {country && (
              <Text style={[styles.countryText, { color: mutedColor }]}>
                {country}
              </Text>
            )}
          </View>
        </View>

        {/* Stats grid */}
        <View style={styles.statsRow}>
          {/* Rank Box */}
          <View style={[styles.statBox, { backgroundColor: surfaceColor }]}>
            <AntDesign name="trophy" size={24} color={rankColor} />
            <Text style={[styles.statValue, { color: textColor }]}>
              {rank ? (
                <>
                  {rank}
                  <Text style={{ fontSize: 14, fontWeight: '400' }}>
                    {rank === 1
                      ? 'st'
                      : rank === 2
                        ? 'nd'
                        : rank === 3
                          ? 'rd'
                          : 'th'}
                  </Text>
                </>
              ) : (
                '-'
              )}
            </Text>
            <Text style={[styles.statLabel, { color: mutedColor }]}>RANK</Text>
          </View>

          {/* Time Box */}
          <View style={[styles.statBox, { backgroundColor: surfaceColor }]}>
            <Feather name="clock" size={24} color={theme.colors.primary} />
            <Text style={[styles.statValue, { color: textColor }]}>
              {totalTime || '--'}
            </Text>
            <Text style={[styles.statLabel, { color: mutedColor }]}>
              TOTAL TIME
            </Text>
          </View>
        </View>

        {/* Top 3 Podium Section */}
        {top3Users && top3Users.length > 0 && (
          <View
            style={{
              marginTop: 24,
              paddingTop: 16,
              borderTopWidth: 1,
              borderTopColor: isDark ? '#333' : '#eee',
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: 'bold',
                color: mutedColor,
                marginBottom: 12,
                textTransform: 'uppercase',
              }}
            >
              Leading the charts
            </Text>
            {top3Users.map((user, index) => (
              <View
                key={user.user.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 8,
                }}
              >
                <Text style={{ width: 24, fontSize: 16 }}>
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                </Text>
                <Avatar
                  source={
                    user.user.photo ? { uri: user.user.photo } : undefined
                  }
                  initials={user.user.display_name || user.user.username}
                  size={24}
                />
                <Text
                  style={{
                    marginLeft: 8,
                    fontSize: 14,
                    fontWeight: '600',
                    color: textColor,
                    flex: 1,
                  }}
                  numberOfLines={1}
                >
                  {user.user.display_name || user.user.username}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '500',
                    color: theme.colors.primary,
                  }}
                >
                  {user.running_total.human_readable_total}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ShareCardWrapper>
    );
  },
);

const styles = StyleSheet.create({
  scopeStart: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  heroSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 8,
  },

  displayName: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 2,
  },
  countryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    textAlign: 'center',
    opacity: 0.8,
  },
});
