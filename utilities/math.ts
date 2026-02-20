/**
 * Calculate percentage change between current and previous values
 */
export const calculatePercentageChange = (
  current: number,
  previous: number,
): number => {
  if (previous === 0) return 0;
  return Math.round(((current - previous) / previous) * 100);
};

/**
 * Calculate percentage of a value against a total
 */
export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};
