import { COUNTRIES } from '@/constants/countries';
import { useLeaderboard, useUser } from '@/hooks';
import { LeaderboardUser } from '@/interfaces/leaderboard';
import { useLeaderboardStore } from '@/stores/useLeaderboardStore';
import React, { createContext, useContext, useEffect, useMemo } from 'react';

interface LeaderboardContextType {
  selectedCountry: string | undefined;
  setSelectedCountry: (country: string | undefined) => void;
  isLoading: boolean;
  isRefetching: boolean;
  leaderboardData: LeaderboardUser[];
  currentUserRank: LeaderboardUser | undefined;
  refetch: () => void;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  countries: typeof COUNTRIES;
  userCountry: string | undefined;
}

const LeaderboardContext = createContext<LeaderboardContextType | undefined>(
  undefined,
);

export function LeaderboardProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: userData } = useUser();
  const { selectedCountry, setSelectedCountry, fetchUserRanks } =
    useLeaderboardStore();

  const userCountry = useMemo(() => {
    return userData?.data?.city?.country_code;
  }, [userData]);

  useEffect(() => {
    if (userCountry) {
      fetchUserRanks(userCountry);
      if (selectedCountry === undefined) {
        setSelectedCountry(userCountry);
      }
    }
  }, [userCountry, selectedCountry, setSelectedCountry, fetchUserRanks]);

  const {
    data: leaderboardDataObj,
    isLoading,
    isRefetching,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useLeaderboard();

  const leaderboardData = useMemo(
    () => leaderboardDataObj?.pages?.flatMap((page) => page.data) || [],
    [leaderboardDataObj?.pages],
  );

  const currentUserRank = useMemo(() => {
    return leaderboardDataObj?.pages?.[0]?.current_user;
  }, [leaderboardDataObj?.pages]);

  const value = {
    selectedCountry,
    setSelectedCountry,
    isLoading,
    isRefetching,
    leaderboardData,
    currentUserRank,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    countries: COUNTRIES,
    userCountry,
  };

  return (
    <LeaderboardContext.Provider value={value}>
      {children}
    </LeaderboardContext.Provider>
  );
}

export function useLeaderboardContext() {
  const context = useContext(LeaderboardContext);
  if (context === undefined) {
    throw new Error(
      'useLeaderboardContext must be used within a LeaderboardProvider',
    );
  }
  return context;
}
