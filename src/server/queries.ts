import "server-only";
import { db } from "./db";
import { draftPicks, pros } from "./db/schema";
import { sql } from "drizzle-orm";

export async function getAllPosts() {
  const myPlayers = await db.query.players.findMany();
  return myPlayers;
}

export async function getMyQueue() {
  const myQueue = await db.query.players.findMany();
  return myQueue;
}

export async function getDraftPlayers() {
  const draftPlayers = await db.select().from(pros);
  return draftPlayers;
}

export async function postDraftPick() {
  const playerDrafted = await db.insert(draftPicks).values({
    draftId: 728,
    playerId: 728,
    teamId: 728,
  });
  return playerDrafted;
}
