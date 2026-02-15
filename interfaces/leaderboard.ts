export interface LeaderboardUser {
  rank: number;
  running_total: {
    total_seconds: number;
    human_readable_total: string;
    daily_average: number;
    human_readable_daily_average: string;
    languages: {
      name: string;
      total_seconds: number;
    }[];
  };
  user: {
    id: string;
    email?: string;
    username?: string;
    full_name?: string;
    display_name?: string;
    website?: string;
    human_readable_website?: string;
    is_hireable: boolean;
    photo: string;
    is_email_public: boolean;
    photo_public: boolean;
  };
}

export interface WakaTimeLeaderboard {
  data: LeaderboardUser[];
  current_user?: LeaderboardUser;
  page: number;
  total_pages: number;
  range: {
    start_date: string;
    start_text: string;
    end_date: string;
    end_text: string;
  };
}
