"use server";

// Auth
import { auth } from "@clerk/nextjs/server";

// Types
import { type QueuePlayers, type DraftablePlayers } from "../utils/draft";

// Queries
import {
  postPlayerToQueue,
  deletePlayerFromQueue,
  getMyQueuePlayers,
  updateQueueOrder,
  getQueueCount,
} from "../database/queueQueries";
import { getTeamSettings, updateTeamSettings } from "~/app/_features/team/database/queries";
import { checkUserCanPick } from "../database/queries";
import { executeAutoDraftPickUseCase } from "./draftUseCases";

async function checkAuthorization() {
  // Authorization
  const user = await auth();
  if (!user.userId) throw new Error("Not logged in");
  return user;
}

export async function getMyQueueUseCase(): Promise<QueuePlayers[]> {
  // Check if user is authenticated
  const user = await checkAuthorization();
  if (!user) {
    throw new Error("User is not authenticated");
  }
  // This function should fetch the draft queue from the database
  const myQueue = await getMyQueuePlayers(user.userId);
  if (!myQueue) {
    throw new Error("Error getting draft queue");
  }

  return myQueue as QueuePlayers[];
}

export async function addPlayerToQueueUseCase(playerToQueue: DraftablePlayers) {
  // Use case to add player to queue
  // Check if user is authenticated
  const user = await checkAuthorization();
  if (!user) {
    throw new Error("User is not authenticated");
  }

  // Check if user is a team owner

  // Add player to queue and revalidate the draft path
  try {
    await postPlayerToQueue(playerToQueue.id, user.userId);
  } catch (error) {
    console.log(error);
    throw new Error("Error adding player to queue");
  }
}

export async function removePlayerFromQueueUseCase(
  playerToRemove: DraftablePlayers,
) {
  // Use case to remove player from queue
  // Check if user is authenticated
  const user = await checkAuthorization();
  if (!user) {
    throw new Error("User is not authenticated");
  }
  // Check if user is a team owner

  // Remove player from queue and revalidate the draft path
  try {
    await deletePlayerFromQueue(playerToRemove.id, user.userId);
  } catch (error) {
    console.log(error);
    throw new Error("Error removing player from queue");
  }
}

export async function updateMyQueueOrderUseCase(
  queueOrder: { playerId: number; rank: number }[],
) {
  const user = await checkAuthorization();
  if (!user) {
    throw new Error("User is not authenticated");
  }

  try {
    await updateQueueOrder(queueOrder, user.userId);
  } catch (error) {
    console.log("Error Updating Queue:", error);
    throw new Error("Error Updating Queue");
  }
}

export async function getMyAutoDraftSettingsUseCase() {
  const user = await checkAuthorization();
  if (!user.userId) throw new Error("Not logged in");

  const team = await getTeamSettings(user.userId);
  const queueCount = await getQueueCount(user.userId);

  return {
    autoDraftEnabled: Boolean(team?.autoDraftEnabled),
    autoDraftMode: (team?.autoDraftMode === "safety_net" ? "safety_net" : "instant") as "instant" | "safety_net",
    queueCount,
    teamName: team?.name ?? "My Team",
  };
}

export async function updateMyAutoDraftSettingsUseCase({
  enabled,
  mode,
}: {
  enabled: boolean;
  mode?: "instant" | "safety_net";
}) {
  const user = await checkAuthorization();
  if (!user.userId) throw new Error("Not logged in");

  const currentTeam = await getTeamSettings(user.userId);
  if (!currentTeam) throw new Error("Team not found for user");

  const newMode = mode ?? (currentTeam.autoDraftMode === "safety_net" ? "safety_net" : "instant");

  await updateTeamSettings(
    {
      teamName: currentTeam.name,
      teamAbbreviation: currentTeam.abbreviation ?? "TM",
      teamLogo: undefined,
      autoDraftEnabled: enabled,
      autoDraftMode: newMode,
    },
    user.userId,
  );

  let immediatePickResult = null;
  // If enabled and instant mode, check if user is on clock to trigger pick immediately
  if (enabled && newMode === "instant") {
    const userPick = await checkUserCanPick(user.userId);
    if (userPick) {
      immediatePickResult = await executeAutoDraftPickUseCase({
        pickId: userPick.pickId,
      });
    }
  }

  return {
    success: true,
    autoDraftEnabled: enabled,
    autoDraftMode: newMode,
    immediatePick: immediatePickResult,
  };
}
