CREATE TABLE `goals` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`status` text NOT NULL,
	`seconds` integer DEFAULT 0 NOT NULL,
	`improvement_status` text,
	`is_enabled` integer DEFAULT true,
	`range_text` text,
	`last_synced_at` integer
);
