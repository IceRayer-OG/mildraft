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

export async function loadDraftablePlayers(_draftablePlayers: unknown) {

}

export async function loadProspectPlayers(dataToInsert: ProPlayers[]) {
  const batchSize = 100;

  for (let i = 0; i < dataToInsert.length; i += batchSize) {
    const batch = dataToInsert.slice(i, i + batchSize);

    await db
      .insert(pros)
      .values(batch)
      .onConflictDoUpdate({
        target: pros.mlbamId,
        set: {
          rank: sql`excluded.rank`,
          teamRank: sql`excluded.team_rank`,
          draftRank: sql`excluded.draft_rank`,
          intlRank: sql`excluded.intl_rank`,
          position: sql`excluded.position`,
          team: sql`excluded.team`,
          org: sql`excluded.org`,
          orgId: sql`excluded.org_id`,
          affiliateTeam: sql`excluded.affiliate_team`,
          level: sql`excluded.level`,
          eta: sql`excluded.eta`,
          age: sql`excluded.age`,
          height: sql`excluded.height`,
          weight: sql`excluded.weight`,
          bats: sql`excluded.bats`,
          throws: sql`excluded.throws`,
          headshotUrl: sql`excluded.headshot_url`,
          lists: sql`excluded.lists`,
          careerMlbAtBats: sql`excluded.career_mlb_at_bats`,
          careerMlbInningsPitched: sql`excluded.career_mlb_innings_pitched`,
          mlbDebutDate: sql`excluded.mlb_debut_date`,
          isMilEligible: sql`excluded.is_mil_eligible`,
          updatedAt: sql`NOW()`,
        },
      });
  }
}
