import { useShareTheme } from '@/hooks/useShareTheme';
import { LeaderboardUser } from '@/interfaces/leaderboard';
import React, { forwardRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar } from '../Avatar';
import { StatBox } from '../StatBox';
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
        {/* Scope header */}
        <Typography
          variant="micro"
          weight="bold"
          color={mutedColor}
          style={styles.scopeStart}
        >
          {scope || 'GLOBAL TOP DEVELOPERS'}
        </Typography>

        {/* Hero Rank + User */}
        <View style={styles.heroSection}>
          <Avatar
            source={photo ? { uri: photo } : undefined}
            initials={displayName}
            size={56}
          />
          <View>
            <Typography
              variant="headline"
              weight="bold"
              color={textColor}
              style={styles.displayName}
            >
              {displayName}
            </Typography>
            {country && (
              <Typography
                variant="body"
                weight="medium"
                color={mutedColor}
                style={styles.countryText}
              >
                {country}
              </Typography>
            )}
          </View>
        </View>

        {/* Stats grid */}
        <View style={styles.statsRow}>
          <StatBox
            label="RANK"
            value={rankDisplay}
            valueColor={rankColor}
            style={{ backgroundColor: surfaceColor }}
          />
          <StatBox
            label="TOTAL TIME"
            value={totalTime || '--'}
            style={{ backgroundColor: surfaceColor }}
          />
        </View>

        {/* Top 3 Podium Section */}
        {top3Users && top3Users.length > 0 && (
          <View
            style={[
              styles.podiumContainer,
              { borderTopColor: isDark ? '#333' : '#eee' },
            ]}
          >
            <Typography
              variant="micro"
              weight="bold"
              color={mutedColor}
              style={styles.podiumTitle}
            >
              Leading the charts
            </Typography>
            {top3Users.map((user, index) => (
              <View key={user.user.id} style={styles.podiumRow}>
                <Typography style={styles.podiumEmoji}>
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                </Typography>
                <Avatar
                  source={
                    user.user.photo ? { uri: user.user.photo } : undefined
                  }
                  initials={user.user.display_name || user.user.username}
                  size={24}
                />
                <Typography
                  variant="body"
                  weight="semibold"
                  color={textColor}
                  style={styles.podiumName}
                  numberOfLines={1}
                >
                  {user.user.display_name || user.user.username}
                </Typography>
                <Typography
                  variant="caption"
                  weight="bold"
                  color={theme.colors.primary}
                >
                  {user.running_total.human_readable_total}
                </Typography>
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
    marginBottom: 2,
  },
  countryText: {},
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  podiumContainer: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  podiumTitle: {
    marginBottom: 12,
  },
  podiumRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  podiumEmoji: {
    width: 24,
    fontSize: 16,
  },
  podiumName: {
    marginLeft: 8,
    flex: 1,
  },
});
