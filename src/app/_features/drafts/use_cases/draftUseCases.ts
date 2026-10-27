import "server-only";

// Clerk Import
import { auth } from "@clerk/nextjs/server";
import { checkCommissionerAuthorization } from "~/lib/auth";

// Types
import {
  DraftResults,
  type CompletedDraftPicks,
  type DraftablePlayers,
  type QueueDraftPick,
} from "../utils/draft";

// Database Queries
import {
  getDraftPicks,
  postDraftPick,
  postWriteInDraftPick,
  undoDraftPick,
  getCompletedDraftPicks,
  insertNewDraftPick,
  getCurrentDraftPick,
  getNextDraftPick,
  checkUserCanPick,
  getActiveDraft,
} from "../database/queries";
import { getDraftPickEmails } from "..//database/teamQueries";
import {
  deletePlayerFromQueues,
  getTopQueuedPlayer,
} from "../database/queueQueries";
import {
  checkWriteInNameAvailable,
  getDraftResults,
  startPickClock,
  getFirstDraftPick,
  updateDraftPickOverdue,
  getPickWithTeamDetails,
} from "../database/draftPickQueries";
import { getDraftablePlayers } from "../database/draftPalyersQueries";

// Inngest Import
import { inngest } from "~/inngest/client";

// Email Imports
import { Resend } from "resend";
import DraftPickEmail from "~/emails/draft_pick";

const resend = new Resend(process.env.RESEND_API_KEY);

async function checkAuthorization() {
  // Authorization
  const user = await auth();
  if (!user.userId) throw new Error("Not logged in");
  return user;
}

export async function startDraftPickClockUseCase(
  pickId: number,
  startPickAt: Date,
  deadLine: Date,
) {
  const pickData = await startPickClock(pickId, startPickAt, deadLine);
  if (!pickData?.endsAt) throw new Error("No pick info");
  return pickData?.endsAt;
}

export async function markDraftPickOverdueUseCase(pickId: number) {
  const pickData = await updateDraftPickOverdue(pickId);
  return pickData;
}

export async function getFirstDraftPickUseCase(draftId: number) {
  const firstPickData = await getFirstDraftPick(draftId);
  return firstPickData;
}

export async function getCurrentDraftPickUseCase() {
  const currentPickData = getCurrentDraftPick();
  return currentPickData;
}

export async function getNextDraftPickUseCase(draftId = 2) {
  const nextPickData = await getNextDraftPick(draftId);
  return nextPickData;
}

export async function draftPlayerUseCase(playerToDraft: DraftablePlayers) {
  // Use case to draft player
  const response = {
    status: "",
    message: "",
  };

  // Check if user is authenticated
  const user = await checkAuthorization();
  if (!user) {
    response.status = "Error";
    response.message = "User is not authenticated";
    console.error("ERROR: User not authenticated");
    return response;
  }

  const userPickId = await checkUserCanPick(user.userId);

  if (userPickId === undefined) {
    response.status = "Error";
    response.message = "User is not on the clock";
    console.error("ERROR: User is not on the clock");
    return response;
  }

  const effectiveDraftId = userPickId.draftId ?? 2;

  // Perform the draft operation
  try {
    await postDraftPick(effectiveDraftId, userPickId.pickNumber, playerToDraft.id);

    // Attempt to remove player from queues
    try {
      await deletePlayerFromQueues(playerToDraft.id, effectiveDraftId);
      console.log("LOG: Player removed from queues successfully");
    } catch (error) {
      console.error("ERROR: Error removing player from queues:", error);
    }

    // Draft operation successful
    response.status = "Success";
    response.message = `${playerToDraft.playerName} selected`;
    console.log(
      `LOG: ${playerToDraft.playerName} drafted successfully by ${userPickId.teamName}`,
    );
  } catch (error) {
    // Draft operation failed
    response.status = "Error";
    response.message = "Error making pick";
    console.error("ERROR: Drafting player failed:", error);
  }

  if (response.status === "Success") {
    // Cancel timer if still running
    await inngest.send({
      name: "draft/pick.submitted",
      data: { pickId: userPickId.pickId },
    });

    if (userPickId.pickStatus === "on the clock") {
      // Start the next timer
      const [nextPick] = await getNextDraftPick(effectiveDraftId);
      if (nextPick) {
        await inngest.send({
          name: "draft/turn.started",
          data: { pickId: nextPick.pickId, draftId: effectiveDraftId },
        });
      }

      if (!nextPick?.teamName) {
        response.status = "Error";
        response.message = "No Next Pick Team Data";
        // Check if all picks complete

        // If all picks complete, send draft complete email
      }

      const { data, error } = await sendDraftPickEmail(
        userPickId.pickNumber,
        userPickId.teamName ?? "Unknown Team",
        playerToDraft.playerName,
        nextPick?.teamName ?? "Unknown Team",
      );
    }
  } else {
    const currentPick = await getCurrentDraftPick(effectiveDraftId);

    const { data, error } = await sendDraftPickEmail(
      userPickId.pickNumber,
      userPickId.teamName ?? "Unknown Team",
      playerToDraft.playerName,
      currentPick?.team?.name ?? "Unknown Team",
    );
  }

  return response; // Return response
}

