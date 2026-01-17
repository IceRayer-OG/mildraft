import z from "zod";

const positions = z.enum(["RHP", "LHP", "C", "1B", "2B", "3B", "SS", "OF", "CI", "MI", "INF", "DH"]);

const draftPlayersSchema = z.object({
    id: z.number(),
    rank: z.number(),
    playerName: z.string(),
    userId: z.string(),
    position: positions.array(),
    team: z.string(),
    age: z.number(),
    height: z.string(),
    weight: z.number(),
    throws: z.enum(["R", "L", "B"]),
    bats: z.enum(["R", "L", "B"]),
});

const proPlayersSchema = z.object({
    rank: z.number().nullable(),
    teamRank: z.number().nullable(),
    draftRank: z.number().nullable(),
    playerName: z.string(),
    position: positions.array(),
    team: z.string(),
    level: z.string(),
    age: z.number().nullable(),
    eta: z.number().nullable(),
    height: z.string(),
    weight: z.number().nullable(),
    throws: z.enum(["R", "L", "B", "S"]),
    bats: z.enum(["R", "L", "B", "S"])
});

const queuePlayersSchema = z.object({
    pros: z.object({
        id: z.number(),
        rank: z.number(),
        playerName: z.string(),
        userId: z.string(),
        position: positions.array(),
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
        position: positions.array(),
    }),
    pros: z.object({
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
        throws: z.enum(["R", "L", "B"]),
        bats: z.enum(["R", "L", "B"]),
        rank: z.number(),
    }),
});

const PlayersSchema = z.object({
    id: z.number(),
    playerName: z.string(),
    position: positions.array(),
    team: z.string(),
    throws: z.enum(["R", "L", "B"]),
    bats: z.enum(["R", "L", "B"]),
});

export type DraftPlayers = z.infer<typeof draftPlayersSchema>;
export type QueuePlayers = z.infer<typeof queuePlayersSchema>;
export type teamPlayers = z.infer<typeof teamPlayersSchema>;
export type Players = z.infer<typeof PlayersSchema>;
export type ProPlayers = z.infer<typeof proPlayersSchema>;