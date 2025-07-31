import "server-only";

import { auth } from "@clerk/nextjs/server";
import { type DraftablePlayers, type QueueDraftPick } from "../utils/draft";
import { getDraftablePlayers, getDraftPicks } from "../database/queries";

async function checkAuthorization() {
  // Authorization
  const user = await auth();
  if (!user.userId) throw new Error("Not logged in");
  return user;
}

export async function draftPlayerUseCase(playerToDraft: DraftablePlayers) {
  // Use case to draft player
  // Check if user is authenticated
  const user = await checkAuthorization();
  if (!user) {
    throw new Error("User is not authenticated");
  }
  // Check if user is current pick team owner

  // Perform the draft operation
  

  // Revalidate the draft path
}

export async function getDraftablePlayersUseCase(): Promise<DraftablePlayers[]> {
  // Use case to get draft players
  const draftablePlayers = await getDraftablePlayers();
  if (!draftablePlayers) {
    throw new Error("Error getting draft players");
  }
  return draftablePlayers as DraftablePlayers[];
}

export async function getDraftPicksListUseCase(): Promise<QueueDraftPick[]> {
  const draftPickQueueData = await getDraftPicks();
  if (!draftPickQueueData) {
    throw new Error("Error getting draft pick queue");
  }

  return draftPickQueueData as QueueDraftPick[];
}