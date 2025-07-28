"use server";

import { revalidatePath } from "next/cache";
import { LeagueSettings, TeamSettings, DraftSettings } from "../utils/settings";
// add queries

export async function updateLeagueSettings(data: LeagueSettings) {
  // DB Call to update league settings
  // This is a placeholder function, implement the actual DB call
  console.log("Updating league settings with data:", data);
  revalidatePath("league");
}

export async function updateDraftSettings(data: DraftSettings) {
  // DB Call to update draft settings
  // This is a placeholder function, implement the actual DB call
  console.log("Updating draft settings with data:", data);
  revalidatePath("league");
}

export async function updateTeamSettings(data: TeamSettings) {
  // DB Call to update team settings
  // This is a placeholder function, implement the actual DB call
  console.log("Updating team settings with data:", data );
  revalidatePath("league");
}