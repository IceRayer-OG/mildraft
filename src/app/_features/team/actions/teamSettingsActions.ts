"use server";

import { revalidatePath } from "next/cache";
import { type TeamSettings } from "../utils/team";
import {
  updateTeamSettingsUseCase,
  getTeamSettingsUseCase,
} from "../use_cases/teamSettingsUseCases";

export async function updateTeamSettingsAction(
  previousState: { status: string; message: string; data: TeamSettings },
  formData: FormData,
) {
  await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulate a delay
  const teamData: TeamSettings = {
    teamName: formData.get("teamName") as string,
    teamAbbreviation: formData.get("teamAbbreviation") as string,
    teamLogo: formData.get("teamLogo") as string,
  };
  const response = await updateTeamSettingsUseCase(teamData);
  revalidatePath("/team"); // Revalidate the path to reflect changes
  return response;
}

export async function getTeamSettingsAction() {
  try {
    // Fetch team settings from the use case
    const teamSettings = await getTeamSettingsUseCase();
    return teamSettings;
  } catch (error) {
    console.error("Failed to fetch team settings:", error);
    throw error; // Re-throw the error for further handling if needed
  }
}
