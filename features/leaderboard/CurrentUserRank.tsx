import { Avatar } from '@/components';
import { Card } from '@/components/Card';
import { Typography } from '@/components/Typography';
import { useLeaderboardContext } from '@/contexts/LeaderboardContext';
import { useStats, useTheme } from '@/hooks';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export const CurrentUserRank = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const { currentUserRank, userCountry, selectedCountry } =
    useLeaderboardContext();
  const { data: weeklyStats } = useStats('last_7_days');

  if (!currentUserRank) return null;

  if (selectedCountry && selectedCountry !== userCountry) return null;

  return (
    <View
      style={[
        styles.currentUserContainer,
        {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => router.push(`/user/${currentUserRank.user.id}`)}
      >
        <Card
          style={[
            styles.userCard,
            {
              marginBottom: 0,
              borderWidth: 1,
              borderColor: theme.colors.primary,
              paddingVertical: 8,
            },
          ]}
        >
          <View style={styles.rankContainer}>
            <Typography
              variant="body"
              weight="bold"
              color={theme.colors.primary}
            >
              #{currentUserRank.rank}
            </Typography>
          </View>
          <View style={{ marginHorizontal: 12 }}>
            <Avatar
              source={
                currentUserRank.user.photo
                  ? { uri: currentUserRank.user.photo }
                  : undefined
              }
              initials={
                currentUserRank.user.display_name ||
                currentUserRank.user.username
              }
              size={40}
            />
          </View>
          <View style={styles.userInfo}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography variant="caption" weight="bold">
                {currentUserRank.user.display_name ||
                  currentUserRank.user.username ||
                  'You'}
              </Typography>
              <Typography
                variant="micro"
                weight="bold"
                color={theme.colors.primary}
                style={{ marginRight: 8 }}
              >
                YOU
              </Typography>
            </View>

            <Typography variant="micro" color={theme.colors.textSecondary}>
              {currentUserRank.running_total?.total_seconds > 0
                ? currentUserRank.running_total.human_readable_total
                : weeklyStats?.data.human_readable_total || 'No time logged'}
            </Typography>
          </View>
        </Card>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  currentUserContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    paddingBottom: 16,
    borderTopWidth: 1,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
  },
  rankContainer: {
    width: 40,
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
});
