export interface WakaTimeSummary {
  grand_total: {
    digital: string;
    hours: number;
    minutes: number;
    text: string;
    total_seconds: number;
  };
  range: {
    date: string;
    start: string;
    end: string;
    text: string;
    timezone: string;
  };
  projects: {
    name: string;
    total_seconds: number;
    percent: number;
    digital: string;
    text: string;
    hours: number;
    minutes: number;
  }[];
}

export interface WakaTimeSummaries {
  data: WakaTimeSummary[];
  start: string;
  end: string;
  cumulative_total: {
    seconds: number;
    text: string;
  };
}
