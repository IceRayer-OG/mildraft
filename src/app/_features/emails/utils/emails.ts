import z from "zod";

export const DraftPickEmailPropsSchema = z.object({
  pickNumber: z.number(),
  teamName: z.string(),
  playerName: z.string(),
  pickingTeam: z.string(),
});

export const DraftStartDataSchema = z.object({
  team: z.object({
    name: z.string(),
  }),
  draft_pick: z.object({
    id: z.number(),
  }),
});

export const DraftTimeOutEmailDataSchema = z.object({
  pickNumber: z.number(),
  teamName: z.string(),
  pickingTeam: z.string(),
});

export type DraftPickEmailProps = z.infer<typeof DraftPickEmailPropsSchema>;
export type DraftStartData = z.infer<typeof DraftStartDataSchema>;
export type DraftTimeOutEmailData = z.infer<typeof DraftTimeOutEmailDataSchema>;
