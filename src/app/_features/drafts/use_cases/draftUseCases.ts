import "server-only";

import { auth } from "@clerk/nextjs/server";
import {
  type CompletedDraftPicks,
  type DraftablePlayers,
  type QueueDraftPick,
} from "../utils/draft";
import {
  getDraftablePlayers,
  getDraftPicks,
  postDraftPick,
  postWriteInDraftPick,
  undoDraftPick,
  getCompletedDraftPicks,
  insertNewDraftPick,
} from "../database/queries";
import { getCurrentDraftPick } from "~/server/queries";

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
    throw new Error("User is not authenticated");
    // response.status = "Error";
    // response.message = "User is not authenticated";
    // return response
  }

  // Check if user is current pick team owner
  const currentPick = await getCurrentDraftPick();
  if (!currentPick) {
    throw new Error("No pick set");
    // response.status = "Error";
    // response.message = "Not the current pick";
    // return response
  }

  // Perform the draft operation
  try {
    await postDraftPick(currentPick.teamId,2,currentPick.pickNumber,playerToDraft.id,);
    // response.status = "Success";
    // response.message = `${playerToDraft.playerName} selected`;
    // return response
  } catch (error) {
    // response.status = "Error";
    // response.message = "Error making pick";
    // return response
  }
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
  if (!currentPick) {
    response.status = "Error";
    response.message = "No Pick Set";
    return response;
  }

  // draft write in player
  try {
    await postWriteInDraftPick(currentPick.teamId, 2, currentPick.pickNumber, playerToDraft);
    response.status = "Success";
    response.message = `${playerToDraft} drafted successfully`;
    return response;
  } catch (error) {
    console.error("Failed to draft write in player:", error);
    response.status = "Error";
    response.message = `Failed to draft ${playerToDraft}`;
    return response;
  }
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
