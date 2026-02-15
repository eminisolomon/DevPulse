export interface WakaTimeGoal {
  id: string;
  title: string;
  type: string;
  status: 'success' | 'fail' | 'ignored' | 'pending';
  seconds: number;
  average_status: 'success' | 'fail' | 'ignored' | 'pending';
  chart_data: {
    actual_seconds: number;
    goal_seconds: number;
    range: {
      date: string;
      start: string;
      end: string;
      text: string;
      whitelist: {
        name: string;
        public: boolean;
        type: string;
      }[];
    };
  }[];
  created_at: string;
  cumulative_status: 'success' | 'fail' | 'ignored' | 'pending';
  delta: string;
  ignore_days: string[];
  ignore_zero_days: boolean;
  improvement_status: 'success' | 'fail' | 'ignored' | 'pending';
  is_enabled: boolean;
  is_inverse: boolean;
  is_snoozed: boolean;
  languages: string[];
  projects: string[];
  editors: string[];
  range_text: string;
  short_title: string;
  subscribed: boolean;
}

export interface WakaTimeGoalsResponse {
  data: WakaTimeGoal[];
  total: number;
  total_pages: number;
}
