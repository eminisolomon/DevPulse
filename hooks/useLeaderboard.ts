import { WakaTimeLeaderboard } from '@/interfaces/leaderboard';
import { wakaService } from '@/services/waka.service';
import { useQuery } from '@tanstack/react-query';

export function useLeaderboard(language?: string) {
  return useQuery<WakaTimeLeaderboard>({
    queryKey: ['leaderboard', language],
    queryFn: () => wakaService.getLeaderboard(language),
  });
}
