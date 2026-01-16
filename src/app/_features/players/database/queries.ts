import "server-only";
import { db } from "~/server/db";
import { eq, notInArray, and, isNotNull, sql } from "drizzle-orm";
import { draftPicks, pros, players } from "~/server/db/schema";
import { ProPlayers } from "../utils/players";

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

    return freeAgents;
}

export async function loadDraftablePlayers(draftablePlayers: unknown) {

}

export async function loadProspectPlayers(dataToInsert: ProPlayers[]) {

	const batchSize = 10; // Adjust batch size as needed

	for (let i = 0; i < dataToInsert.length; i += batchSize) {
    const batch = dataToInsert.slice(i, i + batchSize);
    
	await db.insert(pros)
	.values(batch)
	.onConflictDoUpdate({
		target: [pros.playerName, pros.team],
		set: {
			rank: sql`excluded.rank`,
			position: sql`excluded.position`,
			level: sql`excluded.level`,
			eta: sql`excluded.eta`,
			age: sql`excluded.age`,
			height: sql`excluded.height`,
			weight: sql`excluded.weight`,
			bats: sql`excluded.bats`,
			throws: sql`excluded.throws`,
			updatedAt: sql`NOW()`
		}
	});
}

}
