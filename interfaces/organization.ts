export interface WakaTimeOrganization {
  id: string;
  name: string;
  timeout?: number;
  weekday_start?: number;
  writes_only?: boolean;
  can_edit?: boolean;
  role?: string;
  is_default?: boolean;
  created_at?: string;
  member_count?: number;
}

export interface WakaTimeOrganizationsResponse {
  data: WakaTimeOrganization[];
  total: number;
  total_pages: number;
  page: number;
}
