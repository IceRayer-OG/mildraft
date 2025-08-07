import { db } from "~/server/db";
import { eq, notInArray, and, isNotNull, isNull, asc, inArray } from "drizzle-orm";
import { queues, draftPicks, pros, teams,  } from "~/server/db/schema";


export async function getDraftablePlayers() {
    const draftedPlayers = db.select({pickedPlayer: draftPicks.playerId}).from(draftPicks)
      .where(
        and(
          eq(draftPicks.draftId, 2), 
          isNotNull(draftPicks.playerId)
        )
      );
    
    const draftablePlayers = await db.select().from(pros)
      .where(notInArray(pros.id, draftedPlayers));                          

    if(draftablePlayers === null) throw new Error("Error getting draft players");

    return draftablePlayers;
}

export async function getMyQueuePlayers(userId: string) {
  const myQueue = db.select({queuedPlayer: queues.playerId}).from(queues)
    .where(eq(queues.userId, userId)
  );

  const myQueuedPlayeers = await db.select().from(pros)
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
    // draftId: drafts.id, 
  });
}

export async function deletePlayerFromQueue(playerId: number, userId: string) {
  await db.delete(queues).where(and(eq(queues.playerId, playerId), eq(queues.userId, userId)));
}

export async function getDraftPicks() {
  const draftPicksData = await db.select().from(draftPicks)
    .where(and(isNull(draftPicks.playerId), eq(draftPicks.draftId, 2)))
    .orderBy(asc(draftPicks.pickNumber))
    .leftJoin(teams, eq(draftPicks.teamId, teams.id));

  return draftPicksData;
}

export async function postDraftPick(teamId: number, draftId: number, pickNumber: number, playerPicked: number) {
  
  await db.insert(draftPicks).values({
    teamId: teamId,
    draftId: draftId,
    pickNumber: pickNumber,
    playerId: playerPicked,
  });

}

export async function postWriteInDraftPick(teamId: number, draftId: number, pickNumber: number, playerName: string) {

  await db.insert(draftPicks).values({
    teamId: teamId,
    draftId: draftId,
    pickNumber: pickNumber,
    isWriteIn: true,
    writeInName: playerName,
  });

}

export async function getDraftedPlayers() {
  const draftedPicks = db.select({pickedPlayer: draftPicks.playerId}).from(draftPicks)
    .where(
        and(
            eq(draftPicks.draftId, 2), 
            isNotNull(draftPicks.playerId)
        )
    );
    
  const draftedPlayers = await db.select().from(pros)
    .where(inArray(pros.id,draftPicks))
  
  return draftedPlayers;
}