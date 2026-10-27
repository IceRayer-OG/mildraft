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
  getDraftResultsUseCase,
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

export async function draftPlayerAction(
  previousState: { status: string; message: string },
  playerToDraft: DraftablePlayers
) {
  const response = await draftPlayerUseCase(playerToDraft);
  
  revalidatePath("league/draft");
  return response;
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

export async function getDraftPicksListAction(draftId?: number) {
  const draftPickQueue = await getDraftPicksListUseCase(draftId);
  if (!draftPickQueue) {
    throw new Error("Error getting draft pick queue");
  }

  return draftPickQueue;
}

export async function getCompleteDraftPicksAction(
  draftId?: number,
): Promise<CompletedDraftPicks[]> {
  const draftedPlayers = await getCompletedDraftPicksUseCase(draftId);
  return draftedPlayers;
}

export async function undoDraftPickAction(
  draftPickToUndo: number,
  draftId?: number,
) {
  await undoDraftPickUseCase(draftPickToUndo, draftId);
  revalidatePath("/league/draft");
}

export async function addNewDraftPickAction(teamName: string, draftId?: number) {
  const teamSelected = await addNewDraftPickUseCase(teamName, draftId);
  revalidatePath("/league/draft");
  return teamSelected;
}

export async function getDraftResultsAction(draftId: number) {
  const draftResults = await getDraftResultsUseCase(draftId);
  return draftResults;
}

export async function getActiveDraftAction(leagueId = 1) {
  const { getActiveDraft } = await import("../database/queries");
  const activeDraft = await getActiveDraft(leagueId);
  return activeDraft;
}

export async function getAllDraftsAction(leagueId = 1) {
  const { getAllDrafts } = await import("../database/queries");
  const allDrafts = await getAllDrafts(leagueId);
  return allDrafts;
}

export async function rolloverSeasonAction(leagueId = 1) {
  const { rolloverSeasonUseCase } = await import("../use_cases/seasonRolloverUseCase");
  const result = await rolloverSeasonUseCase(leagueId);
  revalidatePath("/league");
  revalidatePath("/league/draft");
  return result;
}