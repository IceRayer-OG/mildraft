import { sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTableCreator,
  timestamp,
  time,
  varchar,
  boolean,
  pgEnum,
  unique,
  date,
} from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `mildraft_${name}`);
export const positions = pgEnum('positions', ['P', 'C', '1B', '2B', '3B', 'SS', 'OF', 'CI', 'MI']);
export const throws = pgEnum("throws", ["R", "L", "B"]);
export const bats = pgEnum("bats", ["R", "L", "B"]);

export const posts = createTable(
  "post",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    title: varchar("title", { length: 256 }),
    body: varchar("body", { length: 1024 }),
    leagueId: integer("league_id").references(() => leagues.id), // Make not null later
    ownerId: varchar("owner_id", { length: 256 }),                                // Make not null later         
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
  },
  (example) => ({
    nameIndex: index("name_idx").on(example.title),
  })
);

export const leagues = createTable(
  "league",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    name: varchar("name", { length: 256 }),
    abbreviation: varchar("abbreviation", { length: 4 }),
    commissioner: varchar("commissioner", { length: 256 }),
    coCommissioner: varchar("co_commissioner", { length: 256 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
  },
  (example) => ({
    nameIndex: index("league_idx").on(example.name),
  })
);

export const teams = createTable(
  "team",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    name: varchar("name", { length: 256 }),
    leagueId: integer("league_id").notNull().references(() => leagues.id),
    ownerId: varchar("owner_id", { length: 256 }),
    abbreviation: varchar("abbreviation", { length: 5 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
  },
  (example) => ({
    nameIndex: index("team_idx").on(example.name),
  })
);

export const players = createTable(
  "player",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    name: varchar("name", { length: 256 }),
    leagueId: integer("league_id").notNull().references(() => leagues.id),
    teamId: integer("team_id").notNull().references(() => teams.id),
    proId: integer("pro_id").notNull().references(() => pros.id),
    position: positions("positions"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
  },
  (example) => ({
    nameIndex: index("player_idx").on(example.name),
    uniquePlayerIndex: unique("playerProId").on(example.proId, example.leagueId),
  })
);

export const drafts = createTable(
  "draft",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    leagueId: integer("league_id").references(() => leagues.id),  // Make not null later
    draftYear: integer("draft_year"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
  },
);

export const draftPicks = createTable(
  "draft_pick",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    pickNumber: integer("pick_number").notNull(),
    leagueId: integer("league_id").references(() => leagues.id).notNull(),  
    draftId: integer("draft_id").references(() => drafts.id).notNull(),     
    playerId: integer("player_id").references(() => pros.id),
    teamId: integer("team_id").references(() => teams.id).notNull(),        
    isWriteIn: boolean("is_write_in").default(false),
    writeInName: varchar("write_in", {length: 256}),
    pickMade: boolean("pick_made").default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
  },
  (example) => ({
    nameIndex: index("draft_pick_idx").on(example.id),
    uniqueDraftIndex: unique("draftPickId").on(example.draftId, example.pickNumber)
  })
);

export const draftSettings = createTable(
  "draft_settings",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    leagueId: integer("league_id").notNull().references(() => leagues.id),
    draftId: integer("draft_id").notNull().references(() => drafts.id),
    draftStartDate: date("darft_start_date", { mode: "date"}),
    draftStartTime: time("darft_start_time", { withTimezone: true}),
    startDate: timestamp("start_date", { withTimezone: true }),
    draftType: varchar("draft_type", { length: 256 }),
    snakeDraft: boolean("snake_draft").default(false),
    pickDuration: integer("pick_duration"),
    overnightPauseEnable: boolean("overnight_pause_enable").default(false),
    pauseStartTime: time("pause_start_time", { withTimezone: true }),
    pauseEndTime: time("pause_end_time", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
  },
  (example) => ({
    nameIndex: index("draft_settings_idx").on(example.id),
  })
);

export const pros = createTable(
  "pros",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    playerNumber: integer("player_number"),
    playerFirstName: varchar("player_first_name", { length: 256 }),
    playerLastName: varchar("player_last_name", { length: 256 }),
    playerName: varchar("player_name", { length: 256 }),
    team: varchar("team", { length: 256 }),
    position: positions("position"),
    age: integer("age"),
    height: varchar("height", { length: 256 }),
    weight: integer("weight"),
    throws: throws("throws"),
    bats: bats("bats"),
    rank: integer("rank"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
  },
  (example) => ({
    nameIndex: index("pros_idx").on(example.id),
  })
);

export const settings = createTable(
  "settings",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    leagueId: integer("league_id").notNull().references(() => leagues.id),
    draftsEnabled: boolean("drafts_enabled").default(false),
    name: varchar("name", { length: 256 }),
    abbreviation: varchar("abbreviation", { length: 10 }),
    primaryColor: varchar("primary_color", { length: 7 }),
    sceondaryColor: varchar("secondary_color", { length: 7 }),
    teams: integer("teams"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
  },
  (example) => ({
    nameIndex: index("settings_idx").on(example.id),
  })
);

export const queues = createTable(
  "queue",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    leagueId: integer("league_id").references(() => leagues.id),  // Make not null later
    draftId: integer("draft_id").references(() => drafts.id),     // Make not null later
    teamId: integer("team_id").references(() => teams.id),        // Make not null later
    playerId: integer("player_id").references(() => pros.id),     // Make not null later
    userId: varchar("user_id", { length: 256 }),                  // Make not null later
    name: varchar("name", { length: 256 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
  },
  (example) => ({
    nameIndex: index("queue_idx").on(example.playerId),
    uniqueNameIndex: unique("inQueue").on(example.playerId, example.userId),
  })
);
