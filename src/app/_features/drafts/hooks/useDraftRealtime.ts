"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PusherClient from "pusher-js";
import { toast } from "sonner";
import { env } from "~/env";
import type {
  PickMadeEventPayload,
  TurnStartedEventPayload,
  PickOverdueEventPayload,
} from "~/server/pusher/server";

interface UseDraftRealtimeOptions {
  draftId: number;
  onPickMade?: (data: PickMadeEventPayload) => void;
  onTurnStarted?: (data: TurnStartedEventPayload) => void;
  onPickOverdue?: (data: PickOverdueEventPayload) => void;
}

export function useDraftRealtime({
  draftId,
  onPickMade,
  onTurnStarted,
  onPickOverdue,
}: UseDraftRealtimeOptions) {
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const pusherKey = env.NEXT_PUBLIC_PUSHER_KEY;
    if (!pusherKey) {
      console.log(
        "[PUSHER CLIENT] NEXT_PUBLIC_PUSHER_KEY is not configured. Real-time updates disabled.",
      );
      return;
    }

    const pusher = new PusherClient(pusherKey, {
      cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER ?? "us3",
    });

    const channelName = `draft-${draftId}`;
    const channel = pusher.subscribe(channelName);

    pusher.connection.bind("connected", () => {
      setIsConnected(true);
    });

    pusher.connection.bind("disconnected", () => {
      setIsConnected(false);
    });

    channel.bind("pick-made", (data: PickMadeEventPayload) => {
      toast.info(`Pick #${data.pickNumber} Complete`, {
        description: `${data.teamName} selected ${data.playerName}`,
      });
      onPickMade?.(data);
      router.refresh();
    });

    channel.bind("turn-started", (data: TurnStartedEventPayload) => {
      if (data.teamName) {
        toast.info("On The Clock", {
          description: `${data.teamName} is now selecting`,
        });
      }
      onTurnStarted?.(data);
      router.refresh();
    });

    channel.bind("pick-overdue", (data: PickOverdueEventPayload) => {
      toast.warning("Pick Timed Out", {
        description: `Pick #${data.pickNumber ?? ""} (${data.teamName ?? "Team"}) deadline passed`,
      });
      onPickOverdue?.(data);
      router.refresh();
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(channelName);
      pusher.disconnect();
    };
  }, [draftId, onPickMade, onTurnStarted, onPickOverdue, router]);

  return { isConnected };
}
