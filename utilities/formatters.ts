import { format, isToday, isYesterday, parseISO } from 'date-fns';

/**
 * Common date format patterns
 */
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy', // Jan 01, 2024
  SHORT: 'MMM dd', // Jan 01
  FULL: 'EEEE, dd MMM', // Monday, 01 Jan
  MONTH: 'MMMM', // January
  YEAR: 'yyyy', // 2024
  ISO: 'yyyy-MM-dd', // 2024-01-01
};

/**
 * Format total seconds into a readable string like "5h 23m" or "23m"
 */
export const formatDuration = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

/**
 * Format total seconds into a decimal hours string like "5.2h"
 */
export const formatHoursDecimal = (totalSeconds: number): string => {
  const hours = totalSeconds / 3600;
  return `${hours.toFixed(1)}h`;
};

/**
 * Format total seconds into a readable string like "X HRS Y MINS"
 */
export const formatDisplayDuration = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${hours} HRS ${minutes} MINS`;
};

/**
 * Get contextually relevant title for daily stats
 */
export const getDailyStatsTitle = (date: Date): string => {
  if (isToday(date)) return 'TODAY';
  if (isYesterday(date)) return 'YESTERDAY';
  return format(date, DATE_FORMATS.FULL).toUpperCase();
};

/**
 * Format a date string to a readable format
 */
export const formatDate = (
  date: string | Date,
  pattern: string = DATE_FORMATS.DISPLAY,
): string => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, pattern);
};

/**
 * Extract repository name from URL
 */
export const getRepoName = (url: string): string => {
  if (!url) return '';
  return url.split('/').pop() || '';
};
