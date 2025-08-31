"use server";

import { revalidatePath } from "next/cache";
import { type LeagueSettings, type TeamSettings, type DraftSettings, type LeagueData } from "../utils/settings";
import { updateLeagueSettingsUseCase, updateDraftSettingsUseCase, updateTeamSettingsUseCase, getLeagueSettingsUseCase, getTeamSettingsUseCase, getDraftSettingsUseCase } from "../use_cases/leagueUseCases";

export async function getLeagueSettingsAction(leagueData: LeagueData) {
  const response = await getLeagueSettingsUseCase(leagueData);
  return response;
}

export async function updateLeagueSettingsAction(
  leagueData: LeagueData,
  previousState: { 
    status: string; 
    message: string; 
    data: LeagueSettings ;
  }, 
  formData: FormData,
) {

  const data: LeagueSettings = {
    name: formData.get("leagueName") as string,
    abbreviation: formData.get("leagueAbbreviation") as string,
  };

  const response = await updateLeagueSettingsUseCase(data, leagueData);
  revalidatePath("league");
  return response;
}

export async function getDraftSettingsAction(leagueData: LeagueData) {
  const response = await getDraftSettingsUseCase(leagueData);
  return response;
}

export async function updateDraftSettingsAction(
  leagueData: LeagueData,
  previousState: { 
    status: string; 
    message: string; 
    data: DraftSettings ;
  }, 
  formData: FormData,
) {

  const data: DraftSettings = {
    draftEnabled: Boolean(formData.get("draftEnabled")),
    snakeDraft: Boolean(formData.get("snakeDraft")),
    draftStart: formData.get("draftStartDate") as string,
    draftTime: formData.get("draftStartTime") as string,
    pickDuration: Number(formData.get("pickDuration")),
  };

  const response = await updateDraftSettingsUseCase(data, leagueData);
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
    data: TeamSettings ;
  }, 
  formData: FormData,
) {

  const data: TeamSettings = {
    logoEnabled: Boolean(formData.get("teamLogosEnabled")),
    teamsAllowed: Number(formData.get("teamsAllowed")),
  };

  const response = await updateTeamSettingsUseCase(data, leagueData);
  revalidatePath("league");
  return response;
}
