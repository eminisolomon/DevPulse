export interface WakaTimeProject {
  id: string;
  name: string;
  repository?: {
    html_url: string;
    description?: string;
    homepage?: string;
  };
  badge?: {
    color: string;
    link: string;
    title: string;
    url: string;
  };
  color?: string;
  created_at: string;
  has_public_url: boolean;
  human_readable_last_heartbeat_at?: string;
  last_heartbeat_at?: string;
  url: string;
  urlencoded_name: string;
}

export interface WakaTimeProjectsResponse {
  data: WakaTimeProject[];
  total?: number;
  total_pages?: number;
  page: number;
}
