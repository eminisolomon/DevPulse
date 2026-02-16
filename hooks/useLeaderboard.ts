import { WakaTimeLeaderboard } from '@/interfaces/leaderboard';
import { wakaService } from '@/services/waka.service';
import { useInfiniteQuery } from '@tanstack/react-query';

export function useLeaderboard(language?: string, countryCode?: string) {
  return useInfiniteQuery<WakaTimeLeaderboard>({
    queryKey: ['leaderboard', language, countryCode],
    queryFn: ({ pageParam = 1 }) =>
      wakaService.getLeaderboard(language, countryCode, pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
  });
}
