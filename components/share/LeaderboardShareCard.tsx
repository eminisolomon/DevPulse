import { useShareTheme } from '@/hooks/useShareTheme';
import { LeaderboardUser } from '@/interfaces/leaderboard';
import { Feather } from '@expo/vector-icons';
import React, { forwardRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar } from '../Avatar';
import { Typography } from '../Typography';
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
    const { textColor, mutedColor, surfaceColor, theme, isDark } =
      useShareTheme();

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
    const rankSuffix =
      rank === 1 ? 'st' : rank === 2 ? 'nd' : rank === 3 ? 'rd' : 'th';
    const rankDisplay = rank ? `${rank}${rankSuffix}` : '-';

    return (
      <ShareCardWrapper ref={ref} outerPadding={24}>
        <View style={styles.topContainer}>
          <Typography
            variant="micro"
            weight="bold"
            color={mutedColor}
            style={styles.scopeLabel}
          >
            {scope || 'GLOBAL TOP DEVELOPERS'}
          </Typography>

          <View style={styles.rankSection}>
            <View
              style={[
                styles.rankBadge,
                {
                  backgroundColor: rankColor + '15',
                  borderColor: rankColor + '30',
                },
              ]}
            >
              <Typography
                variant="display"
                weight="bold"
                color={rankColor}
                style={styles.rankText}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {rankDisplay}
              </Typography>
            </View>
            <Typography
              variant="micro"
              weight="bold"
              color={mutedColor}
              style={styles.rankLabel}
            >
              LEADERBOARD RANK
            </Typography>
          </View>

          <View style={styles.heroStats}>
            <View style={styles.heroStatItem}>
              <Typography variant="micro" weight="bold" color={mutedColor}>
                RECORDED TIME
              </Typography>
              <Typography
                variant="title"
                weight="bold"
                color={textColor}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {totalTime || '--'}
              </Typography>
            </View>
            {country && (
              <View style={styles.heroStatItem}>
                <Typography variant="micro" weight="bold" color={mutedColor}>
                  COUNTRY
                </Typography>
                <Typography variant="title" weight="bold" color={textColor}>
                  {country.toUpperCase()}
                </Typography>
              </View>
            )}
          </View>
        </View>

        {/* Top 3 Podium Section */}
        {top3Users && top3Users.length > 0 && (
          <View
            style={[styles.podiumContainer, { backgroundColor: surfaceColor }]}
          >
            <View style={styles.podiumHeader}>
              <Feather name="award" size={14} color={goldColor} />
              <Typography variant="micro" weight="bold" color={mutedColor}>
                TOP PERFORMERS
              </Typography>
            </View>
            <View style={styles.podiumList}>
              {top3Users.map((user, index) => (
                <View key={user.user.id} style={styles.podiumRow}>
                  <View style={styles.podiumRank}>
                    <Typography style={styles.podiumEmoji}>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </Typography>
                  </View>
                  <Avatar
                    source={
                      user.user.photo ? { uri: user.user.photo } : undefined
                    }
                    initials={user.user.display_name || user.user.username}
                    size={28}
                  />
                  <View style={styles.podiumInfo}>
                    <Typography
                      variant="caption"
                      weight="bold"
                      color={textColor}
                      numberOfLines={1}
                    >
                      {user.user.display_name || user.user.username}
                    </Typography>
                    <Typography variant="micro" color={mutedColor}>
                      {user.running_total.human_readable_total}
                    </Typography>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </ShareCardWrapper>
    );
  },
);

const styles = StyleSheet.create({
  topContainer: {
    alignItems: 'center',
    gap: 16,
  },
  scopeLabel: {
    letterSpacing: 2,
    opacity: 0.8,
  },
  rankSection: {
    alignItems: 'center',
    gap: 8,
  },
  rankBadge: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 2,
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    fontSize: 42,
    lineHeight: 48,
  },
  rankLabel: {
    letterSpacing: 1.5,
  },
  heroStats: {
    flexDirection: 'row',
    gap: 32,
    marginTop: 8,
  },
  heroStatItem: {
    alignItems: 'center',
    gap: 4,
  },
  podiumContainer: {
    marginTop: 20,
    borderRadius: 20,
    padding: 20,
    gap: 16,
  },
  podiumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  podiumList: {
    gap: 12,
  },
  podiumRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  podiumRank: {
    width: 28,
    alignItems: 'center',
  },
  podiumEmoji: {
    fontSize: 18,
  },
  podiumInfo: {
    flex: 1,
    gap: 2,
  },
});
