import "server-only";
import { db } from "~/server/db";
import { leagues, settings, draftSettings } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";
import {
  type LeagueSettings,
  type DraftSettings,
  type TeamSettings,
  type LeagueData,
} from "../utils/settings";

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
  // Placeholder for actual database query logic
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
    draftStart: draftSettingsData[0]?.draftStartDate?.toISOString().split("T")[0],
    draftTime: draftSettingsData[0]?.draftStartTime?.split("+")[0],
    pickDuration: draftSettingsData[0]?.pickDuration,
  } as DraftSettings;

  return draftSettingsDataResponse;

}

export async function updateDraftSettings(
  data: DraftSettings,
  leagueData: LeagueData,
): Promise<boolean> {
  
  try {
    await db
    .update(settings)
    .set({ draftsEnabled: data.draftEnabled })
    .where(eq(settings.leagueId, leagueData.leagueId)
  );
  } catch(error) {
    console.log("Draft Enable error",error)
  }
  
  try {
    await db
    .update(draftSettings)
    .set({
      snakeDraft: data.snakeDraft,
      draftStartDate: new Date(data.draftStart),
      draftStartTime: data.draftTime,
      pickDuration: data.pickDuration,
    })
    .where(and(eq(draftSettings.leagueId, leagueData.leagueId),eq(draftSettings.id, leagueData.draftId)));
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
