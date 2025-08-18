"use server";

import { auth } from "@clerk/nextjs/server";
import { type TeamSettings } from "../utils/team";
import { updateTeamSettings, getTeamSettings } from "../database/queries";

async function checkAuthorization() {
  // Authorization
  const user = await auth();
  if (!user.userId) throw new Error("Not logged in");
  return user;
}

export async function updateTeamSettingsUseCase(teamData: TeamSettings) {
  // Check auth
  const user = await checkAuthorization();

  // Is the user the team owner?
  const teamId: string = user.userId;

  // If not, throw an error or handle accordingly

  try {
    await updateTeamSettings(teamData, teamId);
    return {
      status: "success",
      message: `Team settings updated successfully.`,
      data: teamData,
    };
  } catch (error) {
    console.error("Failed to update team settings:", error);
    return {
      status: "error",
      message: "Failed to update team settings.",
      data: teamData,
    };
  }
}

export async function getTeamSettingsUseCase() {
  // Check auth
  const user = await checkAuthorization();

  // Is the user the team owner?
  const teamId: string = user.userId;

  // If not, throw an error or handle accordingly
  // Fetch team settings from the database
  try {
    const teamSettings = await getTeamSettings(teamId);
    if (!teamSettings) {
      throw new Error("No team settings found for the user");
    }
    const teamSettingsData = {
      teamName: teamSettings.name,
      teamAbbreviation: teamSettings.abbreviation,
      teamLogo: undefined, // Assuming logo is optional
    } as TeamSettings;
    return teamSettingsData;
  } catch (error) {
    console.error("Failed to fetch team settings:", error);
    throw error; // Re-throw the error for further handling if needed
  }
}
