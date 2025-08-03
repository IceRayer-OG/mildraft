import { db } from "~/server/db";
import { eq, notInArray, and, isNotNull } from "drizzle-orm";
import { draftPicks, pros, players } from "~/server/db/schema";

export async function getFreeAgents() {
    const playersDrafted = db.select({pickedPlayer: draftPicks.playerId}).from(draftPicks)
        .where(
            and(
                eq(draftPicks.draftId, 2), 
                isNotNull(draftPicks.playerId),
            )
        );
    const playersOnTeams = db.select({playerOnTeam: players.proId}).from(players)
        .where(eq(players.leagueId, 1));

    const freeAgents = await db.select().from(pros)
        .where(
            and(
                notInArray(pros.id, playersDrafted),
                notInArray(pros.id, playersOnTeams)
            )
        );
        
    if (freeAgents === null) throw new Error("Error getting free agents"); 

    console.log("Free agents:", freeAgents);

    return freeAgents;
}