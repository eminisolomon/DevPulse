import { subDays } from 'date-fns';
import { Redirect } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ActivityChart from '@/components/ActivityChart';
import LanguageChart from '@/components/LanguageChart';
import { useStats } from '@/hooks/useStats';
import { useSummaries } from '@/hooks/useSummaries';
import { useUser } from '@/hooks/useUser';
import { useAuthStore } from '@/stores/useAuthStore';

export default function Dashboard() {
  const { apiKey } = useAuthStore();

  if (!apiKey) {
    return <Redirect href="/" />;
  }

  const { data: user, isLoading: userLoading } = useUser();

  const {
    data: stats,
    isLoading: statsLoading,
    refetch: refetchStats,
    isRefetching: isStatsRefetching,
  } = useStats();

  const today = new Date();
  const start = subDays(today, 6);

  const {
    data: summaries,
    isLoading: summariesLoading,
    refetch: refetchSummaries,
    isRefetching: isSummariesRefetching,
  } = useSummaries(start, today);

  const isLoading = userLoading || statsLoading || summariesLoading;
  const isRefetching = isStatsRefetching || isSummariesRefetching;

  const handleRefresh = () => {
    refetchStats();
    refetchSummaries();
  };

  if (isLoading && !stats && !summaries) {
    return (
      <View className="flex-1 bg-neutral-900 justify-center items-center">
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-neutral-900" edges={['top']}>
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={handleRefresh}
            tintColor="#10b981"
          />
        }
      >
        <View className="mb-6">
          <Text className="text-neutral-400 text-sm uppercase font-semibold tracking-wider mb-1 font-sans">
            Welcome back
          </Text>
          <Text className="text-white text-3xl font-bold font-sans">
            {user?.data?.display_name || user?.data?.username || 'Developer'}
          </Text>
        </View>

        {/* Quick Stats Grid */}
        <View className="flex-row justify-between mb-6">
          <View className="bg-neutral-800 p-4 rounded-2xl flex-1 mr-2 border border-neutral-700 shadow-sm">
            <Text className="text-neutral-400 text-xs font-medium mb-1 uppercase tracking-wide font-sans">
              7 Day Total
            </Text>
            <Text className="text-emerald-400 text-2xl font-bold tracking-tight font-sans">
              {stats?.data?.human_readable_total || '0h 0m'}
            </Text>
          </View>
          <View className="bg-neutral-800 p-4 rounded-2xl flex-1 ml-2 border border-neutral-700 shadow-sm">
            <Text className="text-neutral-400 text-xs font-medium mb-1 uppercase tracking-wide font-sans">
              Daily Average
            </Text>
            <Text className="text-white text-2xl font-bold tracking-tight font-sans">
              {stats?.data?.human_readable_daily_average || '0h 0m'}
            </Text>
          </View>
        </View>

        {/* Languages Chart */}
        <View className="mb-8">
          <Text className="text-white text-lg font-bold mb-4 font-sans">
            Top Languages
          </Text>
          <View className="bg-neutral-800 rounded-3xl p-6 border border-neutral-700 shadow-sm">
            {stats?.data?.languages ? (
              <LanguageChart data={stats.data.languages} />
            ) : (
              <Text className="text-neutral-500 text-center py-10 font-sans">
                No language data available
              </Text>
            )}
          </View>
        </View>

        {/* Activity Chart */}
        <View className="mb-8">
          <Text className="text-white text-lg font-bold mb-4 font-sans">
            Daily Activity
          </Text>
          <View className="bg-neutral-800 rounded-3xl p-4 border border-neutral-700 shadow-sm overflow-hidden">
            {summaries?.data ? (
              <ActivityChart data={summaries.data} />
            ) : (
              <Text className="text-neutral-500 text-center py-10 font-sans">
                Loading activity data...
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
