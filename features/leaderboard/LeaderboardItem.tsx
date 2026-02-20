import { Avatar, Card, Typography } from '@/components';
import { useTheme } from '@/hooks';
import { LeaderboardUser } from '@/interfaces/leaderboard';
import { commonStyles } from '@/theme';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface LeaderboardItemProps {
  item: LeaderboardUser;
}

export const LeaderboardItem = ({ item }: LeaderboardItemProps) => {
  const { theme } = useTheme();
  const router = useRouter();

  const styles = StyleSheet.create({
    userCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing[3],
      marginBottom: theme.spacing[2],
      borderRadius: theme.tokens.borderRadius.md,
    },
    rankContainer: {
      width: 40,
      ...commonStyles.center,
    },
    userInfo: {
      flex: 1,
    },
  });

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => router.push(`/user/${item.user.id}`)}
    >
      <Card style={styles.userCard}>
        <View style={styles.rankContainer}>
          <Typography
            variant="body"
            weight="bold"
            color={theme.colors.textSecondary}
          >
            #{item.rank}
          </Typography>
        </View>
        <View style={{ marginHorizontal: theme.spacing[3] }}>
          <Avatar
            source={item.user.photo ? { uri: item.user.photo } : undefined}
            initials={item.user.display_name || item.user.username}
            size={40}
          />
        </View>
        <View style={styles.userInfo}>
          <Typography variant="caption" weight="bold">
            {item.user.display_name || item.user.username || 'Anonymous'}
          </Typography>
          <Typography variant="micro" color={theme.colors.textSecondary}>
            {item.running_total.human_readable_total}
          </Typography>
        </View>
      </Card>
    </TouchableOpacity>
  );
};
