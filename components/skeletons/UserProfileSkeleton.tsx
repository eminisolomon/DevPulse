import { useTheme } from '@/hooks';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card } from '../Card';
import { Skeleton } from '../Skeleton';

export const UserProfileSkeleton = () => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileSection}>
          <Skeleton
            width={120}
            height={120}
            variant="circle"
            style={styles.avatar}
          />

          <Skeleton width={200} height={32} style={styles.displayName} />

          <Skeleton width={140} height={20} style={styles.username} />

          <View style={styles.badgesContainer}>
            <Skeleton width={90} height={28} borderRadius={8} />
            <Skeleton width={110} height={28} borderRadius={8} />
          </View>
        </View>

        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Skeleton width={80} height={12} style={styles.statLabel} />
            <Skeleton width={120} height={24} />
          </Card>
          <Card style={styles.statCard}>
            <Skeleton width={70} height={12} style={styles.statLabel} />
            <Skeleton width={100} height={24} />
          </Card>
        </View>

        <Skeleton width={120} height={14} style={styles.sectionHeader} />

        <Card style={styles.languagesCard}>
          {[1, 2, 3, 4].map((i) => (
            <View key={i} style={styles.langItem}>
              <Skeleton width={100} height={16} />
              <Skeleton width={60} height={16} />
            </View>
          ))}
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  avatar: {
    marginBottom: 16,
  },
  displayName: {
    marginBottom: 8,
    marginTop: 8,
  },
  username: {
    marginBottom: 16,
  },
  badgesContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
    justifyContent: 'center',
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
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
});
