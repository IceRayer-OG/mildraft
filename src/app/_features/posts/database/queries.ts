import "server-only";
import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { posts } from "~/server/db/schema";
import { type CreatePost, type Post } from "../utils/posts";


export async function getAllPosts() {
  const allPosts = await db.query.posts.findMany();
  return allPosts;
}

export async function createAPost(postData: CreatePost) {

  const newPost = postData;

  const postNewPost = await db.insert(posts).values({
    title: newPost.title,
    textBody: newPost.body,
    leagueId: newPost.leagueId,
  });
  return postNewPost;
}

export async function getLeaguePosts(): Promise<Post[]> {  // add league: number

  const leaguePosts = await db.query.posts.findMany({
    orderBy: (model, {desc}) => desc(posts.createdAt),
    limit: 4,
    // where: eq(posts.leagueId, league),
  });

  return leaguePosts as Post[];

}