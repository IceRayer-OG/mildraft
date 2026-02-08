import { time } from "console";
import z from "zod";

const leagueSettingsSchema = z.object({
  name: z.string(),
  abbreviation: z.string(),
  timezone: z.string().max(256),
});

const draftPageDetails = z.object({
  draftStart: z.date(),
})

const draftSettingsSchema = z.object({
  draftEnabled: z.boolean(),
  snakeDraft: z.boolean(),
  draftStart: z.date(),
  draftTime: z.iso.time(),
  pickDuration: z.number(),
  draftPauseEnabled: z.boolean(),
  draftPauseStartTime: z.iso.time(),
  draftPauseEndTime: z.iso.time(),
}); 

const teamSettingsSchema = z.object({
  logoEnabled: z.boolean(),
  teamsAllowed: z.number(),
});

export const leagueDataSchema = z.object({
  leagueId: z.number(),
  draftId: z.number(),
});

export type LeagueSettings = z.infer<typeof leagueSettingsSchema>;
export type DraftSettings = z.infer<typeof draftSettingsSchema>;
export type TeamSettings = z.infer<typeof teamSettingsSchema>;
export type LeagueData = z.infer<typeof leagueDataSchema>;
export type DraftPageDetails = z.infer<typeof draftPageDetails>;
