"use server";

// Import Next.js
import { revalidatePath } from "next/cache";

// Import Use Cases
import { getFreeAgentsUseCase, loadProspectPlayersUseCase } from "../use_cases/playerUseCases";

export async function getFreeAgentsAction() {
    const freeAgents = await getFreeAgentsUseCase();

    return freeAgents;
}

export async function loadProspectPlayersAction(
  previousState: { status: string; message: string },
  formData: FormData,
) {
  const loadFile = formData.get("excelFile") as File;
  const response = await loadProspectPlayersUseCase(loadFile);
  console.log("loadProspectPlayersAction response:", response);
  
  revalidatePath("/league/draft");
  return response;
}
