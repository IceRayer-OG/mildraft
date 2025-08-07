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

export async function getCurrentDraftPick() {
    // Check if user is current pick
    const currentPick = await db.query.draftPicks.findFirst({
      orderBy: [asc(draftPicks.pickNumber)],
      where: isNull(draftPicks.playerId),
    });
  
    if(currentPick === null) throw new Error("No current pick found");

    return currentPick;
}

export async function postDraftPick(teamId: number, draftId: number, pickNumber: number, playerPicked: number) {
  
  await db.update(draftPicks).set({
    playerId: playerPicked,
    isWriteIn: false,
    leagueId: 1
  })
  .where(
    and(
      eq(
        draftPicks.pickNumber, pickNumber
      ),
      eq(
        draftPicks.draftId, draftId
      )
    )
  )
}

export async function postWriteInDraftPick(teamId: number, draftId: number, pickNumber: number, playerName: string) {

  await db.update(draftPicks)
    .set({
      leagueId: 1,
      isWriteIn: true,
      writeInName: playerName,
    })
  .where(
    and(
      eq(
        draftPicks.pickNumber, pickNumber
      ),
      eq(
        draftPicks.draftId, draftId
      )
    )
  );
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