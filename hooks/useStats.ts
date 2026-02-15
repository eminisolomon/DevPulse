import { WakaTimeStats } from '@/interfaces/stats';
import { wakaService } from '@/services/waka.service';
import { useQuery } from '@tanstack/react-query';

export function useStats(range: string = 'last_7_days') {
  return useQuery<WakaTimeStats>({
    queryKey: ['stats', range],
    queryFn: () => wakaService.getStats(range),
  });
}
