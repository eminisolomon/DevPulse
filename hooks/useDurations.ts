import { wakaService } from '@/services/waka.service';
import { useQuery } from '@tanstack/react-query';

export function useDurations(date: Date) {
  const dateStr = date.toISOString().split('T')[0];
  return useQuery({
    queryKey: ['durations', dateStr],
    queryFn: () => wakaService.getDurations(dateStr),
  });
}
