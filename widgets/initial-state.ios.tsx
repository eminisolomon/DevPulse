import React from 'react';
import type { WidgetVariants as VoltraWidgetVariants } from 'voltra';
import { DailyStatsWidgetIOS } from './DailyStatsWidgetIOS';

const defaultStats = {
  todayTotalText: '0 mins',
  todayPercent: 0,
};

const content = <DailyStatsWidgetIOS stats={defaultStats} />;

/**
 * Initial state for the Daily Stats Widget (iOS).
 * iOS expects a Record (object) mapping families to content.
 */
export const WidgetVariants: VoltraWidgetVariants = {
  systemSmall: content,
  systemMedium: content,
  systemLarge: content,
};

export default WidgetVariants;
