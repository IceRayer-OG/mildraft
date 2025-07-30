"use server";

import { revalidatePath } from "next/cache";
import { LeagueSettings, TeamSettings, DraftSettings, LeagueData } from "../utils/settings";
import { updateLeagueSettingsUseCase, updateDraftSettingsUseCase, updateTeamSettingsUseCase } from "../use_cases/leagueUseCases";
// add queries

export async function updateLeagueSettingsAction(data: LeagueSettings, leagueData: LeagueData) {
  // Persistence layer call to update league settings
  await updateLeagueSettingsUseCase(data, leagueData);
  // This is a placeholder function, implement the actual DB call
  console.log("Updating league settings with data:", data, leagueData);
  revalidatePath("league");
}

export async function updateDraftSettingsAction(data: DraftSettings, leagueData: LeagueData) {
  // Persistance layer call to update draft settings
  await updateDraftSettingsUseCase(data, leagueData);
  // This is a placeholder function, implement the actual DB call
  console.log("Updating draft settings with data:", data, leagueData);
  revalidatePath("league");
}

export async function updateTeamSettingsAction(data: TeamSettings, leagueData: LeagueData) {
  // Persistance layer call to update team settings
  await updateTeamSettingsUseCase(data, leagueData);
  // This is a placeholder function, implement the actual DB call
  console.log("Updating team settings with data:", data, leagueData);
  revalidatePath("league");
}