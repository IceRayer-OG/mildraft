"use server";

import { revalidatePath } from "next/cache";
import { type LeagueSettings, type TeamSettings, type DraftSettings, type LeagueData } from "../utils/settings";
import { updateLeagueSettingsUseCase, updateDraftSettingsUseCase, updateTeamSettingsUseCase, getLeagueSettingsUseCase, getTeamSettingsUseCase, getDraftSettingsUseCase, getDraftDetailsUseCase, getDraftPageDetailsUseCase } from "../use_cases/leagueUseCases";

export async function getLeagueSettingsAction(leagueData: LeagueData) {
  const response = await getLeagueSettingsUseCase(leagueData);
  return response;
}

export async function updateLeagueSettingsAction(
  leagueData: LeagueData,
  previousState: { 
    status: string; 
    message: string; 
    data: LeagueSettings;
  }, 
  formData: FormData,
  
) {

  const data: LeagueSettings = {
    name: formData.get("leagueName") as string,
    abbreviation: formData.get("leagueAbbreviation") as string,
    timezone: formData.get("leagueTimezone") as string,
  };

  const response = await updateLeagueSettingsUseCase(data, leagueData);
  revalidatePath("league");
  return response;
}

export async function getDraftPageDetailsAction(leagueData: LeagueData) {
  const response = await getDraftPageDetailsUseCase(leagueData);
  return response;
}

export async function getDraftSettingsAction(leagueData: LeagueData) {
  const response = await getDraftSettingsUseCase(leagueData);
  console.log(response.draftStart)
  return response;
}

export async function getDraftDetailsAction(leagueData: LeagueData) {
  const response = await getDraftDetailsUseCase(leagueData);
  return response;
}

export async function updateDraftSettingsAction(
  leagueData: LeagueData,
  previousState: { 
    status: string; 
    message: string; 
    data: DraftSettings;
  }, 
  formData: FormData,
) {

  const draftData: DraftSettings = {
    draftEnabled: Boolean(formData.get("draftEnabled")),
    snakeDraft: Boolean(formData.get("snakeDraft")),
    draftStart: new Date(formData.get("draftStartDate") as string),
    draftTime: formData.get("draftStartTime") as string,
    pickDuration: Number(formData.get("pickDuration")),
    draftPauseEnabled: Boolean(formData.get("draftPauseEnabled")),
    draftPauseStartTime: formData.get("draftPauseStartTime") as string,
    draftPauseEndTime: formData.get("draftPauseEndTime") as string,
  };

  const response = await updateDraftSettingsUseCase(draftData, leagueData);
  revalidatePath("league");
  return response;
}

export async function getTeamSettingsAction(leagueData: LeagueData) {
  const response = await getTeamSettingsUseCase(leagueData);
  return response;
}

export async function updateTeamSettingsAction(
  leagueData: LeagueData,
  previousState: { 
    status: string; 
    message: string; 
    data: TeamSettings;
  }, 
  formData: FormData,
) {

  const teamSettingsData: TeamSettings = {
    logoEnabled: Boolean(formData.get("teamLogosEnabled")),
    teamsAllowed: Number(formData.get("teamsAllowed")),
  };

  const response = await updateTeamSettingsUseCase(teamSettingsData, leagueData);
  revalidatePath("league");
  return response;
}
