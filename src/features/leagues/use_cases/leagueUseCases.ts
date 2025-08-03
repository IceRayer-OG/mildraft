
import { type LeagueSettings, type DraftSettings, type TeamSettings, type LeagueData } from "../utils/settings";
import { auth } from "@clerk/nextjs/server";
import { updateLeagueSettings, updateDraftSettings, updateTeamSettings } from "../database/queries";

// import database functions here

async function checkAuthorization() {
  // Authorization
  const user = await auth();
  if (!user.userId) throw new Error("Not logged in");
  return user;
}

export async function updateLeagueSettingsUseCase(data: LeagueSettings, leagueData: LeagueData) {
    const user = await checkAuthorization();

    const settingsUpdated = await updateLeagueSettings(data, leagueData);
    if (!settingsUpdated) {
        throw new Error("Failed to update league settings");
    }
    
    console.log("Updating league settings with data:", data, leagueData);
}

export async function updateDraftSettingsUseCase(data: DraftSettings, leagueData: LeagueData) {

    await checkAuthorization();
    
    const settingsUpdated = await updateDraftSettings(data, leagueData);

    if (!settingsUpdated) {
        throw new Error("Failed to update draft settings");
    }

    console.log("Updating league settings with data:", data, leagueData);
}

export async function updateTeamSettingsUseCase(data: TeamSettings, leagueData: LeagueData) {
    await checkAuthorization();

    const settingsUpdated = await updateTeamSettings(data, leagueData);

    if (!settingsUpdated) {
        throw new Error("Failed to update team settings");
    }

    console.log("Updating league settings with data:", data, leagueData);
}