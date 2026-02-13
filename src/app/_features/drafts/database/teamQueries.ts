import { db } from "~/server/db"
import {
    and,
    eq,
    or
} from "drizzle-orm"
import { teams } from "~/server/db/schema"

export async function getDraftPickEmails() {
  const draftPickEmails = await db
    .select({ teamEmail: teams.email, teamName: teams.name })
    .from(teams)
    .where(and(eq(teams.leagueId, 1),or(eq(teams.id,2),eq(teams.id,5),eq(teams.id,8),eq(teams.id,14))));

  return draftPickEmails;
}