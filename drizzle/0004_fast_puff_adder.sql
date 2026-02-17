ALTER TABLE `goals` ADD `type` text;--> statement-breakpoint
ALTER TABLE `goals` ADD `delta` text;--> statement-breakpoint
ALTER TABLE `goals` ADD `average_status` text;--> statement-breakpoint
ALTER TABLE `goals` ADD `cumulative_status` text;--> statement-breakpoint
ALTER TABLE `goals` ADD `custom_title` text;--> statement-breakpoint
ALTER TABLE `goals` ADD `is_inverse` integer DEFAULT false;--> statement-breakpoint
ALTER TABLE `goals` ADD `is_snoozed` integer DEFAULT false;--> statement-breakpoint
ALTER TABLE `goals` ADD `ignore_zero_days` integer DEFAULT false;--> statement-breakpoint
ALTER TABLE `goals` ADD `improve_by_percent` real;--> statement-breakpoint
ALTER TABLE `goals` ADD `projects` text;--> statement-breakpoint
ALTER TABLE `goals` ADD `editors` text;--> statement-breakpoint
ALTER TABLE `goals` ADD `ignore_days` text;--> statement-breakpoint
ALTER TABLE `goals` ADD `created_at` text;--> statement-breakpoint
ALTER TABLE `goals` ADD `modified_at` text;--> statement-breakpoint
ALTER TABLE `goals` ADD `snooze_until` text;