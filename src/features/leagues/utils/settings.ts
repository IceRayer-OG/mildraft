import z from "zod";

const leagueSettingsSchema = z.object({
  name: z.string(),
  abbreviation: z.string(),
});

const draftSettingsSchema = z.object({
  draftEnabled: z.boolean(),
  snakeDraft: z.boolean(),
  draftStart: z.string(),
  draftTime: z.string(),
  pickDuration: z.number(),
}); 

const teamSettingsSchema = z.object({
  logoEnabled: z.boolean(),
  teamsAllowed: z.number(),
});

export type LeagueSettings = z.infer<typeof leagueSettingsSchema>;
export type DraftSettings = z.infer<typeof draftSettingsSchema>;
export type TeamSettings = z.infer<typeof teamSettingsSchema>;
