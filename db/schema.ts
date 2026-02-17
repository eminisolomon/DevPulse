import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const goals = sqliteTable('goals', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  type: text('type'),
  status: text('status').notNull(),
  seconds: integer('seconds').notNull().default(0),
  delta: text('delta'),
  averageStatus: text('average_status'),
  cumulativeStatus: text('cumulative_status'),
  customTitle: text('custom_title'),
  improvementStatus: text('improvement_status'),
  isEnabled: integer('is_enabled', { mode: 'boolean' }).default(true),
  isInverse: integer('is_inverse', { mode: 'boolean' }).default(false),
  isSnoozed: integer('is_snoozed', { mode: 'boolean' }).default(false),
  ignoreZeroDays: integer('ignore_zero_days', { mode: 'boolean' }).default(
    false,
  ),
  improveByPercent: real('improve_by_percent'),
  notifiedHalfway: integer('notified_halfway', { mode: 'boolean' }).default(
    false,
  ),
  notifiedCompleted: integer('notified_completed', { mode: 'boolean' }).default(
    false,
  ),
  rangeText: text('range_text'),
  chartData: text('chart_data'),
  languages: text('languages'),
  projects: text('projects'),
  editors: text('editors'),
  ignoreDays: text('ignore_days'),
  createdAt: text('created_at'),
  modifiedAt: text('modified_at'),
  snoozeUntil: text('snooze_until'),
  lastSyncedAt: integer('last_synced_at', { mode: 'timestamp' }),
});

export const summaries = sqliteTable('summaries', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  date: text('date').notNull().unique(),
  data: text('data'),
  lastSyncedAt: integer('last_synced_at', { mode: 'timestamp' }),
});

export const settings = sqliteTable('settings', {
  id: integer('id').primaryKey().default(1),
  themeMode: text('theme_mode').notNull().default('system'),
  accentColor: text('accent_color').notNull().default('#3B82F6'),
  collectCrashes: integer('collect_crashes', { mode: 'boolean' }).default(true),
  collectPerformance: integer('collect_performance', {
    mode: 'boolean',
  }).default(true),
  collectAnalytics: integer('collect_analytics', { mode: 'boolean' }).default(
    true,
  ),
  lastUpdatedAt: integer('last_updated_at', { mode: 'timestamp' }),
});