export async function draftWriteInPlayerUseCase(playerToDraft: string) {
  const response = {
    status: "",
    message: "",
  };

  const user = await checkAuthorization();
  if (!user) {
    response.status = "Error";
    response.message = "User is not authenticated";
    console.error("ERROR: User not authenticated");
    return response;
  }

  const userPickId = await checkUserCanPick(user.userId);

  if (!userPickId) {
    response.status = "Error";
    response.message = "User is not on the clock";
    console.error("ERROR: User not on the clock");
    return response;
  }

  const effectiveDraftId = userPickId.draftId ?? 2;

  // Check if name is available
  const existingPlayer = await checkWriteInNameAvailable(playerToDraft);
  if (existingPlayer) {
    response.status = "Error";
    response.message = `${playerToDraft} has already been drafted`;
    console.error("ERROR: Write in name already drafted");
    return response;
  }

  // draft write in player
  try {
    await postWriteInDraftPick(effectiveDraftId, userPickId.pickNumber, playerToDraft);
    response.status = "Success";
    response.message = `${playerToDraft} drafted successfully`;
    console.log(
      `LOG: Write In ${playerToDraft} drafted successfully by ${userPickId.teamName}`,
    );
  } catch (error) {
    console.error("ERROR: Failed to draft write in player:", error);
    response.status = "Error";
    response.message = `Failed to draft ${playerToDraft}`;
    console.error(
      `LOG: Failed to draft write in ${playerToDraft} by ${userPickId.teamName}`,
      error,
    );
  }

  if (response.status === "Success") {
    // Cancel timer if still running
    await inngest.send({
      name: "draft/pick.submitted",
      data: { pickId: userPickId.pickId },
    });

    if (userPickId.pickStatus === "on the clock") {
      // Start the next timer
      const [nextPick] = await getNextDraftPick(effectiveDraftId);
      if (nextPick) {
        await inngest.send({
          name: "draft/turn.started",
          data: { pickId: nextPick.pickId, draftId: effectiveDraftId },
        });
      }

      if (!nextPick?.teamName) {
        response.status = "Error";
        response.message = "No Next Pick Team Data";
        // Check if all picks complete

        // If all picks complete, send draft complete email
      }

      const { data, error } = await sendDraftPickEmail(
        userPickId.pickNumber,
        userPickId.teamName ?? "Unknown Team",
        playerToDraft,
        nextPick?.teamName ?? "Unknown Team",
      );
    }
  } else {
    const currentPick = await getCurrentDraftPick(effectiveDraftId);

    const { data, error } = await sendDraftPickEmail(
      userPickId.pickNumber,
      userPickId.teamName ?? "Unknown Team",
      playerToDraft,
      currentPick?.team?.name ?? "Unknown Team",
    );
  }

  return response; // Return response
}

async function sendDraftPickEmail(
  pickNumber: number,
  teamName: string,
  playerName: string,
  nextPickTeamName: string,
) {
  const draftPickEmails = await getDraftPickEmails();
  const emails = draftPickEmails.map(
    (email) => `${email.teamName} <${email.teamEmail}>`,
  );

  const emailprops = {
    pickNumber: pickNumber,
    teamName: teamName,
    playerName: playerName,
    pickingTeam: nextPickTeamName,
  };

  const { data, error } = await resend.emails.send({
    from: "MilDraft <mildraft@siliconvalleybaseball.com>",
    to: emails, // Distro list
    // to: ['Slump Busters <matthew.dowling3@gmail.com>'],  // Used for testing
    subject: "Draft Pick Completed",
    react: DraftPickEmail(emailprops),
  });

  return { data, error };
}

export async function getDraftablePlayersUseCase(): Promise<
  DraftablePlayers[]
> {
  // Use case to get draft players
  const draftablePlayers = await getDraftablePlayers();
  if (!draftablePlayers) {
    throw new Error("Error getting draft players");
  }
  return draftablePlayers as DraftablePlayers[];
}

export async function getDraftPicksListUseCase(draftId?: number): Promise<QueueDraftPick[]> {
  let targetDraftId = draftId;
  if (!targetDraftId) {
    const activeDraft = await getActiveDraft(1);
    targetDraftId = activeDraft?.id ?? 2;
  }

  const draftPickQueueData = await getDraftPicks(targetDraftId);
  if (!draftPickQueueData) {
    throw new Error("Error getting draft pick queue");
  }

  return draftPickQueueData as QueueDraftPick[];
}

