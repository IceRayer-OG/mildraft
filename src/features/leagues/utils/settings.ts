import z from "zod";

const leagueSettingsSchema = z.object({
  id: z.number(),
  leagueId: z.number(),
  name: z.string(),
  abbreviation: z.string(),
});

const draftSettingsSchema = z.object({
  id: z.number(),
  leagueId: z.number(),
  draftId: z.number(),
  draftEnabled: z.boolean(),
  snakeDraft: z.boolean(),
  draftType: z.string(),
  draftDate: z.string(),
  draftTime: z.string(),
  pickDuration: z.number(),
}); 

const teamSettingsSchema = z.object({
  id: z.number(),
  leagueId: z.number(),
  logoEnabled: z.boolean(),
  teams: z.number(),
});

export type LeagueSettings = z.infer<typeof leagueSettingsSchema>;
export type DraftSettings = z.infer<typeof draftSettingsSchema>;
export type TeamSettings = z.infer<typeof teamSettingsSchema>;
