import { db } from "~/server/db";
import {
  eq,
  notInArray,
  and,
  isNotNull,
  isNull,
  asc,
  inArray,
  ne,
  count,
  or,
  sql
} from "drizzle-orm";
import { draftPicks, pros, teams } from "~/server/db/schema";

export async function getDraftablePlayers() {
  const draftedPlayers = db
    .select({ pickedPlayer: draftPicks.playerId })
    .from(draftPicks)
    .where(and(eq(draftPicks.draftId, 2), isNotNull(draftPicks.playerId)));

  const draftablePlayers = await db
    .select()
    .from(pros)
    .where(notInArray(pros.id, draftedPlayers));

  if (draftablePlayers === null) throw new Error("Error getting draft players");

  return draftablePlayers;
}

export async function getDraftedPlayers() {
  const completedDraftPicks = db
    .select({ pickedPlayer: draftPicks.playerId })
    .from(draftPicks)
    .where(and(eq(draftPicks.draftId, 2), isNotNull(draftPicks.playerId)));

  const draftedPlayers = await db
    .select()
    .from(pros)
    .where(inArray(pros.id, completedDraftPicks));

  return draftedPlayers;
}