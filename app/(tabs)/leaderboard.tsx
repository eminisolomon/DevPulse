import { Avatar } from '@/components';
import { BottomSheet } from '@/components/BottomSheet';
import { Card } from '@/components/Card';
import { ListItem } from '@/components/ListItem';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Typography } from '@/components/Typography';
import { useLeaderboardContext } from '@/contexts/LeaderboardContext';
import { useStats, useTheme } from '@/hooks';
import { LeaderboardUser } from '@/interfaces/leaderboard';
import { Feather } from '@expo/vector-icons';
import { BottomSheetFlatList, BottomSheetModal } from '@gorhom/bottom-sheet';
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

export default function LeaderboardScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
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
    userCountry,
  } = useLeaderboardContext();

  const { data: weeklyStats } = useStats('last_7_days');

  const topThree = React.useMemo(
    () => leaderboardData.slice(0, 3),
    [leaderboardData],
  );

  const displayTopThree = React.useMemo(() => {
    return [topThree[1], topThree[0], topThree[2]].filter(Boolean);
  }, [topThree]);

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

  const renderLeaderboardItem = ({ item }: { item: LeaderboardUser }) => (
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
        <View style={{ marginHorizontal: 12 }}>
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

  const renderTopThree = () => {
    if (displayTopThree.length === 0) return null;

    return (
      <View style={styles.podiumContainer}>
        {displayTopThree.map((user, index) => {
          const podiumRank =
            user.rank === topThree[0]?.rank
              ? 1
              : user.rank === topThree[1]?.rank
                ? 2
                : 3;
          const isFirst = podiumRank === 1;
          const isSecond = podiumRank === 2;
          const colors = {
            1: '#FFD700', // Gold
            2: '#C0C0C0', // Silver
            3: '#CD7F32', // Bronze
          };
          const color = colors[podiumRank as 1 | 2 | 3];

          return (
            <TouchableOpacity
              key={user.user.id}
              activeOpacity={0.8}
              style={[
                styles.podiumItem,
                isFirst && styles.podiumItemFirst,
                isSecond && styles.podiumItemSecond,
              ]}
              onPress={() => router.push(`/user/${user.user.id}`)}
            >
              <View style={styles.avatarWrapper}>
                <View
                  style={[
                    styles.podiumAvatar,
                    isFirst
                      ? styles.avatarFirst
                      : isSecond
                        ? styles.avatarSecond
                        : styles.avatarThird,
                    {
                      borderColor: color,
                      width: isFirst ? 86 : isSecond ? 72 : 64,
                      height: isFirst ? 86 : isSecond ? 72 : 64,
                      borderRadius: isFirst ? 43 : isSecond ? 36 : 32,
                      justifyContent: 'center',
                      alignItems: 'center',
                    },
                  ]}
                >
                  <Avatar
                    source={
                      user.user.photo ? { uri: user.user.photo } : undefined
                    }
                    initials={user.user.display_name || user.user.username}
                    size={isFirst ? 80 : isSecond ? 66 : 58}
                  />
                </View>
                <View style={[styles.podiumBadge, { backgroundColor: color }]}>
                  <Typography
                    variant="micro"
                    weight="bold"
                    color="#FFFFFF"
                    style={user.rank > 999 ? { fontSize: 8 } : undefined}
                  >
                    {user.rank}
                  </Typography>
                </View>
                {isFirst && (
                  <View style={styles.crownContainer}>
                    <Feather name="award" size={24} color="#FFD700" />
                  </View>
                )}
              </View>

              <View style={styles.podiumInfo}>
                <Typography
                  variant="caption"
                  weight="bold"
                  align="center"
                  numberOfLines={1}
                >
                  {user.user.display_name || user.user.username || 'Anon'}
                </Typography>
                <Typography
                  variant="micro"
                  color={theme.colors.textSecondary}
                  align="center"
                  weight="medium"
                >
                  {user.running_total.human_readable_total
                    .replace('hrs', 'h')
                    .replace('mins', 'm')}
                </Typography>
              </View>

              {/* Pedestal effect */}
              <View
                style={[
                  styles.pedestal,
                  {
                    backgroundColor: isDark
                      ? 'rgba(255,255,255,0.05)'
                      : 'rgba(0,0,0,0.03)',
                  },
                  isFirst
                    ? styles.pedestalFirst
                    : isSecond
                      ? styles.pedestalSecond
                      : styles.pedestalThird,
                ]}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const renderCurrentUserRank = () => {
    if (!currentUserRank) return null;

    // Hide rank if viewing a specific country that is not the user's home country
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
                paddingVertical: 8, // Reduced padding
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

  if (isLoading && !leaderboardData.length) {
    return (
      <View
        style={[styles.center, { backgroundColor: theme.colors.background }]}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
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
        renderItem={renderLeaderboardItem}
        keyExtractor={(item) => item.user.id}
        contentContainerStyle={[
          styles.listContent,
          currentUserRank && styles.listContentWithFooter,
        ]}
        ListHeaderComponent={renderTopThree}
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

      {renderCurrentUserRank()}

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
  header: {
    padding: 24,
    paddingBottom: 0,
  },
  listContent: {
    padding: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  listContentWithFooter: {
    paddingBottom: 160, // Add extra padding for the fixed footer
  },
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginTop: 24,
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  podiumItem: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  podiumItemFirst: {
    zIndex: 2,
  },
  podiumItemSecond: {
    zIndex: 1,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 12,
    alignItems: 'center',
  },
  podiumAvatar: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderWidth: 3,
  },
  avatarFirst: {
    width: 86,
    height: 86,
    borderRadius: 43,
  },
  avatarSecond: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  avatarThird: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  podiumBadge: {
    position: 'absolute',
    bottom: -2,
    right: 0,
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    paddingHorizontal: 4,
  },
  crownContainer: {
    position: 'absolute',
    top: -20,
    zIndex: 3,
  },
  podiumInfo: {
    paddingHorizontal: 4,
    marginBottom: 8,
    width: '100%',
  },
  pedestal: {
    width: '90%',
    borderRadius: 12,
    position: 'absolute',
    bottom: -16,
    zIndex: -1,
  },
  pedestalFirst: {
    height: 90,
    width: '100%',
  },
  pedestalSecond: {
    height: 70,
  },
  pedestalThird: {
    height: 50,
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
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  userInfo: {
    flex: 1,
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
  currentUserContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    paddingBottom: 16,
    borderTopWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
});
