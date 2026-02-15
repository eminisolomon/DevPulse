import { api } from '@/services/api';
import { useQuery } from '@tanstack/react-query';

export function useSummaries(start: Date, end: Date) {
  return useQuery({
    queryKey: ['summaries', start, end],
    queryFn: () => api.getSummaries(start, end),
  });
}
