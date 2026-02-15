import { wakaService } from '@/services/waka.service';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

export function useDurations(date: Date = new Date()) {
  const dateStr = format(date, 'yyyy-MM-dd');

  return useQuery({
    queryKey: ['durations', dateStr],
    queryFn: async () => {
      const response = await wakaService.getDurations(dateStr);

      if (!response || !response.data) return [];

      return response.data.map((item: any) => {
        const startTime = new Date(item.time * 1000);
        const startOfDay = new Date(startTime);
        startOfDay.setHours(0, 0, 0, 0);

        const secondsFromStart =
          (startTime.getTime() - startOfDay.getTime()) / 1000;

        return {
          start: secondsFromStart,
          duration: item.duration,
          color: item.color,
        };
      });
    },
  });
}
