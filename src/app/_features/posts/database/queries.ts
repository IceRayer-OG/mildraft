import "server-only";
import { db } from "~/server/db";
import { eq, desc } from "drizzle-orm";
import { posts } from "~/server/db/schema";
import { type CreatePost, type Post } from "../utils/posts";


export async function getAllPosts() {
  const allPosts = await db.select().from(posts);
  return allPosts;
}

export async function createAPost(postData: CreatePost, userId: string) {

  const newPost = postData;

  const postNewPost = await db.insert(posts).values({
    title: newPost.title,
    body: newPost.body,
    leagueId: newPost.leagueId,
    ownerId: userId,
  });
  return postNewPost;
}

export async function getLeaguePosts() {  // add league: number

  const leaguePosts = await db.select().from(posts)
    .orderBy(desc(posts.createdAt))
    .limit(4);
    // .where(eq(posts.leagueId, league)); add this back in when league is added to params

  return leaguePosts;

}