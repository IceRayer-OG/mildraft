"use server";

import { revalidatePath } from "next/cache";
// add types
// add queries

export async function updateLeagueSettings(data: any) {
  // DB Call to update league settings
  // This is a placeholder function, implement the actual DB call
  console.log("Updating league settings with data:", data);
  revalidatePath("league/settings");
}

export async function updateDraftSettings(data: any) {
  // DB Call to update draft settings
  // This is a placeholder function, implement the actual DB call
  console.log("Updating draft settings with data:", data);
  revalidatePath("league/draft");
}

export async function updateTeamSettings(data: any) {
  // DB Call to update team settings
  // This is a placeholder function, implement the actual DB call
  console.log("Updating team settings with data:", data);
  revalidatePath("league/team");
}