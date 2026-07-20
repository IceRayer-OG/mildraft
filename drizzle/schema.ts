import { pgEnum, pgTable, integer, varchar, boolean, timestamp, text, date, time, index, foreignKey, primaryKey, unique } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const bats = pgEnum("bats", ["R", "L", "B", "S"])
export const throws = pgEnum("throws", ["R", "L", "B", "S"])
export const positions = pgEnum("positions", ["RHP", "LHP", "C", "1B", "2B", "3B", "SS", "OF", "CI", "MI", "INF", "DH", "UTIL"])
export const pickStatus = pgEnum("pick_status", ["pending", "on the clock", "overdue", "completed"])


export const mildraftDraft = pgTable("mildraft_draft", {
	id: integer().primaryKey().generatedByDefaultAsIdentity(),
	leagueId: integer("league_id").references(() => mildraftLeague.id),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }),
	draftYear: integer("draft_year"),
});

export const mildraftDraftPick = pgTable("mildraft_draft_pick", {
	id: integer().primaryKey().generatedByDefaultAsIdentity(),
	leagueId: integer("league_id").notNull().references(() => mildraftLeague.id),
	draftId: integer("draft_id").notNull().references(() => mildraftDraft.id),
	playerId: integer("player_id").references(() => mildraftPros.id),
	teamId: integer("team_id").notNull().references(() => mildraftTeam.id),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }),
	pickNumber: integer("pick_number").notNull(),
	isWriteIn: boolean("is_write_in").default(false),
	writeIn: varchar("write_in", { length: 256 }),
	pickMade: boolean("pick_made").default(false),
	isOnClock: boolean("is_on_clock").default(false),
	onClockAt: timestamp("on_clock_at").default(sql`now()`),
	completedAt: timestamp("completed_at"),
	isAutoSkipped: boolean("is_auto_skipped").default(false),
	pickStatus: pickStatus("pick_status").default("pending").notNull(),
	clockEndsAt: timestamp("clock_ends_at"),
}, (table) => [
	index("draft_pick_idx").using("btree", table.id.asc().nullsLast()),
	unique("draftPickId").on(table.draftId, table.pickNumber),]);

export const mildraftDraftSettings = pgTable("mildraft_draft_settings", {
	id: integer().primaryKey().generatedByDefaultAsIdentity(),
	leagueId: integer("league_id").notNull().references(() => mildraftLeague.id),
	draftId: integer("draft_id").notNull().references(() => mildraftDraft.id),
	startDate: timestamp("start_date", { withTimezone: true }).notNull(),
	draftType: varchar("draft_type", { length: 256 }),
	snakeDraft: boolean("snake_draft").default(false),
	pickDuration: integer("pick_duration"),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }),
	darftStartDate: date("darft_start_date"),
	darftStartTime: time("darft_start_time", { withTimezone: true }),
	overnightPauseEnable: boolean("overnight_pause_enable").default(false),
	pauseStartTime: time("pause_start_time", { withTimezone: true }),
	pauseEndTime: time("pause_end_time", { withTimezone: true }),
}, (table) => [
	index("draft_settings_idx").using("btree", table.id.asc().nullsLast()),
]);

export const mildraftLeague = pgTable("mildraft_league", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: "mildraft_fantasy_league_id_seq" }),
	name: varchar({ length: 256 }),
	commissioner: varchar({ length: 256 }),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }),
	coCommissioner: varchar("co_commissioner", { length: 256 }),
	abbreviation: varchar({ length: 4 }),
	timeZone: varchar("time_zone", { length: 256 }),
}, (table) => [
	index("league_idx").using("btree", table.name.asc().nullsLast()),
]);

export const mildraftPlayer = pgTable("mildraft_player", {
	id: integer().primaryKey().generatedByDefaultAsIdentity(),
	name: varchar({ length: 256 }),
	teamId: integer("team_id").notNull().references(() => mildraftTeam.id),
	positions: positions(),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }),
	leagueId: integer("league_id").notNull().references(() => mildraftLeague.id),
	proId: integer("pro_id").notNull().references(() => mildraftPros.id),
}, (table) => [
	index("player_idx").using("btree", table.name.asc().nullsLast()),
	unique("playerProId").on(table.proId, table.leagueId),]);

export const mildraftPost = pgTable("mildraft_post", {
	id: integer().primaryKey().generatedByDefaultAsIdentity(),
	title: varchar({ length: 256 }),
	ownerId: varchar("owner_id", { length: 256 }),
	leagueId: integer("league_id").references(() => mildraftLeague.id),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }),
	body: varchar({ length: 1024 }),
	textBody: text("text_body"),
}, (table) => [
	index("name_idx").using("btree", table.title.asc().nullsLast()),
]);

export const mildraftPros = pgTable("mildraft_pros", {
	id: integer().primaryKey().generatedByDefaultAsIdentity(),
	playerNumber: integer("player_number"),
	playerFirstName: varchar("player_first_name", { length: 256 }),
	playerLastName: varchar("player_last_name", { length: 256 }),
	playerName: varchar("player_name", { length: 256 }),
	team: varchar({ length: 256 }),
	position: positions().array(),
	age: integer(),
	height: varchar({ length: 256 }),
	weight: integer(),
	throws: throws(),
	bats: bats(),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }),
	rank: integer(),
	eta: integer(),
	level: varchar({ length: 256 }),
	teamRank: integer("team_rank"),
	draftRank: integer("draft_rank"),
}, (table) => [
	index("pros_idx").using("btree", table.id.asc().nullsLast()),
	unique("player_team_unique").on(table.playerName, table.team),	unique("player_throws_unique").on(table.playerName, table.throws),]);

export const mildraftQueue = pgTable("mildraft_queue", {
	id: integer().primaryKey().generatedByDefaultAsIdentity(),
	leagueId: integer("league_id").references(() => mildraftLeague.id),
	draftId: integer("draft_id").references(() => mildraftDraft.id),
	teamId: integer("team_id").references(() => mildraftTeam.id),
	playerId: integer("player_id").references(() => mildraftPros.id),
	name: varchar({ length: 256 }),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }),
	userId: varchar("user_id", { length: 256 }),
}, (table) => [
	index("queue_idx").using("btree", table.playerId.asc().nullsLast()),
	unique("inQueue").on(table.playerId, table.userId),]);

export const mildraftSettings = pgTable("mildraft_settings", {
	id: integer().primaryKey().generatedByDefaultAsIdentity(),
	leagueId: integer("league_id").notNull().references(() => mildraftLeague.id),
	draftsEnabled: boolean("drafts_enabled").default(false),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }),
	name: varchar({ length: 256 }),
	abbreviation: varchar({ length: 5 }),
	primaryColor: varchar("primary_color", { length: 7 }),
	secondaryColor: varchar("secondary_color", { length: 7 }),
	teams: integer(),
	teamLogosEnabled: boolean("team_logos_enabled").default(true),
	timeZone: varchar("time_zone", { length: 256 }),
}, (table) => [
	index("settings_idx").using("btree", table.id.asc().nullsLast()),
]);

export const mildraftTeam = pgTable("mildraft_team", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: "mildraft_roster_id_seq" }),
	name: varchar({ length: 256 }).notNull(),
	leagueId: integer("league_id").notNull().references(() => mildraftLeague.id),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }),
	ownerId: varchar("owner_id", { length: 256 }),
	abbreviation: varchar({ length: 5 }),
	email: varchar({ length: 256 }),
	autoDraftEnabled: boolean("auto_draft_enabled").default(false),
}, (table) => [
	index("team_idx").using("btree", table.name.asc().nullsLast()),
]);
