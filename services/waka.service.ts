import { WakaTimeStats } from '@/interfaces/stats';
import { WakaTimeSummaries } from '@/interfaces/summary';
import { User } from '@/interfaces/user';
import { fetchWithAuth } from '@/utilities/api';

export const wakaService = {
  getStats: (range: string = 'last_7_days'): Promise<WakaTimeStats> =>
    fetchWithAuth<WakaTimeStats>(`/users/current/stats/${range}`),
  getSummaries: (start: string, end: string): Promise<WakaTimeSummaries> =>
    fetchWithAuth<WakaTimeSummaries>(
      `/users/current/summaries?start=${start}&end=${end}`,
    ),
  getUser: (): Promise<User> => fetchWithAuth<User>('/users/current'),
};
