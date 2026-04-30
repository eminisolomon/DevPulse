import { WakaTimeDuration } from '@/interfaces';
import { wakaService } from '@/services';
import { getProjectColor } from '@/utilities';
import { useQuery } from '@tanstack/react-query';
import { format, startOfDay } from 'date-fns';

export function useDurations(date: Date = new Date()) {
  const dateStr = format(date, 'yyyy-MM-dd');

  const query = useQuery({
    queryKey: ['durations', dateStr],
    queryFn: async () => {
      const response = await wakaService.getDurations(dateStr);
      if (!response || !Array.isArray(response.data)) return [];

      const dayStart = startOfDay(date).getTime() / 1000;

      return response.data.map((duration: WakaTimeDuration) => {
        const startTime =
          typeof duration.time === 'string'
            ? new Date(duration.time).getTime() / 1000
            : duration.time;

        return {
          start: Math.max(0, startTime - dayStart),
          duration: duration.duration,
          project: duration.project,
          color: duration.project
            ? getProjectColor(duration.project)
            : undefined,
        };
      });
    },
    staleTime: 0,
    gcTime: 0,
  });

  return {
    // Data
    data: query.data || [],

    // State
    isLoading: query.isLoading,
    isRefetching: query.isRefetching,
    error: query.error,

    // Actions
    refetch: query.refetch,
  };
}
