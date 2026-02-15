import { Card } from '@/components';
import { Typography } from '@/components/Typography';
import { useLeaderboard, useTheme } from '@/hooks';
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const { data: leaderboardData } = useLeaderboard();
  const router = useRouter();

  const userRank = useMemo(() => {
    return leaderboardData?.data.find((item) => item.user.id === id);
  }, [leaderboardData, id]);

  if (!userRank) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Feather name="arrow-left" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Typography variant="headline" weight="bold">
            User Not Found
          </Typography>
        </View>
      </SafeAreaView>
    );
  }

  const { user, running_total, rank } = userRank;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Typography variant="headline" weight="bold">
          Profile
        </Typography>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: user.photo || 'https://via.placeholder.com/150' }}
              style={styles.avatar}
            />
            <View
              style={[
                styles.rankBadge,
                { backgroundColor: theme.colors.primary },
              ]}
            >
              <Typography
                variant="micro"
                weight="bold"
                style={{ color: '#fff' }}
              >
                #{rank}
              </Typography>
            </View>
          </View>

          <Typography variant="title" weight="bold" style={styles.displayName}>
            {user.display_name || user.username || 'Anonymous'}
          </Typography>
          <Typography
            color={theme.colors.textSecondary}
            style={styles.username}
          >
            @{user.username || 'anonymous'}
          </Typography>

          {user.is_hireable && (
            <View
              style={[
                styles.hireableBadge,
                { backgroundColor: theme.colors.primary + '15' },
              ]}
            >
              <Feather name="zap" size={14} color={theme.colors.primary} />
              <Typography
                variant="micro"
                weight="bold"
                color={theme.colors.primary}
                style={styles.badgeText}
              >
                HIREABLE
              </Typography>
            </View>
          )}
        </View>

        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Typography
              variant="micro"
              color={theme.colors.textSecondary}
              style={styles.statLabel}
            >
              WEEKLY TOTAL
            </Typography>
            <Typography variant="title" weight="bold">
              {running_total.human_readable_total}
            </Typography>
          </Card>
          <Card style={styles.statCard}>
            <Typography
              variant="micro"
              color={theme.colors.textSecondary}
              style={styles.statLabel}
            >
              DAILY AVG
            </Typography>
            <Typography variant="title" weight="bold">
              {running_total.human_readable_daily_average}
            </Typography>
          </Card>
        </View>

        <Typography
          variant="micro"
          weight="bold"
          color={theme.colors.textSecondary}
          style={styles.sectionHeader}
        >
          TOP LANGUAGES
        </Typography>
        <Card style={styles.languagesCard}>
          {running_total.languages.map((lang, index) => (
            <View
              key={lang.name}
              style={[
                styles.langItem,
                index !== running_total.languages.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: theme.colors.border + '50',
                },
              ]}
            >
              <Typography weight="medium">{lang.name}</Typography>
              <Typography color={theme.colors.textSecondary}>
                {Math.round(lang.total_seconds / 3600)}h
              </Typography>
            </View>
          ))}
          {running_total.languages.length === 0 && (
            <Typography
              color={theme.colors.textSecondary}
              style={{ textAlign: 'center', padding: 16 }}
            >
              No language data available
            </Typography>
          )}
        </Card>

        {user.website && (
          <TouchableOpacity
            style={[
              styles.webButton,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <Feather name="globe" size={18} color={theme.colors.text} />
            <Typography weight="bold" style={{ marginLeft: 12 }}>
              {user.human_readable_website || 'Visit Website'}
            </Typography>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  backButton: {
    marginRight: 16,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 8,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  rankBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#fff',
  },
  displayName: {
    marginBottom: 4,
  },
  username: {
    marginBottom: 12,
  },
  hireableBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    marginLeft: 6,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  statLabel: {
    marginBottom: 8,
  },
  sectionHeader: {
    marginLeft: 4,
    marginBottom: 12,
  },
  languagesCard: {
    padding: 4,
    marginBottom: 24,
  },
  langItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  webButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
  },
});
