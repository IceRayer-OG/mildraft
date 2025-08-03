"use server";

import { auth } from "@clerk/nextjs/server";
import { type Players } from "../utils/players";
import { getFreeAgents } from "../database/queries";

export async function getFreeAgentsUseCase(): Promise<Players[]> {
    const freeAgents = await getFreeAgents();
    
    return freeAgents as Players[];
}