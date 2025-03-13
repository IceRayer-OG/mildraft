"use server";

import { toast } from "sonner"
import { postToMyQueue, deletePlayerFromQueue } from "~/server/queries"
import { type Players } from "./columns";

export async function dbQueuePlayer(playerToQueue: Players) {
  // DB Call to add player to queue
  await postToMyQueue(playerToQueue.id);
}

export async function dbRemovePlayerFromQueue(playerToRemove: Players) {
  // DB Call to remove player from queue
  await deletePlayerFromQueue(playerToRemove.id);
}

export async function dbDraftPlayer(playerToDraft: Players) {
  // DB Call to draft player

  toast.success(`${playerToDraft.playerName} has been drafted`);

}