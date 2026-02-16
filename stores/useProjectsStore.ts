import { WakaTimeProject as Project } from '@/interfaces/project';
import { wakaService } from '@/services/waka.service';
import { asyncStorage } from '@/utilities/storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface ProjectsState {
  data: Project[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
  fetchProjects: (reset?: boolean) => Promise<void>;
  fetchNextPage: () => Promise<void>;
}

export const useProjectsStore = create<ProjectsState>()(
  persist(
    (set, get) => ({
      data: [],
      isLoading: false,
      isFetchingNextPage: false,
      error: null,
      page: 1,
      hasMore: true,
      fetchProjects: async (reset = false) => {
        set({
          isLoading: true,
          error: null,
          ...(reset ? { data: [], page: 1, hasMore: true } : {}),
        });
        try {
          const response = await wakaService.getProjects(1);
          set({
            data: response.data,
            isLoading: false,
            page: 1,
            hasMore: response.page < (response.total_pages || 1),
          });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },
      fetchNextPage: async () => {
        const { page, hasMore, isFetchingNextPage, isLoading, data } = get();
        if (!hasMore || isFetchingNextPage || isLoading) return;

        set({ isFetchingNextPage: true });
        try {
          const nextPage = page + 1;
          const response = await wakaService.getProjects(nextPage);
          set({
            data: [...data, ...response.data],
            page: nextPage,
            hasMore: response.page < (response.total_pages || 1),
            isFetchingNextPage: false,
          });
        } catch (error: any) {
          set({ error: error.message, isFetchingNextPage: false });
        }
      },
    }),
    {
      name: 'projects-storage',
      storage: createJSONStorage(() => asyncStorage),
    },
  ),
);
