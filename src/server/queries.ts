import "server-only";

import { db } from "./db";
import { draftPicks, pros, teams, leagues, drafts, queues } from "./db/schema";
import { auth } from "@clerk/nextjs/server";
import { sql } from "drizzle-orm";

export async function getAllPosts() {
  const myPlayers = await db.query.players.findMany();
  return myPlayers;
}

export async function getMyQueue() {
  // Setup auth to see access to your queue

  
  const myQueue = await db.query.players.findMany();
  return myQueue;
}

export async function postToMyQueue(prosId: number) {
  // Authorization later
  // const user = await auth();
  // if (!user.userId) {
  //   return { error: "Not logged in" };
  // }

  try {
    await db.insert(queues).values({
      playerId: prosId,
      // teamId: teams.id,
      // leagueId: leagues.id,
      // draftId: drafts.id, 
    });
    return;
  } catch (error) {
    return error;
  }
}

export async function getDraftPlayers() {
  // Build in auth for access to league

  try {
    const draftPlayers = await db.query.pros.findMany();
    return draftPlayers;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function postDraftPick() {
  const playerDrafted = await db.insert(draftPicks).values({
    draftId: 728,
    playerId: 728,
    teamId: 728,
  });
  return playerDrafted;
}
