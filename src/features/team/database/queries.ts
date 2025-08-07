import "server-only";
import { db } from "~/server/db";
import { teams, players, pros } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";
import { TeamSettings } from "../utils/team";

export async function updateTeamSettings(
  teamData: TeamSettings,
  teamId: string,
): Promise<boolean> {
  await db
    .update(teams)
    .set({
      name: teamData.teamName,
      abbreviation: teamData.teamAbbreviation,
    })
    .where(eq(teams.ownerId, teamId));

  return true;
}

export async function getTeamSettings(teamOwnerId: string) {
  const team = await db.query.teams.findFirst({
    where: eq(teams.ownerId, teamOwnerId),
  });

  if (!team) {
    return null; // No team found for the given ID
  }

  return team;
}

export async function getTeamIdByUserId(userId: string) {
    const teamId = await db.query.teams.findFirst({
        where: eq(teams.ownerId, userId),
        columns: {
            id: true
        }
    });

    if(!teamId) throw new Error("No team found for user")
    
    return teamId;
}

export async function getMyTeam(userId: string) {

  const myTeamId = await db.query.teams.findFirst({
    where: eq(teams.ownerId, userId),
  });

  if(myTeamId === undefined) throw new Error("No team found");

  const myTeam = await db.select().from(players)
    .leftJoin(pros, eq(players.proId, pros.id))
    .where(eq(players.teamId, myTeamId.id)
  );

  // if(!myTeam[0]?.player.id) throw new Error("No players found")

  return myTeam;
}

export async function getAllTeamsInLeague() {
  const leagueTeams = await db.query.teams.findMany({
    where: eq(teams.leagueId, 1),
  });

  return leagueTeams;
}

export async function dropPlayerFromMyTeam(playerId: number, userId: string) {
  // Check user is team owner
  const myTeamId = await db.query.teams.findFirst({
    where: eq(teams.ownerId, userId),
  });
  
  if(myTeamId === undefined) throw new Error("No team found");

  // Delete player from team
  await db.delete(players).where(
    and(
      eq(players.id, playerId),
      eq(players.teamId, myTeamId.id)
    )
  );
}
