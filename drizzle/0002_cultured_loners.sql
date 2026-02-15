CREATE TABLE `settings` (
	`id` integer PRIMARY KEY DEFAULT 1 NOT NULL,
	`theme_mode` text DEFAULT 'system' NOT NULL,
	`accent_color` text DEFAULT '#3B82F6' NOT NULL,
	`collect_crashes` integer DEFAULT true,
	`collect_performance` integer DEFAULT true,
	`collect_analytics` integer DEFAULT true,
	`last_updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `summaries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date` text NOT NULL,
	`data` text,
	`last_synced_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `summaries_date_unique` ON `summaries` (`date`);