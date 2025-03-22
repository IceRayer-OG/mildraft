import z from "zod";

const PostSchema = z.object ({
    id: z.number(),
    ownerId: z.string(),
    leagueId: z.number(),
    title: z.string(),
    body: z.string(),
})

const createPostSchema = z.object ({
    title: z.string(),
    body: z.string(),
    leagueId: z.number(),
})

export type Post = z.infer<typeof PostSchema>
export type CreatePost = z.infer<typeof createPostSchema>