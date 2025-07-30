"use server";

import { revalidatePath } from "next/cache";
import { type TeamSettings } from "../utils/team";
import { updateTeamSettingsUseCase, getTeamSettingsUseCase } from "../use_cases/teamSettingsUseCases";

export async function updateTeamSettingsAction(teamData: TeamSettings) {
    try {
        // Here you would typically make an API call, e.g.:
        await updateTeamSettingsUseCase(teamData);
        revalidatePath("/team"); // Revalidate the path to reflect changes
    } catch (error) {
        console.error("Failed to update team settings:", error);
        throw error; // Re-throw the error for further handling if needed
    }
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