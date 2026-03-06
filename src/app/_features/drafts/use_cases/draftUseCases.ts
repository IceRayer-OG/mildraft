import "server-only";

// Clerk Import
import { auth } from "@clerk/nextjs/server";

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
} from "../database/queries";
import { getDraftPickEmails } from "..//database/teamQueries";
import { deletePlayerFromQueues } from "../database/queueQueries";
import {
  checkWriteInNameAvailable,
  getDraftResults,
  startPickClock,
} from "../database/draftPickQueries";
import { getDraftablePlayers } from "../database/draftPalyersQueries";
import { removePlayerFromQueueUseCase } from "./queueUseCases";
import { updateDraftPickOverdue } from "../database/draftPickQueries";

// Inngest Import
import { inngest } from "~/inngest/client";

// Email Imports
import { Resend } from "resend";
import DraftPickEmail from "~/emails/draft_pick";
import { send } from "process";

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

export async function getCurrentDraftPickUseCase() {
  const currentPickData = getCurrentDraftPick();
  return currentPickData;
}

export async function getNextDraftPickUseCase(draftId: number) {
  const nextPickData = await getNextDraftPick(2);
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

  // Perform the draft operation
  try {
    await postDraftPick(2, userPickId.pickNumber, playerToDraft.id);

    // Attempt to remove player from queues
    try {
      await deletePlayerFromQueues(playerToDraft.id);
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
      const [nextPick] = await getNextDraftPick(2);
      if (nextPick) {
        await inngest.send({
          name: "draft/turn.started",
          data: { pickId: nextPick.pickId, draftId: 2 },
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

    const currentPick = await getCurrentDraftPick();

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
    await postWriteInDraftPick(2, userPickId.pickNumber, playerToDraft);
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
      const [nextPick] = await getNextDraftPick(2);
      if (nextPick) {
        await inngest.send({
          name: "draft/turn.started",
          data: { pickId: nextPick.pickId, draftId: 2 },
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

    const currentPick = await getCurrentDraftPick();

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

export async function getDraftPicksListUseCase(): Promise<QueueDraftPick[]> {
  const draftPickQueueData = await getDraftPicks();
  if (!draftPickQueueData) {
    throw new Error("Error getting draft pick queue");
  }

  return draftPickQueueData as QueueDraftPick[];
}

export async function getCompletedDraftPicksUseCase(): Promise<
  CompletedDraftPicks[]
> {
  const user = await checkAuthorization();
  if (!user) {
    throw new Error("User is not authenticated");
  }

  const draftedPlayers = await getCompletedDraftPicks(2);

  if (!draftedPlayers) {
    throw new Error("No players drafted yet");
  }

  return draftedPlayers as CompletedDraftPicks[];
}

export async function undoDraftPickUseCase(draftPickToUndo: number) {
  // const response = {
  //   status: "",
  //   message: ""
  // }

  try {
    await undoDraftPick(draftPickToUndo, 2);
    // response.status="Success"
    // response.message=`Draft Pick #${draftPickToUndo} has been cleared`
    return;
  } catch (error) {
    console.log("undoDraftPick Error", error);
    // response.status="Error"
    // response.message="Error while undoing draft pick"
    // return response
    return;
  }
}

export async function addNewDraftPickUseCase(teamName: string) {
  const user = await checkAuthorization();
  if (!user) {
    throw new Error("User is not authenticated");
  }

  const teamSelected = await insertNewDraftPick(2, teamName);

  return teamSelected;
}

export async function getDraftResultsUseCase(draftId: number) {
  const draftResults = await getDraftResults(draftId);
  if (!draftResults) {
    throw new Error("Error getting draft results");
  }
  return draftResults as DraftResults[];
}
