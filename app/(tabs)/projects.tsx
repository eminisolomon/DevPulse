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
  const {
    data,
    isLoading,
    isRefetching,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useProjects();

  const projectsData = React.useMemo(
    () => data?.pages.flatMap((page) => page.data) || [],
    [data],
  );

  const renderProjectItem = ({ item }: { item: WakaTimeProject }) => {
    const projectColor = item.color || theme.colors.primary;

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => router.push(`/project/${item.urlencoded_name}`)}
      >
        <Card style={styles.projectCard}>
          <View style={styles.projectHeader}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: projectColor + '15' },
              ]}
            >
              <Feather name="code" size={18} color={projectColor} />
            </View>

            <View style={styles.projectMainInfo}>
              <View style={styles.nameRow}>
                <Typography variant="body" weight="bold" numberOfLines={1}>
                  {item.name}
                </Typography>
                <View
                  style={[
                    styles.colorIndicator,
                    { backgroundColor: projectColor },
                  ]}
                />
              </View>

              <Typography
                variant="micro"
                color={theme.colors.textSecondary}
                style={styles.lastActiveText}
              >
                Last active: {item.human_readable_last_heartbeat_at || 'Never'}
              </Typography>

              {item.repository && (
                <View style={styles.repoInfo}>
                  <Feather
                    name="github"
                    size={12}
                    color={theme.colors.textSecondary}
                  />
                  <Typography
                    variant="micro"
                    color={theme.colors.textSecondary}
                    style={styles.repoText}
                    numberOfLines={1}
                  >
                    {item.repository.html_url.split('/').pop()}
                  </Typography>
                </View>
              )}
            </View>

            <View style={styles.projectStats}>
              <Feather
                name="chevron-right"
                size={18}
                color={theme.colors.border}
              />
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

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
        subtitle={`${projectsData.length} projects tracked`}
        actions={[
          {
            icon: 'filter-variant',
            onPress: () => {
              /* TODO: Implement filtering */
            },
          },
          {
            icon: 'magnify',
            onPress: () => {
              /* TODO: Implement search */
            },
          },
        ]}
      />

      <FlatList
        data={projectsData}
        renderItem={renderProjectItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator color={theme.colors.primary} />
            </View>
          ) : (
            <View style={{ height: 40 }} />
          )
        }
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View
              style={[
                styles.emptyIconContainer,
                { backgroundColor: theme.colors.border + '20' },
              ]}
            >
              <Feather name="folder" size={48} color={theme.colors.border} />
            </View>
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
        showsVerticalScrollIndicator={false}
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
    paddingBottom: 40,
  },
  projectCard: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  projectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  projectMainInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  colorIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginLeft: 8,
  },
  repoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  repoText: {
    marginLeft: 4,
    opacity: 0.7,
  },
  projectStats: {
    alignItems: 'flex-end',
    paddingLeft: 8,
  },
  lastActiveText: {
    marginTop: -2,
    marginBottom: 6,
    opacity: 0.8,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    marginTop: 40,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    marginBottom: 8,
  },
  emptySubtitle: {
    textAlign: 'center',
    maxWidth: 250,
  },
});
