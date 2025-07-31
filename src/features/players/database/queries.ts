import { db } from "~/server/db";
import { eq, notInArray, and, isNotNull, isNull, asc, inArray } from "drizzle-orm";
import { queues, draftPicks, pros, teams } from "~/server/db/schema";

export async function getFreeAgents() {
    const freeAgents = await db.select().from(pros)

    return freeAgents;
}