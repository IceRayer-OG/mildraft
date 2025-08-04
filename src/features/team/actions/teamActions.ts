"use server";

import { revalidatePath } from "next/cache";
import { type Team } from "../utils/team";
import { getMyTeam, dropPlayer, getLeagueTeams, getMyTeamName } from "~/server/queries";

export async function dbGetLeagueTeams() {
    // DB Call to get all teams
    const allTeams = await getLeagueTeams();
    // Check if the query was successful
    if(allTeams === null) throw new Error("Error getting your League's team");
    // Return the data
    return allTeams as Team[];
}

export async function dbGetMyTeam() {
    // DB Call to get my team
    const myTeam = await getMyTeam();

    if(myTeam === null) throw new Error("Error getting your team");
    
    return myTeam;   
}

export async function dbGetMyTeamName() {
    // DB Call to get my team name
    const myTeamName = await getMyTeamName();
    if(myTeamName === null) throw new Error("Error getting your team name");
    return myTeamName;
}

export async function dbDropPlayer(playerId: number) {
    // DB Call to drop player
    await dropPlayer(playerId);
    revalidatePath("league/team");
}