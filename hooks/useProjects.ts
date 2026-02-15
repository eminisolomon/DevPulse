import { WakaTimeProjectsResponse } from '@/interfaces/project';
import { wakaService } from '@/services/waka.service';
import { useQuery } from '@tanstack/react-query';

export function useProjects() {
  return useQuery<WakaTimeProjectsResponse>({
    queryKey: ['projects'],
    queryFn: () => wakaService.getProjects(),
  });
}
