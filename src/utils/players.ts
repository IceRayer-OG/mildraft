import z from "zod";

const PlayersSchema = z.object({
    id: z.number(),
    playerName: z.string(),
    position: z.enum(["P", "C", "1B", "2B", "3B", "SS", "OF", "CI", "MI", "DH"]),
    team: z.string(),
    age: z.number(),
    height: z.string(),
    weight: z.number(),
    throws: z.enum(["R", "L", "B"]),
    bats: z.enum(["R", "L", "B"]),
});

export type Players = z.infer<typeof PlayersSchema>;