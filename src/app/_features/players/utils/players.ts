import z from "zod";

const positions = z.enum(["RHP", "LHP", "C", "1B", "2B", "3B", "SS", "OF", "CI", "MI", "INF", "DH", "UTIL"]);

const draftPlayersSchema = z.object({
    id: z.number(),
    rank: z.number(),
    teamRank: z.number(),
    draftRank: z.number(),
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
    id: z.number().optional(),
    mlbamId: z.number().nullable().optional(),
    rank: z.number().nullable().optional(),
    teamRank: z.number().nullable().optional(),
    draftRank: z.number().nullable().optional(),
    intlRank: z.number().nullable().optional(),
    playerName: z.string(),
    playerFirstName: z.string().nullable().optional(),
    playerLastName: z.string().nullable().optional(),
    position: positions.array(),
    team: z.string().nullable().optional(),
    org: z.string().nullable().optional(),
    orgId: z.number().nullable().optional(),
    affiliateTeam: z.string().nullable().optional(),
    level: z.string().nullable().optional(),
    age: z.number().nullable().optional(),
    eta: z.number().nullable().optional(),
    height: z.string().nullable().optional(),
    weight: z.number().nullable().optional(),
    throws: z.enum(["R", "L", "B", "S"]).nullable().optional(),
    bats: z.enum(["R", "L", "B", "S"]).nullable().optional(),
    headshotUrl: z.string().nullable().optional(),
    lists: z.array(z.string()).nullable().optional(),
    careerMlbAtBats: z.number().optional(),
    careerMlbInningsPitched: z.string().optional(),
    mlbDebutDate: z.string().nullable().optional(),
    isMilEligible: z.boolean().optional(),
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
    teamRank: z.number(),
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