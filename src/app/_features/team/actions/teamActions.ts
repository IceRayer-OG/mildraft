"use server";

// Cache Items
import { revalidatePath } from "next/cache";

// Use Cases
import { 
    dropPlayerFromMyTeamUseCase, 
    getLeagueTeamsUseCase, 
    getMyTeamInfoUseCase, 
    getMyTeamUseCase,
    getLeagueUnclaimedTeamsUseCase,
    claimTeamUseCase,
} from "../use_cases/teamsUseCase";
import { type UnclaimedTeam } from "../utils/team";

export async function getMyTeamAction() {
    const myTeam = await getMyTeamUseCase();

    return myTeam;
}

export async function dropPlayerFromMyTeamAction(playerId: number) {
    const dropPlayer = await dropPlayerFromMyTeamUseCase(playerId);
    revalidatePath("/league/team")
    return dropPlayer;
}

export async function getLeagueTeamsAction() {
    const allTeams = await getLeagueTeamsUseCase();

    return allTeams;
}

export async function getLeagueUnclaimedTeamsAction() {
    const unclaimedTeams = getLeagueUnclaimedTeamsUseCase();
    return unclaimedTeams; 
}

export async function getMyTeamInfoAction() {
    const myTeamInfo = await getMyTeamInfoUseCase();

    return myTeamInfo;
}

export async function claimTeamAction(claimedTeamInfo: UnclaimedTeam) {
    const claimedTeam = await claimTeamUseCase(claimedTeamInfo);
    revalidatePath("/");
    return claimedTeam;

}

export async function claimTeamActionTest(claimedTeam: UnclaimedTeam) {
    
    const response = await claimTeamUseCase(claimedTeam);
    
    revalidatePath("/");

    return response;
}