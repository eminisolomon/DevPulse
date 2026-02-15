import { wakaService } from '@/services/waka.service';
import { useQueries } from '@tanstack/react-query';
import { format, subDays } from 'date-fns';

export function usePunchCardData(days: number = 7) {
  const dates = Array.from({ length: days }).map((_, i) =>
    subDays(new Date(), i),
  );

  const queries = useQueries({
    queries: dates.map((date) => ({
      queryKey: ['durations', format(date, 'yyyy-MM-dd')],
      queryFn: () => wakaService.getDurations(format(date, 'yyyy-MM-dd')),
      staleTime: 1000 * 60 * 5, // 5 minutes
    })),
  });

  const isLoading = queries.some((q) => q.isLoading);

  // Aggregate data into [{ day: 0-6, hour: 0-23, seconds: number }]
  const aggregatedData: { day: number; hour: number; seconds: number }[] = [];

  // Initialize with zeros
  for (let d = 0; d < 7; d++) {
    for (let h = 0; h < 24; h++) {
      aggregatedData.push({ day: d, hour: h, seconds: 0 });
    }
  }

  queries.forEach((query, index) => {
    if (query.data && query.data.data) {
      const dayIdx = dates[index].getDay();
      query.data.data.forEach((duration: any) => {
        const date = new Date(duration.time * 1000);
        const hour = date.getHours();
        const entry = aggregatedData.find(
          (d) => d.day === dayIdx && d.hour === hour,
        );
        if (entry) {
          entry.seconds += duration.duration;
        }
      });
    }
  });

  return { data: aggregatedData, isLoading };
}
