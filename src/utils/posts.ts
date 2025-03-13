import z from "zod";

const PostSchema = z.object ({
    id: z.number(),
    ownerId: z.string(),
    leagueId: z.number(),
    title: z.string(),
    body: z.string(),
})

export type Post = z.infer<typeof PostSchema>