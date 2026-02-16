import { WakaTimeGoal, WakaTimeGoalsResponse } from '@/interfaces/goal';
import { WakaTimeLeaderboard } from '@/interfaces/leaderboard';
import { WakaTimeProjectsResponse } from '@/interfaces/project';
import { WakaTimeAllTime, WakaTimeStats } from '@/interfaces/stats';
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
      `/users/current/stats/${range}?project=${encodeURIComponent(projectName)}`,
    ),

  getGoals: (): Promise<WakaTimeGoalsResponse> =>
    fetchWithAuth<WakaTimeGoalsResponse>('/users/current/goals'),

  createGoal: (data: Partial<WakaTimeGoal>): Promise<any> =>
    fetchWithAuth<any>('/users/current/goals', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateGoal: (id: string, data: Partial<WakaTimeGoal>): Promise<any> =>
    fetchWithAuth<any>(`/users/current/goals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteGoal: (id: string): Promise<any> =>
    fetchWithAuth<any>(`/users/current/goals/${id}`, {
      method: 'DELETE',
    }),

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

  getProgramLanguages: (): Promise<any> =>
    fetchWithAuth<any>('/program_languages'),

  getAllTimeSinceToday: (): Promise<WakaTimeAllTime> =>
    fetchWithAuth<WakaTimeAllTime>('/users/current/all_time_since_today'),

  getOrganizations: (): Promise<any> =>
    fetchWithAuth<any>('/users/current/organizations'),

  getOrgStats: (orgId: string, range: string): Promise<any> =>
    fetchWithAuth<any>(
      `/users/current/organizations/${orgId}/stats?range=${range}`,
    ),
};
