import "server-only";

// Clerk Import
import { auth } from "@clerk/nextjs/server";

// Types
import {
  type CompletedDraftPicks,
  type DraftablePlayers,
  type QueueDraftPick,
} from "../utils/draft";

// Database Queries
import {
  getDraftablePlayers,
  getDraftPicks,
  postDraftPick,
  postWriteInDraftPick,
  undoDraftPick,
  getCompletedDraftPicks,
  insertNewDraftPick,
  getDraftPickEmails,
  deletePlayerFromQueues,
} from "../database/queries";
import { getCurrentDraftPick, getNextDraftPick } from "~/server/queries";
import { removePlayerFromQueueUseCase } from "./queueUseCases";

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

  // Check if user is current pick team owner
  const currentPick = await getCurrentDraftPick();
  if (!currentPick[0]?.draft_pick) {
    response.status = "Error";
    response.message = "Not the current pick";
    return response
  }
    if (!currentPick[0]?.team) {
    response.status = "Error";
    response.message = "No team data";
    return response
  }

  // Perform the draft operation
  try {
    await postDraftPick(currentPick[0]?.draft_pick.teamId,2,currentPick[0]?.draft_pick.pickNumber,playerToDraft.id,);
    
    // Attempt to remove player from queues
    try { 
      await deletePlayerFromQueues(playerToDraft.id);
    } catch (error) {
      console.error("Error removing player from queues:", error);
    }
    
    // Draft operation successful
    response.status = "Success";
    response.message = `${playerToDraft.playerName} selected`;
  } catch (error) {
    // Draft operation failed
    response.status = "Error";
    response.message = "Error making pick";
    console.error("Drafting player failed:", error);
  }
  
  // If draft operation was successful, send emails
  if (response.status === "Success") {
    // Get needed info for email
    const draftPickEmails = await getDraftPickEmails();
    const nextPick = await getNextDraftPick();
    const emails = draftPickEmails.map(email => `${email.teamName} <${email.teamEmail}>`);
    // console.log("Draft Pick Emails:", emails); // Debug email string

    // Validate next pick data is not Null
    if (!nextPick[0]?.teamName) {
      response.status = "Error";
      response.message = "No Next Pick Team Data";
      return response;
    }

    // Send Draft Pick Email
    const emailprops = {
      pickNumber: currentPick[0]?.draft_pick.pickNumber,
      teamName: currentPick[0]?.team.name || "Unknown Team",
      playerName: playerToDraft.playerName,
      pickingTeam: nextPick[0]?.teamName,
    };

    const { data, error } = await resend.emails.send({
      from: 'No-Reply <no-reply@siliconvalleybaseball.com>',
      // to: emails, // Distro list
      to: ['Slump Busters <matthew.dowling3@gmail.com>'],  // Used for testing
      subject: 'TEST - Draft Pick Completed',
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
  if (!currentPick[0]?.draft_pick) {
    response.status = "Error";
    response.message = "No Pick Set";
    return response;
  }
  if (!currentPick[0]?.team) {
    response.status = "Error";
    response.message = "No Team Data";
    return response;
  }

  // draft write in player
  try {
    await postWriteInDraftPick(currentPick[0]?.draft_pick.teamId, 2, currentPick[0]?.draft_pick.pickNumber, playerToDraft);
    response.status = "Success";
    response.message = `${playerToDraft} drafted successfully`;
  } catch (error) {
    console.error("Failed to draft write in player:", error);
    response.status = "Error";
    response.message = `Failed to draft ${playerToDraft}`;
  }

  if (response.status === "Success") {
    const draftPickEmails = await getDraftPickEmails();
    const nextPick = await getNextDraftPick();
    const emails = draftPickEmails.map(email => `${email.teamName} <${email.teamEmail}>`);
    console.log("Draft Pick Emails:", emails);

    if (!nextPick[0]?.teamName) {
      response.status = "Error";
      response.message = "No Next Pick Team Data";
      return response;
    }

    // Send Draft Pick Email
    const emailprops = {
      pickNumber: currentPick[0]?.draft_pick.pickNumber,
      teamName: currentPick[0]?.team.name || "Unknown Team",
      playerName: playerToDraft,
      pickingTeam: nextPick[0]?.teamName,
    };

    const { data, error } = await resend.emails.send({
          from: 'No-Reply <no-reply@siliconvalleybaseball.com>',
          // to: emails,
          to: ['Slump Busters <matthew.dowling3@gmail.com>'],
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
