ALTER TABLE "mildraft_pros" DROP CONSTRAINT "player_team_unique";--> statement-breakpoint
ALTER TABLE "mildraft_pros" DROP CONSTRAINT "player_throws_unique";--> statement-breakpoint
ALTER TABLE "mildraft_pros" ADD COLUMN "mlbam_id" integer;--> statement-breakpoint
ALTER TABLE "mildraft_pros" ADD COLUMN "org" varchar(256);--> statement-breakpoint
ALTER TABLE "mildraft_pros" ADD COLUMN "org_id" integer;--> statement-breakpoint
ALTER TABLE "mildraft_pros" ADD COLUMN "affiliate_team" varchar(256);--> statement-breakpoint
ALTER TABLE "mildraft_pros" ADD COLUMN "intl_rank" integer;--> statement-breakpoint
ALTER TABLE "mildraft_pros" ADD COLUMN "lists" varchar(64)[];--> statement-breakpoint
ALTER TABLE "mildraft_pros" ADD COLUMN "headshot_url" varchar(512);--> statement-breakpoint
ALTER TABLE "mildraft_pros" ADD COLUMN "career_mlb_at_bats" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "mildraft_pros" ADD COLUMN "career_mlb_innings_pitched" numeric(5,1) DEFAULT '0.0' NOT NULL;--> statement-breakpoint
ALTER TABLE "mildraft_pros" ADD COLUMN "mlb_debut_date" date;--> statement-breakpoint
ALTER TABLE "mildraft_pros" ADD COLUMN "is_mil_eligible" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "mildraft_settings" ADD COLUMN "max_career_at_bats" integer DEFAULT 130 NOT NULL;--> statement-breakpoint
ALTER TABLE "mildraft_settings" ADD COLUMN "max_career_innings_pitched" numeric(5,1) DEFAULT '50.0' NOT NULL;--> statement-breakpoint
ALTER TABLE "mildraft_pros" ADD CONSTRAINT "pros_mlbam_id_unique" UNIQUE("mlbam_id");--> statement-breakpoint
CREATE INDEX "pros_mlbam_idx" ON "mildraft_pros" ("mlbam_id");--> statement-breakpoint
CREATE INDEX "pros_eligibility_idx" ON "mildraft_pros" ("is_mil_eligible");