import "server-only";
import { db } from "~/server/db";
import { draftPicks, pros, teams, leagues, drafts, queues, posts, players } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { LeagueSettings, DraftSettings, TeamSettings, LeagueData } from "../utils/settings";


export async function updateLeagueSettings(data: LeagueSettings, leagueData: LeagueData):Promise<boolean> {
    // Placeholder for actual database update logic
    console.log("Updating league settings in the database with data:", data, leagueData);
    return true
    // Example: await db.update(leagues).set(data).where(eq(leagues.id, leagueData.leagueId));
}

export async function updateDraftSettings(data: DraftSettings, leagueData: LeagueData):Promise<boolean> {
    // Placeholder for actual database update logic
    console.log("Updating draft settings in the database with data:", data, leagueData);
    return true
    // Example: await db.update(drafts).set(data).where(eq(drafts.id, leagueData.draftId));
}

export async function updateTeamSettings(data: TeamSettings, leagueData: LeagueData):Promise<boolean> {
    // Placeholder for actual database update logic
    console.log("Updating team settings in the database with data:", data, leagueData);
    return true
    // Example: await db.update(teams).set(data).where(eq(teams.id, leagueData.teamId));
}