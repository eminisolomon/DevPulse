export interface WakaTimeDuration {
  project: string;
  duration: number;
  time: number | string;
  id: string;
  start?: number;
  color?: string;
}

export interface WakaTimeDurationsResponse {
  data: WakaTimeDuration[];
  start: string;
  end: string;
  timezone: string;
}
