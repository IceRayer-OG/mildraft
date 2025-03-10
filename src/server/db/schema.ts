// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTableCreator,
  timestamp,
  varchar,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `mildraft_${name}`);
export const positions = pgEnum('positions', ['P', 'C', '1B', '2B', '3B', 'SS', 'OF', 'CI', 'MI']);
export const throws = pgEnum("throws", ["R", "L", "B"]);
export const bats = pgEnum("bats", ["R", "L", "B"]);

export const posts = createTable(
  "post",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    name: varchar("name", { length: 256 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
  },
  (example) => ({
    nameIndex: index("name_idx").on(example.name),
  })
);

export const leagues = createTable(
  "league",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    name: varchar("name", { length: 256 }),
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
    leagueId: integer("league_id").notNull(),
    owernId: integer("owner_id"),
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
    teamId: integer("team_id").notNull(),
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
  })
);

export const drafts = createTable(
  "draft",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    name: varchar("name", { length: 256 }),
    leagueId: integer("league_id").notNull(),
    teamId: integer("team_id").notNull(),
    playerId: integer("player_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
  },
  (example) => ({
    nameIndex: index("draft_idx").on(example.name),
  })
);

export const draftPicks = createTable(
  "draft_pick",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    draftId: integer("draft_id").notNull(),
    playerId: integer("player_id").notNull(),
    teamId: integer("team_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
  },
  (example) => ({
    nameIndex: index("draft_pick_idx").on(example.id),
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
    leagueId: integer("league_id").notNull(),
    draftsEnabled: boolean("drafts_enabled").notNull(),
    draftType: varchar("draft_type", { length: 256 }),
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
    leagueId: integer("league_id").notNull(),
    draftId: integer("draft_id").notNull(),
    teamId: integer("team_id").notNull(),
    name: varchar("name", { length: 256 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
  },
  (example) => ({
    nameIndex: index("queue_idx").on(example.id),
  })
);
