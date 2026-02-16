export const STATS_RANGES = [
  { label: 'Last 7 Days', value: 'last_7_days' },
  { label: 'Last 30 Days', value: 'last_30_days' },
  { label: 'Last 6 Months', value: 'last_6_months' },
  { label: 'Last Year', value: 'last_year' },
  { label: 'All Time', value: 'all_time' },
] as const;

export type StatsRange = (typeof STATS_RANGES)[number]['value'];

export const getRangeLabel = (value: string): string => {
  return STATS_RANGES.find((r) => r.value === value)?.label || value;
};
