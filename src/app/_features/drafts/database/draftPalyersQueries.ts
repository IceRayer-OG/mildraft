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
  sql,
} from "drizzle-orm";
import { draftPicks, pros, players, teams } from "~/server/db/schema";

export async function getDraftablePlayers() {
  const draftedPlayers = db
    .select({ pickedPlayer: draftPicks.playerId })
    .from(draftPicks)
    .where(and(eq(draftPicks.draftId, 2), isNotNull(draftPicks.playerId)));

  const playersOnTeams = db
    .select({ playerOnTeam: players.proId })
    .from(players)
    .where(eq(players.leagueId, 1));

  const draftablePlayers = await db
    .select()
    .from(pros)
    .where(
      and(
        notInArray(pros.id, draftedPlayers),
        notInArray(pros.id, playersOnTeams),
      ),
    );

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
