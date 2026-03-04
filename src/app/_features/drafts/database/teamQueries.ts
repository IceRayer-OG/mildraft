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
    .where(eq(teams.leagueId, 1));

  return draftPickEmails;
}