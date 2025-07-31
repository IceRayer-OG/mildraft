"use server";

// Auth
import { auth } from "@clerk/nextjs/server";

// Types
import { type QueuePlayers, type DraftablePlayers } from "../utils/draft";

// Queries
import { postPlayerToQueue, deletePlayerFromQueue, getMyQueuePlayers } from "../database/queries";



async function checkAuthorization() {
  // Authorization
  const user = await auth();
  if (!user.userId) throw new Error("Not logged in");
  return user;
}

export async function getMyQueueUseCase(): Promise<QueuePlayers[]> {
    // Check if user is authenticated
    const user = await checkAuthorization();
    if (!user) {
        throw new Error("User is not authenticated");
    }
    // This function should fetch the draft queue from the database
    const myQueue = await getMyQueuePlayers(user.userId);
    if (!myQueue) {
        throw new Error("Error getting draft queue");
    }

    return myQueue as QueuePlayers[];
}

export async function addPlayerToQueueUseCase(playerToQueue: DraftablePlayers) {
    // Use case to add player to queue
    // Check if user is authenticated
    const user = await checkAuthorization();
    if (!user) {
        throw new Error("User is not authenticated");
    }

    // Check if user is a team owner

    // Add player to queue and revalidate the draft path
    postPlayerToQueue(playerToQueue.id, user.userId)
    return true;
}

export async function removePlayerFromQueueUseCase(playerToRemove: DraftablePlayers) {
    // Use case to remove player from queue
    // Check if user is authenticated
    const user = await checkAuthorization();
    if (!user) {
        throw new Error("User is not authenticated");
    }
    // Check if user is a team owner

    // Remove player from queue and revalidate the draft path
    deletePlayerFromQueue(playerToRemove.id, user.userId)
    
}