import { WakaTimeGoalsResponse } from '@/interfaces/goal';
import { WakaTimeLeaderboard } from '@/interfaces/leaderboard';
import { WakaTimeProjectsResponse } from '@/interfaces/project';
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
  getProjects: (): Promise<WakaTimeProjectsResponse> =>
    fetchWithAuth<WakaTimeProjectsResponse>('/users/current/projects'),
  getProjectStats: (
    projectName: string,
    range: string = 'last_7_days',
  ): Promise<WakaTimeStats> =>
    fetchWithAuth<WakaTimeStats>(
      `/users/current/stats/${range}?project=${projectName}`,
    ),
  getGoals: (): Promise<WakaTimeGoalsResponse> =>
    fetchWithAuth<WakaTimeGoalsResponse>('/users/current/goals'),
  getLeaderboard: (language?: string): Promise<WakaTimeLeaderboard> =>
    fetchWithAuth<WakaTimeLeaderboard>(
      language ? `/leaders?language=${language}` : '/leaders',
    ),
  getDurations: (date: string): Promise<any> =>
    fetchWithAuth<any>(`/users/current/durations?date=${date}`),
};
