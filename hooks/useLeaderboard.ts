import { WakaTimeLeaderboard } from '@/interfaces/leaderboard';
import { wakaService } from '@/services/waka.service';
import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query';

export function useLeaderboard(countryCode?: string, language?: string) {
  return useInfiniteQuery<
    WakaTimeLeaderboard,
    Error,
    InfiniteData<WakaTimeLeaderboard>,
    (string | undefined)[],
    number
  >({
    queryKey: ['leaderboard', countryCode, language],
    queryFn: ({ pageParam }) =>
      wakaService.getLeaderboard(language, countryCode, pageParam),
    initialPageParam: 1,
    staleTime: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
  });
}
