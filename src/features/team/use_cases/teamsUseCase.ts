"use server";
// Authentication
import { auth } from "@clerk/nextjs/server";

// Types
import { 
    type Team, 
    type TeamPlayers 
} from "../utils/team";

// DB Queries
import { 
    dropPlayerFromMyTeam, 
    getAllTeamsInLeague, 
    getMyTeam, 
    // getTeamIdByUserId, 
    getTeamSettings 
} from "../database/queries";

async function checkAuthentication() {
    const user = await auth();
    
    if(!user.userId) {
        throw new Error("User not authenticated")
    }

    return user;
}


export async function getMyTeamUseCase() {
    const user = await checkAuthentication();

    // Get users team id
    // const teamId = await getTeamIdByUserId(user.userId);

    const myTeam = await getMyTeam(user.userId);

    return (myTeam) as TeamPlayers[];
}

export async function dropPlayerFromMyTeamUseCase(playerId: number) {
    const user = await checkAuthentication();

    await dropPlayerFromMyTeam(playerId, user.userId);

    return true;
}

export async function getLeagueTeamsUseCase() {
    const user = await checkAuthentication();
    // DB Call to get all teams
    const allTeams = await getAllTeamsInLeague();
    // Check if the query was successful
    if(allTeams === null) throw new Error("Error getting your League's team");
    // Return the data
    return allTeams as Team[];
}

export async function getMyTeamInfoUseCase(): Promise<Team> {
    const user = await checkAuthentication();

    // Get users team id
    // const teamId = await getTeamIdByUserId(user.userId);

    const myTeamInfo = await getTeamSettings(user.userId);

    return myTeamInfo as Team;
}