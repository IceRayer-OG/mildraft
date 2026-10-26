import z from "zod";

export const PostSchema = z.object({
  id: z.number(),
  ownerId: z.string().nullable().optional(),
  leagueId: z.number().nullable().optional(),
  title: z.string(),
  body: z.string(),
  createdAt: z.date().nullable().optional(),
  teamName: z.string().nullable().optional(),
});

export const createPostSchema = z.object({
  title: z.string(),
  body: z.string(),
  leagueId: z.number().optional(),
});

export type Post = z.infer<typeof PostSchema>;
export type CreatePost = z.infer<typeof createPostSchema>;
