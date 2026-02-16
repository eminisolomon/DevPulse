import { BottomSheet, ListItem, Typography } from '@/components';
import { ScreenHeader } from '@/components/ScreenHeader';
import { LeaderboardSkeleton } from '@/components/skeletons/LeaderboardSkeleton';
import { useLeaderboardContext } from '@/contexts/LeaderboardContext';
import {
  CurrentUserRank,
  LeaderboardItem,
  TopThreePodium,
} from '@/features/leaderboard';
import { useTheme } from '@/hooks';
import { Feather } from '@expo/vector-icons';
import { BottomSheetFlatList, BottomSheetModal } from '@gorhom/bottom-sheet';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

export default function LeaderboardScreen() {
  const { theme } = useTheme();
  const bottomSheetRef = React.useRef<BottomSheetModal>(null);

  const {
    selectedCountry,
    setSelectedCountry,
    isLoading,
    isRefetching,
    refetch,
    leaderboardData,
    currentUserRank,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    countries,
  } = useLeaderboardContext();

  const topThree = React.useMemo(
    () => leaderboardData.slice(0, 3),
    [leaderboardData],
  );

  const remainingUsers = React.useMemo(
    () => leaderboardData.slice(3),
    [leaderboardData],
  );

  const handlePresentModalPress = React.useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  const handleCountrySelect = (country: string | undefined) => {
    setSelectedCountry(country);
    bottomSheetRef.current?.dismiss();
  };

  if (isLoading && !leaderboardData.length) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <ScreenHeader
          title="Leaderboard"
          subtitle={
            selectedCountry
              ? `${selectedCountry} Top Developers`
              : 'Global Top Developers'
          }
          rightElement={
            <TouchableOpacity
              activeOpacity={0.7}
              style={{
                padding: 8,
                backgroundColor: theme.colors.surfaceHighlight,
                borderRadius: 8,
              }}
              onPress={handlePresentModalPress}
            >
              <Typography variant="title">
                {countries.find((c) => c.value === selectedCountry)?.icon ||
                  '🌍'}
              </Typography>
            </TouchableOpacity>
          }
        />
        <LeaderboardSkeleton />
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScreenHeader
        title="Leaderboard"
        subtitle={
          selectedCountry
            ? `${selectedCountry} Top Developers`
            : 'Global Top Developers'
        }
        rightElement={
          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              padding: 8,
              backgroundColor: theme.colors.surfaceHighlight,
              borderRadius: 8,
            }}
            onPress={handlePresentModalPress}
          >
            <Typography variant="title">
              {countries.find((c) => c.value === selectedCountry)?.icon || '🌍'}
            </Typography>
          </TouchableOpacity>
        }
      />

      <FlatList
        data={remainingUsers}
        renderItem={({ item }) => <LeaderboardItem item={item} />}
        keyExtractor={(item) => item.user.id}
        contentContainerStyle={[
          styles.listContent,
          currentUserRank && styles.listContentWithFooter,
        ]}
        ListHeaderComponent={<TopThreePodium users={topThree} />}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator color={theme.colors.primary} />
            </View>
          ) : null
        }
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
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
          remainingUsers.length === 0 && leaderboardData.length === 0 ? (
            <View style={styles.emptyState}>
              <Feather name="users" size={48} color={theme.colors.border} />
              <Typography
                variant="title"
                weight="semibold"
                style={styles.emptyTitle}
              >
                Leaderboard Unavailable
              </Typography>
              <Typography
                color={theme.colors.textSecondary}
                style={styles.emptySubtitle}
              >
                Unable to fetch leaderboard data at this time.
              </Typography>
            </View>
          ) : null
        }
      />

      <CurrentUserRank />

      <BottomSheet
        ref={bottomSheetRef}
        title="Select Location"
        snapPoints={['50%', '90%']}
      >
        <BottomSheetFlatList
          data={countries}
          keyExtractor={(item: {
            label: string;
            value: string | undefined;
            icon: string;
          }) => item.label}
          renderItem={({
            item,
          }: {
            item: { label: string; value: string | undefined; icon: string };
          }) => (
            <ListItem
              title={item.label}
              leftIcon={<Typography variant="title">{item.icon}</Typography>}
              rightIcon={
                selectedCountry === item.value ? (
                  <Feather
                    name="check"
                    size={20}
                    color={theme.colors.primary}
                  />
                ) : undefined
              }
              onPress={() => handleCountrySelect(item.value)}
            />
          )}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      </BottomSheet>
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
    paddingBottom: 100,
  },
  listContentWithFooter: {
    paddingBottom: 160,
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
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});
