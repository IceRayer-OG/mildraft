"use server";

import { auth } from "@clerk/nextjs/server";
import { type Players } from "../utils/players";
import { getFreeAgents } from "../database/queries";

async function checkAuthorization() {
    const user = await auth();
    if (!user.userId) {
        throw new Error("Not logged in");
    }
    return user;
}

export async function getFreeAgentsUseCase(): Promise<Players[]> {
    const user = await checkAuthorization();
    if (!user) {
        throw new Error("User is not authenticated");
    }
    
    const freeAgents = await getFreeAgents();
    
    return freeAgents as Players[];
}