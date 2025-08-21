"use client";

import { Suspense } from "react";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "~/_components/ui/dialog";
import { Button } from "~/_components/ui/button";
import { GlowEffect } from "~/_components/ui/glow-effect";
import { TextShimmerWave } from "~/_components/ui/text-shimmer-wave";
import ClaimTeamList from "./ClaimTeamsList";
import { type UnclaimedTeam } from "../utils/team";

export function ClaimTeamDialog({
  unclaimedLeagueTeams,
}: {
  unclaimedLeagueTeams: Promise<UnclaimedTeam[]>;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="relative">
          <GlowEffect
            colors={["#FF5733", "#33FF57", "#3357FF", "#F1C40F"]}
            mode="colorShift"
            blur="soft"
            duration={3}
            scale={0.9}
          />
          <Button
            variant={"ghost"}
            className="relative inline-flex items-center gap-1 rounded-md bg-zinc-900 px-2.5 py-1.5"
          >
            <TextShimmerWave
              className="[--base-color:#FFFFFF] [--base-gradient-color:#5EB1EF]"
              duration={1}
              spread={1}
              zDistance={1}
              scaleDistance={1.1}
              rotateYDistance={20}
            >
              Claim Your Team
            </TextShimmerWave>
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="justify-self-center">
          Claim Your Team
        </DialogTitle>
        <Suspense fallback={<div>Loading...</div>}>
          <ClaimTeamList teamList={unclaimedLeagueTeams} />
        </Suspense>
      </DialogContent>
    </Dialog>
  );
}
