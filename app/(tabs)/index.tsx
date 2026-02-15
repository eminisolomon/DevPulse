import ActivityChart from '@/components/ActivityChart';
import LanguageChart from '@/components/LanguageChart';
import { useAuthStore } from '@/stores/useAuthStore';
import { api } from '@/utils/api';
import { useQuery } from '@tanstack/react-query';
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

export default function Dashboard() {
  const { apiKey } = useAuthStore();

  if (!apiKey) {
    return <Redirect href="/" />;
  }

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['user'],
    queryFn: api.getUser,
  });

  const {
    data: stats,
    isLoading: statsLoading,
    refetch: refetchStats,
    isRefetching,
  } = useQuery({
    queryKey: ['stats', 'last_7_days'],
    queryFn: () => api.getStats('last_7_days'),
  });

  const today = new Date();
  const start = subDays(today, 6); // Last 7 days including today

  const {
    data: summaries,
    isLoading: summariesLoading,
    refetch: refetchSummaries,
  } = useQuery({
    queryKey: ['summaries', start, today],
    queryFn: () => api.getSummaries(start, today),
  });

  const isLoading = userLoading || statsLoading || summariesLoading;

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
          <Text className="text-neutral-400 text-sm uppercase font-semibold tracking-wider mb-1">
            Welcome back
          </Text>
          <Text className="text-white text-3xl font-bold">
            {user?.data?.display_name || user?.data?.username || 'Developer'}
          </Text>
        </View>

        {/* Quick Stats Grid */}
        <View className="flex-row justify-between mb-6">
          <View className="bg-neutral-800 p-4 rounded-2xl flex-1 mr-2 border border-neutral-700 shadow-sm">
            <Text className="text-neutral-400 text-xs font-medium mb-1 uppercase tracking-wide">
              7 Day Total
            </Text>
            <Text className="text-emerald-400 text-2xl font-bold tracking-tight">
              {stats?.data?.human_readable_total || '0h 0m'}
            </Text>
          </View>
          <View className="bg-neutral-800 p-4 rounded-2xl flex-1 ml-2 border border-neutral-700 shadow-sm">
            <Text className="text-neutral-400 text-xs font-medium mb-1 uppercase tracking-wide">
              Daily Average
            </Text>
            <Text className="text-white text-2xl font-bold tracking-tight">
              {stats?.data?.human_readable_daily_average || '0h 0m'}
            </Text>
          </View>
        </View>

        {/* Languages Chart */}
        <View className="mb-8">
          <Text className="text-white text-lg font-bold mb-4">
            Top Languages
          </Text>
          <View className="bg-neutral-800 rounded-3xl p-6 border border-neutral-700 shadow-sm">
            {stats?.data?.languages ? (
              <LanguageChart data={stats.data.languages} />
            ) : (
              <Text className="text-neutral-500 text-center py-10">
                No language data available
              </Text>
            )}
          </View>
        </View>

        {/* Activity Chart */}
        <View className="mb-8">
          <Text className="text-white text-lg font-bold mb-4">
            Daily Activity
          </Text>
          <View className="bg-neutral-800 rounded-3xl p-4 border border-neutral-700 shadow-sm overflow-hidden">
            {summaries?.data ? (
              <ActivityChart data={summaries.data} />
            ) : (
              <Text className="text-neutral-500 text-center py-10">
                Loading activity data...
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
