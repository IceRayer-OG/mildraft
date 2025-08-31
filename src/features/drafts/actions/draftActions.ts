"use server";

// React & Next
import { revalidatePath } from "next/cache";

// UI Components
import {
  draftPlayerUseCase,
  draftWriteInPlayerUseCase,
  getDraftablePlayersUseCase,
  getCompletedDraftPicksUseCase,
  getDraftPicksListUseCase,
  undoDraftPickUseCase,
  addNewDraftPickUseCase,
} from "../use_cases/draftUseCases";

// Types
import {
  type CompletedDraftPicks,
  type DraftablePlayers,
} from "../utils/draft";

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

export async function draftWriteInPlayerAction(
  previousState: { status: string; message: string },
  formData: FormData,
) {
  const playerToDraft = formData.get("writeInPlayerName") as string;
  const response = await draftWriteInPlayerUseCase(playerToDraft);
  revalidatePath("league/draft");
  return response;
}

export async function getDraftPicksListAction() {
  const draftPickQueue = await getDraftPicksListUseCase();
  if (!draftPickQueue) {
    throw new Error("Error getting draft pick queue");
  }

  return draftPickQueue;
}

export async function getCompleteDraftPicksAction(): Promise<
  CompletedDraftPicks[]
> {
  const draftedPlayers = await getCompletedDraftPicksUseCase();
  return draftedPlayers;
}

export async function undoDraftPickAction(draftPickToUndo: number) {
  await undoDraftPickUseCase(draftPickToUndo);
  revalidatePath("/league/draft");
}

export async function addNewDraftPickAction(teamName: string) {
  const teamSelected = await addNewDraftPickUseCase(teamName);
  revalidatePath("/league/Draft");
  return teamSelected;
}
