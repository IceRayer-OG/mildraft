"use server";

import { auth } from "@clerk/nextjs/server";
import { TeamSettings } from "../utils/team";
import { updateTeamSettings } from "../database/queries";

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
    } catch (error) {
        console.error("Failed to update team settings:", error);
        throw error; // Re-throw the error for further handling if needed
    }
}