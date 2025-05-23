// Persistance layer for queries to the database
import "server-only";

import { db } from "./db";
import { draftPicks, pros, teams, leagues, drafts, queues, posts, players } from "./db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, asc, eq, ne, isNull, sql } from "drizzle-orm";
import { type Post, type CreatePost } from "../utils/posts";

async function checkAuthorization() {
  // Authorization
  const user = await auth();
  if (!user.userId) throw new Error("Not logged in");
  return user;
}

export async function getAllPosts() {
  const myPlayers = await db.query.players.findMany();
  return myPlayers;
}

export async function getLeaguePosts(): Promise<Post[]> {  // add league: number
  // Authorization
  const user = await auth();
  if (!user.userId) throw new Error("Not logged in");

  const leaguePosts = await db.query.posts.findMany({
    orderBy: (model, {desc}) => desc(posts.createdAt),
    limit: 4,
    // where: eq(posts.leagueId, league),
  });

  return leaguePosts as Post[];

}

export async function createAPost(postData: CreatePost) {
  // Authorization
  const user = await auth();
  if (!user.userId) throw new Error("Not logged in" );

  const newPost = postData;

  const postNewPost = await db.insert(posts).values({
    title: newPost.title,
    body: newPost.body,
    leagueId: newPost.leagueId,
    ownerId: user.userId,
  });
  return postNewPost;
}

export async function getMyQueue(): Promise<unknown> {
  // Authorization later
  const user = await auth();
  if (!user.userId) throw new Error("Not logged in");
  
  const myQueue = await db.select().from(queues)
    .leftJoin(pros, eq(queues.playerId, pros.id))
    .where(eq(queues.userId, user.userId)
  );
  return myQueue;
}

export async function postToMyQueue(prosId: number) {
  // Authorization later
  const user = await auth();
  if (!user.userId) throw new Error("Not logged in");

  await db.insert(queues).values({
    playerId: prosId,
    userId: user.userId,
    // teamId: teams.id,
    // leagueId: leagues.id,
    // draftId: drafts.id, 
  });
}

export async function deletePlayerFromQueue(queueId: number) {
  // Authorization 
  const user = await auth();
  if (!user.userId) throw new Error("Not logged in");

  await db.delete(queues).where(eq(queues.id, queueId));

}

export async function getDraftPlayers(): Promise<unknown> {
  // Authorization
  const user = await auth();
  if (!user.userId) throw new Error("Not logged in");

  // remove players on teams and not eligible for draft

  const draftPlayers = await db.query.pros.findMany({
    orderBy: (model, {asc}) => asc(pros.rank),
  });

  return draftPlayers;

}

export async function postDraftWriteIn() {
  // Authorization
  const user = await auth();
  if (!user.userId) throw new Error("Not logged in");
  
  await db.insert(draftPicks).values({
    playerId: 728,
    teamId: 728,
  });

}

export async function getDraftPicks() {
  // Authorization
  const user = await auth();
  if (!user.userId) throw new Error("Not logged in");

  const draftPicksData = await db.select().from(draftPicks)
    .where(and(isNull(draftPicks.playerId), eq(draftPicks.draftId, 2)))
    .orderBy(asc(draftPicks.pickNumber))
    .leftJoin(teams, eq(draftPicks.teamId, teams.id));

  return draftPicksData;
}

export async function postDraftPick() {
  // Authorization
  const user = await auth();
  if (!user.userId) throw new Error("Not logged in");

  const playerDrafted = await db.insert(draftPicks).values({
    playerId: 728,
    teamId: 728,
  });

  return playerDrafted;
}

export async function getLeagueTeams() {
  // Authorization later
  const user = await auth();
  if (!user.userId) throw new Error("Not logged in");

  const leagueTeams = await db.query.teams.findMany({
    where: eq(teams.leagueId, 1),
  });

  return leagueTeams;
}

export async function getMyTeam(): Promise<unknown> {
  // Authorization later
  const user = await auth();
  if (!user.userId) throw new Error("Not logged in");

  const myTeamId = await db.query.teams.findFirst({
    where: eq(teams.ownerId, user.userId),
  });

  if(myTeamId === undefined) throw new Error("No team found");

  const myTeam = await db.select().from(players)
    .leftJoin(pros, eq(players.id, pros.id))
    .where(eq(players.teamId, myTeamId.id)
  );

  return myTeam;
}

export async function getFreeAgents() {
  // Authorization later
  const user = await auth();
  if (!user.userId) throw new Error("Not logged in");

  const freeAgents = await db.query.pros.findMany();
  
  return freeAgents;

}

export async function addFreeAgentToTeam(pro: number) {
  // Authorization later
  const user = await auth();
  if (!user.userId) throw new Error("Not logged in");

  // Check user is team owner
  const myTeamId = await db.query.teams.findFirst({
    where: eq(teams.ownerId, user.userId),
  });

  if(myTeamId === undefined) throw new Error("No team found");

  // Check Free Agent pick up is allowed

  // Add free Agent Player to team
  await db.insert(players).values({
    leagueId: myTeamId.leagueId,
    teamId: myTeamId.id,
    proId: pro,
  }).onConflictDoNothing();

}

export async function dropPlayer(playerId: number) {
  // Authorization later
  const user = await auth();
  if (!user.userId) throw new Error("Not logged in");

  // Check user is team owner
  const myTeamId = await db.query.teams.findFirst({
    where: eq(teams.ownerId, user.userId),
  });
  
  if(myTeamId === undefined) throw new Error("No team found");

  // Delete player from team
  await db.delete(players).where(
    and(
      eq(players.id, playerId),
      eq(players.teamId, myTeamId.id)
    )
  );
  
}