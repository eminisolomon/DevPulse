export interface WakaTimeDuration {
  project: string;
  duration: number;
  time: number;
  id: string;
}

export interface WakaTimeDurationsResponse {
  data: WakaTimeDuration[];
  start: string;
  end: string;
  timezone: string;
}
