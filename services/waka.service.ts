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
  getProjects: (page?: number): Promise<WakaTimeProjectsResponse> => {
    let url = '/users/current/projects';
    if (page) url += `?page=${page}`;
    return fetchWithAuth<WakaTimeProjectsResponse>(url);
  },
  getProjectStats: (
    projectName: string,
    range: string = 'last_7_days',
  ): Promise<WakaTimeStats> =>
    fetchWithAuth<WakaTimeStats>(
      `/users/current/stats/${range}?project=${projectName}`,
    ),
  getGoals: (): Promise<WakaTimeGoalsResponse> =>
    fetchWithAuth<WakaTimeGoalsResponse>('/users/current/goals'),
  getLeaderboard: (
    language?: string,
    countryCode?: string,
    page?: number,
  ): Promise<WakaTimeLeaderboard> => {
    let url = '/leaders';
    const params = new URLSearchParams();
    if (language) params.append('language', language);
    if (countryCode) params.append('country_code', countryCode);
    if (page) params.append('page', page.toString());
    if (params.toString()) url += `?${params.toString()}`;
    return fetchWithAuth<WakaTimeLeaderboard>(url);
  },
  getDurations: (date: string): Promise<any> =>
    fetchWithAuth<any>(`/users/current/durations?date=${date}`),
};
