import { WakaTimeGoalsResponse } from '@/interfaces';
import { wakaService } from '@/services';
import { useQuery } from '@tanstack/react-query';

export function useGoals() {
  return useQuery<WakaTimeGoalsResponse>({
    queryKey: ['goals'],
    queryFn: () => wakaService.getGoals(),
  });
}
