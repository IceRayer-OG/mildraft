import "server-only";
import { db } from "~/server/db";
import { eq, desc, and, or, isNull } from "drizzle-orm";
import { posts, teams } from "~/server/db/schema";
import { type CreatePost } from "../utils/posts";

export async function getAllPosts() {
  const allPosts = await db.select().from(posts);
  return allPosts;
}

export async function createAPost(postData: CreatePost, userId: string) {
  const postNewPost = await db.insert(posts).values({
    title: postData.title,
    body: postData.body,
    leagueId: postData.leagueId ?? 1,
    ownerId: userId,
  });
  return postNewPost;
}

export async function getLeaguePosts(leagueId = 1) {
  const leaguePosts = await db
    .select({
      id: posts.id,
      title: posts.title,
      body: posts.body,
      createdAt: posts.createdAt,
      ownerId: posts.ownerId,
      leagueId: posts.leagueId,
      teamName: teams.name,
    })
    .from(posts)
    .leftJoin(
      teams,
      and(eq(posts.ownerId, teams.ownerId), eq(teams.leagueId, leagueId)),
    )
    .where(or(eq(posts.leagueId, leagueId), isNull(posts.leagueId)))
    .orderBy(desc(posts.createdAt))
    .limit(10);

  return leaguePosts;
}
