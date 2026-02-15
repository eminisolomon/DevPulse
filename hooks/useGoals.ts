import { db } from '@/db';
import { syncService } from '@/services/sync.service';
import { useQuery } from '@tanstack/react-query';

export function useGoals() {
  const query = useQuery({
    queryKey: ['goals', 'local'],
    queryFn: async () => {
      // Fetch from local DB
      const localGoals = await db.query.goals.findMany();

      // Map back to WakaTime types
      const mapped = localGoals.map((g) => ({
        id: g.id,
        title: g.title,
        status: g.status,
        seconds: g.seconds,
        improvement_status: g.improvementStatus,
        is_enabled: g.isEnabled,
        range_text: g.rangeText,
        chart_data: g.chartData ? JSON.parse(g.chartData) : [],
        languages: g.languages ? JSON.parse(g.languages) : [],
      }));

      return { data: mapped };
    },
  });

  // Background sync trigger
  const sync = async () => {
    await syncService.syncGoals();
    query.refetch();
  };

  return {
    ...query,
    sync,
    // Overwrite refetch to trigger sync then reload local
    refetch: sync,
  };
}
