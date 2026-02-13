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
  sql
} from "drizzle-orm";
import { draftPicks, pros, teams } from "~/server/db/schema";

export async function getDraftPicks() {
  const draftPicksData = await db
    .select()
    .from(draftPicks)
    .where(ne(draftPicks.pickMade, true))
    .orderBy(asc(draftPicks.pickNumber))
    .leftJoin(teams, eq(draftPicks.teamId, teams.id));

  return draftPicksData;
}

export async function getCurrentDraftPick() {  
    // Check if user is current pick
    const currentPick = await db.select().from(draftPicks)
      .where(eq(draftPicks.pickMade, false))
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
        teamName: teams.name
      })
      .from(draftPicks)
      .where(eq(draftPicks.pickMade, false))
      .orderBy(asc(draftPicks.pickNumber))
      .offset(1)
      .limit(1)
      .leftJoin(teams, eq(draftPicks.teamId, teams.id));
  
    if(nextPick === null) throw new Error("No current pick found");

    return nextPick;
}

export async function postDraftPick(
  teamId: number,
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
  teamId: number,
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
    .where(and(eq(teams.leagueId, 1),or(eq(teams.id,2),eq(teams.id,5),eq(teams.id,8),eq(teams.id,14))));

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
    .orderBy(asc(draftPicks.pickNumber))

  return completedDraftPicks;  
}

export async function getTeamIdByName(teamName: string){
    // Get the teamId by name
  const teamId = await db.query.teams.findFirst({
    columns: {
      id: true
    },
    where: eq(teams.name, teamName)
  })

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
