export interface StatsData {
  todayTotalText: string;
  todayPercent: number;
  themeColor?: string;
  topLanguage?: {
    name: string;
    percent: number;
  };
  topProject?: {
    name: string;
    text: string;
  };
}
