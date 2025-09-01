
import { getFreeAgentsUseCase } from "../use_cases/playerUseCases";

export async function getFreeAgentsAction() {
    const freeAgents = await getFreeAgentsUseCase();

    return freeAgents;
}
