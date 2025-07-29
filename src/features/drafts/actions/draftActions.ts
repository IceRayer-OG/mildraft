"use server";

import { 
  postToMyQueue, 
  deletePlayerFromQueue, 
  getDraftPicks, 
  getDraftPlayers, 
  postDraftPick ,
  getCurrentDraftPick,
  getTeamOwner,
  getLimitedDraftPlayers,
} from "~/server/queries"
import { type DraftPlayers, type QueuePlayers } from "~/utils/players";
import { type QueueDraftPick } from "~/utils/draft";
import { revalidatePath } from "next/cache";
// import { auth } from "@clerk/nextjs/server";

export async function dbQueuePlayer(playerToQueue: DraftPlayers) {
  // DB Call to add player to queue
  try {
    await postToMyQueue(playerToQueue.id);
    revalidatePath("league/draft");
  } catch (error) {
    console.log(error);
    throw new Error("Error adding player to queue");
  }
}

export async function dbRemovePlayerFromQueue(playerToRemove: QueuePlayers) {
  // DB Call to remove player from queue
  await deletePlayerFromQueue(playerToRemove.queue.id);
  revalidatePath("league/draft");
}

 export async function dbDraftPlayer(playerToDraft: DraftPlayers) {
   // Get Current Pick
//   const currentPick = await getCurrentDraftPick();
//   if(currentPick?.teamId === null || currentPick?.teamId === undefined) throw new Error("No current pick found");
//   if(currentPick?.pickNumber === null || currentPick?.pickNumber === undefined) throw new Error("No current pick found");
//   // Check if the user is the team owner
//   const teamOwner = getTeamOwner(currentPick.teamId);
//   if(teamOwner === null) throw new Error("No team owner found");
//   if(!teamOwner) throw new Error("You are not the team owner");

//   // DB Call to draft player
//   await postDraftPick(playerToDraft.id, currentPick.pickNumber);
//   revalidatePath("league/draft");
 }

export async function dbGetDraftPlayers() {
  // Data fetch draft players
  const draftablePlayers = await getDraftPlayers() as DraftPlayers[];

  if(draftablePlayers === null) throw new Error("Error getting draft players");

  return draftablePlayers;
}

export async function dbGetDraftQueue() {
  // Data fetch draft queue
  const draftQueue = await getDraftPicks() as QueueDraftPick[];
  return draftQueue;
}