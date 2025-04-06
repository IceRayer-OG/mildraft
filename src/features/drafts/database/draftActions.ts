"use server";

import { postToMyQueue, deletePlayerFromQueue, getDraftPicks, getDraftPlayers } from "~/server/queries"
import { type DraftPlayers, type QueuePlayers } from "~/utils/players";
import { type QueueDraftPick } from "~/utils/draft";
import { revalidatePath } from "next/cache";

export async function dbQueuePlayer(playerToQueue: DraftPlayers) {
  // DB Call to add player to queue
  try {
    await postToMyQueue(playerToQueue.id);
    revalidatePath("league/queue");
  } catch (error) {
    console.log(error);
    throw new Error("Error adding player to queue");
  }
}

export async function dbRemovePlayerFromQueue(playerToRemove: QueuePlayers) {
  // DB Call to remove player from queue
  await deletePlayerFromQueue(playerToRemove.queue.id);
  revalidatePath("league/queue");
}

export async function dbDraftPlayer(playerToDraft: DraftPlayers) {
  // DB Call to draft player
  // await postPlayerDrafted(playerToDraft.id);
  // revalidatePath("league/queue");
  // toast.success(`${playerToDraft.playerName} has been drafted`);

}

export async function dbGetDraftPlayers() {
  // Data fetch draft players
  const draftablePlayers = await getDraftPlayers() as DraftPlayers[];
  return draftablePlayers;
}

export async function dbGetDraftQueue() {
  // Data fetch draft queue
  const draftQueue = await getDraftPicks() as QueueDraftPick[];
  return draftQueue;
}