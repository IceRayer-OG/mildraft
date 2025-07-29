"use server";

import { revalidatePath } from "next/cache";
import { LeagueSettings, TeamSettings, DraftSettings, LeagueData } from "../utils/settings";
// add queries

export async function updateLeagueSettings(data: LeagueSettings, leagueData: LeagueData) {
  // DB Call to update league settings
  // This is a placeholder function, implement the actual DB call
  console.log("Updating league settings with data:", data, leagueData);
  revalidatePath("league");
}

export async function updateDraftSettings(data: DraftSettings, leagueData: LeagueData) {
  // DB Call to update draft settings
  // This is a placeholder function, implement the actual DB call
  console.log("Updating draft settings with data:", data, leagueData);
  revalidatePath("league");
}

export async function updateTeamSettings(data: TeamSettings, leagueData: LeagueData) {
  // DB Call to update team settings
  // This is a placeholder function, implement the actual DB call
  console.log("Updating team settings with data:", data, leagueData);
  revalidatePath("league");
}