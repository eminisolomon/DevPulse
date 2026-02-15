import { api } from '@/services/api';
import { useQuery } from '@tanstack/react-query';
import { WakaTimeStats } from '@/interfaces/stats';

export function useStats(range: string = 'last_7_days') {
  return useQuery<WakaTimeStats>({
    queryKey: ['stats', range],
    queryFn: () => api.getStats(range),
  });
}
