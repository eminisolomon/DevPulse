import { format, isToday, isYesterday } from 'date-fns';

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
  return format(date, 'EEEE, dd MMM').toUpperCase();
};

/**
 * Format a date string to a readable format
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Extract repository name from URL
 */
export const getRepoName = (url: string): string => {
  if (!url) return '';
  return url.split('/').pop() || '';
};
