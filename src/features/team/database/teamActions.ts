"use server";

import { revalidatePath } from "next/cache";
import { getMyTeam, dropPlayer } from "~/server/queries";

export async function dbGetMyTeam() {
    // DB Call to get my team
    const myTeam = await getMyTeam();

    if(myTeam === null) throw new Error("Error getting your team");
    
    return myTeam;   
}

export async function dbDropPlayer(playerId: number) {
    // DB Call to drop player
    await dropPlayer(playerId);
    revalidatePath("league/team");
}
