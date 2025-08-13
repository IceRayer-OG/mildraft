import "server-only";

import { auth } from "@clerk/nextjs/server";
import { type CompletedDraftPicks, type DraftablePlayers, type QueueDraftPick } from "../utils/draft";
import { getDraftablePlayers, getDraftedPlayers, getDraftPicks, postDraftPick, postWriteInDraftPick, undoDraftPick, getCompletedDraftPicks, insertNewDraftPick } from "../database/queries";
// import { type TeamPlayers } from "~/features/team/utils/team";
import { getCurrentDraftPick } from "~/server/queries";

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
  const currentPick = await getCurrentDraftPick();
  if(!currentPick) {
    throw new Error("No pick set")
  }

  // Perform the draft operation
  await postDraftPick(currentPick.teamId, 2, currentPick.pickNumber, playerToDraft.id);

}

export async function draftWriteInPlayerUseCase(playerToDraft: string) {
  const user = await checkAuthorization();
  if (!user) {
    throw new Error("User is not authenticated");
  }

  // check it user is current pick team owner
  // Check if user is current pick team owner
  const currentPick = await getCurrentDraftPick();
  if(!currentPick) {
    throw new Error("No pick set")
  }

  // draft write in player
  await postWriteInDraftPick(currentPick.teamId, 2, currentPick.pickNumber, playerToDraft);

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

export async function getCompletedDraftPicksUseCase(): Promise<CompletedDraftPicks[]> {
  const user = await checkAuthorization();
  if (!user) {
    throw new Error("User is not authenticated");
  }

  const draftedPlayers = await getCompletedDraftPicks(2);

  if(!draftedPlayers) {
    throw new Error("No players drafted yet");
  }

  return draftedPlayers as CompletedDraftPicks[];
}

export async function undoDraftPickUseCase(draftPickToUndo: number) {
  await undoDraftPick(draftPickToUndo, 2);

}

export async function addNewDraftPickUseCase(teamName: string) {
  const user = await checkAuthorization();
  if (!user) {
    throw new Error("User is not authenticated");
  }

  await insertNewDraftPick(2, teamName);
}