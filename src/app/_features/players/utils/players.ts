import z from "zod";

const draftPlayersSchema = z.object({
    id: z.number(),
    rank: z.number(),
    playerName: z.string(),
    userId: z.string(),
    position: z.enum(["P", "C", "1B", "2B", "3B", "SS", "OF", "CI", "MI", "DH"]),
    team: z.string(),
    age: z.number(),
    height: z.string(),
    weight: z.number(),
    throws: z.enum(["R", "L", "B"]),
    bats: z.enum(["R", "L", "B"]),
});

const queuePlayersSchema = z.object({
    pros: z.object({
        id: z.number(),
        rank: z.number(),
        playerName: z.string(),
        userId: z.string(),
        position: z.enum(["P", "C", "1B", "2B", "3B", "SS", "OF", "CI", "MI", "DH"]),
        team: z.string(),
        age: z.number(),
        height: z.string(),
        weight: z.number(),
        throws: z.enum(["R", "L", "B"]),
        bats: z.enum(["R", "L", "B"]),
    }),
    queue: z.object({
        id: z.number(),
        playerId: z.number(),
        userId: z.string(),
        teamId: z.number(),
        leagueId: z.number(),
        draftId: z.number(),
    }),
});

const teamPlayersSchema = z.object({
    player: z.object({
        id: z.number(),
        proId: z.number(),
        teamId: z.number(),
        position: z.enum(["P", "C", "1B", "2B", "3B", "SS", "OF", "CI", "MI", "DH"]),
    }),
    pros: z.object({
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
    }),
});

const PlayersSchema = z.object({
    id: z.number(),
    playerName: z.string(),
    position: z.enum(["P", "C", "1B", "2B", "3B", "SS", "OF", "CI", "MI", "DH"]),
    team: z.string(),
    throws: z.enum(["R", "L", "B"]),
    bats: z.enum(["R", "L", "B"]),
});

export type DraftPlayers = z.infer<typeof draftPlayersSchema>;
export type QueuePlayers = z.infer<typeof queuePlayersSchema>;
export type teamPlayers = z.infer<typeof teamPlayersSchema>;
export type Players = z.infer<typeof PlayersSchema>;