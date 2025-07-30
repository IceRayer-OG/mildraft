import z from "zod";

const teamSchema = z.object({
  id: z.number(),
  name: z.string(),
  abbreviation: z.string(),
});

const teamSettingsSchema = z.object({
  teamName: z.string(),
  teamAbbreviation: z.string(),
  teamLogo: z.string().url("Invalid URL format").optional(),
});

export type Team = z.infer<typeof teamSchema>;
export type TeamSettings = z.infer<typeof teamSettingsSchema>;