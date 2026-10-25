"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/_components/ui/alert-dialog";
import { Button } from "~/_components/ui/button";
import { rolloverSeasonAction } from "../actions/draftActions";
import { toast } from "sonner";

export function SeasonRolloverDialog({ leagueId = 1 }: { leagueId?: number }) {
  const [isPending, setIsPending] = useState(false);

  const handleRollover = async () => {
    setIsPending(true);
    try {
      const result = await rolloverSeasonAction(leagueId);
      toast.success(result.message);
    } catch (error) {
      console.error("Rollover failed:", error);
      toast.error(error instanceof Error ? error.message : "Rollover failed");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-full">
          Conclude Season & Provision Next Draft
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Conclude Season & Rollover?</AlertDialogTitle>
          <AlertDialogDescription>
            This will conclude the current season:
          </AlertDialogDescription>
          <div className="text-sm text-muted-foreground">
            <ul className="list-disc list-inside space-y-1">
              <li>Lock all drafted prospects onto team rosters.</li>
              <li>Archive the current draft and mark it as completed.</li>
              <li>Provision next year&apos;s draft in Setup mode (0 picks).</li>
              <li>Clone draft settings for the new year.</li>
            </ul>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleRollover}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? "Rolling over..." : "Confirm Rollover"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
