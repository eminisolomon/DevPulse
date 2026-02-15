import { WakaTimeGoalsResponse } from '@/interfaces/goal';
import { wakaService } from '@/services/waka.service';
import { useQuery } from '@tanstack/react-query';

export function useGoals() {
  return useQuery<WakaTimeGoalsResponse>({
    queryKey: ['goals'],
    queryFn: () => wakaService.getGoals(),
  });
}
