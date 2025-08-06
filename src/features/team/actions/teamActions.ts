"use server";

// Cache Items
import { revalidatePath } from "next/cache";

// Use Cases
import { 
    dropPlayerFromMyTeamUseCase, 
    getLeagueTeamsUseCase, 
    getMyTeamInfoUseCase, 
    getMyTeamUseCase 
} from "../use_cases/teamsUseCase";

export async function getMyTeamAction() {
    const myTeam = await getMyTeamUseCase();
    console.log(myTeam);

    return myTeam;
}

export async function dropPlayerFromMyTeamAction(playerId: number) {
    const dropPlayer = await dropPlayerFromMyTeamUseCase(playerId);
    revalidatePath("/league/team")
    return;
}

export async function getLeagueTeamsAction() {
    const allTeams = await getLeagueTeamsUseCase();

    return allTeams;
}

export async function getMyTeamInfoAction() {
    const myTeamInfo = await getMyTeamInfoUseCase();

    return myTeamInfo;
}