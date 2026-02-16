import { WakaTimeProjectsResponse } from '@/interfaces/project';
import { wakaService } from '@/services/waka.service';
import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query';

export function useProjects() {
  return useInfiniteQuery<
    WakaTimeProjectsResponse,
    Error,
    InfiniteData<WakaTimeProjectsResponse>,
    string[],
    number
  >({
    queryKey: ['projects'],
    queryFn: ({ pageParam }) => wakaService.getProjects(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.total_pages && allPages.length < lastPage.total_pages) {
        return allPages.length + 1;
      }
      return undefined;
    },
  });
}
