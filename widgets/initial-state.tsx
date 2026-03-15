import React from 'react';
import { DailyStatsWidget } from './index';

/**
 * Initial state for the Daily Stats Widget.
 * This is displayed before the first real sync occurs.
 */
export default function InitialState() {
  return (
    <DailyStatsWidget
      stats={{
        todayTotalText: '0 mins',
        todayPercent: 0,
      }}
    />
  );
}
