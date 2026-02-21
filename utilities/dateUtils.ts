import { StatsRange } from '@/constants/wakatime';
import { subDays } from 'date-fns';

export type TimeRange = StatsRange;

export const VALID_TIME_RANGES: TimeRange[] = [
  'last_7_days',
  'last_30_days',
  'last_6_months',
  'last_year',
  'all_time',
];

export const RANGE_API_MAP: Record<TimeRange, StatsRange> = {
  last_7_days: 'last_7_days',
  last_30_days: 'last_30_days',
  last_6_months: 'last_6_months',
  last_year: 'last_year',
  all_time: 'all_time',
};

export const getRangeDates = (range: TimeRange) => {
  const today = new Date();
  switch (range) {
    case 'last_7_days':
      return { start: subDays(today, 6), end: today };
    case 'last_30_days':
      return { start: subDays(today, 29), end: today };
    case 'last_6_months':
      return { start: subDays(today, 180), end: today };
    case 'last_year':
      return { start: subDays(today, 364), end: today };
    case 'all_time':
      return { start: subDays(today, 3650), end: today };
    default:
      return { start: subDays(today, 6), end: today };
  }
};
