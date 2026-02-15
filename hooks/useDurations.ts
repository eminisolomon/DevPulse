import { wakaService } from '@/services/waka.service';
import { useQuery } from '@tanstack/react-query';
import { format, startOfDay } from 'date-fns';

export function useDurations(date: Date = new Date()) {
  const dateStr = format(date, 'yyyy-MM-dd');

  return useQuery({
    queryKey: ['durations', dateStr],
    queryFn: async () => {
      const response = await wakaService.getDurations(dateStr);
      if (!response || !Array.isArray(response.data)) return [];

      const dayStart = startOfDay(date).getTime() / 1000;

      return response.data.map((d: any) => ({
        // Use epoch start minus day start to get seconds from 00:00:00
        start: Math.max(0, d.start - dayStart),
        duration: d.duration,
        color: d.color,
      }));
    },
  });
}