export async function getCompletedDraftPicksUseCase(
  draftId?: number,
): Promise<CompletedDraftPicks[]> {
  const user = await checkAuthorization();
  if (!user) {
    throw new Error("User is not authenticated");
  }

  let targetDraftId = draftId;
  if (!targetDraftId) {
    const activeDraft = await getActiveDraft(1);
    targetDraftId = activeDraft?.id ?? 2;
  }

  const draftedPlayers = await getCompletedDraftPicks(targetDraftId);

  if (!draftedPlayers) {
    throw new Error("No players drafted yet");
  }

  return draftedPlayers as CompletedDraftPicks[];
}

export async function undoDraftPickUseCase(draftPickToUndo: number, draftId?: number) {
  await checkCommissionerAuthorization();

  let targetDraftId = draftId;
  if (!targetDraftId) {
    const activeDraft = await getActiveDraft(1);
    targetDraftId = activeDraft?.id ?? 2;
  }

  try {
    await undoDraftPick(draftPickToUndo, targetDraftId);
    return;
  } catch (error) {
    console.log("undoDraftPick Error", error);
    return;
  }
}

export async function addNewDraftPickUseCase(teamName: string, draftId?: number) {
  await checkCommissionerAuthorization();

  let targetDraftId = draftId;
  if (!targetDraftId) {
    const activeDraft = await getActiveDraft(1);
    targetDraftId = activeDraft?.id ?? 2;
  }

  const teamSelected = await insertNewDraftPick(targetDraftId, teamName);

  return teamSelected;
}

export async function getDraftResultsUseCase(draftId: number) {
  const draftResults = await getDraftResults(draftId);
  if (!draftResults) {
    throw new Error("Error getting draft results");
  }
  return draftResults as DraftResults[];
}

export async function executeAutoDraftPickUseCase({
  pickId,
  draftId = 2,
}: {
  pickId: number;
  draftId?: number;
}) {
  const pick = await getPickWithTeamDetails(pickId);
  if (!pick) {
    return { status: "Error", message: "Draft pick not found" };
  }

  if (pick.pickMade) {
    return { status: "AlreadyPicked", message: "Pick has already been made" };
  }

  if (!pick.ownerId) {
    return { status: "NoOwner", message: "Team has no owner assigned" };
  }

  const effectiveDraftId = pick.draftId ?? draftId;

  // Retrieve top-ranked player from user's queue
  const topPlayer = await getTopQueuedPlayer(pick.ownerId, effectiveDraftId);
  if (!topPlayer) {
    console.log(
      `LOG: Auto-draft skipped for ${pick.teamName}: No queued players available`,
    );
    return { status: "NoQueuedPlayer", message: "No queued players available" };
  }

  try {
    await postDraftPick(effectiveDraftId, pick.pickNumber, topPlayer.id);

    try {
      await deletePlayerFromQueues(topPlayer.id, effectiveDraftId);
      console.log(
        `LOG: Queued player ${topPlayer.playerName} removed from queues`,
      );
    } catch (error) {
      console.error(
        "ERROR: Error removing auto-drafted player from queues:",
        error,
      );
    }

    console.log(
      `LOG: ${topPlayer.playerName} auto-drafted successfully for ${pick.teamName} (Pick #${pick.pickNumber})`,
    );

    // Cancel timer for this pick
    await inngest.send({
      name: "draft/pick.submitted",
      data: { pickId: pick.pickId },
    });

    // Advance to next pick
    const [nextPick] = await getNextDraftPick(effectiveDraftId);
    if (nextPick) {
      await inngest.send({
        name: "draft/turn.started",
        data: { pickId: nextPick.pickId, draftId: effectiveDraftId },
      });
    }

    try {
      await sendDraftPickEmail(
        pick.pickNumber,
        pick.teamName ?? "Unknown Team",
        topPlayer.playerName ?? "Selected Player",
        nextPick?.teamName ?? "Unknown Team",
      );
    } catch (emailErr) {
      console.error(
        "ERROR: Failed sending auto-draft notification email:",
        emailErr,
      );
    }

    return {
      status: "Success",
      message: `${topPlayer.playerName} auto-drafted for ${pick.teamName}`,
      playerId: topPlayer.id,
      playerName: topPlayer.playerName,
    };
  } catch (error) {
    console.error("ERROR: Failed executing auto-draft pick:", error);
    return { status: "Error", message: "Failed executing auto-draft pick" };
  }
}

export async function triggerAutoDraftIfOnClockUseCase(userId: string) {
  const userPick = await checkUserCanPick(userId);
  if (!userPick) {
    return { status: "NotOnClock", message: "User is not on the clock" };
  }

  return await executeAutoDraftPickUseCase({
    pickId: userPick.pickId,
  });
}