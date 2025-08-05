"use server";

import { draftPlayerUseCase, draftWriteInPlayerUseCase , getDraftablePlayersUseCase, getDraftPicksListUseCase } from "../use_cases/draftUseCases";
import { type DraftPlayers} from "~/features/players/utils/players";
import { revalidatePath } from "next/cache";

// Refactored functions
export async function getDraftablePlayersAction() {
  const draftablePlayers = await getDraftablePlayersUseCase();
  if (!draftablePlayers) {
    throw new Error("Error getting draft players");
  }
  return draftablePlayers;
}

export async function draftPlayerAction(playerToDraft: DraftPlayers) {
  await draftPlayerUseCase(playerToDraft);
  revalidatePath("league/draft");
}

export async function draftWriteInPlayerAction(playerToDraft: string) {
  await draftWriteInPlayerUseCase();
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