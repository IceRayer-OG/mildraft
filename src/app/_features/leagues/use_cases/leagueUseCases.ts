import {
  type LeagueSettings,
  type DraftSettings,
  type TeamSettings,
  type LeagueData,
} from "../utils/settings";
import { auth } from "@clerk/nextjs/server";
import {
  updateLeagueSettings,
  updateDraftSettings,
  updateTeamSettings,
  getLeagueSettings,
  getLeagueTeamSettings,
  getDraftSettings,
  getDraftPageDetails,
} from "../database/queries";
import { revalidatePath } from "next/cache";
import { formatDateToLeagueTimezone, formatToLeagueTimezone, formatToUserTimezone } from "../utils/date-utils";
import { log } from "console";

// import database functions here

async function checkAuthorization() {
  // Authorization
  const user = await auth();
  if (!user.userId) throw new Error("Not logged in");
  return user;
}

export async function getLeagueSettingsUseCase(leagueData: LeagueData) {
  const user = await checkAuthorization();

  // Fetch league settings from the database
  try {
    const settings = await getLeagueSettings(leagueData);
    return settings;
  } catch (error) {
    console.error("Failed to get league settings:", error);
    return { name: "", abbreviation: "", timezone: "UTC"};
  }
}

export async function updateLeagueSettingsUseCase(
  leagueSettingsData: LeagueSettings,
  leagueData: LeagueData,
) {
  const user = await checkAuthorization();

  try {
    await updateLeagueSettings(leagueSettingsData, leagueData);
    return {
      status: "success",
      message: "League settings updated successfully",
      data: leagueSettingsData,
    };
  } catch (error) {
    console.error("Failed to update league settings:", error);
    return {
      status: "error",
      message: "Failed to update league settings",
      data: leagueSettingsData,
    };
  }
}

export async function getDraftSettingsUseCase(leagueData: LeagueData) {
    const defaultSettings = {
      draftEnabled: false,
      snakeDraft: false,
      draftStart: new Date(),
      draftTime: "19:00:00+00",
      pickDuration: 60,
      draftPauseEnabled: false,
      draftPauseStartTime: "00:00:00+00",
      draftPauseEndTime: "00:00:00+00",
    }

  try {
    const settings = await getDraftSettings(leagueData);

    const { dateStr: localStartDate, timeStr: localStartTime } =
      await formatDateToLeagueTimezone(settings.draftStart);

    settings.draftStart = new Date(localStartDate);
    settings.draftTime = localStartTime;

    return settings;

  } catch (error) {
    console.error("Failed to get draft settings:", error);
    return defaultSettings;
  }
}

export async function getDraftPageDetailsUseCase(leagueData: LeagueData) {
  const draftPageDetailsDefault = {
    userDetails: new Date(),
    serverDetails: new Date(),
  }

  try {
    const draftPageDetailsData = await getDraftPageDetails(leagueData)

    if(!draftPageDetailsData) throw new Error("No start date found")

    const userDateData = await formatToUserTimezone(draftPageDetailsData[0]?.draftStart)

    const draftPageDetailsResponse = {
      userDetails: new Date(`${userDateData.dateStr}T${userDateData.timeStr}`),
      serverDetails: draftPageDetailsData[0]?.draftStart as Date
    }

    console.log(draftPageDetailsResponse)

    return draftPageDetailsResponse;

  } catch (error) {
    console.log(error)
    return draftPageDetailsDefault
  }

}

export async function getDraftDetailsUseCase(leagueData: LeagueData) {
    const defaultSettings = {
      draftEnabled: false,
      snakeDraft: false,
      draftStart: new Date(),
      draftTime: "19:00:00+00",
      pickDuration: 60,
      draftPauseEnabled: false,
      draftPauseStartTime: "00:00:00+00",
      draftPauseEndTime: "00:00:00+00",
    }

  try {
    const settings = await getDraftSettings(leagueData);

    const { dateStr: localStartDate, timeStr: localStartTime } =
      await formatToUserTimezone(settings.draftStart);

    settings.draftStart = new Date(localStartDate);
    settings.draftTime = localStartTime;

    return { draftStart: settings.draftStart, draftTime: settings.draftTime };

  } catch (error) {
    console.error("Failed to get draft settings:", error);
    return { draftStart: defaultSettings.draftStart, draftTime: defaultSettings.draftTime };
  }
}

export async function updateDraftSettingsUseCase(
  draftData: DraftSettings,
  leagueData: LeagueData,
) {
  await checkAuthorization();

  try {
    await updateDraftSettings(draftData, leagueData);
    return {
      status: "success",
      message: "Draft settings updated successfully",
      data: draftData,
    };
  } catch (error) {
    console.error("Failed to update draft settings:", error);
    return {
      status: "error",
      message: "Failed to update draft settings",
      data: draftData,
    };
  }
}

export async function getTeamSettingsUseCase(leagueData: LeagueData) {
  const user = await checkAuthorization();

  try {
    const settings = await getLeagueTeamSettings(leagueData);
    return settings;
  } catch (error) {
    console.error("Failed to get team settings:", error);
    return { teamsAllowed: 10, logoEnabled: true };
  }
}

export async function updateTeamSettingsUseCase(
  teamData: TeamSettings,
  leagueData: LeagueData,
) {
  await checkAuthorization();

  try {
    await updateTeamSettings(teamData, leagueData);
    return {
      status: "success",
      message: "Team settings updated successfully",
      data: teamData,
    };
  } catch (error) {
    console.error("Failed to update team settings:", error);
    return {
      status: "error",
      message: "Failed to update team settings",
      data: teamData,
    };
  }
}
