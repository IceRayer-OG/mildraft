CREATE TYPE "pick_status" AS ENUM('pending', 'on the clock', 'overdue', 'completed');--> statement-breakpoint
ALTER TYPE "bats" ADD VALUE 'S';--> statement-breakpoint
ALTER TYPE "throws" ADD VALUE 'S';--> statement-breakpoint
ALTER TABLE "mildraft_draft_pick" ADD COLUMN "is_on_clock" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "mildraft_draft_pick" ADD COLUMN "on_clock_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "mildraft_draft_pick" ADD COLUMN "clock_ends_at" timestamp;--> statement-breakpoint
ALTER TABLE "mildraft_draft_pick" ADD COLUMN "completed_at" timestamp;--> statement-breakpoint
ALTER TABLE "mildraft_draft_pick" ADD COLUMN "is_auto_skipped" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "mildraft_draft_pick" ADD COLUMN "pick_status" "pick_status" DEFAULT 'pending'::"pick_status" NOT NULL;--> statement-breakpoint
ALTER TABLE "mildraft_draft" ADD COLUMN "status" varchar(32) DEFAULT 'setup' NOT NULL;--> statement-breakpoint
ALTER TABLE "mildraft_league" ADD COLUMN "time_zone" varchar(256);--> statement-breakpoint
ALTER TABLE "mildraft_pros" ADD COLUMN "level" varchar(256);--> statement-breakpoint
ALTER TABLE "mildraft_pros" ADD COLUMN "team_rank" integer;--> statement-breakpoint
ALTER TABLE "mildraft_pros" ADD COLUMN "draft_rank" integer;--> statement-breakpoint
ALTER TABLE "mildraft_queue" ADD COLUMN "queue_rank" integer;--> statement-breakpoint
ALTER TABLE "mildraft_settings" ADD COLUMN "time_zone" varchar(256);--> statement-breakpoint
ALTER TABLE "mildraft_team" ADD COLUMN "auto_draft_enabled" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "mildraft_team" ADD COLUMN "email" varchar(256);--> statement-breakpoint
ALTER TABLE "mildraft_player" ALTER COLUMN "positions" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "mildraft_pros" ALTER COLUMN "position" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "positions";--> statement-breakpoint
CREATE TYPE "positions" AS ENUM('RHP', 'LHP', 'C', '1B', '2B', '3B', 'SS', 'OF', 'CI', 'MI', 'INF', 'DH', 'UTIL');--> statement-breakpoint
ALTER TABLE "mildraft_player" ALTER COLUMN "positions" SET DATA TYPE "positions" USING "positions"::"positions";--> statement-breakpoint
ALTER TABLE "mildraft_pros" ALTER COLUMN "position" SET DATA TYPE "positions" USING "position"::"positions";--> statement-breakpoint
ALTER TABLE "mildraft_draft_settings" ALTER COLUMN "start_date" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "mildraft_team" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "mildraft_pros" ADD CONSTRAINT "player_team_unique" UNIQUE("player_name","team");--> statement-breakpoint
ALTER TABLE "mildraft_pros" ADD CONSTRAINT "player_throws_unique" UNIQUE("player_name","throws");