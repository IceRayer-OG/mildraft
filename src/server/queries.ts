import "server-only";

import { db } from "./db";
import { draftPicks, pros, teams, leagues, drafts, queues, posts } from "./db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, sql } from "drizzle-orm";
import { type Post } from "../utils/posts";

export async function getAllPosts() {
  const myPlayers = await db.query.players.findMany();
  return myPlayers;
}

export async function getLeaguePosts(league: number) {
  // Authorization
  const user = await auth();
  if (!user.userId) throw new Error("Not logged in");

  const leaguePosts = await db.query.posts.findMany({
    orderBy: (model, {desc}) => desc(posts.createdAt),
    limit: 3,
    // where: eq(posts.leagueId, league),
  });
  return leaguePosts;

}

export async function createAPost(postData: Post) {
  // Authorization
  const user = await auth();
  if (!user.userId) throw new Error("Not logged in" );

  const newPost = postData;

  const postNewPost = await db.insert(posts).values({
    title: newPost.title,
    body: newPost.body,
    leagueId: 1,
    ownerId: user.userId,
  });
  return postNewPost;
}

export async function getMyQueue(): Promise<unknown> {
  // Authorization later
  // const user = await auth();
  // if (!user.userId) throw new Error("Not logged in");
  
  const myQueue = await db.query.players.findMany();
  return myQueue;
}

export async function postToMyQueue(prosId: number) {
  // Authorization later
  // const user = await auth();
  // if (!user.userId) throw new Error("Not logged in");

  await db.insert(queues).values({
    playerId: prosId,
    // teamId: teams.id,
    // leagueId: leagues.id,
    // draftId: drafts.id, 
  });
  return { success: "Player added to queue" };

}

export async function deletePlayerFromQueue(queueId: number) {
  // Authorization later
  // const user = await auth();
  // if (!user.userId) throw new Error("Not logged in");

  await db.delete(queues).where(eq(queues.id, queueId));

}

export async function getDraftPlayers(): Promise<unknown> {
  // Build in auth for access to league
  // const user = await auth();
  // if (!user.userId) throw new Error("Not logged in");

  const draftPlayers = await db.query.pros.findMany();
  return draftPlayers;

}

export async function postDraftPick() {
  // Authorization later
  // const user = await auth();
  // if (!user.userId) throw new Error("Not logged in");

  const playerDrafted = await db.insert(draftPicks).values({
    draftId: 728,
    playerId: 728,
    teamId: 728,
  });
  return playerDrafted;
}
