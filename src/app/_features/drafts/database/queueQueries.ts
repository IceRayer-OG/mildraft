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
import { queues, draftPicks, pros, teams } from "~/server/db/schema";

// FUNCTIONS
export async function getMyQueuePlayers(userId: string) {
  const myQueue = db
    .select({ queuedPlayer: queues.playerId })
    .from(queues)
    .where(eq(queues.userId, userId));

  const myQueuedPlayeers = await db
    .select()
    .from(pros)
    .where(inArray(pros.id, myQueue));

  if (myQueuedPlayeers === null) throw new Error("Error getting draft queue");

  return myQueuedPlayeers;
}

export async function postPlayerToQueue(prosId: number, userId: string) {
  await db.insert(queues).values({
    playerId: prosId,
    userId: userId,
    // teamId: teams.id,
    // leagueId: leagues.id,
    draftId: 2,
  });
}

export async function deletePlayerFromQueue(playerId: number, userId: string) {
  await db
    .delete(queues)
    .where(and(eq(queues.playerId, playerId), eq(queues.userId, userId)));
}

export async function deletePlayerFromQueues(playerId: number) {
  await db.delete(queues).where(and(eq(queues.playerId, playerId), eq(queues.draftId, 2)));
}