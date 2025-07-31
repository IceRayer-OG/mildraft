"use server";

import { revalidatePath } from "next/cache";
import { type DraftablePlayers } from "~/features/drafts/utils/draft";
import { getMyQueueUseCase, addPlayerToQueueUseCase, removePlayerFromQueueUseCase } from "../use_cases/queueUseCases";


export async function getMyQueueAction() {
    const myQueue = await getMyQueueUseCase();
    return myQueue;
}

export async function addPlayerToQueueAction(playerToDraft: DraftablePlayers) {
    await addPlayerToQueueUseCase(playerToDraft);
    revalidatePath("league/draft");
}

export async function removePlayerFromQueueAction(playerToRemove: DraftablePlayers) {
    await removePlayerFromQueueUseCase(playerToRemove);
    revalidatePath("league/draft");
}