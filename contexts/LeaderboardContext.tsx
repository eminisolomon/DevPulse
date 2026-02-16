import { COUNTRIES } from '@/constants/countries';
import { useLeaderboard, useUser } from '@/hooks';
import { LeaderboardUser } from '@/interfaces/leaderboard';
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

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
  const [selectedCountry, setSelectedCountry] = useState<string | undefined>(
    undefined,
  );

  useEffect(() => {
    if (
      userData?.data.timezone?.includes('Lagos') &&
      selectedCountry === undefined
    ) {
      setSelectedCountry('NG');
    }
  }, [userData]);

  const {
    data,
    isLoading,
    isRefetching,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useLeaderboard(selectedCountry);

  const leaderboardData = useMemo(
    () => data?.pages.flatMap((page) => page.data) || [],
    [data],
  );

  const currentUserRank = useMemo(() => {
    return data?.pages[0]?.current_user;
  }, [data]);

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
