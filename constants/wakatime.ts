export const STATS_RANGES = [
  { label: '7 Days', value: 'last_7_days' },
  { label: '30 Days', value: 'last_30_days' },
  { label: '6 Months', value: 'last_6_months' },
  { label: '1 Year', value: 'last_year' },
  { label: 'All Time', value: 'all_time' },
] as const;

export type StatsRange = (typeof STATS_RANGES)[number]['value'];

export const getRangeLabel = (value: string): string => {
  return STATS_RANGES.find((r) => r.value === value)?.label || value;
};
