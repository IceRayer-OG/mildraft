import { db } from "~/server/db";
import {
  eq,
  notInArray,
  and,
  isNotNull,
  isNull,
  asc,
  desc,
  inArray,
  ne,
  count,
  or,
  sql,
} from "drizzle-orm";
import { draftPicks, players, pros, teams } from "~/server/db/schema";
import { type InngestPick } from "../utils/draft";

export async function getNextDraftPick(draftId: number) {
  // Check if user is current pick
  const nextPick = await db
    .select({
      pickId: draftPicks.id,
      teamName: teams.name,
    })
    .from(draftPicks)
    .where(
      and(eq(draftPicks.draftId, draftId), eq(draftPicks.status, "pending")),
    )
    .orderBy(asc(draftPicks.pickNumber))
    .offset(1)
    .limit(1)
    .leftJoin(teams, eq(draftPicks.teamId, teams.id));

  if (nextPick === null) throw new Error("No current pick found");

  return nextPick;
}

export async function startPickClock(
  pickId: number,
  startPickAt: Date,
  deadline: Date,
) {
  const pickData = await db
    .update(draftPicks)
    .set({
      status: "on the clock",
      isOnClock: true,
      onClockAt: startPickAt,
      clockEndsAt: deadline,
    })
    .where(and(eq(draftPicks.draftId, 2), eq(draftPicks.id, pickId)))
    .returning({
      pickId: draftPicks.id,
      startsAt: draftPicks.onClockAt,
      endsAt: draftPicks.clockEndsAt,
    });

  if (!pickData[0]) throw new Error("No Pick to set");

  return pickData[0] as InngestPick;
}

export async function updateDraftPickOverdue(pickId: number) {
  const pickData = await db
    .update(draftPicks)
    .set({
      status: "overdue",
      isOnClock: false,
    })
    .where(eq(draftPicks.id, pickId))
    .returning({
      id: draftPicks.id,
    });

  return pickData;
}

export async function getDraftResults(draftId: number) {
  const draftResults = await db
    .select({
      pickNumber: draftPicks.pickNumber,
      teamName: teams.name,
      playerName: sql<string>`COALESCE(${pros.playerName}, ${draftPicks.writeInName})`.as('player_name'),
    })
    .from(draftPicks)
    .where(and(eq(draftPicks.draftId, draftId), eq(draftPicks.pickMade, true)))
    .orderBy(desc(draftPicks.pickNumber))
    .leftJoin(teams, eq(draftPicks.teamId, teams.id))
    .leftJoin(pros, eq(draftPicks.id, pros.id));

  return draftResults;
}

export async function checkWriteInNameAvailable(playerName: string) {

const existingPlayer = await db
  .select({ id: players.id }) // Minimize data transfer by only selecting the ID
  .from(players)
  .leftJoin(pros, eq(players.id, pros.id))
  .leftJoin(draftPicks, eq(players.id, draftPicks.playerId))
  .where(
    or(
      // Case-insensitive comparison: "Name" vs "name"
      sql`lower(${pros.playerName}) = lower(${playerName})`,
      sql`lower(${draftPicks.writeInName}) = lower(${playerName})`
    )
  )
  .limit(1);

return existingPlayer.length > 0;
}
