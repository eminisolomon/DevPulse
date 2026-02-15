import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const goals = sqliteTable('goals', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  status: text('status').notNull(),
  seconds: integer('seconds').notNull().default(0),
  improvementStatus: text('improvement_status'),
  isEnabled: integer('is_enabled', { mode: 'boolean' }).default(true),
  rangeText: text('range_text'),
  chartData: text('chart_data'),
  languages: text('languages'),
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
