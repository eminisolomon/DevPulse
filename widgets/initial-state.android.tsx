'use no memo';

import React from 'react';
import type { AndroidWidgetVariants } from 'voltra/android/client';
import { DailyStatsWidgetAndroid } from './DailyStatsWidgetAndroid';

const defaultStats = {
  todayTotalText: '0 mins',
  todayPercent: 0,
};

const content = <DailyStatsWidgetAndroid stats={defaultStats} />;

export const WidgetVariants: AndroidWidgetVariants = [
  { size: { width: 170, height: 170 }, content },
  { size: { width: 330, height: 170 }, content },
  { size: { width: 330, height: 330 }, content },
];

export default WidgetVariants;
