import { ScreenHeader } from '@/components/ScreenHeader';
import { ProjectListSkeleton } from '@/components/skeletons/ProjectListSkeleton';
import { Typography } from '@/components/Typography';
import { ProjectCard } from '@/features/projects/ProjectCard';
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
  View,
} from 'react-native';

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
    return <ProjectCard item={item} />;
  };

  if (isLoading && !data) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
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
        <ProjectListSkeleton />
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
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
            colors={[theme.colors.primary]} // For Android
            progressBackgroundColor={theme.colors.surface} // For Android
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
    </View>
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
    paddingTop: 16,
    paddingBottom: 40,
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
