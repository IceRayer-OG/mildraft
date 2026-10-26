"use server";

import { revalidatePath } from "next/cache";
import { type DraftablePlayers } from "~/app/_features/drafts/utils/draft";
import {
  getMyQueueUseCase,
  addPlayerToQueueUseCase,
  removePlayerFromQueueUseCase,
  updateMyQueueOrderUseCase,
  getMyAutoDraftSettingsUseCase,
  updateMyAutoDraftSettingsUseCase,
} from "../use_cases/queueUseCases";


export async function getMyQueueAction() {
    const myQueue = await getMyQueueUseCase();
    return myQueue;
}

export async function updateMyQueueOrderAction(queueOrder: {playerId: number, rank: number}[]) {
    if(!queueOrder) {
        throw new Error("No order provided")
    }

    updateMyQueueOrderUseCase(queueOrder);
    return;
};

export async function addPlayerToQueueAction(playerToDraft: DraftablePlayers) {
    await addPlayerToQueueUseCase(playerToDraft);
    revalidatePath("/league/draft");
}

export async function removePlayerFromQueueAction(playerToRemove: DraftablePlayers) {
    await removePlayerFromQueueUseCase(playerToRemove);
    revalidatePath("/league/draft");
}

export async function getMyAutoDraftSettingsAction() {
    const settings = await getMyAutoDraftSettingsUseCase();
    return settings;
}

export async function updateMyAutoDraftSettingsAction(options: {
    enabled: boolean;
    mode?: "instant" | "safety_net";
}) {
    const result = await updateMyAutoDraftSettingsUseCase(options);
    revalidatePath("/league/draft");
    revalidatePath("/league/team");
    return result;
}