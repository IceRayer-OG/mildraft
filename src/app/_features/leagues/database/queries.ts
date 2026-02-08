import "server-only";
import { db } from "~/server/db";
import { leagues, settings, draftSettings } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";
import {
  type LeagueSettings,
  type DraftSettings,
  type TeamSettings,
  type LeagueData,
  DraftPageDetails,
} from "../utils/settings";
import { convertToUTC } from "../utils/date-utils";

export async function getLeagueSettings(
  leagueData: LeagueData,
): Promise<LeagueSettings> {
  // Placeholder for actual database query logic
  const data = await db
    .select()
    .from(settings)
    .where(eq(settings.leagueId, leagueData.leagueId))
    .limit(1);

  if (!data) throw new Error("League settings not found");

  const leagueSettings = {
    name: data[0]?.name,
    abbreviation: data[0]?.abbreviation,
    timezone: data[0]?.timezone,
  } as LeagueSettings;

  return leagueSettings;
}

export async function updateLeagueSettings(
  data: LeagueSettings,
  leagueData: LeagueData,
): Promise<boolean> {

  await db
    .update(settings)
    .set({ name: data.name, abbreviation: data.abbreviation })
    .where(eq(settings.leagueId, leagueData.leagueId));
  return true;
}

export async function getDraftSettings(
  leagueData: LeagueData,
): Promise<DraftSettings> {

  const leagueSettingsData = await db
    .select()
    .from(settings)
    .where(eq(settings.leagueId, leagueData.leagueId))
    .limit(1);
  if (!leagueSettingsData) throw new Error("League settings not found");

  const draftSettingsData = await db
    .select()
    .from(draftSettings)
    .where(
      and(
        eq(draftSettings.leagueId, leagueData.leagueId),
        eq(draftSettings.draftId, leagueData.draftId)
      ))
    .limit(1);

  if (!draftSettingsData) throw new Error("Draft settings not found");

  const draftSettingsDataResponse = {
    draftEnabled: leagueSettingsData[0]?.draftsEnabled,
    snakeDraft: draftSettingsData[0]?.snakeDraft,
    draftStart: draftSettingsData[0]?.startDate,
    draftTime: draftSettingsData[0]?.startDate?.toString().split(" ")[1],
    pickDuration: draftSettingsData[0]?.pickDuration,
    draftPauseEnabled: draftSettingsData[0]?.overnightPauseEnable,
    draftPauseStartTime: draftSettingsData[0]?.pauseStartTime?.split("-")[0],
    draftPauseEndTime: draftSettingsData[0]?.pauseEndTime?.split("-")[0],
  } as DraftSettings;

  console.log(draftSettingsDataResponse.draftStart)

  return draftSettingsDataResponse;

}

export async function getDraftPageDetails(
  leagueData: LeagueData,
) {

  const leagueSettingsData = await db
    .select()
    .from(settings)
    .where(eq(settings.leagueId, leagueData.leagueId))
    .limit(1);
  if (!leagueSettingsData) throw new Error("League settings not found");

  const draftSettingsData = await db
    .select({
      draftStart: draftSettings.startDate,
    })
    .from(draftSettings)
    .where(
      and(
        eq(draftSettings.leagueId, leagueData.leagueId),
        eq(draftSettings.draftId, leagueData.draftId)
      ))
    .limit(1);

  if (!draftSettingsData) throw new Error("Draft settings not found");

  return draftSettingsData;

}

export async function updateDraftSettings(
  draftData: DraftSettings,
  leagueData: LeagueData,
): Promise<boolean> {
  
  try {
    await db
    .update(settings)
    .set({ draftsEnabled: draftData.draftEnabled })
    .where(eq(settings.leagueId, leagueData.leagueId)
  );
  } catch(error) {
    console.log("Draft Enable error",error)
  }
  
  try {
    const startDateUTC = await convertToUTC(draftData.draftStart.toISOString(), draftData.draftTime);

    await db
    .update(draftSettings)
    .set({
      snakeDraft: draftData.snakeDraft,
      startDate: startDateUTC,
      draftStartDate: new Date(draftData.draftStart),
      draftStartTime: draftData.draftTime,
      pickDuration: draftData.pickDuration,
      overnightPauseEnable: draftData.draftPauseEnabled,
      pauseStartTime: `${draftData.draftPauseStartTime}-08`,
      pauseEndTime: `${draftData.draftPauseEndTime}-08`,
    })
    .where(and(eq(draftSettings.leagueId, leagueData.leagueId),eq(draftSettings.draftId, leagueData.draftId)));
  } catch(error) {
    console.log("Draft Settings error",error)
  }

  return true;

}

export async function getLeagueTeamSettings(
  leagueData: LeagueData,
): Promise<TeamSettings> {
  // Placeholder for actual database query logic
  const data = await db
    .select()
    .from(settings)
    .where(eq(settings.leagueId, leagueData.leagueId))
    .limit(1);

  if (!data) throw new Error("League settings not found");

  const teamSettings = {
    logoEnabled: data[0]?.teamLogosEnabled,
    teamsAllowed: data[0]?.teams,
  } as TeamSettings;
  
  return teamSettings;
}

export async function updateTeamSettings(
  data: TeamSettings,
  leagueData: LeagueData,
): Promise<boolean> {

  await db
    .update(settings)
    .set({ teams: data.teamsAllowed, teamLogosEnabled: data.logoEnabled })
    .where(eq(settings.leagueId, leagueData.leagueId));
  return true;
}
