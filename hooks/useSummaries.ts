import { wakaService } from '@/services/waka.service';
import { useQuery } from '@tanstack/react-query';

import { WakaTimeSummaries } from '@/interfaces/summary';

export function useSummaries(start: Date, end: Date) {
  return useQuery<WakaTimeSummaries>({
    queryKey: ['summaries', start, end],
    queryFn: () =>
      wakaService.getSummaries(
        start.toISOString().split('T')[0],
        end.toISOString().split('T')[0],
      ),
  });
}
