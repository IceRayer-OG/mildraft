import z from "zod";

const teamSchema = z.object({
  id: z.number(),
  name: z.string(),
  abbreviation: z.string(),
});

export type Team = z.infer<typeof teamSchema>;