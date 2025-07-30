import "server-only";
import { db } from "~/server/db";
import { teams } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { TeamSettings } from "../utils/team";

export async function updateTeamSettings(teamData: TeamSettings, teamId: string): Promise<boolean> {
    await db.update(teams)
        .set({
            name: teamData.teamName,
            abbreviation: teamData.teamAbbreviation,
        })
        .where(eq(teams.ownerId, teamId))
    
    return true
}