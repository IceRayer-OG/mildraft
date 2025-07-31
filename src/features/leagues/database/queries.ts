import "server-only";
import { db } from "~/server/db";
import { leagues, draftSettings, settings } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { LeagueSettings, DraftSettings, TeamSettings, LeagueData } from "../utils/settings";


export async function updateLeagueSettings(data: LeagueSettings, leagueData: LeagueData):Promise<boolean> {
    // Placeholder for actual database update logic
    console.log("Updating league settings in the database with data:", data, leagueData);
    await db.update(leagues).set({name: data.name, abbreviation: data.abbreviation}).where(eq(leagues.id, leagueData.leagueId));
    return true;
}

export async function updateDraftSettings(data: DraftSettings, leagueData: LeagueData):Promise<boolean> {
    // Placeholder for actual database update logic
    console.log("Updating draft settings in the database with data:", data, leagueData);
    await db.update(draftSettings).set({
        snakeDraft: data.snakeDraft,
        startDate: new Date(data.draftStart),
        pickDuration: data.pickDuration
    }).where(eq(draftSettings.leagueId, leagueData.leagueId));
    return true;
}

export async function updateTeamSettings(data: TeamSettings, leagueData: LeagueData):Promise<boolean> {
    // Placeholder for actual database update logic
    console.log("Updating team settings in the database with data:", data, leagueData);
    await db.update(settings).set({teams: data.teamsAllowed}).where(eq(settings.leagueId, leagueData.leagueId));
    return true;
}

