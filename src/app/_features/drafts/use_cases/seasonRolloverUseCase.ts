import "server-only";

import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { eq, and, isNotNull } from "drizzle-orm";
import { drafts, draftPicks, draftSettings, players, pros } from "~/server/db/schema";
import { getActiveDraft } from "../database/queries";

async function checkAuthorization() {
  const user = await auth();
  if (!user.userId) {
    throw new Error("Not logged in");
  }
  return user;
}

export async function rolloverSeasonUseCase(leagueId = 1) {
  await checkAuthorization();

  const activeDraft = await getActiveDraft(leagueId);
  if (!activeDraft) {
    throw new Error("No draft found to roll over");
  }

  const currentYear = activeDraft.draftYear ?? 2026;
  const nextDraftYear = currentYear + 1;

  // 1. Sync 2026 Drafted Players to Team Rosters (players table)
  const completedPicks = await db
    .select({
      pickId: draftPicks.id,
      playerId: draftPicks.playerId,
      teamId: draftPicks.teamId,
      leagueId: draftPicks.leagueId,
      playerName: pros.playerName,
      positions: pros.position,
    })
    .from(draftPicks)
    .where(
      and(
        eq(draftPicks.draftId, activeDraft.id),
        eq(draftPicks.pickMade, true),
        isNotNull(draftPicks.playerId)
      )
    )
    .leftJoin(pros, eq(draftPicks.playerId, pros.id));

  let syncedCount = 0;
  for (const pick of completedPicks) {
    if (!pick.playerId) continue;

    // Check if player is already assigned to a team in this league
    const existing = await db
      .select({ id: players.id })
      .from(players)
      .where(
        and(
          eq(players.leagueId, pick.leagueId),
          eq(players.proId, pick.playerId)
        )
      )
      .limit(1);

    if (existing.length === 0) {
      await db.insert(players).values({
        name: pick.playerName ?? "Unknown Player",
        leagueId: pick.leagueId,
        teamId: pick.teamId,
        proId: pick.playerId,
        position: pick.positions?.[0] ?? null,
      });
      syncedCount++;
    }
  }

  // 2. Mark active draft as completed
  await db
    .update(drafts)
    .set({ status: "completed" })
    .where(eq(drafts.id, activeDraft.id));

  // 3. Provision next year's draft in 'setup' status
  let nextDraft = await db
    .select()
    .from(drafts)
    .where(
      and(
        eq(drafts.leagueId, leagueId),
        eq(drafts.draftYear, nextDraftYear)
      )
    )
    .limit(1)
    .then((rows) => rows[0]);

  if (!nextDraft) {
    const [inserted] = await db
      .insert(drafts)
      .values({
        leagueId,
        draftYear: nextDraftYear,
        status: "setup",
      })
      .returning();
    nextDraft = inserted;
  }

  // 4. Clone settings from previous draft
  if (nextDraft) {
    const [prevSettings] = await db
      .select()
      .from(draftSettings)
      .where(eq(draftSettings.draftId, activeDraft.id))
      .limit(1);

    const [existingSettings] = await db
      .select({ id: draftSettings.id })
      .from(draftSettings)
      .where(eq(draftSettings.draftId, nextDraft.id))
      .limit(1);

    if (prevSettings && !existingSettings) {
      const nextStartDate = new Date(prevSettings.startDate);
      nextStartDate.setFullYear(nextDraftYear);

      await db.insert(draftSettings).values({
        leagueId,
        draftId: nextDraft.id,
        draftStartDate: nextStartDate,
        draftStartTime: prevSettings.draftStartTime,
        startDate: nextStartDate,
        draftType: prevSettings.draftType,
        snakeDraft: prevSettings.snakeDraft,
        pickDuration: prevSettings.pickDuration,
        overnightPauseEnable: prevSettings.overnightPauseEnable,
        pauseStartTime: prevSettings.pauseStartTime,
        pauseEndTime: prevSettings.pauseEndTime,
      });
    }
  }

  return {
    status: "success",
    message: `Season concluded. ${syncedCount} drafted players added to team rosters. ${nextDraftYear} draft provisioned in Setup mode.`,
    completedDraftId: activeDraft.id,
    nextDraftId: nextDraft?.id,
    nextDraftYear,
    syncedPlayersCount: syncedCount,
  };
}
