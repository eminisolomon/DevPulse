export interface WakaTimeLanguage {
  name: string;
  total_seconds: number;
  percent: number;
  digital: string;
  text: string;
  hours: number;
  minutes: number;
  color?: string;
}
export interface WakaTimeMachineStat extends WakaTimeLanguage {
  machine_name_id: string;
}

export interface WakaTimeStats {
  data: {
    languages: WakaTimeLanguage[];
    editors: WakaTimeLanguage[];
    operating_systems: WakaTimeLanguage[];
    categories: WakaTimeLanguage[];
    machines: WakaTimeMachineStat[];
    projects: WakaTimeLanguage[];
    best_day?: {
      date: string;
      text: string;
      total_seconds: number;
    };
    daily_average: number;
    daily_average_including_other_language: number;
    human_readable_daily_average: string;
    total_seconds: number;
    human_readable_total: string;
    ai_additions?: number;
    ai_deletions?: number;
    human_additions?: number;
    human_deletions?: number;
    dependencies?: {
      name: string;
      total_seconds: number;
      percent: number;
      digital: string;
      text: string;
    }[];
    is_up_to_date: boolean;
    start: string;
    end: string;
    timezone: string;
  };
}
export interface WakaTimeAllTime {
  data: {
    total_seconds: number;
    text: string;
    digital: string;
    is_up_to_date: boolean;
    percent_calculated: number;
  };
}
