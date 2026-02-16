import { Card } from '@/components/Card';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Typography } from '@/components/Typography';
import { useProjects, useTheme } from '@/hooks';
import { WakaTimeProject } from '@/interfaces/project';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProjectsScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { data, isLoading, refetch, isRefetching } = useProjects();

  const renderProjectItem = ({ item }: { item: WakaTimeProject }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => router.push(`/project/${item.urlencoded_name}`)}
    >
      <Card style={styles.projectCard}>
        <View style={styles.projectInfo}>
          <View>
            <Typography variant="title" weight="bold">
              {item.name}
            </Typography>
            {item.repository && (
              <View style={styles.repoInfo}>
                <Feather
                  name="github"
                  size={14}
                  color={theme.colors.textSecondary}
                />
                <Typography
                  variant="micro"
                  color={theme.colors.textSecondary}
                  style={styles.repoText}
                >
                  {item.repository.html_url.split('/').pop()}
                </Typography>
              </View>
            )}
          </View>
          <Feather
            name="chevron-right"
            size={20}
            color={theme.colors.textSecondary}
          />
        </View>

        {/* Note: Sparklines could go here in a future update if summaries data is pre-fetched */}
        <View style={styles.footer}>
          <Typography variant="micro" color={theme.colors.textSecondary}>
            Last Activity: {item.human_readable_last_heartbeat_at || 'Never'}
          </Typography>
        </View>
      </Card>
    </TouchableOpacity>
  );

  if (isLoading && !data) {
    return (
      <View
        style={[styles.center, { backgroundColor: theme.colors.background }]}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      <ScreenHeader
        title="Projects"
        subtitle={`${data?.data?.length || 0} active projects`}
      />

      <FlatList
        data={data?.data}
        renderItem={renderProjectItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Feather name="folder" size={48} color={theme.colors.border} />
            <Typography
              variant="title"
              weight="semibold"
              style={styles.emptyTitle}
            >
              No Projects Found
            </Typography>
            <Typography
              color={theme.colors.textSecondary}
              style={styles.emptySubtitle}
            >
              Make sure you have projects tracked in WakaTime.
            </Typography>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
    paddingBottom: 100,
  },
  projectCard: {
    marginBottom: 12,
    padding: 16,
  },
  projectInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  repoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  repoText: {
    marginLeft: 4,
  },
  footer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    marginTop: 40,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    textAlign: 'center',
  },
});
