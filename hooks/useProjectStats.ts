import { WakaTimeStats } from '@/interfaces';
import { wakaService } from '@/services';
import { useQuery } from '@tanstack/react-query';

export function useProjectStats(
  projectName: string,
  range: string = 'last_7_days',
) {
  return useQuery<WakaTimeStats>({
    queryKey: ['project-stats', projectName, range],
    queryFn: () => wakaService.getProjectStats(projectName, range),
    enabled: !!projectName,
    staleTime: 0,
    gcTime: 0,
  });
}
