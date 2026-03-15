import React from 'react';
import type { WidgetVariants as VoltraWidgetVariants } from 'voltra';
import { DailyStatsWidget } from './DailyStatsWidget';

const defaultStats = {
  todayTotalText: '0 mins',
  todayPercent: 0,
};

/**
 * Initial state for the Daily Stats Widget.
 * This is displayed before the first real sync occurs.
 * iOS requires an export named WidgetVariants or a default export of the same.
 */
export const WidgetVariants: VoltraWidgetVariants = {
  systemSmall: <DailyStatsWidget stats={defaultStats} />,
  systemMedium: <DailyStatsWidget stats={defaultStats} />,
  systemLarge: <DailyStatsWidget stats={defaultStats} />,
};

export default WidgetVariants;
