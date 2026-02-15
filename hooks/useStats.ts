import { api } from '@/services/api';
import { useQuery } from '@tanstack/react-query';

export function useStats(range: string = 'last_7_days') {
  return useQuery({
    queryKey: ['stats', range],
    queryFn: () => api.getStats(range),
  });
}
