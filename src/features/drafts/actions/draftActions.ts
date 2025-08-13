"use server";

import { draftPlayerUseCase, 
  draftWriteInPlayerUseCase , 
  getDraftablePlayersUseCase, 
  getCompletedDraftPicksUseCase, 
  getDraftPicksListUseCase,
  undoDraftPickUseCase,
  addNewDraftPickUseCase
} from "../use_cases/draftUseCases";
import { type DraftPlayers} from "~/features/players/utils/players";
import { type CompletedDraftPicks, type DraftablePlayers } from "../utils/draft";
import { revalidatePath } from "next/cache";

// Refactored functions
export async function getDraftablePlayersAction() {
  const draftablePlayers = await getDraftablePlayersUseCase();
  if (!draftablePlayers) {
    throw new Error("Error getting draft players");
  }
  return draftablePlayers;
}

export async function draftPlayerAction(playerToDraft: DraftablePlayers) {
  await draftPlayerUseCase(playerToDraft);
  revalidatePath("league/draft");
}

export async function draftWriteInPlayerAction(playerToDraft: string) {
  await draftWriteInPlayerUseCase(playerToDraft);
  revalidatePath("league/draft");
}

export async function getDraftPicksListAction() {
  // Fetch the current draft pick queue
  const draftPickQueue = await getDraftPicksListUseCase();
  if (!draftPickQueue) {
    throw new Error("Error getting draft pick queue");
  }
  return draftPickQueue;
}

export async function getCompleteDraftPicksAction(): Promise<CompletedDraftPicks[]> {
  const draftedPlayers = await getCompletedDraftPicksUseCase();
  return draftedPlayers;
}

export async function undoDraftPickAction(draftPickToUndo: number) {
  await undoDraftPickUseCase(draftPickToUndo);
  revalidatePath("/league/draft");
}

export async function addNewDraftPickAction(teamName: string) {
  await addNewDraftPickUseCase(teamName);
  revalidatePath("/league/Draft")
}