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
import { getDraftPickEmails } from "..//database/teamQueries"
import { deletePlayerFromQueues } from "../database/queueQueries"
import { getDraftResults, startPickClock } from "../database/draftPickQueries"
import { getDraftablePlayers } from "../database/draftPalyersQueries"
import { removePlayerFromQueueUseCase } from "./queueUseCases";
import { updateDraftPickOverdue } from "../database/draftPickQueries";

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

export async function startDraftPickClockUseCase(pickId: number, startPickAt: Date, deadLine: Date) {
  const pickData = await startPickClock(pickId, startPickAt, deadLine);
  if(!pickData?.endsAt) throw new Error("No pick info")
  return pickData?.endsAt
}

export async function markDraftPickOverdueUseCase(pickId: number) {
  const pickData = await updateDraftPickOverdue(pickId);
  return pickData;
}

export async function getCurrentDraftPickUseCase(){
  const currentPickData = getCurrentDraftPick()
  return currentPickData
}

export async function getNextDraftPickUseCase(draftId: number){
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
    return response
  }

  const userPickId = await checkUserCanPick(user.userId);

  if (!userPickId) {
    response.status = "Error";
    response.message = "User is not on the clock";
    return response;
  }

  // Perform the draft operation
  try {
    await postDraftPick(2, userPickId.pickNumber,playerToDraft.id,);
    
    // Attempt to remove player from queues
    try { 
      await deletePlayerFromQueues(playerToDraft.id);
    } catch (error) {
      console.error("ERROR: Error removing player from queues:", error);
    }
    
    // Draft operation successful
    response.status = "Success";
    response.message = `${playerToDraft.playerName} selected`;
  } catch (error) {
    // Draft operation failed
    response.status = "Error";
    response.message = "Error making pick";
    console.error("ERROR: Drafting player failed:", error);
  }
  
  // If draft operation was successful, set timer and send emails
  if (response.status === "Success") {
    // Cancel timer if still running
    await inngest.send({ name: "draft/pick.submitted", data: { pickId: userPickId.pickId } });

    // Start the next timer
    const nextPick = await getCurrentDraftPick();
    if (nextPick) {
      await inngest.send({ 
        name: "draft/turn.started", 
        data: { pickId: nextPick?.draft_pick.id, draftId: 2 } 
      });
    }

    // Get email list
    const draftPickEmails = await getDraftPickEmails();
    const emails = draftPickEmails.map(email => `${email.teamName} <${email.teamEmail}>`);
    // console.log("DEBUG: Draft Pick Emails:", emails); // Debug email string

    // Validate next pick data is not Null
    if (!nextPick?.team) {
      response.status = "Error";
      response.message = "No Next Pick Team Data";
      // Check if all picks complete

      // If all picks complete, send draft complete email

      //Else send awaiting final draft picks email to league

      return response;
    }

    // Send Draft Pick Email
    const emailprops = {
      pickNumber: userPickId.pickNumber,
      teamName: userPickId?.teamName || "Unknown Team",
      playerName: playerToDraft.playerName,
      pickingTeam: nextPick?.team.name,
    };

    const { data, error } = await resend.emails.send({
      from: 'No-Reply <no-reply@siliconvalleybaseball.com>',
      to: emails, // Distro list
      // to: ['Slump Busters <matthew.dowling3@gmail.com>'],  // Used for testing
      subject: 'Draft Pick Completed',
      react: DraftPickEmail(emailprops),
    });
  }

  return response;
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
    return response;
  }

  // Check if user is current pick team owner
  const currentPick = await getCurrentDraftPick();
  if (!currentPick?.draft_pick) {
    response.status = "Error";
    response.message = "No Pick Set";
    return response;
  }
  if (!currentPick?.team) {
    response.status = "Error";
    response.message = "No Team Data";
    return response;
  }

  // draft write in player
  try {
    await postWriteInDraftPick(currentPick?.draft_pick.teamId, 2, currentPick?.draft_pick.pickNumber, playerToDraft);
    response.status = "Success";
    response.message = `${playerToDraft} drafted successfully`;
  } catch (error) {
    console.error("ERROR: Failed to draft write in player:", error);
    response.status = "Error";
    response.message = `Failed to draft ${playerToDraft}`;
  }

  if (response.status === "Success") {
    const draftPickEmails = await getDraftPickEmails();
    const nextPick = await getNextDraftPick(2);
    const emails = draftPickEmails.map(email => `${email.teamName} <${email.teamEmail}>`);
    // console.log("Draft Pick Emails:", emails);

    if (!nextPick[0]?.teamName) {
      response.status = "Error";
      response.message = "No Next Pick Team Data";
      return response;
    }

    // Send Draft Pick Email
    const emailprops = {
      pickNumber: currentPick?.draft_pick.pickNumber,
      teamName: currentPick?.team.name || "Unknown Team",
      playerName: playerToDraft,
      pickingTeam: nextPick[0]?.teamName,
    };

    const { data, error } = await resend.emails.send({
          from: 'No-Reply <no-reply@siliconvalleybaseball.com>',
          to: emails,
          // to: ['Slump Busters <matthew.dowling3@gmail.com>'],
          subject: 'TEST - Draft Pick Completed',
          react: DraftPickEmail(emailprops),
        });
  }

  return response; // Return response
}

export async function getDraftablePlayersUseCase(): Promise< DraftablePlayers[] > {
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
  
  try{
    await undoDraftPick(draftPickToUndo, 2);
    // response.status="Success"
    // response.message=`Draft Pick #${draftPickToUndo} has been cleared`
    return
  }catch(error){
    console.log("undoDraftPick Error", error)
    // response.status="Error"
    // response.message="Error while undoing draft pick"
    // return response
    return
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
