import { db } from "~/server/db";
import {
  eq,
  and,
  asc,
  inArray,
  sql,
} from "drizzle-orm";
import { queues, pros } from "~/server/db/schema";

// FUNCTIONS
export async function getMyQueuePlayers(userId: string) {
  const myQueue = db
    .select({ queuedPlayer: queues.playerId })
    .from(queues)
    .where(eq(queues.userId, userId))
    .orderBy(asc(queues.queueRank));

  const myQueuedPlayeers = await db
    .select()
    .from(pros)
    .where(inArray(pros.id, myQueue));

  if (myQueuedPlayeers === null) throw new Error("Error getting draft queue");

  return myQueuedPlayeers;
}

export async function getTopQueuedPlayer(userId: string, draftId = 2) {
  const [topPlayer] = await db
    .select({
      id: pros.id,
      playerNumber: pros.playerNumber,
      playerFirstName: pros.playerFirstName,
      playerLastName: pros.playerLastName,
      playerName: pros.playerName,
      team: pros.team,
      position: pros.position,
      level: pros.level,
      age: pros.age,
      height: pros.height,
      weight: pros.weight,
      throws: pros.throws,
      bats: pros.bats,
      rank: pros.rank,
      teamRank: pros.teamRank,
      draftRank: pros.draftRank,
      eta: pros.eta,
      queueRank: queues.queueRank,
    })
    .from(queues)
    .innerJoin(pros, eq(queues.playerId, pros.id))
    .where(and(eq(queues.userId, userId), eq(queues.draftId, draftId)))
    .orderBy(asc(queues.queueRank), asc(queues.id))
    .limit(1);

  return topPlayer ?? null;
}

export async function getQueueCount(userId: string, draftId = 2) {
  const [result] = await db
    .select({ count: sql<number>`count(*)` })
    .from(queues)
    .where(and(eq(queues.userId, userId), eq(queues.draftId, draftId)));

  return Number(result?.count ?? 0);
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

export async function deletePlayerFromQueues(playerId: number, draftId = 2) {
  await db.delete(queues).where(and(eq(queues.playerId, playerId), eq(queues.draftId, draftId)));
}

export async function updateQueueOrder(queueOrder: {rank: number, playerId: number}[], userId: string) {

  for(const order of queueOrder ) {
    if(!order || order.rank === undefined || order.playerId === undefined) {
      continue;
    }

    await db
      .update(queues)
      .set({queueRank: order.rank})
      .where(and(eq(queues.playerId, order.playerId),eq(queues.userId, userId)));

  }
}