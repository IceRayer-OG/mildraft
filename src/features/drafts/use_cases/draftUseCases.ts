import "server-only";

import { auth } from "@clerk/nextjs/server";
import { type DraftablePlayers, type QueueDraftPick } from "../utils/draft";
import { getDraftablePlayers, getDraftedPlayers, getDraftPicks, postDraftPick } from "../database/queries";
import { TeamPlayers } from "~/features/team/utils/team";

async function checkAuthorization() {
  // Authorization
  const user = await auth();
  if (!user.userId) throw new Error("Not logged in");
  return user;
}

async function getTeamIdData(userId: string) {

  // const team = await getTeamIdByUserId(userId);
  // return team;

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
  

}

export async function draftWriteInPlayerUseCase() {
  const user = await checkAuthorization();
  if (!user) {
    throw new Error("User is not authenticated");
  }

  // check it user is current pick team owner

  // draft write in player
  // await postDraftPickraft();

  return true;

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

export async function getDraftedPlayersUseCase(): Promise<DraftablePlayers[]> {
  const user = await checkAuthorization();
  if (!user) {
    throw new Error("User is not authenticated");
  }

  const draftedPlayers = await getDraftedPlayers();

  if(!draftedPlayers) {
    throw new Error("No players drafted yet");
  }

  return draftedPlayers as DraftablePlayers[];
}