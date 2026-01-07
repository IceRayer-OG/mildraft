"use server";

// Import Next.js
import { revalidatePath } from "next/cache";

// Import Use Cases
import { getFreeAgentsUseCase, loadDraftablePlayersUseCase } from "../use_cases/playerUseCases";

export async function getFreeAgentsAction() {
    const freeAgents = await getFreeAgentsUseCase();

    return freeAgents;
}

export async function loadDraftablePlayersAction(
  previousState: { status: string; message: string },
  formData: FormData,
) {
  const loadFile = formData.get("draftablePlayersFile") as File;
  const draftablePlayers = await loadDraftablePlayersUseCase(loadFile);
  revalidatePath("/league/draft");
  return true;
}
