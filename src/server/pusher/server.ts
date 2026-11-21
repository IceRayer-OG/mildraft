import Pusher from "pusher";
import { env } from "~/env";

export interface PickMadeEventPayload {
  pickNumber: number;
  teamName: string;
  playerId?: number;
  playerName: string;
  isWriteIn?: boolean;
  nextPickTeamName?: string;
  nextPickId?: number;
}

export interface TurnStartedEventPayload {
  pickId: number;
  pickNumber?: number;
  teamName?: string;
  clockEndsAt?: string;
}

export interface PickOverdueEventPayload {
  pickId: number;
  pickNumber?: number;
  teamName?: string;
}

export type DraftEventName = "pick-made" | "turn-started" | "pick-overdue";

let pusherServerInstance: Pusher | null = null;

export function getPusherServer(): Pusher | null {
  if (pusherServerInstance) return pusherServerInstance;

  if (!env.PUSHER_APP_ID || !env.PUSHER_KEY || !env.PUSHER_SECRET) {
    return null;
  }

  pusherServerInstance = new Pusher({
    appId: env.PUSHER_APP_ID,
    key: env.PUSHER_KEY,
    secret: env.PUSHER_SECRET,
    cluster: env.PUSHER_CLUSTER,
    useTLS: true,
  });

  return pusherServerInstance;
}

export async function triggerDraftEvent(
  draftId: number,
  event: DraftEventName,
  data: Record<string, unknown>,
): Promise<boolean> {
  const channel = `draft-${draftId}`;
  const pusher = getPusherServer();

  if (!pusher) {
    console.log(
      `[PUSHER MOCK] Credentials not configured. Event logged:\n` +
      `  Channel: "${channel}"\n` +
      `  Event:   "${event}"\n` +
      `  Data:    ${JSON.stringify(data)}`,
    );
    return false;
  }

  try {
    await pusher.trigger(channel, event, data);
    console.log(`[PUSHER] Broadcasted "${event}" to "${channel}"`);
    return true;
  } catch (err) {
    console.error(`[PUSHER ERROR] Failed to trigger "${event}" on "${channel}":`, err);
    return false;
  }
}
