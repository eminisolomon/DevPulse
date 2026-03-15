export interface StatsData {
  todayTotalText: string;
  todayPercent: number;
  theme: {
    background: string;
    surface: string;
    surfaceSubtle: string;
    border: string;
    text: string;
    textSecondary: string;
    primary: string;
  };
  topLanguage?: {
    name: string;
    percent: number;
    color?: string;
  };
  topProject?: {
    name: string;
    text: string;
    color?: string;
  };
}
