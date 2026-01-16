import z from "zod";

const positions = z.enum(["RHP", "LHP", "C", "1B", "2B", "3B", "SS", "OF", "CI", "MI", "INF", "DH"]);

const teamSchema = z.object({
  id: z.number(),
  name: z.string(),
  abbreviation: z.string(),
});

const unclaimedTeamSchema = z.object({
  id: z.number(),
  name: z.string(),
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
  position: positions,
}); 

const proSchema = z.object({
  id: z.number(),
  playerNumber: z.number(),
  playerFirstName: z.string(),
  playerLastName: z.string(),
  playerName: z.string(),
  team: z.string(),
  position: positions.array(),
  age: z.number(),
  height: z.string(),
  weight: z.number(),
  throws: z.enum(["R", "L", "B", "S"]),
  bats: z.enum(["R", "L", "B", "S"]),
  rank: z.number(),
});

const teamPlayersSchema = z.object({
    player: playersSchema,
    pros: proSchema,
});

const appErrorSchema = z.object({
  message: z.string(),
  status: z.enum(["error", "success"]),
});

export type Team = z.infer<typeof teamSchema>;
export type UnclaimedTeam = z.infer<typeof unclaimedTeamSchema>;
export type TeamSettings = z.infer<typeof teamSettingsSchema>;
export type TeamPlayers = z.infer<typeof teamPlayersSchema>;
export type AppError = z.infer<typeof appErrorSchema>;