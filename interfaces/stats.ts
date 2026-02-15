export interface WakaTimeLanguage {
  name: string;
  total_seconds: number;
  percent: number;
  digital: string;
  text: string;
  hours: number;
  minutes: number;
}

export interface WakaTimeStats {
  data: {
    languages: WakaTimeLanguage[];
    editors: WakaTimeLanguage[];
    operating_systems: WakaTimeLanguage[];
    daily_average: number;
    daily_average_including_other_language: number;
    human_readable_daily_average: string;
    total_seconds: number;
    human_readable_total: string;
    is_up_to_date: boolean;
    start: string;
    end: string;
    timezone: string;
  };
}
