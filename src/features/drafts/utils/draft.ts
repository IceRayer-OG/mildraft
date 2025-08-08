import z from "zod";

const queueDraftPickSchema = z.object({
    team: z.object({
        id: z.number(),
        name: z.string(),
        abbreviation: z.string(),
    }),
    draft_pick: z.object({
        id: z.number(),
        pickNumber: z.number(),
        leagueId: z.number(),
        draftId: z.number(),
    })
});

const compeltedDraftPickSchema = z.object({
    pickNumber: z.number(),
    playerName: z.string(),
    position: z.enum(["P", "C", "1B", "2B", "3B", "SS", "OF", "CI", "MI", "DH"]),
    teamName: z.string(),
});

const draftablePlayersSchema = z.object({
    id: z.number(),
    rank: z.number(),
    playerName: z.string(),
    position: z.enum(["P", "C", "1B", "2B", "3B", "SS", "OF", "CI", "MI", "DH"]),
    team: z.string(),
    age: z.number(),
    height: z.string(),
    weight: z.number(),
    throws: z.enum(["R", "L", "B"]),
    bats: z.enum(["R", "L", "B"]),
});

const queuePlayersSchema = z.object({
    id: z.number(),
    rank: z.number(),
    playerName: z.string(),
    position: z.enum(["P", "C", "1B", "2B", "3B", "SS", "OF", "CI", "MI", "DH"]),
    team: z.string(),
    age: z.number(),
    height: z.string(),
    weight: z.number(),
    throws: z.enum(["R", "L", "B"]),
    bats: z.enum(["R", "L", "B"]),
});

export type QueueDraftPick = z.infer<typeof queueDraftPickSchema>;
export type DraftablePlayers = z.infer<typeof draftablePlayersSchema>;
export type QueuePlayers = z.infer<typeof queuePlayersSchema>;
export type CompletedDraftPicks = z.infer<typeof compeltedDraftPickSchema>;