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
