ALTER TABLE "mildraft_draft_pick" ALTER COLUMN "pick_number" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "mildraft_draft_pick" ALTER COLUMN "league_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "mildraft_draft_pick" ALTER COLUMN "draft_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "mildraft_draft_pick" ALTER COLUMN "team_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "mildraft_settings" ALTER COLUMN "abbreviation" SET DATA TYPE varchar(5);--> statement-breakpoint
ALTER TABLE "mildraft_draft_pick" ADD COLUMN "is_write_in" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "mildraft_draft_pick" ADD COLUMN "write_in" varchar(256);--> statement-breakpoint
ALTER TABLE "mildraft_draft_pick" ADD COLUMN "pick_made" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "mildraft_draft_settings" ADD COLUMN "darft_start_date" date;--> statement-breakpoint
ALTER TABLE "mildraft_draft_settings" ADD COLUMN "darft_start_time" time with time zone;--> statement-breakpoint
ALTER TABLE "mildraft_draft_settings" ADD COLUMN "overnight_pause_enable" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "mildraft_draft_settings" ADD COLUMN "pause_start_time" time with time zone;--> statement-breakpoint
ALTER TABLE "mildraft_draft_settings" ADD COLUMN "pause_end_time" time with time zone;--> statement-breakpoint
ALTER TABLE "mildraft_league" ADD COLUMN "abbreviation" varchar(4);--> statement-breakpoint
ALTER TABLE "mildraft_post" ADD COLUMN "text_body" text;--> statement-breakpoint
ALTER TABLE "mildraft_pros" ADD COLUMN "eta" integer;--> statement-breakpoint
ALTER TABLE "mildraft_settings" ADD COLUMN "team_logos_enabled" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "mildraft_draft_pick" ADD CONSTRAINT "draftPickId" UNIQUE("draft_id","pick_number");