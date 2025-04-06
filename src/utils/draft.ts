import z from "zod";

const queueDraftPickSchema = z.object({
    team: z.object({
        id: z.number(),
        name: z.string(),
    }),
    draft_pick: z.object({
        id: z.number(),
        pickNumber: z.number(),
        leagueId: z.number(),
        draftId: z.number(),
    })
});

export type QueueDraftPick = z.infer<typeof queueDraftPickSchema>;