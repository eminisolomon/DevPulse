export interface WakaTimeMetadata {
  id: string;
  name: string;
  color: string;
}

export interface WakaTimeMetadataResponse {
  data: WakaTimeMetadata[];
}

export interface WakaTimeMachine {
  id: string;
  name: string;
  ip: string;
  last_seen_at: string;
  timezone: string;
  created_at: string;
}

export interface WakaTimeMachinesResponse {
  data: WakaTimeMachine[];
}

export interface WakaTimeHeartbeat {
  id: string;
  entity: string;
  type: string;
  project: string;
  language: string | null;
  is_ai: boolean;
  ai_line_changes: number;
  human_line_changes: number;
  time: number;
}

export interface WakaTimeHeartbeatsResponse {
  data: WakaTimeHeartbeat[];
}
