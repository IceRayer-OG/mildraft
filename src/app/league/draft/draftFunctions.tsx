"use server";

import { postToMyQueue, deletePlayerFromQueue } from "~/server/queries"
import { type DraftPlayers, type QueuePlayers } from "~/utils/players";
import { revalidatePath } from "next/cache";

export async function dbQueuePlayer(playerToQueue: DraftPlayers) {
  // DB Call to add player to queue
  try {
    await postToMyQueue(playerToQueue.id);
    revalidatePath("/league/draft");
  } catch (error) {
    console.log(error);
    throw new Error("Error adding player to queue");
  }
}

export async function dbRemovePlayerFromQueue(playerToRemove: QueuePlayers) {
  // DB Call to remove player from queue
  await deletePlayerFromQueue(playerToRemove.queue.id);
}

export async function dbDraftPlayer(playerToDraft: DraftPlayers) {
  // DB Call to draft player
  // await postPlayerDrafted(playerToDraft.id);
  // toast.success(`${playerToDraft.playerName} has been drafted`);

}