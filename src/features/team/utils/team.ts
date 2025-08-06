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

const playersSchema =  z.object({
  id: z.number(),
  proId: z.number(),
  teamId: z.number(),
  position: z.enum(["P", "C", "1B", "2B", "3B", "SS", "OF", "CI", "MI", "DH"]),
}); 

const proSchema = z.object({
  id: z.number(),
  playerNumber: z.number(),
  playerFirstName: z.string(),
  playerLastName: z.string(),
  playerName: z.string(),
  team: z.string(),
  position: z.enum(["P", "C", "1B", "2B", "3B", "SS", "OF", "CI", "MI", "DH"]),
  age: z.number(),
  height: z.string(),
  weight: z.number(),
  throws: z.enum(["R", "L", "B"]),
  bats: z.enum(["R", "L", "B"]),
  rank: z.number(),
});

const teamPlayersSchema = z.object({
    player: playersSchema,
    pros: proSchema,
});

export type Team = z.infer<typeof teamSchema>;
export type TeamSettings = z.infer<typeof teamSettingsSchema>;
export type TeamPlayers = z.infer<typeof teamPlayersSchema>;