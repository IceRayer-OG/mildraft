import { db } from "~/server/db";
import {
  eq,
  notInArray,
  and,
  isNotNull,
  isNull,
  asc,
  inArray,
  ne,
  count,
  or,
  sql,
  desc
} from "drizzle-orm";
import { draftPicks, drafts, pros, teams } from "~/server/db/schema";
import { PickCountdownTimer } from "../components/PickClockTimer";

export async function getActiveDraft(leagueId = 1) {
  // 1. Look for in-progress or setup draft first
  const [activeDraft] = await db
    .select()
    .from(drafts)
    .where(and(eq(drafts.leagueId, leagueId), ne(drafts.status, "completed")))
    .orderBy(desc(drafts.draftYear))
    .limit(1);

  if (activeDraft) return activeDraft;

  // 2. If all completed, return the latest draft
  const [latestDraft] = await db
    .select()
    .from(drafts)
    .where(eq(drafts.leagueId, leagueId))
    .orderBy(desc(drafts.draftYear))
    .limit(1);

  return latestDraft;
}

export async function getAllDrafts(leagueId = 1) {
  const allDrafts = await db
    .select()
    .from(drafts)
    .where(eq(drafts.leagueId, leagueId))
    .orderBy(desc(drafts.draftYear));

  return allDrafts;
}

export async function getDraftPicks(draftId = 2) {
  const draftPicksData = await db
    .select()
    .from(draftPicks)
    .where(and(eq(draftPicks.draftId, draftId), ne(draftPicks.pickMade, true)))
    .orderBy(asc(draftPicks.pickNumber))
    .leftJoin(teams, eq(draftPicks.teamId, teams.id));

  return draftPicksData;
}

export async function checkUserCanPick(userId: string, draftId?: number) {
  const conditions = [
    eq(teams.ownerId, userId), 
    eq(draftPicks.pickMade, false),
    or(eq(draftPicks.status, "overdue"), eq(draftPicks.status, "on the clock"))
  ];

  if (draftId != null) {
    conditions.push(eq(draftPicks.draftId, draftId));
  }

  const [pickNumber] = await db.select({ 
    pickId: draftPicks.id,
    pickNumber: draftPicks.pickNumber,
    teamName: teams.name,
    pickStatus: draftPicks.status
  })
  .from(draftPicks)
  .where(and(...conditions))
  .orderBy(asc(draftPicks.pickNumber))
  .limit(1)
  .leftJoin(teams, eq(draftPicks.teamId, teams.id))

  console.log("LOG: User pick check result:", { pickNumber: pickNumber?.pickNumber, teamName: pickNumber?.teamName });

  return pickNumber;
}

export async function getCurrentDraftPick(draftId?: number) {  
    const conditions = [eq(draftPicks.status, "on the clock")];
    if (draftId != null) {
      conditions.push(eq(draftPicks.draftId, draftId));
    }

    // Check if user is current pick
    const [currentPick] = await db.select().from(draftPicks)
      .where(and(...conditions))
      .orderBy(asc(draftPicks.pickNumber))
      .limit(1)
      .leftJoin(teams, eq(draftPicks.teamId, teams.id));
  
    if(currentPick === null) throw new Error("No current pick found");

    return currentPick;
}

export async function getNextDraftPick(draftId: number) {  
    // Check if user is current pick
    const nextPick = await db.select({
        pickId: draftPicks.id,
        pickNumber: draftPicks.pickNumber,
        teamName: teams.name
      })
      .from(draftPicks)
      .where(
        and(
          eq(draftPicks.draftId, draftId),
          eq(draftPicks.status, "pending")
        )
      )
      .orderBy(asc(draftPicks.pickNumber))
      .limit(1)
      .leftJoin(teams, eq(draftPicks.teamId, teams.id));
  
    if(nextPick === null) throw new Error("No current pick found");

    return nextPick;
}

export async function postDraftPick(
  draftId: number,
  pickNumber: number,
  playerPicked: number,
) {
  await db
    .update(draftPicks)
    .set({
      playerId: playerPicked,
      isWriteIn: false,
      leagueId: 1,
      pickMade: true,
      status: "completed",
      isOnClock: false,
      completedAt: new Date(),
    })
    .where(
      and(
        eq(draftPicks.pickNumber, pickNumber),
        eq(draftPicks.draftId, draftId),
      ),
    );
}

export async function postWriteInDraftPick(
  draftId: number,
  pickNumber: number,
  playerName: string,
) {
  await db
    .update(draftPicks)
    .set({
      leagueId: 1,
      isWriteIn: true,
      writeInName: playerName,
      pickMade: true,
      status: "completed",
      isOnClock: false,
      completedAt: new Date(),
    })
    .where(
      and(
        eq(draftPicks.pickNumber, pickNumber),
        eq(draftPicks.draftId, draftId),
      ),
    );
}

export async function getDraftPickEmails() {
  const draftPickEmails = await db
    .select({ teamEmail: teams.email, teamName: teams.name })
    .from(teams)
    .where(eq(teams.leagueId, 1));

  return draftPickEmails;
}

async function getDraftPickInfo(draftPick: number, draftId: number) {
  const pickInfo = await db.select().from(draftPicks)
    .where(
      and(
        eq(draftPicks.pickNumber, draftPick),
        eq(draftPicks.draftId, draftId)
      )
    )
    .limit(1);

  if (!pickInfo) {
    throw new Error("No pick information found");
  }

  return pickInfo;
}

export async function undoDraftPick(draftPick: number, draftId: number) {
  const pickInfo = await getDraftPickInfo(draftPick, draftId);

    await db
      .update(draftPicks)
      .set({
        playerId: null,
        isWriteIn: false,
        writeInName: null,
        pickMade: false,
        status: "overdue",
        completedAt: null,
      })
      .where(
        and(
          eq(draftPicks.pickNumber, draftPick),
          eq(draftPicks.draftId, draftId),
        ),
      );
}

export async function getCompletedDraftPicks(draftId: number) {
  const completedDraftPicks = await db.select({
    pickNumber: draftPicks.pickNumber,
    playerName: sql<string>`COALESCE(${pros.playerName}, ${draftPicks.writeInName})`.as('player_name'),
    position: pros.position,
    teamName: teams.name,
  }).from(draftPicks)
    .where(and(eq(draftPicks.pickMade, true),eq(draftPicks.draftId, draftId)))
    .leftJoin(pros, eq(draftPicks.playerId, pros.id))
    .leftJoin(teams, eq(draftPicks.teamId, teams.id))
    .orderBy(desc(draftPicks.pickNumber))

  return completedDraftPicks;  
}

export async function getTeamIdByName(teamName: string){
    // Get the teamId by name
  const [teamId] = await db.select({id: teams.id}).from(teams)
    .where(eq(teams.name, teamName))
    .limit(1);

  if(teamId === undefined) throw new Error("Team not found")

  return teamId.id
}

export async function insertNewDraftPick( draftId: number, teamName: string ) {
  // Get the teamId by name
  const teamId = await getTeamIdByName(teamName)

  // Get the count of draft picks in the current draft
  const picksInDraft = await db.select({count: count()}).from(draftPicks).where(eq(draftPicks.draftId, draftId));
  let countOfPicksInDraft = 0;
  
  if(picksInDraft[0]?.count === undefined) {
    countOfPicksInDraft = 0;
  } else {
    countOfPicksInDraft = picksInDraft[0].count + 1;
  }

  await db.insert(draftPicks).values({
    leagueId: 1,
    draftId: draftId,
    teamId: teamId,
    pickNumber: countOfPicksInDraft
  })

  return teamName;
}
