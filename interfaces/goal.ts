export interface WakaTimeGoalOwner {
  display_name: string;
  email?: string;
  full_name?: string;
  id: string;
  photo?: string;
  username?: string;
}

export interface WakaTimeGoalSharedWith {
  display_name?: string;
  email?: string;
  full_name?: string;
  id?: string;
  photo?: string;
  status?: string;
  user_id?: string;
  username?: string;
}

export interface WakaTimeGoalSubscriber {
  email?: string;
  email_frequency?: string;
  full_name?: string;
  user_id?: string;
  username?: string;
}

export interface WakaTimeGoalChartData {
  actual_seconds: number;
  actual_seconds_text: string;
  goal_seconds: number;
  goal_seconds_text: string;
  range: {
    date: string;
    start: string;
    end: string;
    text: string;
    timezone: string;
  };
  range_status: 'success' | 'fail' | 'pending' | 'ignored';
  range_status_reason: string;
}

type GoalStatus = 'success' | 'fail' | 'ignored' | 'pending';

export interface WakaTimeGoal {
  id: string;
  title: string;
  type: string;
  status: GoalStatus;
  seconds: number;
  average_status: GoalStatus;
  chart_data: WakaTimeGoalChartData[];
  created_at: string;
  cumulative_status: GoalStatus;
  custom_title?: string;
  delta: string;
  editors: string[];
  ignore_days: string[];
  ignore_zero_days: boolean;
  improve_by_percent?: number;
  improvement_status: GoalStatus;
  is_current_user_owner?: boolean;
  is_enabled: boolean;
  is_inverse: boolean;
  is_snoozed: boolean;
  is_tweeting?: boolean;
  languages: string[];
  modified_at?: string;
  owner?: WakaTimeGoalOwner;
  projects: string[];
  range_text: string;
  shared_with?: WakaTimeGoalSharedWith[];
  short_title: string;
  snooze_until?: string;
  status_percent_calculated?: number;
  subscribed: boolean;
  subscribers?: WakaTimeGoalSubscriber[];
}

export interface WakaTimeGoalsResponse {
  data: WakaTimeGoal[];
  total: number;
  total_pages: number;
}
