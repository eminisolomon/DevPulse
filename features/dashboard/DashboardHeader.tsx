import { Avatar, Typography } from '@/components';
import { useTheme, useUser } from '@/hooks';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { OrganizationSwitcher } from './OrganizationSwitcher';

export const DashboardHeader = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const { data: user } = useUser();

  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View style={styles.greetingContainer}>
          <Typography
            variant="caption"
            weight="semibold"
            color={theme.colors.textSecondary}
            style={styles.greeting}
          >
            Welcome back
          </Typography>
          <Typography variant="headline" weight="bold">
            {user?.data?.display_name || user?.data?.username || 'Developer'}
          </Typography>
        </View>

        <View style={styles.rightContainer}>
          <OrganizationSwitcher />
          <TouchableOpacity onPress={() => router.push('/settings')}>
            <Avatar
              source={user?.data?.photo ? { uri: user.data.photo } : undefined}
              initials={user?.data?.display_name || user?.data?.username}
              size={44}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingContainer: {
    flex: 1,
    marginRight: 12,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  greeting: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
});
